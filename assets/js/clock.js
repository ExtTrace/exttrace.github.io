const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const ampmSpan = document.getElementById('ampm');
const dateDiv = document.getElementById('date');
const colons = document.querySelectorAll('.colon');
const timeContainer = document.getElementById('time-container');

let colonVisible = true;
let is24Hour = true;

// Restore saved clock format preference
const savedFormat = localStorage.getItem('clock-is-24h');
if (savedFormat !== null) {
  is24Hour = savedFormat === 'true';
}

timeContainer.addEventListener('click', () => {
  is24Hour = !is24Hour;
  localStorage.setItem('clock-is-24h', is24Hour);
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
}

export function initClock() {
  document.getElementById('domain-label').textContent = window.location.hostname;
  updateClock();
  setInterval(updateClock, 1000);
}
