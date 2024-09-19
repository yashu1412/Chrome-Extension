let collectedUrls = [];
let collectedSecrets = [];
let filterDomain = null;

// Collect URLs from tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => { return window.location.href; }
    }, (result) => {
      if (result && result[0] && result[0].result) {
        let url = result[0].result;
        if (shouldCollectUrl(url) && !collectedUrls.includes(url)) {
          collectedUrls.push(url);
          chrome.storage.local.set({ collectedUrls });
        }
      }
    });
  }
});

// Collect URLs from web requests (including JS files and other resources)
chrome.webRequest.onResponseStarted.addListener((details) => {
  let url = details.url;
  if (shouldCollectUrl(url) && !collectedUrls.includes(url)) {
    collectedUrls.push(url);
    chrome.storage.local.set({ collectedUrls });
  }
}, { urls: ["<all_urls>"] });

// Collect URLs from web navigations
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {
    chrome.tabs.get(details.tabId, (tab) => {
      let url = tab.url;
      if (shouldCollectUrl(url) && !collectedUrls.includes(url)) {
        collectedUrls.push(url);
        chrome.storage.local.set({ collectedUrls });
      }
    });
  }
});

// Collect secrets from the page content
function collectSecretsFromPage() {
  chrome.scripting.executeScript({
    target: { allFrames: true },
    func: () => {
      const secretPatterns = [
        /(?:\b(?:api_key|secret|password|token)\b)[\s:]*[^\s'"]+/gi,
        /(?:\b(?:username|email|user|login)\b)[\s:]*[^\s'"]+/gi,
        /(?:\b(?:client_id|client_secret|auth_token)\b)[\s:]*[^\s'"]+/gi // Additional patterns
      ];
      const scriptContent = Array.from(document.querySelectorAll('script')).map(script => script.textContent).join(' ');
      secretPatterns.forEach(pattern => {
        const matches = scriptContent.match(pattern) || [];
        if (matches.length) {
          chrome.storage.local.get('collectedSecrets', (result) => {
            let secrets = result.collectedSecrets || [];
            matches.forEach(secret => {
              if (!secrets.includes(secret)) {
                secrets.push(secret);
              }
            });
            chrome.storage.local.set({ collectedSecrets: secrets });
          });
        }
      });
    }
  });
}

// Call this function periodically to check for secrets
setInterval(collectSecretsFromPage, 60000); // Check every 60 seconds

// Helper function to decide whether to collect URL based on filter domain
function shouldCollectUrl(url) {
  if (!filterDomain) return true;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.endsWith(filterDomain);
  } catch (e) {
    return false;
  }
}

// Set filter domain
chrome.storage.local.get('filterDomain', (result) => {
  filterDomain = result.filterDomain || null;
});
