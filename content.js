document.querySelectorAll('img[src$=".webp"]').forEach(img => {
    const button = document.createElement('button');
    button.textContent = "Convert to PNG/JPG";
    button.style.position = "absolute";
    button.style.zIndex = "1000";
    button.onclick = () => convertImage(img.src);
  
    img.parentNode.appendChild(button);
  });
  
  function convertImage(url) {
    chrome.runtime.sendMessage({ type: 'convertImage', url });
  }
  