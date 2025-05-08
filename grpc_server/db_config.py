
import pyodbc

# --- SQL Connection Setup ---
def get_connection():
    conn = pyodbc.connect(
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=DESKTOP-A37BJM4\\SQLEXPRESS;"
        "Database=RFID;"
        "UID=ema;"
        "PWD=emaema889;"
    )

    return conn
