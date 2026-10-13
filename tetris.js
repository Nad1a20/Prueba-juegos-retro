const canvas = document.getElementById('juego');
const ctx = canvas.getContext('2d');
const estadoEl = document.getElementById('estado');
const puntosEl = document.getElementById('puntos');

const COLS = 10, ROWS = 20, B = 30;
const COLORES = {
  I:'#7FB8F0', O:'#E8D48B', T:'#B79CED', S:'#7ED6A5',
  Z:'#FF9EBB', J:'#9EC9F0', L:'#FFC79E'
};
const PIEZAS = {
  I:[[1,1,1,1]],
  O:[[1,1],[1,1]],
  T:[[0,1,0],[1,1,1]],
  S:[[0,1,1],[1,1,0]],
  Z:[[1,1,0],[0,1,1]],
  J:[[1,0,0],[1,1,1]],
  L:[[0,0,1],[1,1,1]]
};

let grid, pieza, px, py, puntos, lineas, nivel, vivo, pausado, timer, velocidad;

function vaciar() { return Array.from({length:ROWS}, () => Array(COLS).fill('')); }

function iniciar() {
  grid = vaciar();
  puntos = 0; lineas = 0; nivel = 1;
  vivo = true; pausado = false;
  velocidad = 700;
  estadoEl.textContent = '¡A jugar! 🌸';
  document.getElementById('pausa').textContent = 'Pausa';
  nuevaPieza();
  clearInterval(timer);
  timer = setInterval(bajar, velocidad);
  dibujar();
  actualizar();
}

function nuevaPieza() {
  const keys = Object.keys(PIEZAS);
  const k = keys[Math.floor(Math.random()*keys.length)];
  pieza = { forma: PIEZAS[k].map(r=>[...r]), color: COLORES[k] };
  px = Math.floor(COLS/2) - Math.ceil(pieza.forma[0].length/2);
  py = 0;
  if (colisiona(px, py, pieza.forma)) morir();
}

function rotar(m) {
  return m[0].map((_, i) => m.map(r => r[i]).reverse());
}

function colisiona(nx, ny, forma) {
  for (let y=0; y<forma.length; y++)
    for (let x=0; x<forma[y].length; x++)
      if (forma[y][x]) {
        const gx = nx+x, gy = ny+y;
        if (gx<0||gx>=COLS||gy>=ROWS) return true;
        if (gy>=0 && grid[gy][gx]) return true;
      }
  return false;
}

function fijar() {
  pieza.forma.forEach((r,y) => r.forEach((v,x) => {
    if (v && py+y>=0) grid[py+y][px+x] = pieza.color;
  }));
  limpiarLineas();
  if (vivo) nuevaPieza();
}

function limpiarLineas() {
  let n = 0;
  grid = grid.filter(row => {
    if (row.every(c => c)) { n++; return false; }
    return true;
  });
  while (grid.length < ROWS) grid.unshift(Array(COLS).fill(''));
  if (n) {
    lineas += n;
    puntos += [0,100,300,500,800][n] * nivel;
    nivel = Math.floor(lineas/10)+1;
    velocidad = Math.max(100, 700 - (nivel-1)*60);
    clearInterval(timer);
    if (vivo && !pausado) timer = setInterval(bajar, velocidad);
  }
}

function bajar() {
  if (!vivo || pausado) return;
  if (!colisiona(px, py+1, pieza.forma)) py++;
  else fijar();
  dibujar();
  actualizar();
}

function caidaDura() {
  if (!vivo || pausado) return;
  while (!colisiona(px, py+1, pieza.forma)) py++;
  fijar(); dibujar(); actualizar();
}

function morir() {
  vivo = false;
  clearInterval(timer);
  estadoEl.textContent = 'Game Over 💔 Pulsa Iniciar';
}

function dibujar() {
  ctx.fillStyle = '#FFFDF7';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  const dib = (gx,gy,color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(gx*B+1, gy*B+1, B-2, B-2, 7);
    else ctx.rect(gx*B+1, gy*B+1, B-2, B-2);
    ctx.fill(); ctx.stroke();
  };
  grid.forEach((row,y) => row.forEach((c,x) => { if (c) dib(x,y,c); }));
  if (pieza && vivo) pieza.forma.forEach((r,y) => r.forEach((v,x) => {
    if (v && py+y>=0) dib(px+x, py+y, pieza.color);
  }));
}

function actualizar() {
  puntosEl.textContent = `Puntos: ${puntos} | Líneas: ${lineas} | Nivel: ${nivel}`;
}

function togglePausa() {
  if (!vivo) return;
  pausado = !pausado;
  estadoEl.textContent = pausado ? 'Pausa ⏸️' : '¡A jugar! 🌸';
  document.getElementById('pausa').textContent = pausado ? 'Reanudar' : 'Pausa';
}

document.addEventListener('keydown', e => {
  if (!vivo || pausado || !pieza) return;
  if (e.key === 'ArrowLeft') {
    if (!colisiona(px-1, py, pieza.forma)) { px--; dibujar(); }
    e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    if (!colisiona(px+1, py, pieza.forma)) { px++; dibujar(); }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (!colisiona(px, py+1, pieza.forma)) { py++; dibujar(); actualizar(); }
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    const r = rotar(pieza.forma);
    if (!colisiona(px, py, r)) { pieza.forma = r; dibujar(); }
    e.preventDefault();
  } else if (e.key === ' ') {
    caidaDura(); e.preventDefault();
  } else if (e.key.toLowerCase() === 'p') {
    togglePausa();
  }
});

document.getElementById('iniciar').addEventListener('click', iniciar);
document.getElementById('pausa').addEventListener('click', togglePausa);

grid = vaciar();
pieza = null; puntos = 0; lineas = 0; nivel = 1; vivo = false; pausado = false;
dibujar();
actualizar();
