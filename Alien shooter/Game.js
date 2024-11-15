// Hent referanser til HTML-elementer
let player = document.getElementById('player');
let posX = 300; // Startposisjon X
let posY = 300; // Startposisjon Y
let speed = 60; // Standard fart for spilleren

// Funksjon for å oppdatere spillerens posisjon basert på joystickverdier
function movePlayer(x, y) {
  const threshold = 50; // Terskel for joystickens følsomhet
  if (x < 326) posX -= speed; // Flytt venstre
  if (x > 340) posX += speed; // Flytt høyre
  if (y < 345) posY -= speed; // Flytt opp
  if (y > 400) posY += speed; // Flytt ned

  // Begrens spillfigurens bevegelser til spillområdet
  posX = Math.max(0, Math.min(380, posX));
  posY = Math.max(0, Math.min(380, posY));

  // Oppdater figurens posisjon
  player.style.left = posX + 'px';
  player.style.top = posY + 'px';
}

// Funksjon for å koble til joystick via Web Serial API
async function connectJoystick() {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();

    console.log("Koblet til joystick!");

    let buffer = ""; // For å samle ufullstendige data

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("Serial forbindelse avsluttet.");
        break;
      }
      if (value) {
        buffer += value; // Legg til data i buffer
        const lines = buffer.split("\n"); // Splitt på linjeskift
        buffer = lines.pop(); // Hold siste linje

        for (const line of lines) {
          try {
            const data = JSON.parse(line.trim());
            const { x, y } = data;

            // Beveg spilleren basert på joystick-data
            movePlayer(x, y);
          } catch (error) {
            console.error("Kunne ikke parse JSON:", line, error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Kan ikke koble til joystick:", error);
  }
}

// Funksjon for å justere spillerens fart
function setSpeed(newSpeed) {
  speed = newSpeed;
  console.log("Ny fart satt til:", speed);
}

// Koble til når brukeren klikker på knappen
document.getElementById('connectButton').addEventListener('click', connectJoystick);

// Oppdater fart basert på input
document.getElementById('speedInput').addEventListener('input', (event) => {
  setSpeed(Number(event.target.value));
});
