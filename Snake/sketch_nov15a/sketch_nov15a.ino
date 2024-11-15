#define VRX_PIN A0  // X-akse til joystick
#define VRY_PIN A1  // Y-akse til joystick
#define SW_PIN 2    // Knapp på joystick

void setup() {
  Serial.begin(9600);  // Start seriell kommunikasjon på 9600 baud
  pinMode(SW_PIN, INPUT_PULLUP); // Sett opp knappen med intern pull-up
}

void loop() {
  // Les joystickens X- og Y-verdier
  int xValue = analogRead(VRX_PIN);  // Verdi fra 0 til 1023
  int yValue = analogRead(VRY_PIN);  // Verdi fra 0 til 1023
  
  // Les knappens status (LOW hvis trykket, HIGH hvis ikke trykket)
  int buttonState = digitalRead(SW_PIN);

  // Skriv verdiene til Serial Monitor som JSON-format (enkelt for parsing)
  Serial.print("{\"x\":");
  Serial.print(xValue);
  Serial.print(", \"y\":");
  Serial.print(yValue);
  Serial.print(", \"button\":");
  Serial.print(buttonState == LOW ? 1 : 0);  // 1 hvis trykket, 0 hvis ikke
  Serial.println("}");
  
  delay(100);  // Vent litt før neste måling for å unngå for mange dataoppdateringer
}
