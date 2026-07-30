import { mouseState } from './state.js';

const canvas = document.getElementById('dust-canvas');
const ctx = canvas.getContext('2d');
const dustParticles = [];

// Detect Android Screensaver Mode via URL parameter
const isAndroidScreensaver = window.location.search.includes('mode=android');

// Scaled density & FPS throttle for ultra-low power consumption in screensaver mode
const dustCount = isAndroidScreensaver ? 20 : 70;
const targetFps = isAndroidScreensaver ? 25 : 60;
const frameInterval = 1000 / targetFps;

let isVisible = true;
let isLoopRunning = false;
let lastStarTime = 0;
let lastFrameTime = 0;

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
    this.size = 1.8 + Math.random() * 2.7;
    this.speedY = 0.2 + Math.random() * 0.45;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = 0.25 + Math.random() * 0.50;
  }

  update() {
    const dx = mouseState.x - this.x;
    const dy = mouseState.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const gravityRadius = 260;

    if (distance < gravityRadius) {
      const force = (gravityRadius - distance) / gravityRadius;
      const pullX = (dx / distance) * force * 0.4;
      const pullY = (dy / distance) * force * 0.4;
      
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
    // Skip heavy shadowBlur shader processing in screensaver mode to keep CPU/GPU cool
    if (!isAndroidScreensaver) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = activeColor;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.active = false;
  }

  reset() {
    this.x = Math.random() * canvas.width * 0.7 - 50;
    this.y = Math.random() * (canvas.height * 0.3) - 50;
    this.speedX = 5 + Math.random() * 4;
    this.speedY = 3.2 + Math.random() * 3;
    this.lengthFactor = 18 + Math.random() * 8;
    this.opacity = 1.0;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.008;

    if (this.opacity <= 0 || this.y > canvas.height + 100 || this.x > canvas.width + 100) {
      this.active = false;
      lastStarTime = Date.now();
    }
  }

  draw() {
    if (!this.active) return;
    const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';
    
    const tailX = this.x - this.speedX * this.lengthFactor;
    const tailY = this.y - this.speedY * this.lengthFactor;

    ctx.beginPath();
    const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, activeColor);
    gradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3.4;
    ctx.globalAlpha = Math.max(0, this.opacity);
    if (!isAndroidScreensaver) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = activeColor;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    if (!isAndroidScreensaver) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = activeColor;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
}

for (let i = 0; i < dustCount; i++) {
  dustParticles.push(new DustParticle());
}

const star = new ShootingStar();

document.addEventListener('visibilitychange', () => {
  const previouslyVisible = isVisible;
  isVisible = document.visibilityState === 'visible';
  
  if (isVisible && !previouslyVisible && !isLoopRunning) {
    animateDust();
  }
});

export function animateDust(nowTimestamp) {
  if (!isVisible) {
    isLoopRunning = false;
    return;
  }

  isLoopRunning = true;

  // FPS Throttling for energy-efficient screensaver rendering
  if (nowTimestamp && (nowTimestamp - lastFrameTime < frameInterval)) {
    requestAnimationFrame(animateDust);
    return;
  }
  lastFrameTime = nowTimestamp || Date.now();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dustParticles.forEach(p => {
    p.update();
    p.draw();
  });

  const now = Date.now();
  if (!star.active && (now - lastStarTime > 6000) && Math.random() < 0.004) {
    star.reset();
  }

  if (star.active) {
    star.update();
    star.draw();
  }

  requestAnimationFrame(animateDust);
}
