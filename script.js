// Theme switching functionality
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize theme
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
}

// Toggle theme function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Update theme button appearance
function updateThemeButton() {
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    if (currentTheme === 'dark') {
        lightIcon.style.opacity = '0';
        lightIcon.style.transform = 'scale(0)';
        darkIcon.style.opacity = '1';
        darkIcon.style.transform = 'scale(1)';
    } else {
        lightIcon.style.opacity = '1';
        lightIcon.style.transform = 'scale(1)';
        darkIcon.style.opacity = '0';
        darkIcon.style.transform = 'scale(0)';
    }
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Add hover effects for interactive elements
function addHoverEffects() {
    const interactiveElements = document.querySelectorAll('.fact-card, .aws-link, .cta-button, .contact-submit-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform.replace('translateY(-2px)', 'translateY(-4px)');
            this.style.transform = this.style.transform.replace('translateY(-4px)', 'translateY(-4px)');
            if (!this.style.transform.includes('translateY(-4px)')) {
                this.style.transform += ' translateY(-4px)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace('translateY(-4px)', 'translateY(0)');
        });
    });
}

// Ripple effect on Send Message button
function addRippleEffect() {
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.contact-submit-btn');
        if (!button) return;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - (size / 2);
        const y = e.clientY - rect.top - (size / 2);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    });
}

// Add typing effect for the hero title
// Disable typing effect to avoid height shifts
function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    heroTitle.style.borderRight = 'none';
}

// Add parallax effect for cherry blossoms
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const blossoms = document.querySelectorAll('.blossom');
        
        blossoms.forEach((blossom, index) => {
            const speed = 0.5 + (index * 0.1);
            blossom.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Contact form handler - Sends form data to AWS Lambda
const LAMBDA_URL = 'YOUR_LAMBDA_FUNCTION_URL_HERE'; // Replace with your Function URL

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Add event listeners
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Add animations and effects
    addScrollAnimations();
    addHoverEffects();
    addTypingEffect();
    addParallaxEffect();
    addRippleEffect();
    
    // Contact form functionality
    const form = document.querySelector('.contact-form-container');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.contact-submit-btn');
            const messageDiv = document.getElementById('form-message');

            // Show loading state with spinner
            const originalText = submitBtn.textContent;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            messageDiv.style.display = 'none';

            // Get form data
            const formData = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            };

            try {
                const response = await fetch(LAMBDA_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showMessage('Message sent successfully! Thank you for reaching out.', 'success');
                    form.reset();
                } else {
                    showMessage('Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                showMessage('Network error. Please check your connection and try again.', 'error');
            }

            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide after 10 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 10000);
}

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Escape key to close any open modals or messages
    if (e.key === 'Escape') {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv && messageDiv.style.display !== 'none') {
            messageDiv.style.display = 'none';
        }
    }
});
