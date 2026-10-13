const canvas = document.getElementById('juego');
const ctx = canvas.getContext('2d');
const estadoEl = document.getElementById('estado');
const puntosEl = document.getElementById('puntos');

const N = 20, CELDA = 20;
let snake, dir, comida, puntos, record = 0, vivo = false, timer = null, velocidad = 150;

function nuevaComida() {
  while (true) {
    const c = { x: Math.floor(Math.random()*N), y: Math.floor(Math.random()*N) };
    if (!snake.some(s => s.x===c.x && s.y===c.y)) return c;
  }
}

function iniciar() {
  snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dir = {x:1,y:0};
  puntos = 0;
  velocidad = 150;
  comida = nuevaComida();
  vivo = true;
  estadoEl.textContent = '¡A comer! 🍎';
  clearInterval(timer);
  timer = setInterval(paso, velocidad);
  dibujar();
  actualizarPuntos();
}

function paso() {
  const cabeza = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if (cabeza.x<0||cabeza.y<0||cabeza.x>=N||cabeza.y>=N || snake.some(s=>s.x===cabeza.x&&s.y===cabeza.y)) {
    morir(); return;
  }
  snake.unshift(cabeza);
  if (cabeza.x===comida.x && cabeza.y===comida.y) {
    puntos += 10;
    if (puntos > record) record = puntos;
    comida = nuevaComida();
    if (velocidad > 70) { velocidad -= 5; clearInterval(timer); timer = setInterval(paso, velocidad); }
  } else {
    snake.pop();
  }
  dibujar();
  actualizarPuntos();
}

function morir() {
  vivo = false;
  clearInterval(timer);
  estadoEl.textContent = 'Game Over 💔 Pulsa Iniciar';
}

function dibujar() {
  ctx.fillStyle = '#FFFDF7';
  ctx.fillRect(0,0,400,400);
  // comida
  ctx.fillStyle = '#FF9EBB';
  ctx.beginPath();
  ctx.arc(comida.x*CELDA+10, comida.y*CELDA+10, 8, 0, Math.PI*2);
  ctx.fill();
  // snake
  snake.forEach((s,i) => {
    ctx.fillStyle = i===0 ? '#7ED6A5' : '#C5F0D8';
    ctx.strokeStyle = '#5A5A72';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s.x*CELDA+1, s.y*CELDA+1, CELDA-2, CELDA-2, 6);
    ctx.fill();
    ctx.stroke();
  });
}

function actualizarPuntos() {
  puntosEl.textContent = `Puntos: ${puntos} | Récord: ${record}`;
}

document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['arrowup','w'].includes(k) && dir.y!==1) dir={x:0,y:-1};
  else if (['arrowdown','s'].includes(k) && dir.y!==-1) dir={x:0,y:1};
  else if (['arrowleft','a'].includes(k) && dir.x!==1) dir={x:-1,y:0};
  else if (['arrowright','d'].includes(k) && dir.x!==-1) dir={x:1,y:0};
  if (k.startsWith('arrow')) e.preventDefault();
});

let tx=0, ty=0;
canvas.addEventListener('touchstart', e => {
  const t = e.touches[0]; tx=t.clientX; ty=t.clientY;
}, {passive:true});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const t = e.touches[0];
  const dx = t.clientX-tx, dy = t.clientY-ty;
  if (Math.abs(dx)<12 && Math.abs(dy)<12) return;
  if (Math.abs(dx)>Math.abs(dy)) dir = dx>0 ? {x:1,y:0} : {x:-1,y:0};
  else dir = dy>0 ? {x:0,y:1} : {x:0,y:-1};
  if (dir.y===1 && snake.length>1 && snake[0].y+1===snake[1].y) dir={x:0,y:-1};
  tx=t.clientX; ty=t.clientY;
}, {passive:false});

document.getElementById('iniciar').addEventListener('click', iniciar);
dibujar();
actualizarPuntos();
