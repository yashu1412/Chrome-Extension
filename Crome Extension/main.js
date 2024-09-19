
// Theme Toggle Logic
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const body = document.body;

// Function to update icon and text based on theme
function updateThemeButton() {
  if (body.classList.contains('light-theme')) {
    themeIcon.textContent = 'brightness_2'; // moon icon for dark mode
    themeText.textContent = 'Dark Mode';
  } else {
    themeIcon.textContent = 'wb_sunny'; // sun icon for light mode
    themeText.textContent = 'Light Mode';
  }
}

// Check system theme preference and apply it on load
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
body.classList.add(systemTheme + '-theme');
updateThemeButton(); // Set the initial button icon and text

// Toggle between light and dark themes
themeToggleBtn.addEventListener('click', function () {
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  }
  updateThemeButton(); // Update icon and text after toggling
});
