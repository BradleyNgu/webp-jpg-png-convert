let format = 'png'; // Default format to PNG

// Load the saved format setting when the background script starts
chrome.storage.sync.get(['format'], ({ format: savedFormat }) => {
  format = savedFormat || 'png'; // Set to saved format or default to PNG
  createContextMenu();
});

// Update the format if the user changes it in the popup
chrome.storage.onChanged.addListener((changes) => {
  if (changes.format) {
    format = changes.format.newValue;
    createContextMenu(); // Recreate context menu with updated format
  }
});

// Create or update the context menu item
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "convertImage",
      title: `Save Image as ${format.toUpperCase()}`, // Show selected format in title
      contexts: ["image"]
    });
  });
}

// Handle context menu clicks to convert and download the image in the selected format
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "convertImage" && info.srcUrl) {
    convertAndDownloadImage(info.srcUrl, format);
  }
});

function convertAndDownloadImage(url, selectedFormat) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => createImageBitmap(blob))
    .then(bitmap => {
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      context.drawImage(bitmap, 0, 0);

      // Convert canvas to blob in the specified format
      const mimeType = selectedFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const fileExtension = selectedFormat;

      canvas.toBlob(blob => {
        const newBlob = new Blob([blob], { type: mimeType });
        const downloadUrl = URL.createObjectURL(newBlob);

        // Initiate download with the converted image
        chrome.downloads.download({
          url: downloadUrl,
          filename: `converted_image.${fileExtension}`,
          conflictAction: 'overwrite'
        }, () => URL.revokeObjectURL(downloadUrl));
      }, mimeType);
    })
    .catch(error => console.error('Error converting image:', error));
}
