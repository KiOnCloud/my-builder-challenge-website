let currentTheme = localStorage.getItem('theme') || 'dark';

function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
    
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

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

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

function addHoverEffects() {
    const cards = document.querySelectorAll('.fact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

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

function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    heroTitle.style.borderRight = 'none';
}

function addParallaxEffect() {
}

const LAMBDA_URL = 'YOUR_LAMBDA_FUNCTION_URL_HERE';

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    addScrollAnimations();
    addHoverEffects();
    addTypingEffect();
    addParallaxEffect();
    addRippleEffect();
    
    const form = document.querySelector('.contact-form-container');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.contact-submit-btn');
            const messageDiv = document.getElementById('form-message');

            const originalText = submitBtn.textContent;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            messageDiv.classList.remove('show', 'hide', 'success', 'error');
            messageDiv.style.display = 'none';

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
    void messageDiv.offsetWidth;
    messageDiv.classList.add('show');
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.classList.remove('show');
        messageDiv.classList.add('hide');
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('hide');
        }, 220);
    }, 5000);
}

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

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTheme();
    }
    
    if (e.key === 'Escape') {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv && messageDiv.style.display !== 'none') {
            messageDiv.style.display = 'none';
        }
    }
});
