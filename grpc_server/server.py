import grpc
from concurrent import futures
import access_control_pb2
import access_control_pb2_grpc
import db_config
from datetime import datetime

uid_mapping = {
    "123456": "Father",
    "123": "Son",
    "1234": "Mother"
}

class AccessControlServicer(access_control_pb2_grpc.AccessControlServicer):
    def CheckUID(self, request, context):
        uid = request.uid
        name = uid_mapping.get(uid, "Unknown")
        authorized = uid in uid_mapping

        # Logging access attempt
        conn = db_config.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO AccessLog (uid, name, access_time, access_granted)
            VALUES (?, ?, GETDATE(), ?)
        """, uid, name, 1 if authorized else 0)

        conn.commit()
        conn.close()

        print(f"[SERVER] UID: {uid} | Name: {name} | Status: {'Granted' if authorized else 'Denied'}")

        return access_control_pb2.AccessResponse(is_authorized=authorized)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    access_control_pb2_grpc.add_AccessControlServicer_to_server(AccessControlServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("[SERVER] gRPC Server running on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
