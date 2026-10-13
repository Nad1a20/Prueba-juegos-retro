const canvas = document.getElementById('juego');
const ctx = canvas.getContext('2d');
const estadoEl = document.getElementById('estado');
const puntosEl = document.getElementById('puntos');
const modoEl = document.getElementById('modo');
const difEl = document.getElementById('dificultad');

const W = canvas.width, H = canvas.height;
const PAL_W = 14, PAL_H = 90;
let p1Y, p2Y, bola, vel, puntos1, puntos2, jugando, pausado, raf;
let teclas = {};

const DIF = { facil: 0.06, normal: 0.12, dificil: 0.22 };

function reset(servicio = 0) {
  p1Y = H/2 - PAL_H/2;
  p2Y = H/2 - PAL_H/2;
  const ang = (Math.random()*0.6 - 0.3);
  const dirX = servicio === 0 ? (Math.random()<0.5?-1:1) : (servicio===1?1:-1);
  const sp = 5;
  bola = { x: W/2, y: H/2, vx: Math.cos(ang)*sp*dirX, vy: Math.sin(ang)*sp };
}

function iniciar() {
  puntos1 = 0; puntos2 = 0;
  jugando = true; pausado = false;
  document.getElementById('pausa').textContent = 'Pausa';
  reset(0);
  estadoEl.textContent = modoEl.value === 'cpu' ? 'Tú (izq) vs CPU (der)' : 'Jugador 1 (izq) vs Jugador 2 (der)';
  cancelAnimationFrame(raf);
  loop();
  actualizar();
}

function loop() {
  if (!jugando || pausado) return;
  mover();
  dibujar();
  raf = requestAnimationFrame(loop);
}

function mover() {
  const v = 7;
  if (teclas['w']) p1Y -= v;
  if (teclas['s']) p1Y += v;
  if (modoEl.value === '2p') {
    if (teclas['arrowup']) p2Y -= v;
    if (teclas['arrowdown']) p2Y += v;
  } else {
    // CPU sigue la bola con error según dificultad
    const k = DIF[difEl.value] || 0.12;
    const centro = p2Y + PAL_H/2;
    const err = (H*0.06) * (difEl.value==='facil'?1:0.3);
    if (bola.vx > 0 && bola.x > W*0.4) {
      if (centro < bola.y - err) p2Y += v * k * 10 * 0.55;
      else if (centro > bola.y + err) p2Y -= v * k * 10 * 0.55;
    }
    if (teclas['arrowup']) p1Y -= v;
    if (teclas['arrowdown']) p1Y += v;
  }
  p1Y = Math.max(0, Math.min(H-PAL_H, p1Y));
  p2Y = Math.max(0, Math.min(H-PAL_H, p2Y));

  bola.x += bola.vx;
  bola.y += bola.vy;

  if (bola.y < 10 || bola.y > H-10) bola.vy *= -1;

  // paletas
  if (bola.x < 30 && bola.y > p1Y && bola.y < p1Y+PAL_H && bola.vx < 0) {
    const rel = (bola.y - (p1Y+PAL_H/2)) / (PAL_H/2);
    const sp = Math.min(9, Math.hypot(bola.vx, bola.vy) * 1.05);
    const ang = rel * 0.9;
    bola.vx = Math.cos(ang) * sp;
    bola.vy = Math.sin(ang) * sp;
  }
  if (bola.x > W-30 && bola.y > p2Y && bola.y < p2Y+PAL_H && bola.vx > 0) {
    const rel = (bola.y - (p2Y+PAL_H/2)) / (PAL_H/2);
    const sp = Math.min(9, Math.hypot(bola.vx, bola.vy) * 1.05);
    const ang = rel * 0.9;
    bola.vx = -Math.cos(ang) * sp;
    bola.vy = Math.sin(ang) * sp;
  }

  if (bola.x < 0) { puntos2++; punto(2); }
  if (bola.x > W) { puntos1++; punto(1); }
}

function punto(gano) {
  actualizar();
  if (puntos1 >= 5 || puntos2 >= 5) {
    jugando = false;
    const n1 = modoEl.value==='cpu' ? '¡Ganaste! 🎉' : '¡Gana Jugador 1! 🎉';
    const n2 = modoEl.value==='cpu' ? 'Gana la CPU 🤖' : '¡Gana Jugador 2! 🎉';
    estadoEl.textContent = (gano===1 ? n1 : n2) + ' Pulsa Iniciar';
    dibujar();
    return;
  }
  reset(gano===1 ? 1 : -1);
}

function dibujar() {
  ctx.fillStyle = '#FFFDF7';
  ctx.fillRect(0,0,W,H);
  ctx.strokeStyle = '#E2D1FF';
  ctx.setLineDash([10,10]);
  ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#FF9EBB';
  ctx.beginPath(); ctx.roundRect(16, p1Y, PAL_W, PAL_H, 7); ctx.fill();
  ctx.fillStyle = '#7FB8F0';
  ctx.beginPath(); ctx.roundRect(W-16-PAL_W, p2Y, PAL_W, PAL_H, 7); ctx.fill();
  ctx.fillStyle = '#B79CED';
  ctx.beginPath(); ctx.arc(bola.x, bola.y, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#8A8AA3';
  ctx.font = '800 42px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(puntos1, W/2-50, 55);
  ctx.fillText(puntos2, W/2+50, 55);
}

function actualizar() {
  const n2 = modoEl.value==='cpu' ? 'CPU' : 'Jugador 2';
  puntosEl.textContent = `Jugador 1: ${puntos1} | ${n2}: ${puntos2}`;
}

document.addEventListener('keydown', e => {
  teclas[e.key.toLowerCase()] = true;
  if (e.key.startsWith('Arrow')) e.preventDefault();
});
document.addEventListener('keyup', e => { teclas[e.key.toLowerCase()] = false; });

document.getElementById('iniciar').addEventListener('click', iniciar);
document.getElementById('pausa').addEventListener('click', () => {
  if (!jugando) return;
  pausado = !pausado;
  document.getElementById('pausa').textContent = pausado ? 'Reanudar' : 'Pausa';
  estadoEl.textContent = pausado ? 'Pausa ⏸️' : '¡Jugando!';
  if (!pausado) loop();
});
modoEl.addEventListener('change', () => {
  document.getElementById('labelDif').style.display = modoEl.value==='cpu' ? 'flex' : 'none';
});

puntos1 = 0; puntos2 = 0; jugando = false; pausado = false;
reset(0);
dibujar();
actualizar();
