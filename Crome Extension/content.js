// Collect URLs from <a> tags
function collectLinks() {
    const links = Array.from(document.querySelectorAll('a')).map(anchor => anchor.href);
    chrome.storage.local.get('collectedUrls', (result) => {
      let urls = result.collectedUrls || [];
      links.forEach((link) => {
        if (!urls.includes(link)) {
          urls.push(link);
        }
      });
      chrome.storage.local.set({ collectedUrls: urls });
    });
  }
  
  // Collect URLs from JavaScript variables (extended example)
  function collectJavaScriptUrls() {
    const scriptContent = Array.from(document.querySelectorAll('script')).map(script => script.textContent).join(' ');
    const urlRegex = /https?:\/\/[^\s"']+/g;
    const urls = scriptContent.match(urlRegex) || [];
  
    chrome.storage.local.get('collectedUrls', (result) => {
      let storedUrls = result.collectedUrls || [];
      urls.forEach((url) => {
        if (!storedUrls.includes(url)) {
          storedUrls.push(url);
        }
      });
      chrome.storage.local.set({ collectedUrls: storedUrls });
    });
  }
  
  // Collect URLs from form actions
  function collectFormActions() {
    const forms = Array.from(document.querySelectorAll('form')).map(form => form.action);
    chrome.storage.local.get('collectedUrls', (result) => {
      let urls = result.collectedUrls || [];
      forms.forEach((formAction) => {
        if (!urls.includes(formAction)) {
          urls.push(formAction);
        }
      });
      chrome.storage.local.set({ collectedUrls: urls });
    });
  }
  
  // Collect URLs from encoded or obfuscated sources (base64 example)
  function collectEncodedUrls() {
    const scriptContent = Array.from(document.querySelectorAll('script')).map(script => script.textContent).join(' ');
    const base64UrlRegex = /data:[^;]+;base64,[^\s"']+/g;
    const urls = scriptContent.match(base64UrlRegex) || [];
  
    chrome.storage.local.get('collectedUrls', (result) => {
      let storedUrls = result.collectedUrls || [];
      urls.forEach((url) => {
        if (!storedUrls.includes(url)) {
          storedUrls.push(url);
        }
      });
      chrome.storage.local.set({ collectedUrls: storedUrls });
    });
  }
  
  // Run the functions when the content script is loaded
  collectLinks();
  collectJavaScriptUrls();
  collectFormActions();
  collectEncodedUrls();
  