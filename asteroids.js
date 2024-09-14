const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillStyle = 'black';
context.fillRect(0,0,canvas.width,canvas.height);

class Player {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        //creates the circle in the ship
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();

        //creates the ship
        context.beginPath();
        context.moveTo(this.position.x + 30, this.position.y);
        context.lineTo(this.position.x - 10, this.position.y - 10);
        context.lineTo(this.position.x - 10, this.position.y + 10);
        context.closePath();
        context.strokeStyle = "white";
        context.stroke();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 },
});

const keys = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

function animate() {
    window.requestAnimationFrame(animate);

    
    player.velocity.x = 0;
    player.velocity.y = 0;

    if (keys.w.pressed) player.velocity.y = -1;
    if (keys.s.pressed) player.velocity.y = 1;
    if (keys.a.pressed) player.velocity.x = -1;
    if (keys.d.pressed) player.velocity.x = 1;

    player.update();
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true;
            break;
        case 'KeyS':
            keys.s.pressed = true;
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
        case 'KeyS':
            keys.s.pressed = false;
            break;
        case 'KeyA':
            keys.a.pressed = false;
            break;
        case 'KeyD':
            keys.d.pressed = false;
            break;
    }
});
