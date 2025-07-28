const overlayCanvas = document.getElementById('overlayCanvas');
const ctx = overlayCanvas.getContext('2d');
const revealedContent = document.querySelector('.revealed-content');
let isDrawing = false;
let isRevealed = false; // Flag to prevent multiple reveals

// Set canvas dimensions based on its container
const scratchContainer = document.querySelector('.scratch-container');
overlayCanvas.width = scratchContainer.clientWidth;
overlayCanvas.height = scratchContainer.clientHeight;

// Draw an initial opaque overlay (e.g., a gray rectangle)
ctx.fillStyle = '#777'; // A neutral gray
ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

// Add text prompt on the scratch area
ctx.fillStyle = '#fff';
ctx.font = '20px "Poppins", sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Scratch to reveal', overlayCanvas.width / 2, overlayCanvas.height / 2);


function getScratchedPercentage() {
    if (isRevealed) return 100; // If already revealed, no need to calculate

    const pixels = ctx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height);
    const data = pixels.data;
    let transparentPixels = 0;

    // Iterate over each pixel (4 values: R, G, B, A)
    for (let i = 0; i < data.length; i += 4) {
        // Check if the alpha channel is 0 (fully transparent)
        if (data[i + 3] === 0) {
            transparentPixels++;
        }
    }

    const totalPixels = data.length / 4;
    return (transparentPixels / totalPixels) * 100;
}

function revealContent() {
    if (isRevealed) return; // Don't run if already revealed

    const percentage = getScratchedPercentage();
    
    // Set a threshold, e.g., 50%
    if (percentage > 50) {
        isRevealed = true;
        // Smoothly fade out the canvas
        overlayCanvas.style.opacity = '0';
        // After fade out, remove it to allow text selection
        setTimeout(() => {
            overlayCanvas.style.display = 'none';
        }, 500); // Match timeout with CSS transition duration
    }
}

const startDrawing = (e) => {
    isDrawing = true;
    draw(e); // Allow drawing on click without moving
};

const stopDrawing = () => {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.beginPath(); // Reset the path
    revealContent(); // Check percentage when mouse is released
};

const draw = (e) => {
    if (!isDrawing || isRevealed) return;

    // Handle both mouse and touch events
    e.preventDefault();
    const rect = overlayCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2, false); // Increased radius for easier scratching
    ctx.fill();
};

// Mouse events
overlayCanvas.addEventListener('mousedown', startDrawing);
overlayCanvas.addEventListener('mouseup', stopDrawing);
overlayCanvas.addEventListener('mouseleave', stopDrawing); // Stop if mouse leaves canvas
overlayCanvas.addEventListener('mousemove', draw);

// Touch events for mobile support
overlayCanvas.addEventListener('touchstart', startDrawing);
overlayCanvas.addEventListener('touchend', stopDrawing);
overlayCanvas.addEventListener('touchmove', draw);