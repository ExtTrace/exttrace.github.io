import { mouseState } from './state.js';

const dot = document.getElementById('cursor-dot');
const glow = document.getElementById('cursor-glow');
const clockContainer = document.getElementById('clock-container');

let dotX = mouseState.x;
let dotY = mouseState.y;
let glowX = mouseState.x;
let glowY = mouseState.y;

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

export function animateFollower() {
  dotX += (mouseState.x - dotX) * 0.15;
  dotY += (mouseState.y - dotY) * 0.15;

  glowX += (mouseState.x - glowX) * 0.04;
  glowY += (mouseState.y - glowY) * 0.04;

  dot.style.left = `${dotX}px`;
  dot.style.top = `${dotY}px`;

  glow.style.left = `${glowX}px`;
  glow.style.top = `${glowY}px`;

  requestAnimationFrame(animateFollower);
}
