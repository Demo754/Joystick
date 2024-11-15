from flask import Flask, render_template, jsonify
import serial
import time
import threading

# Sett opp Flask-applikasjonen
app = Flask(__name__)

# Sett opp tilkobling til Arduino
try:
    arduino = serial.Serial('COM3', 9600)  # Bytt COM3 med din Arduino-port (f.eks. /dev/ttyUSB0 på Linux)
    time.sleep(2)  # Vent litt for å sikre at tilkoblingen er klar
except Exception as e:
    print(f"Kan ikke koble til Arduino: {e}")
    arduino = None

# Variabel for joystick data
joystick_data = {"x": 512, "y": 512, "button": 0}

# Les data fra Arduino i bakgrunnen
def read_from_arduino():
    global joystick_data
    while arduino is not None:
        if arduino.in_waiting > 0:
            try:
                line = arduino.readline().decode('utf-8').strip()
                data = eval(line)
                joystick_data = data
            except Exception as e:
                print(f"Feil ved lesing av data: {e}")

# Start en bakgrunnstråd for å lese Arduino-data
if arduino:
    thread = threading.Thread(target=read_from_arduino)
    thread.daemon = True
    thread.start()

@app.route('/')
def index():
    return render_template('index.html')  # Server index.html-siden

@app.route('/joystick-data')
def get_joystick_data():
    return jsonify(joystick_data)  # Returner joystick-data som JSON

if __name__ == '__main__':
    app.run(debug=True)
