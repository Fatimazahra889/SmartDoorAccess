import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import grpc
import access_control_pb2
import access_control_pb2_grpc
import db_config

# ========== APP SETUP ==========
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# gRPC connection
channel = grpc.insecure_channel('localhost:50051')
stub = access_control_pb2_grpc.AccessControlStub(channel)

# ========== ROUTES ==========

@app.route('/uid', methods=['POST'])
def receive_uid():
    data = request.get_json()
    uid = data.get('uid')

    if not uid:
        return "False", 400

    try:
        grpc_request = access_control_pb2.UIDRequest(uid=uid)
        grpc_response = stub.CheckUID(grpc_request)
        access_granted = grpc_response.is_authorized

        if access_granted:
            emit_status_update(uid)

        return str(access_granted), 200

    except Exception as e:
        print(f"[GATEWAY ERROR] {e}")
        return "False", 500

@app.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    uid = data.get('uid')
    name = data.get('name')

    if not uid or not name:
        return jsonify({"error": "Missing name or uid"}), 400

    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Users (uid, name) VALUES (?, ?)", uid, name)
        conn.commit()
        conn.close()
        print(f"[GATEWAY] Added user: {name} ({uid})")
        return jsonify({"success": True}), 201

    except Exception as e:
        print(f"[GATEWAY ERROR] Could not add user: {e}")
        return jsonify({"error": "Failed to add user"}), 500

@app.route('/delete-user', methods=['POST'])
def delete_user():
    data = request.get_json()
    uid = data.get('uid')
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Users WHERE uid = ?", uid)
        conn.commit()
        conn.close()
        print(f"[GATEWAY] Deleted user with UID: {uid}")
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"[GATEWAY ERROR] Could not delete user: {e}")
        return jsonify({"error": "Failed to delete user"}), 500


@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT TOP 20 uid, name, access_time, access_granted
            FROM AccessLog
            ORDER BY access_time DESC
        """)
        rows = cursor.fetchall()

        result = [
            {
                "uid": row.uid,
                "name": row.name,
                "time": row.access_time.strftime("%Y-%m-%d %H:%M:%S"),
                "granted": bool(row.access_granted)
            }
            for row in rows
        ]

        conn.close()
        return jsonify(result), 200

    except Exception as e:
        print(f"[GATEWAY ERROR] Could not fetch logs: {e}")
        return jsonify({"error": "Failed to fetch logs"}), 500

# ========== SOCKET EMIT FUNCTION ==========

def emit_status_update(uid):
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM Users WHERE uid = ?", uid)
        row = cursor.fetchone()
        name = row.name if row else "Unknown"
        conn.close()

        socketio.emit("status", {
            "status": "unlocked",
            "name": name
        })
        print(f"[GATEWAY] WebSocket sent: {name} unlocked")

    except Exception as e:
        print(f"[GATEWAY ERROR] WebSocket emit failed: {e}")

# ========== START SERVER ==========

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False)


