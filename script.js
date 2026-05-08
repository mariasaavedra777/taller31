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
function trazarLinea(x1, y1, x2, y2, color, grosor = 1) {
    const H = canvas.height; // Altura del lienzo
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    
    // Invertimos la Y restándola del alto total del canvas
    ctx.moveTo(x1, H - y1); 
    ctx.lineTo(x2, H - y2);
    
    ctx.stroke();
    ctx.closePath();
}
    function obtenerLineaRecortada(p1, p2, v) {
    const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;

    const computeCode = (x, y) => {
        let code = INSIDE;
        if (x < v.x1) code |= LEFT;
        else if (x > v.x2) code |= RIGHT;
        if (y < v.y1) code |= BOTTOM;
        else if (y > v.y2) code |= TOP;
        return code;
    };

    let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    let code1 = computeCode(x1, y1);
    let code2 = computeCode(x2, y2);
    let accept = false;

    while (true) {
        if (!(code1 | code2)) { accept = true; break; }
        else if (code1 & code2) { break; }
        else {
            let x, y;
            let codeOut = code1 ? code1 : code2;
            if (codeOut & TOP) {
                x = x1 + (x2 - x1) * (v.y2 - y1) / (y2 - y1);
                y = v.y2;
            } else if (codeOut & BOTTOM) {
                x = x1 + (x2 - x1) * (v.y1 - y1) / (y2 - y1);
                y = v.y1;
            } else if (codeOut & RIGHT) {
                y = y1 + (y2 - y1) * (v.x2 - x1) / (x2 - x1);
                x = v.x2;
            } else if (codeOut & LEFT) {
                y = y1 + (y2 - y1) * (v.x1 - x1) / (x2 - x1);
                x = v.x1;
            }
            if (codeOut === code1) { x1 = x; y1 = y; code1 = computeCode(x1, y1); }
            else { x2 = x; y2 = y; code2 = computeCode(x2, y2); }
        }
    }
    return accept ? { x1, y1, x2, y2 } : null;
}
// Función para limpiar el lienzo y dibujar la ventana de recorte (rectángulo azul)
function renderizar() {
    // 1. Limpiamos el canvas para que no se superpongan dibujos anteriores
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Dibujamos el Viewport (las 4 líneas de la ventana azul de 2px de grosor)
    // Usamos la función 'trazarLinea' que creaste en el Commit 3
    trazarLinea(ventana.x1, ventana.y1, ventana.x2, ventana.y1, 'blue', 2); // Línea superior
    trazarLinea(ventana.x2, ventana.y1, ventana.x2, ventana.y2, 'blue', 2); // Línea derecha
    trazarLinea(ventana.x2, ventana.y2, ventana.x1, ventana.y2, 'blue', 2); // Línea inferior
    trazarLinea(ventana.x1, ventana.y2, ventana.x1, ventana.y1, 'blue', 2); // Línea izquierda
}

// Ejecutar la función renderizar automáticamente apenas cargue la página
window.onload = renderizar;