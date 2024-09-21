const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    draw() {
        // Draw the main ship
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);

        context.beginPath();
        context.moveTo(30, 0);
        context.lineTo(-10, -10);
        context.lineTo(-10, 10);
        context.closePath();

        context.fillStyle = 'white';
        context.fill(); 
        context.strokeStyle = "red"; 
        context.stroke();

        context.restore();

        // Draw thrusters if moving forward
        if (keys.w.pressed) {
            // Thruster positions relative to the player
            const thrusterOffset = 10; // Distance behind the ship

            // Draw center thruster
            context.save();
            context.translate(
                this.position.x - thrusterOffset * Math.cos(this.rotation),
                this.position.y - thrusterOffset * Math.sin(this.rotation)
            );
            context.rotate(this.rotation);
            this.drawThruster();
            context.restore();
        }
    }

    drawThruster() {
        context.fillStyle = 'red';
        context.strokeStyle = "yellow";
        
        context.beginPath();
        context.moveTo(-15, 0); 
        context.lineTo(-5, -5);
        context.lineTo(-5, 5);
        context.closePath();
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(-12, 0); // Top point of the small left triangle
        context.lineTo(-5, 7); // Bottom right point
        context.lineTo(-5, 2);   // Bottom left point
        context.closePath();
        context.fill();
        context.stroke();

        // Smaller triangle on the right
        context.beginPath();
        context.moveTo(-12, 0);  // Top point of the small right triangle
        context.lineTo(-5, -7); // Bottom right point
        context.lineTo(-5, -2);   // Bottom left point
        context.closePath();
        context.fill();
        context.stroke(); 
            }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

    
class Asteroid {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    draw() {
        // Implement asteroid drawing here if needed
    }
}

// Function to create random dots
function createDots(numDots) {
    const dots = [];
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        });
    }
    return dots;
}

// Draw dots on the canvas
function drawDots(dots) {
    context.fillStyle = 'white';
    dots.forEach(dot => {
        context.beginPath();
        context.arc(dot.x, dot.y, 2, 0, Math.PI * 2); // Draw a small dot
        context.fill();
    });
}

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 },
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

const MOVE_SPEED = 0.098; // Movement speed increment
const FRICTION = 0.98; // Friction to slow down the player
const ROTATE_SPEED = 0.05; // Rotation speed
const NUM_DOTS = 100; // Number of dots in the background
const dots = createDots(NUM_DOTS); // Create dots

function animate() {
    window.requestAnimationFrame(animate);
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawDots(dots); // Draw the dots in the background
    player.update();

    if (keys.w.pressed) {
        player.velocity.x += MOVE_SPEED * Math.cos(player.rotation);
        player.velocity.y += MOVE_SPEED * Math.sin(player.rotation);
           
    } else {
        // Apply friction
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }

    // Out of bounds
    if (player.position.x < 0) {
        player.position.x = canvas.width;
    } else if (player.position.x > canvas.width) {
        player.position.x = 0;
    }

    if (player.position.y < 0) {
        player.position.y = canvas.height;
    } else if (player.position.y > canvas.height) {
        player.position.y = 0;
    }

    // Handle rotation
    if (keys.a.pressed) player.rotation -= ROTATE_SPEED;
    if (keys.d.pressed) player.rotation += ROTATE_SPEED;
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true;
            break;
        case 'KeyA':
            keys.a.pressed = true;
            break;
        case 'KeyD':
            keys.d.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = false;
            break;
        case 'KeyA':
            keys.a.pressed = false;
            break;
        case 'KeyD':
            keys.d.pressed = false;
            break;
    }
});
