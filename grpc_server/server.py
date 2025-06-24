import grpc
from concurrent import futures
import access_control_pb2
import access_control_pb2_grpc
import db_config
from datetime import datetime

class AccessControlServicer(access_control_pb2_grpc.AccessControlServicer):
    def CheckUID(self, request, context):
        uid = request.uid

        try:
            # Connect to SQL Server
            conn = db_config.get_connection()
            cursor = conn.cursor()

            # Check UID in dbo.Users
            cursor.execute("SELECT name FROM Users WHERE uid = ?", uid)
            row = cursor.fetchone()

            if row:
                name = row.name
                authorized = True
            else:
                name = "Unknown"
                authorized = False

            # Insert access log into dbo.AccessLog
            cursor.execute("""
                INSERT INTO AccessLog (uid, name, access_time, access_granted)
                VALUES (?, ?, GETDATE(), ?)
            """, uid, name, 1 if authorized else 0)

            conn.commit()
            conn.close()

            print(f"[SERVER] UID: {uid} | Name: {name} | Status: {'Granted' if authorized else 'Denied'}")
            return access_control_pb2.AccessResponse(is_authorized=authorized)

        except Exception as e:
            print(f"[SERVER ERROR] {e}")
            return access_control_pb2.AccessResponse(is_authorized=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    access_control_pb2_grpc.add_AccessControlServicer_to_server(AccessControlServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("[SERVER] gRPC Server running on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
