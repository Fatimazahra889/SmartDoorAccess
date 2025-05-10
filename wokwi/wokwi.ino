#include <WiFi.h>
#include <HTTPClient.h>
#include <Keypad.h>

// ------ WiFi & Server Configuration ------
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* server_address = "http://4cf1-105-154-76-132.ngrok-free.app/uid";

// ------ LED ------
#define LED_PIN 26

// ------ Push Button ------
#define BUTTON_PIN 25  // Adjust if connected to another pin

// ------ Keypad ------
#define ROW_NUM     4
#define COLUMN_NUM  4

char keys[ROW_NUM][COLUMN_NUM] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte pin_rows[ROW_NUM] = {19, 18, 5, 17}; 
byte pin_column[COLUMN_NUM] = {16, 4, 0, 2};

Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM);

// ------ Network & Door Control Functions ------
bool send_uid_to_server(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(server_address);
    http.setConnectTimeout(10000);
    http.setTimeout(10000);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"uid\":\"" + uid + "\"}";
    int code = http.POST(json);

    if (code == HTTP_CODE_OK) {
      String response = http.getString();
      response.trim();
      bool access = (response == "True" || response == "true");
      control_door(access);
      http.end();
      return access;
    } else {
      Serial.printf("HTTP Error %d: %s\n", code, http.errorToString(code).c_str());
    }
    http.end();
  }
  control_door(false);
  return false;
}

void control_door(bool access_granted) {
  if (access_granted) {
    Serial.println("Access granted: door unlocked");
    digitalWrite(LED_PIN, HIGH);
    delay(2000);
    digitalWrite(LED_PIN, LOW);
  } else {
    Serial.println("Access denied");
    digitalWrite(LED_PIN, LOW);
  }
}

// ------ Setup & Loop ------
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
}

String uid = "";

void loop() {
  char key = keypad.getKey();

  if (key) {
    if (key == 'C') {
      Serial.println("Input cleared");
      uid = "";
    } else {
      uid += key;
      Serial.print("*"); // Change to Serial.print(key); to show actual digits
    }
  }

  // When pushbutton is pressed
  if (digitalRead(BUTTON_PIN) == LOW) {
    if (uid.length() > 0) {
      Serial.print("Entered UID: ");
      Serial.println(uid);
      send_uid_to_server(uid);
      uid = ""; // Reset after sending
      delay(1000); // Debounce delay
    }
  }
}
