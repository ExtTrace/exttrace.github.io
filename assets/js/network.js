export function initNetworkStatus() {
  const networkStatus = document.getElementById('network-status');

  function updateStatus() {
    if (navigator.onLine) {
      networkStatus.classList.remove('offline');
    } else {
      networkStatus.classList.add('offline');
    }
  }

  // Bind connection change event listeners
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  // Perform initial network connection state check
  updateStatus();
}
