// Theme Selector Functionality

// Get theme from localStorage or default to 'light'
function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateActiveButton(theme);
}

// Update active button state
function updateActiveButton(theme) {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Toggle theme selector open/close
function toggleThemeSelector() {
    const selector = document.querySelector('.theme-selector');
    selector.classList.toggle('open');
}

// Close theme selector when clicking outside
function handleClickOutside(event) {
    const selector = document.querySelector('.theme-selector');
    if (!selector.contains(event.target) && selector.classList.contains('open')) {
        selector.classList.remove('open');
    }
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    
    // Add event listener to main toggle button
    const mainToggle = document.querySelector('.theme-toggle-main');
    if (mainToggle) {
        mainToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleThemeSelector();
        });
    }
    
    // Add event listeners to all theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedTheme = btn.getAttribute('data-theme');
            setTheme(selectedTheme);
            // Close selector after selecting a theme
            setTimeout(() => {
                document.querySelector('.theme-selector').classList.remove('open');
            }, 300);
        });
    });
    
    // Close selector when clicking outside
    document.addEventListener('click', handleClickOutside);
}

// Run on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

