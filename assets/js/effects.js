export function initClickEffects() {
  window.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
    createParticleBurst(e.clientX, e.clientY);
  });
}

function createRipple(x, y) {
  const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';

  // Inner sharp ring (expands to 360px)
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = `${x}px`;
  r.style.top = `${y}px`;
  r.style.borderColor = activeColor;
  r.style.boxShadow = `0 0 16px ${activeColor}, inset 0 0 16px ${activeColor}`;
  document.body.appendChild(r);

  // Outer ambient shockwave ring (expands to 540px)
  const rOuter = document.createElement('div');
  rOuter.className = 'ripple-outer';
  rOuter.style.left = `${x}px`;
  rOuter.style.top = `${y}px`;
  rOuter.style.borderColor = activeColor;
  document.body.appendChild(rOuter);

  setTimeout(() => {
    r.remove();
    rOuter.remove();
  }, 950);
}

function createParticleBurst(x, y) {
  const particleCount = 36; // Increased particle count for a rich, wide splash
  const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    
    // Random particle sizes (3px to 9px)
    const size = 3 + Math.random() * 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    p.style.backgroundColor = activeColor;
    p.style.boxShadow = `0 0 10px ${activeColor}, 0 0 20px ${activeColor}`;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    // Wider particle explosion velocity (80px to 320px radius)
    const velocity = 80 + Math.random() * 240;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    p.getBoundingClientRect();

    p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
    p.style.opacity = '0';

    setTimeout(() => {
      p.remove();
    }, 950);
  }
}
