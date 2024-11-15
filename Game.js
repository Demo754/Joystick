let player = document.getElementById('player');
let posX = 190; // Startposisjon X
let posY = 190; // Startposisjon Y
let buffer = ""; // Buffer for ufullstendig JSON-data

// Funksjon for å oppdatere spillerens posisjon
function movePlayer(x, y) {
  const speed = 2;
  if (x < 400) posX -= speed; // Flytt venstre
  if (x > 600) posX += speed; // Flytt høyre
  if (y < 400) posY -= speed; // Flytt opp
  if (y > 600) posY += speed; // Flytt ned

  // Begrens bevegelsen innenfor spillområdet
  posX = Math.max(0, Math.min(380, posX));
  posY = Math.max(0, Math.min(380, posY));

  // Oppdater posisjonen til figuren
  player.style.left = posX + 'px';
  player.style.top = posY + 'px';
}

// Funksjon for å koble til joystick via Web Serial API
async function connectJoystick() {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value) {
        // Legg til innkommende data i buffer
        buffer += value;

        // Håndter JSON-parsing av komplette meldinger
        const lines = buffer.split('\n'); // Arduino sender data med newline
        buffer = lines.pop(); // Behold ufullstendig linje i buffer

        for (const line of lines) {
          try {
            // Parse JSON-data fra Arduino
            const data = JSON.parse(line.trim());
            const { x, y } = data;

            // Beveg spilleren basert på joystick-inndata
            movePlayer(x, y);
          } catch (error) {
            console.error("JSON-parsing feilet:", error, line);
          }
        }
      }
    }
  } catch (error) {
    console.error("Kan ikke koble til joystick:", error);
  }
}
