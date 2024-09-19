document.addEventListener('DOMContentLoaded', () => {
    const urlList = document.getElementById('urlList');
    const secretList = document.getElementById('secretList');
    const clearUrlsButton = document.getElementById('clearUrls');
    const downloadUrlsButton = document.getElementById('downloadUrls');
    const clearSecretsButton = document.getElementById('clearSecrets');
    const urlsTabButton = document.getElementById('urlsTab');
    const secretsTabButton = document.getElementById('secretsTab');
    const urlsSection = document.getElementById('urlsSection');
    const secretsSection = document.getElementById('secretsSection');

    // Load URLs from Chrome storage
    function loadUrls() {
        chrome.storage.local.get('collectedUrls', (result) => {
            const urls = result.collectedUrls || [];
            
            // If URLs array is empty, show 'No URLs' message, else populate the list
            if (urls.length === 0) {
                urlList.innerHTML = '<li>No URLs till now</li>';
            } else {
                urlList.innerHTML = urls.map(url => `<li>${url}</li>`).join('');
            }
        });
    }

    // Load Secrets from Chrome storage
    function loadSecrets() {
        chrome.storage.local.get('collectedSecrets', (result) => {
            const secrets = result.collectedSecrets || [];
            secretList.innerHTML = secrets.length ? secrets.map(secret => `<li>${secret}</li>`).join('') : '<li>No secrets till now</li>';
        });
    }

    // Clear URLs
    clearUrlsButton.addEventListener('click', () => {
        // Set URLs to an empty array in Chrome storage and clear the list in UI
        chrome.storage.local.set({ collectedUrls: [] }, () => {
            urlList.innerHTML = '<li>No URLs till now</li>';
        });
    });

    // Download URLs
    downloadUrlsButton.addEventListener('click', () => {
        chrome.storage.local.get('collectedUrls', (result) => {
            const urls = result.collectedUrls || [];
            if (urls.length === 0) {
                alert('No URLs to download!');
                return;
            }

            const blob = new Blob([urls.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'urls.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });

    // Clear Secrets
    clearSecretsButton.addEventListener('click', () => {
        chrome.storage.local.set({ collectedSecrets: [] }, () => {
            loadSecrets();
        });
    });

    // Switch to URLs Section
    urlsTabButton.addEventListener('click', () => {
        urlsSection.style.display = 'block';
        secretsSection.style.display = 'none';
        loadUrls();  // Only fetch URLs when switching to this section
    });

    // Switch to Secrets Section
    secretsTabButton.addEventListener('click', () => {
        urlsSection.style.display = 'none';
        secretsSection.style.display = 'block';
        loadSecrets();
    });

    // Initialize the popup with URLs tab selected
    urlsTabButton.click();
});

