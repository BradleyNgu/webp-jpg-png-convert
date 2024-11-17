const formatToggle = document.getElementById('formatToggle');

// Load the saved format setting when the popup opens
chrome.storage.sync.get(['format'], ({ format }) => {
  formatToggle.checked = (format === 'jpg'); // "on" for jpg, "off" for png
});

// Save the selected format when the toggle changes
formatToggle.addEventListener('change', () => {
  const newFormat = formatToggle.checked ? 'jpg' : 'png';
  chrome.storage.sync.set({ format: newFormat });
});
