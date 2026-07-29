/**
 * notifications.js
 * Receives Android notification data from the native JavascriptInterface bridge
 * and renders animated glassmorphism notification cards on the screensaver.
 *
 * Called by Android via: window.showNotification(appName, title, text, iconEmoji)
 */

const NOTIFICATION_DURATION_MS = 6000;  // Auto-dismiss after 6 seconds
const MAX_VISIBLE = 3;                   // Max stacked notifications visible at once

const panel = document.getElementById('notification-panel');

/**
 * Global function exposed to Android JavascriptInterface.
 * Called by ClockNotificationService via evaluateJavascript().
 *
 * @param {string} appName  - Package label (e.g. "WhatsApp")
 * @param {string} title    - Notification title
 * @param {string} text     - Notification body text
 */
window.showNotification = function(appName, title, text) {
  // Limit stacked cards
  const existing = panel.querySelectorAll('.notif-card');
  if (existing.length >= MAX_VISIBLE) {
    existing[0].remove();
  }

  const card = document.createElement('div');
  card.className = 'notif-card';
  card.innerHTML = `
    <div class="notif-app">${escapeHtml(appName)}</div>
    <div class="notif-title">${escapeHtml(title)}</div>
    <div class="notif-text">${escapeHtml(text)}</div>
    <div class="notif-progress"><div class="notif-progress-bar"></div></div>
  `;

  panel.appendChild(card);

  // Trigger slide-in animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('visible'));
  });

  // Auto-dismiss after duration
  const timeout = setTimeout(() => dismissCard(card), NOTIFICATION_DURATION_MS);

  // Dismiss on tap/click
  card.addEventListener('click', () => {
    clearTimeout(timeout);
    dismissCard(card);
  });
};

function dismissCard(card) {
  card.classList.remove('visible');
  card.classList.add('dismissing');
  card.addEventListener('transitionend', () => card.remove(), { once: true });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function initNotifications() {
  // Nothing to initialize — window.showNotification is already exposed globally above.
  // This export exists so Android can call it from evaluateJavascript() after DOM is ready.
  console.log('[Notifications] Bridge ready. Waiting for Android notifications...');
}
