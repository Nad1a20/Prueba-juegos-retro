const tableroEl = document.getElementById('tablero');
const estadoEl = document.getElementById('estado');
const marcadorEl = document.getElementById('marcador');
const modoEl = document.getElementById('modo');
const difEl = document.getElementById('dificultad');
const simEl = document.getElementById('simbolo');
const labelDif = document.getElementById('labelDificultad');
const labelSim = document.getElementById('labelSimbolo');

let tablero = Array(9).fill('');
let turno = 'X';
let juegoActivo = true;
let puntos = { X: 0, O: 0, E: 0 };

const lineas = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function esCPU() { return modoEl.value === 'cpu'; }
function simboloCPU() { return simEl.value === 'X' ? 'O' : 'X'; }

function ganador(t = tablero) {
  for (const [a,b,c] of lineas) {
    if (t[a] && t[a] === t[b] && t[a] === t[c]) return t[a];
  }
  return t.includes('') ? null : 'E';
}

function dibujar() {
  tableroEl.innerHTML = '';
  tablero.forEach((v, i) => {
    const d = document.createElement('div');
    d.className = 'celda ' + v.toLowerCase();
    d.textContent = v;
    d.addEventListener('click', () => jugar(i));
    tableroEl.appendChild(d);
  });
  marcadorEl.textContent = `X: ${puntos.X} | O: ${puntos.O} | Empates: ${puntos.E}`;
}

function jugar(i) {
  if (!juegoActivo || tablero[i]) return;
  if (esCPU() && turno === simboloCPU()) return;
  tablero[i] = turno;
  terminarTurno();
}

function terminarTurno() {
  const g = ganador();
  if (g) { finJuego(g); return; }
  turno = turno === 'X' ? 'O' : 'X';
  estadoEl.textContent = 'Turno: ' + turno;
  dibujar();
  if (esCPU() && juegoActivo && turno === simboloCPU()) {
    estadoEl.textContent = 'Turno CPU (' + turno + ')...';
    setTimeout(movimientoCPU, 400);
  }
}

function finJuego(g) {
  juegoActivo = false;
  if (g === 'E') { puntos.E++; estadoEl.textContent = 'Empate 🤝'; }
  else { puntos[g]++; estadoEl.textContent = '¡Gana ' + g + '! 🎉'; }
  dibujar();
}

function movimientoCPU() {
  if (!juegoActivo) return;
  let i;
  if (difEl.value === 'facil') {
    const libres = tablero.map((v, idx) => v ? null : idx).filter(v => v !== null);
    i = libres[Math.floor(Math.random() * libres.length)];
  } else {
    i = mejorMovimiento();
  }
  if (i !== undefined) { tablero[i] = turno; terminarTurno(); }
}

function mejorMovimiento() {
  let mejor = -Infinity, mov;
  for (let i = 0; i < 9; i++) {
    if (!tablero[i]) {
      tablero[i] = turno;
      const s = minimax(tablero, false, turno);
      tablero[i] = '';
      if (s > mejor) { mejor = s; mov = i; }
    }
  }
  return mov;
}

function minimax(t, esMax, cpu) {
  const g = ganador(t);
  const hum = cpu === 'X' ? 'O' : 'X';
  if (g === cpu) return 10;
  if (g === hum) return -10;
  if (g === 'E') return 0;
  let best = esMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!t[i]) {
      t[i] = esMax ? cpu : hum;
      const s = minimax(t, !esMax, cpu);
      t[i] = '';
      best = esMax ? Math.max(best, s) : Math.min(best, s);
    }
  }
  return best;
}

function reiniciar() {
  tablero = Array(9).fill('');
  turno = 'X';
  juegoActivo = true;
  estadoEl.textContent = 'Turno: X';
  dibujar();
  if (esCPU() && turno === simboloCPU()) setTimeout(movimientoCPU, 400);
}

modoEl.addEventListener('change', () => {
  const cpu = esCPU();
  labelDif.style.display = cpu ? 'flex' : 'none';
  labelSim.style.display = cpu ? 'flex' : 'none';
  reiniciar();
});
document.getElementById('reiniciar').addEventListener('click', reiniciar);
simEl.addEventListener('change', reiniciar);
difEl.addEventListener('change', reiniciar);

dibujar();
