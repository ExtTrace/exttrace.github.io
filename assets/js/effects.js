export function initClickEffects() {
  window.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
    createParticleBurst(e.clientX, e.clientY);
  });
}

function createRipple(x, y) {
  const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = `${x}px`;
  r.style.top = `${y}px`;
  r.style.borderColor = activeColor;
  r.style.boxShadow = `0 0 10px ${activeColor}, inset 0 0 10px ${activeColor}`;
  document.body.appendChild(r);

  setTimeout(() => {
    r.remove();
  }, 600);
}

function createParticleBurst(x, y) {
  const particleCount = 20;
  const activeColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#818cf8';

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    
    const size = 3 + Math.random() * 5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    p.style.backgroundColor = activeColor;
    p.style.boxShadow = `0 0 8px ${activeColor}, 0 0 16px ${activeColor}`;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 40 + Math.random() * 120;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    p.getBoundingClientRect();

    p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
    p.style.opacity = '0';

    setTimeout(() => {
      p.remove();
    }, 800);
  }
}
