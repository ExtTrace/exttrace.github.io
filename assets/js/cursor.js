import { mouseState } from './state.js';

const dot = document.getElementById('cursor-dot');
const glow = document.getElementById('cursor-glow');
const clockContainer = document.getElementById('clock-container');
const pickerBtn = document.getElementById('color-picker-btn');
const exitBtn = document.getElementById('exit-screensaver-btn');

let dotX = mouseState.x;
let dotY = mouseState.y;
let glowX = mouseState.x;
let glowY = mouseState.y;

let lastTrailX = mouseState.x;
let lastTrailY = mouseState.y;

let idleTimer;

// Reset idle timer and restore visibility
function resetIdleTimer() {
  dot.style.opacity = '1';
  glow.style.opacity = '1';
  if (pickerBtn && !pickerBtn.classList.contains('active')) {
    pickerBtn.style.opacity = '0.35';
  }
  if (exitBtn) {
    exitBtn.style.opacity = '0.35';
  }
  document.body.style.cursor = 'default';

  clearTimeout(idleTimer);
  
  // Screensaver Mode: Hide cursor and UI buttons after 3 seconds of idleness
  idleTimer = setTimeout(() => {
    dot.style.opacity = '0';
    glow.style.opacity = '0';
    if (pickerBtn && !pickerBtn.classList.contains('active')) {
      pickerBtn.style.opacity = '0';
    }
    if (exitBtn) {
      exitBtn.style.opacity = '0';
    }
    document.body.style.cursor = 'none';
  }, 3000);
}

// Spawn glowing comet trail particles on cursor movement
function spawnTrailParticle(x, y) {
  const dist = Math.hypot(x - lastTrailX, y - lastTrailY);
  // Spawn particle if cursor has moved at least 4px for dense overlapping trail
  if (dist < 4) return;

  lastTrailX = x;
  lastTrailY = y;

  const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.left = `${x}px`;
  trail.style.top = `${y}px`;

  // Thicker dynamic trail particle size (12px to 26px)
  const size = Math.min(26, Math.max(12, dist * 0.45));
  trail.style.width = `${size}px`;
  trail.style.height = `${size}px`;
  trail.style.backgroundColor = activeColor;
  trail.style.boxShadow = `0 0 16px ${activeColor}, 0 0 32px ${activeColor}, inset 0 0 6px rgba(255, 255, 255, 0.5)`;

  document.body.appendChild(trail);

  // Animate shrink and fade out smoothly
  requestAnimationFrame(() => {
    trail.style.transform = 'translate(-50%, -50%) scale(0.1)';
    trail.style.opacity = '0';
  });

  setTimeout(() => {
    trail.remove();
  }, 550);
}

// Attach reset listeners & trail generator
window.addEventListener('mousemove', (e) => {
  resetIdleTimer();
  spawnTrailParticle(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
  resetIdleTimer();
  if (e.touches && e.touches[0]) {
    spawnTrailParticle(e.touches[0].clientX, e.touches[0].clientY);
  }
});
window.addEventListener('mousedown', resetIdleTimer);
resetIdleTimer();

// 3D Parallax Tilt Effect on mousemove
window.addEventListener('mousemove', () => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = mouseState.x - cx;
  const dy = mouseState.y - cy;
  
  const tiltX = (dy / cy) * -12;
  const tiltY = (dx / cx) * 12;
  
  clockContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

let isFollowerAnimating = false;

export function animateFollower() {
  const dx = mouseState.x - dotX;
  const dy = mouseState.y - dotY;
  const gx = mouseState.x - glowX;
  const gy = mouseState.y - glowY;

  // Smooth, fluid lerp following
  dotX += dx * 0.30;
  dotY += dy * 0.30;

  // Glow lerp set to 0.07 for fluid, realistic motion
  glowX += gx * 0.07;
  glowY += gy * 0.07;

  dot.style.left = `${dotX}px`;
  dot.style.top = `${dotY}px`;

  glow.style.left = `${glowX}px`;
  glow.style.top = `${glowY}px`;

  // Pause loop when cursor is stationary to save 100% CPU/GPU power
  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && Math.abs(gx) < 0.1 && Math.abs(gy) < 0.1) {
    isFollowerAnimating = false;
    return;
  }

  isFollowerAnimating = true;
  requestAnimationFrame(animateFollower);
}

function wakeFollower() {
  if (!isFollowerAnimating) {
    isFollowerAnimating = true;
    requestAnimationFrame(animateFollower);
  }
}

// Wake animation loop on mouse/touch interaction
window.addEventListener('mousemove', wakeFollower);
window.addEventListener('touchmove', wakeFollower);

