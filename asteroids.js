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
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.rotation = Math.atan2(velocity.y, velocity.x); // Calculate the angle based on velocity
        this.vertices = this.generateVertices(); // Generate vertices for the asteroid
    }

    generateVertices() {
        const numVertices = Math.floor(Math.random() * 4) + 5; // Randomly select between 5-8 vertices
        const angleStep = (Math.PI * 2) / numVertices;
        const vertices = [];

        for (let i = 0; i < numVertices; i++) {
            const angle = i * angleStep;
            const rad = this.radius + (Math.random() * 10 - 5); // Add some random noise to the radius
            const x = rad * Math.cos(angle);
            const y = rad * Math.sin(angle);
            vertices.push({ x, y });
        }

        return vertices;
    }

    draw() {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation); // Rotate the asteroid to face its velocity

        context.strokeStyle = "grey";
        context.lineWidth = 3;
        context.beginPath();

        // Move to the first vertex
        context.moveTo(this.vertices[0].x, this.vertices[0].y);
        
        // Draw lines between each vertex
        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        
        context.closePath();
        context.stroke();

        context.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 5
        this.rotation = Math.atan2(velocity.y, velocity.x); // Calculate the angle based on velocity

    }

    draw() {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation); // Rotate the projectile to face its velocity

        context.fillStyle = 'orange';
        context.fillRect(-7.5, -2, 15, 4); // Centered rectangle (adjusted coordinates for rotation)

        context.restore();
    }

    update(){
        this.draw()
        this.position.x  += this.velocity.x
        this.position.y += this.velocity.y
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

const projectiles = []
const PROJECTILE_SPEED = 3

const asteroid = []
 
window.setInterval(() => {
    const index = Math.floor(Math.random ()* 4);
    let x,y,vx, vy;
    let radius = 50* Math.random()+10;

    switch (index){
    case 0: // left side 
        x =  0 - radius
        y =  Math.random() * canvas.height
        vx = 1
        vy = 0
        break 
    case 1: // right side 
        x=  canvas.width + radius
        y=  Math.random() * canvas.height
        vx = -1
        vy = 0
        break
     case 2: // top side 
        x=  Math.random() * canvas.width
        y=  0 - radius
        vx = 0
        vy =  1
        break
    case 3:// bot side  
        x=  Math.random() * canvas.width
        y=  canvas.height + radius
        vx = 0
        vy = -1
        break
    }

    asteroid.push(
        new Asteroid({
         position:{
            x: x,
            y: y,
        },
        velocity: {
            x:vx,
            y:vy,
        } ,
        radius,
     }))
}, 3000);

function collision(circle1, circle2){
    const xDifference = circle2.position.x - circle1.position.x
    const yDifference = circle2.position.y - circle1.position.y

    const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference)

    if ( distance <= circle1.radius + circle2.radius){
        console.log("Two have collided")
        return true
    }
    
    return false
}

function animate() {
    window.requestAnimationFrame(animate);
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawDots(dots); // Draw the dots in the background
    player.update();



    for (let i = projectiles.length - 1; i >= 0; i--){//we use a for loop instead of projectile.forEach() because we want to render things from the back not the front (when we want to remove the)
        const projectile = projectiles[i];
        projectile.update()

        //garbaje collection for projectiles
        if (projectile.position.x + projectile.radius < 0 || 
            projectile.position.x - projectile.radius > canvas.width ||
            projectile.position.y - projectile.radius > canvas.height ||
            projectile.position.y + projectile.radius < 0
        ){
            projectiles.splice(i,1)
        }
    }
 // Asteroid management
 for (let i = 0; i < asteroid.length; i++) {
    const currentAsteroid = asteroid[i];

    for (let j = 0; j < projectiles.length; j++) {
        const projectile = projectiles[j];

        if (collision(currentAsteroid, projectile)) {
            // Handle collision logic, e.g., remove projectile and asteroid
            projectiles.splice(j, 1);
            asteroid.splice(i, 1);
            break; // Break to avoid issues with removed items
        }
    
    currentAsteroid.update();
}
    if (currentAsteroid.position.x < 0) {
        currentAsteroid.position.x = canvas.width;
    } else if (currentAsteroid.position.x > canvas.width) {
        currentAsteroid.position.x = 0;
    }

    if (currentAsteroid.position.y < 0) {
        currentAsteroid.position.y = canvas.height;
    } else if (currentAsteroid.position.y > canvas.height) {
        currentAsteroid.position.y = 0;
    }


    currentAsteroid.update(); // Update each asteroid
}    
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
        case 'Space':
            projectiles.push(new Projectile({
                position:{
                    x:player.position.x + Math.cos(player.rotation)*30 ,
                    y:player.position.y + Math.sin(player.rotation)*30 // will spawn projectile on the player
                },
                velocity: {
                    x:Math.cos(player.rotation) * PROJECTILE_SPEED,
                    y:Math.sin(player.rotation) * PROJECTILE_SPEED ,
                }
            }))
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
})