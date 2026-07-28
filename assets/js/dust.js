import { mouseState } from './state.js';

const canvas = document.getElementById('dust-canvas');
const ctx = canvas.getContext('2d');
const dustParticles = [];
const dustCount = 45;

let isVisible = true;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class DustParticle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 10;
    this.size = 0.5 + Math.random() * 2;
    this.speedY = 0.15 + Math.random() * 0.35;
    this.speedX = (Math.random() - 0.5) * 0.15;
    this.opacity = 0.05 + Math.random() * 0.35;
  }

  update() {
    const dx = mouseState.x - this.x;
    const dy = mouseState.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const gravityRadius = 250;

    if (distance < gravityRadius) {
      const force = (gravityRadius - distance) / gravityRadius;
      const pullX = (dx / distance) * force * 0.3;
      const pullY = (dy / distance) * force * 0.3;
      
      this.x += pullX;
      this.y += pullY;
    }

    this.y -= this.speedY;
    this.x += this.speedX;

    if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
      this.reset();
    }
  }

  draw() {
    const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = activeColor;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 3;
    ctx.shadowColor = activeColor;
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.active = false;
  }

  reset() {
    this.x = Math.random() * canvas.width * 0.6;
    this.y = -50;
    this.speedX = 6 + Math.random() * 6;
    this.speedY = 4 + Math.random() * 4;
    this.opacity = 1.0;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.02;

    if (this.opacity <= 0 || this.y > canvas.height + 50 || this.x > canvas.width + 50) {
      this.active = false;
    }
  }

  draw() {
    if (!this.active) return;
    const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';
    
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(
      this.x, this.y, 
      this.x - this.speedX * 3, this.y - this.speedY * 3
    );
    gradient.addColorStop(0, activeColor);
    gradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 8;
    ctx.shadowColor = activeColor;

    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.speedX * 3, this.y - this.speedY * 3);
    ctx.stroke();
  }
}

for (let i = 0; i < dustCount; i++) {
  dustParticles.push(new DustParticle());
}

const star = new ShootingStar();

// Visibility Listener: Pause animation when tab/screen is invisible to save CPU resources
document.addEventListener('visibilitychange', () => {
  isVisible = document.visibilityState === 'visible';
  if (isVisible) {
    animateDust(); // Resume loops
  }
});

export function animateDust() {
  if (!isVisible) return; // Halt loop execution on invisibility

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur = 0;

  dustParticles.forEach(p => {
    p.update();
    p.draw();
  });

  if (!star.active && Math.random() < 0.0015) {
    star.reset();
  }

  if (star.active) {
    star.update();
    star.draw();
  }

  requestAnimationFrame(animateDust);
}
