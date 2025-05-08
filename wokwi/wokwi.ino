// LINK: https://wokwi.com/projects/429863058970909697


#include <WiFi.h>
#include <HTTPClient.h>

// ------ Configuration ------
#define BUTTON_PIN 25
#define LED_PIN 26
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* adresse_serveur = "http://64cc-154-144-229-242.ngrok-free.app/uid";

// ------ RFIDReader Class (Simulation) ------
class RFIDReader {
  public:
    String scanner_carte() {
      // Simulate reading a UID
      return "123456";
    }
};

RFIDReader lecteur_rfid;

// ------ Fonctions selon UML ------
String lire_carte() {
  return lecteur_rfid.scanner_carte();
}

bool envoyer_uid_au_serveur(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(adresse_serveur); // Regular HTTP (no SSL)
    http.setConnectTimeout(10000);  
    http.setTimeout(10000);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"uid\":\"" + uid + "\"}";
    int code = http.POST(json);

    if (code == HTTP_CODE_OK) {
      String response = http.getString();
      response.trim();
      bool access = (response == "True");
      recevoir_reponse(access);
      http.end();
      return access;
    } else {
      Serial.printf("HTTP Error %d: %s\n", code, http.errorToString(code).c_str());
    }
    http.end();
  }
  recevoir_reponse(false);
  return false;
}

void recevoir_reponse(bool reponse) {
  controler_porte(reponse);
}

void controler_porte(bool reponse) {
  if (reponse) {
    Serial.println("Accès autorisé : porte ouverte");
    digitalWrite(LED_PIN, HIGH);
    delay(2000); // Simulate door open duration
    digitalWrite(LED_PIN, LOW);
  } else {
    Serial.println("Accès refusé");
    digitalWrite(LED_PIN, LOW);
  }
}

// ------ Setup & Loop ------
void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connexion WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnecté !");

  // Fixed print statement:
  Serial.print("Testing connection to ");
  Serial.println(adresse_serveur);
  Serial.println("If this hangs, Wokwi can't reach Ngrok");
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    String uid = lire_carte();
    envoyer_uid_au_serveur(uid);
    delay(1000); // Debounce
  }
}