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
  const systemLocale = new URLSearchParams(window.location.search).get('lang') || navigator.language || undefined;
  dateDiv.textContent = now.toLocaleDateString(systemLocale, options);

  colons.forEach(c => {
    c.style.opacity = colonVisible ? '1' : '0.2';
  });
  colonVisible = !colonVisible;

  // OLED/IPS Screen Burn-In Protection (Fade Out -> Instant Silent Jump -> Fade In)
  const currentMinutes = now.getMinutes();
  if (lastMinutesValue === -1) {
    lastMinutesValue = currentMinutes;
  } else if (currentMinutes !== lastMinutesValue) {
    lastMinutesValue = currentMinutes;
    const wrapper = document.querySelector('.clock-wrapper');
    if (wrapper) {
      const transitionCurve = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';

      // Step 1: Smooth Fade Out (2s 1:1 speed)
      wrapper.style.transition = transitionCurve;
      wrapper.style.opacity = '0';

      // Step 2: Instant silent reposition while 100% invisible
      setTimeout(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const wrapperWidth = wrapper.offsetWidth || 380;
        const wrapperHeight = wrapper.offsetHeight || 180;

        // Safe boundaries with padding so clock is never cut off
        const paddingX = 30;
        const paddingY = 30;
        const maxX = Math.max(0, (vw - wrapperWidth) / 2 - paddingX);
        const maxY = Math.max(0, (vh - wrapperHeight) / 2 - paddingY);

        const randomX = (Math.random() * 2 - 1) * maxX; // -maxX to +maxX
        const randomY = (Math.random() * 2 - 1) * maxY; // -maxY to +maxY

        // Disable transition for instant 0ms position jump
        wrapper.style.transition = 'none';
        wrapper.style.transform = `translate(${randomX}px, ${randomY}px)`;

        // Force browser layout reflow to apply position instantly while hidden
        void wrapper.offsetWidth;

        // Step 3: Smooth Fade In at new location (2s 1:1 speed)
        requestAnimationFrame(() => {
          wrapper.style.transition = transitionCurve;
          wrapper.style.opacity = '1';
        });
      }, 500);
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
  // Detect routes (/android, /windows) or query parameters (?mode=android, ?mode=windows, ?mode=screensaver)
  const pathname = window.location.pathname.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const queryMode = urlParams.get('mode')?.toLowerCase();
  const isScreensaverParam = urlParams.get('screensaver') === 'true';

  const isAndroidRoute = pathname.includes('/android') || queryMode === 'android';
  const isWindowsRoute = pathname.includes('/windows') || queryMode === 'windows' || queryMode === 'screensaver' || isScreensaverParam;
  const isScreensaverMode = isAndroidRoute || isWindowsRoute;

  const domainLabel = document.getElementById('domain-label');
  if (domainLabel) {
    if (isScreensaverMode) {
      domainLabel.style.display = 'none';
    } else {
      domainLabel.style.display = '';
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

  // Handle Exit Screensaver Button click
  const exitBtn = document.getElementById('exit-screensaver-btn');
  if (exitBtn) {
    exitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // 1. Trigger Android native JavascriptInterface bridge if available
      if (window.AndroidBridge && typeof window.AndroidBridge.exitScreensaver === 'function') {
        window.AndroidBridge.exitScreensaver();
        return;
      }
      // 2. Browser fallback for web preview
      try {
        window.close();
      } catch (err) {}
      if (window.history.length > 1) {
        window.history.back();
      }
    });
  }

  // Start the self-correcting sync loop
  runClockLoop();
}
