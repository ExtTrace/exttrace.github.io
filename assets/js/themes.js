const themes = ['default', 'emerald', 'rose', 'amber', 'violet'];
let currentThemeIndex = 0;

// Hex colors mapping for preset themes to synchronize SVG favicon
const themeColors = {
  default: '#818cf8',
  emerald: '#34d399',
  rose: '#f43f5e',
  amber: '#fbbf24',
  violet: '#a78bfa'
};

// Helper: Convert hex to RGBA string
function hexToRgba(hex, alpha) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return `rgba(99, 102, 241, ${alpha})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Generate and apply dynamic SVG favicon based on hex color
function updateFavicon(hex) {
  const cleanColor = hex.replace('#', '%23');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23050508'/><circle cx='50' cy='50' r='30' fill='none' stroke='${cleanColor}' stroke-width='8'/><circle cx='50' cy='50' r='8' fill='${cleanColor}'/><path d='M50 30 L50 50 L65 50' fill='none' stroke='${cleanColor}' stroke-width='6' stroke-linecap='round'/></svg>`;
  
  const link = document.getElementById('favicon');
  if (link) {
    link.href = `data:image/svg+xml,${svg}`;
  }
}

// Apply custom CSS variables directly to body styles
function applyCustomColor(hex) {
  document.body.style.setProperty('--accent', hex);
  document.body.style.setProperty('--text-muted', hex);
  document.body.style.setProperty('--glow', hexToRgba(hex, 0.15));
  document.body.style.setProperty('--text-glow', hexToRgba(hex, 0.4));
  updateFavicon(hex);
}

// Clear custom CSS styles
function clearCustomColor() {
  document.body.style.removeProperty('--accent');
  document.body.style.removeProperty('--text-muted');
  document.body.style.removeProperty('--glow');
  document.body.style.removeProperty('--text-glow');
}

export function initThemes() {
  const btn = document.getElementById('color-picker-btn');
  const palette = document.getElementById('color-palette');
  const swatches = document.querySelectorAll('.color-swatch:not(.custom-picker-swatch)');
  const customTrigger = document.getElementById('custom-picker-trigger');
  const colorPicker = document.getElementById('color-picker');

  // 1. Restore theme state safely on initialization
  let savedCustomColor = null;
  let savedPresetTheme = null;

  try {
    savedCustomColor = localStorage.getItem('custom-theme-color');
    savedPresetTheme = localStorage.getItem('preset-theme');
  } catch (e) {
    console.warn("Could not read from LocalStorage:", e);
  }

  if (savedCustomColor) {
    applyCustomColor(savedCustomColor);
    colorPicker.value = savedCustomColor;
  } else if (savedPresetTheme) {
    if (savedPresetTheme === 'default') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', savedPresetTheme);
    }
    currentThemeIndex = themes.indexOf(savedPresetTheme);
    if (currentThemeIndex === -1) currentThemeIndex = 0;
    updateFavicon(themeColors[savedPresetTheme] || themeColors.default);
  } else {
    updateFavicon(themeColors.default);
  }

  // 2. Double-Click Theme Cycle
  window.addEventListener('dblclick', (e) => {
    if (btn.contains(e.target) || palette.contains(e.target) || e.target === colorPicker) return;

    try {
      localStorage.removeItem('custom-theme-color');
    } catch (e) {
      console.warn("Could not remove item from LocalStorage:", e);
    }
    clearCustomColor();

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    
    if (nextTheme === 'default') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', nextTheme);
    }

    try {
      localStorage.setItem('preset-theme', nextTheme);
    } catch (e) {
      console.warn("Could not save to LocalStorage:", e);
    }
    updateFavicon(themeColors[nextTheme] || themeColors.default);
  });

  // 3. Toggle Custom Palette Popover
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    palette.classList.toggle('visible');
    btn.classList.toggle('active');
  });

  // 4. Click Preset Swatch to Apply Color
  swatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      e.stopPropagation();
      const hex = swatch.getAttribute('data-color');
      
      document.body.removeAttribute('data-theme');
      try {
        localStorage.removeItem('preset-theme');
      } catch (e) {
        console.warn(e);
      }
      currentThemeIndex = 0;

      applyCustomColor(hex);
      try {
        localStorage.setItem('custom-theme-color', hex);
      } catch (e) {
        console.warn("Could not save custom color to LocalStorage:", e);
      }

      colorPicker.value = hex;

      palette.classList.remove('visible');
      btn.classList.remove('active');
    });
  });

  // 5. Prevent closing popover when clicking the nested color picker input directly
  colorPicker.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Apply custom selected color from native picker in real-time
  colorPicker.addEventListener('input', (e) => {
    const selectedHex = e.target.value;
    
    document.body.removeAttribute('data-theme');
    try {
      localStorage.removeItem('preset-theme');
    } catch (e) {
      console.warn(e);
    }
    currentThemeIndex = 0;

    applyCustomColor(selectedHex);
    try {
      localStorage.setItem('custom-theme-color', selectedHex);
    } catch (e) {
      console.warn(e);
    }
  });

  // Close palette popover when native picker dialog is closed/changed
  colorPicker.addEventListener('change', () => {
    palette.classList.remove('visible');
    btn.classList.remove('active');
  });

  // 6. Dismiss popover when clicking anywhere else
  window.addEventListener('click', (e) => {
    if (!palette.contains(e.target) && !btn.contains(e.target)) {
      palette.classList.remove('visible');
      btn.classList.remove('active');
    }
  });
}
