const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const sizeSelector = document.getElementById('size-selector');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const gridBtn = document.getElementById('grid-btn');

let gridSize = parseInt(sizeSelector.value);
let isDrawing = false;
let showGrid = true;
const canvasSize = 512; 

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!showGrid) return;
    
    const cellSize = canvasSize / gridSize;
    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= canvasSize; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
    }
}

function fillPixel(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (!clientX || !clientY) return;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    const cellSize = canvasSize / gridSize;
    const gridX = Math.floor(x / cellSize) * cellSize;
    const gridY = Math.floor(y / cellSize) * cellSize;
    
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(gridX, gridY, cellSize, cellSize);
}

// Mouse Events
canvas.addEventListener('mousedown', (e) => { isDrawing = true; fillPixel(e); });
canvas.addEventListener('mousemove', fillPixel);
window.addEventListener('mouseup', () => isDrawing = false);

// Touch Events for Mobile Response
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; fillPixel(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); fillPixel(e); }, { passive: false });
window.addEventListener('touchend', () => isDrawing = false);

// UI Controls
clearBtn.addEventListener('click', drawGrid);
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
});
gridBtn.addEventListener('click', () => {
    showGrid = !showGrid;
    drawGrid();
});
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g') {
        showGrid = !showGrid;
        drawGrid();
    }
    if (e.key.toLowerCase() === 'p') {
        colorPicker.click();
    }
});

sizeSelector.addEventListener('change', (e) => {
    gridSize = parseInt(e.target.value);
    drawGrid();
});

drawGrid();