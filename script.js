const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let ventana = { x1: 100, y1: 100, x2: 400, y2: 300 };
let escenaActual = 0;

const casos = [
    { p1: {x: 150, y: 150}, p2: {x: 350, y: 250}, desc: "Totalmente dentro" },
    { p1: {x: 10, y: 10},   p2: {x: 50, y: 50},   desc: "Totalmente fuera" },
    { p1: {x: 50, y: 150},  p2: {x: 450, y: 150}, desc: "Recorte horizontal (izq y der)" },
    { p1: {x: 250, y: 50},  p2: {x: 250, y: 350}, desc: "Recorte vertical (arriba y abajo)" },
    { p1: {x: 80, y: 80},   p2: {x: 420, y: 320}, desc: "Recorte diagonal completo" }
];