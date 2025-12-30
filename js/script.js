/* 
   Brimarc Global - Geometric Particle System 
   Shapes: Circles, Squares, Triangles
*/

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Resize Logic
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});
resizeCanvas(); // Init immediately

// Mouse Interaction
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Size 1-4px
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;

        // Slow Drift
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;

        // Random Shape Assignment
        const shapes = ['circle', 'circle', 'square', 'triangle'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];

        // Colors: White/Cyan/Alpha
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`; // Subtle white

        // 10% chance to be Cyan
        if (Math.random() > 0.90) {
            this.color = `rgba(0, 255, 255, ${Math.random() * 0.5 + 0.3})`;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();

        if (this.shape === 'circle') {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        else if (this.shape === 'square') {
            ctx.rect(this.x, this.y, this.size * 2, this.size * 2);
            ctx.fill();
        }
        else if (this.shape === 'triangle') {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size * 2, this.y + this.size * 3);
            ctx.lineTo(this.x - this.size * 2, this.y + this.size * 3);
            ctx.fill();
        }
        ctx.closePath();
    }

    update() {
        // 1. Mouse Interaction (Repulsion)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // 2. Drift Physics
            this.x += this.speedX;
            this.y += this.speedY;
        }

        // 3. Screen Wrapping (Seamless)
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

function init() {
    particlesArray = [];
    // Density calculation: fewer particles for cleaner look
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    requestAnimationFrame(animate);
}

init();
animate();

// Dropdown Logic (Will attach when DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    const accountWrapper = document.querySelector('.account-wrapper');
    const accountBtn = document.querySelector('.account-btn');

    if (accountWrapper && accountBtn) {
        accountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountWrapper.classList.toggle('active');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            accountWrapper.classList.remove('active');
        });

        // Prevent close when clicking inside dropdown
        accountWrapper.querySelector('.account-dropdown').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
