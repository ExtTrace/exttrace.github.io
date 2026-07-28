export function initBattery() {
  const batteryStatus = document.getElementById('battery-status');
  const batteryPercent = document.getElementById('battery-percent');
  const batteryLevel = document.getElementById('battery-level');

  // If the browser doesn't support the Battery Status API, hide the widget silently
  if (!navigator.getBattery) {
    if (batteryStatus) batteryStatus.style.display = 'none';
    return;
  }

  navigator.getBattery().then(battery => {
    function updateBatteryInfo() {
      // 1. Update Percentage Text
      const pct = Math.round(battery.level * 100);
      batteryPercent.textContent = `${pct}%`;

      // 2. Update Visual Fill Level
      batteryLevel.style.width = `${pct}%`;

      // 3. Handle Charging Class Animation
      if (battery.charging) {
        batteryStatus.classList.add('charging');
      } else {
        batteryStatus.classList.remove('charging');
      }
    }

    // Initial load
    updateBatteryInfo();

    // Listeners for real-time status updates
    battery.addEventListener('levelchange', updateBatteryInfo);
    battery.addEventListener('chargingchange', updateBatteryInfo);
  });
}
