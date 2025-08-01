# UnLok – Smart Door Access Control

UnLok is a secure and smart door system using RFID codes. It replaces traditional keys and lets users unlock a door using a keypad. Admins can monitor door status and access logs live via a mobile app.

----

## Technologies Used

### Hardware

* ESP32
* Keypad (4x4)
* Push Button
* LED

### Backend

* Flask (API)
* gRPC (authorization logic)
* SQL Server
* WebSocket (real-time updates)

### Mobile App

* React Native + Expo
* Socket.io-client
* REST fetch API

### Tools

* Ngrok (remote access)
* Wokwi (ESP32 simulator)

---

## How It Works

1. User enters code on keypad.
2. ESP32 sends UID to Flask.
3. Flask uses gRPC to check if UID is valid.
4. Result is logged in SQL Server.
5. WebSocket sends door status to mobile app.

---

## Folder Structure

* `grpc_server/` → gRPC + DB logic
* `gateway_flask/` → Flask + WebSocket
* `myApp/` → React Native mobile app

---

## Features

* Door unlock via code
* Real-time updates on app
* Add/edit/delete members
* Logs all access

---

## Run Steps

1. Start SQL Server
2. Run gRPC server
3. Run Flask server (gateway)
4. Connect ESP32 via Ngrok
5. Launch mobile app with Expo

---

## Future Ideas

* Add fingerprint or camera
* Push notifications
* Cloud storage
* Secure token-based auth

---


