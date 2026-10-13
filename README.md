# 🌸 Melody Game 👾

Mini sitio web de juegos arcade con estética **retro + colores pastel**, hecho solo con **HTML, CSS y JavaScript vanilla**. Sin librerías, sin build, sin dependencias.

Abre `index.html` en tu navegador y elige juego.

## 🎮 Juegos incluidos

| # | Juego | Archivo | Modos |
|---|-------|---------|-------|
| 01 | ⭕ Gato | `gato.html` + `gato.js` | 2 Jugadores / Vs CPU (Fácil aleatorio, Difícil con minimax). Eliges X u O. Marcador. |
| 02 | 🐍 Snake | `snake.html` + `snake.js` | 1 jugador. Flechas / WASD + táctil. Puntaje, récord y velocidad creciente. |
| 03 | 🧱 Tetris | `tetris.html` + `tetris.js` | 1 jugador. Mover, rotar, caída dura, niveles, líneas y pausa. |
| 04 | 🏓 Pong | `pong.html` + `pong.js` | Vs CPU (Fácil / Normal / Difícil) / 2 Jugadores (W/S vs ↑/↓). Gana el primero a 5. |

## ✨ Características

- Home `Melody Game` con hero animado 100% CSS: Gato, Snake, Tetris y Pong.
- Grid 2x2 en desktop, 1 columna en móvil.
- Estilo retro arcade (fuente `Press Start 2P`, bordes gruesos, sombra dura) sobre paleta pastel.
- Cada juego tiene botón `← Inicio` para volver al home.
- Responsive y táctil básico en Snake.

## 📁 Estructura

```
.
├── index.html   # Home Melody Game
├── styles.css   # Estilos retro pastel compartidos + animaciones
├── gato.html / gato.js
├── snake.html / snake.js
├── tetris.html / tetris.js
└── pong.html / pong.js
```

## 🚀 Cómo jugar local

Opción 1 — doble clic:
1. Abre `index.html` en Chrome / Edge / Firefox.

Opción 2 — servidor local (recomendado para fuentes y rutas):
```bash
# con Python
python -m http.server 8000
# luego abre http://localhost:8000
```

```bash
# con Node
npx serve .
```

## 🕹️ Controles

- **Gato:** clic en celdas.
- **Snake:** Flechas o WASD. En móvil desliza sobre el canvas.
- **Tetris:** `← →` mover, `↓` bajar, `↑` rotar, `Espacio` caída dura, `P` pausa.
- **Pong Vs CPU:** `W/S` o `↑/↓`. **Pong 2P:** izquierda `W/S`, derecha `↑/↓`.

## 🎨 Paleta pastel

- Rosa `#FFD6E0` / `#FF9EBB`
- Lila `#E2D1FF` / `#B79CED`
- Menta `#C5F0D8` / `#7ED6A5`
- Celeste `#CDE7FF` / `#7FB8F0`
- Crema `#FFF9EC`, Amarillo `#FFF3B0`, Texto `#5A5A72`

Fuente pixel: `Press Start 2P` + `Nunito` desde Google Fonts.

## 📝 Notas

- No hay backend ni guardado permanente. El récord de Snake vive solo en memoria.
- Todo el código es vanilla JS para que sea fácil de leer y modificar.

Hecho con 💗 en HTML + JS.
