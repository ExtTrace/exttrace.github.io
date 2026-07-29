import './js/state.js';
import { initClock } from './js/clock.js';
import { animateFollower } from './js/cursor.js';
import { initClickEffects } from './js/effects.js';
import { initThemes } from './js/themes.js';
import { animateDust } from './js/dust.js';
import { initBattery } from './js/battery.js';
// Initialize all features on load
initClock();
animateFollower();
initClickEffects();
initThemes();
animateDust();
initBattery();
initNetworkStatus();
