const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const ampmSpan = document.getElementById('ampm');
const dateDiv = document.getElementById('date');
const colons = document.querySelectorAll('.colon');
const timeContainer = document.getElementById('time-container');

let colonVisible = true;
let is24Hour = true;
let lastMinutesValue = -1;

// Restore saved clock format preference safely
try {
  const savedFormat = localStorage.getItem('clock-is-24h');
  if (savedFormat !== null) {
    is24Hour = savedFormat === 'true';
  }
} catch (e) {
  console.warn("LocalStorage is not available:", e);
}

timeContainer.addEventListener('click', (e) => {
  e.preventDefault();
  is24Hour = !is24Hour;
  
  try {
    localStorage.setItem('clock-is-24h', is24Hour);
  } catch (e) {
    console.warn("Could not save to LocalStorage:", e);
  }
  
  updateClock();
});

function updateClock() {
  const now = new Date();
  let hoursVal = now.getHours();

  if (!is24Hour) {
    const ampmVal = hoursVal >= 12 ? 'PM' : 'AM';
    hoursVal = hoursVal % 12;
    hoursVal = hoursVal ? hoursVal : 12;
    
    ampmSpan.textContent = ampmVal;
    ampmSpan.classList.add('visible');
  } else {
    ampmSpan.textContent = ''; // Clear text content to prevent layout artifacts
    ampmSpan.classList.remove('visible');
  }

  hoursSpan.textContent = String(hoursVal).padStart(2, '0');
  minutesSpan.textContent = String(now.getMinutes()).padStart(2, '0');
  secondsSpan.textContent = String(now.getSeconds()).padStart(2, '0');

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  dateDiv.textContent = now.toLocaleDateString('en-US', options);

  colons.forEach(c => {
    c.style.opacity = colonVisible ? '1' : '0.2';
  });
  colonVisible = !colonVisible;

  // OLED/IPS Screen Burn-In Prevention (Pixel Shifting every minute)
  const currentMinutes = now.getMinutes();
  if (currentMinutes !== lastMinutesValue) {
    lastMinutesValue = currentMinutes;
    const offsetX = (Math.random() - 0.5) * 50; // -25px to +25px range
    const offsetY = (Math.random() - 0.5) * 30; // -15px to +15px range
    const wrapper = document.querySelector('.clock-wrapper');
    if (wrapper) {
      wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      wrapper.style.transition = 'transform 6s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  }
}

function runClockLoop() {
  updateClock();
  
  // Calculate exact milliseconds left until the next second boundary
  const now = new Date();
  const msUntilNextSecond = 1000 - now.getMilliseconds();
  
  // Dynamic sync scheduling
  setTimeout(runClockLoop, msUntilNextSecond);
}

export function initClock() {
  // Check URL query parameters to toggle screensaver mode automatically
  const urlParams = new URLSearchParams(window.location.search);
  const isScreensaverMode = urlParams.get('mode') === 'screensaver' || urlParams.get('screensaver') === 'true';

  const domainLabel = document.getElementById('domain-label');
  if (domainLabel) {
    if (isScreensaverMode) {
      domainLabel.style.display = 'none';
    } else {
      domainLabel.textContent = window.location.hostname;
    }
  }

  // Clean up animation on wrapper once completed to free up transform property
  const wrapper = document.querySelector('.clock-wrapper');
  if (wrapper) {
    wrapper.addEventListener('animationend', () => {
      wrapper.style.animation = 'none';
      wrapper.style.opacity = '1';
    });
  }

  // Start the self-correcting sync loop
  runClockLoop();
}
