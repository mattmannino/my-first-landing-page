// Modern JavaScript for NCLR.fm Landing Page

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initFormHandling();
    initInteractiveElements();
    initPerformanceOptimizations();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Set initial navigation styling immediately
    if (nav) {
        nav.style.background = 'rgba(10, 10, 20, 0.95)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    }
    
    // Scroll-based navigation styling
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 20, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 20, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        }
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
    
    // Initialize navigation styling based on current scroll position
    handleScroll();
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Logo click handler for home navigation
    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('services-grid') || 
                    entry.target.classList.contains('results-grid') || 
                    entry.target.classList.contains('testimonials')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('section, .service-card, .result-card, .testimonial').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for results
    animateCounters();
}

function animateGridItems(container) {
    const items = container.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.result-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = formatNumber(Math.ceil(current));
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = formatNumber(target);
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k+';
    } else {
        return num + '%';
    }
}

// Form handling with validation and submission
function initFormHandling() {
    const strategyForm = document.getElementById('strategyForm');
    const contactForm = document.getElementById('contactForm');
    
    if (strategyForm) {
        strategyForm.addEventListener('submit', handleStrategyForm);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Real-time validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(event);
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function clearFieldError(event) {
    const field = event.target;
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '4px';
    field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleStrategyForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    let isValid = true;
    event.target.querySelectorAll('input, select, textarea').forEach(field => {
        if (!validateField({target: field})) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner"></span> Processing...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Strategy form submitted:', data);
        showNotification('Thank you! We\'ll send you a calendar link within 24 hours.', 'success');
        event.target.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Track conversion
        trackConversion('strategy_session_request', data);
    }, 2000);
}

function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    let isValid = true;
    event.target.querySelectorAll('input, select, textarea').forEach(field => {
        if (!validateField({target: field})) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Contact form submitted:', data);
        showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
        event.target.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Track conversion
        trackConversion('contact_form_submission', data);
    }, 2000);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles for notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Interactive elements
function initInteractiveElements() {
    // Parallax effect for hero section
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroParticles) {
        const handleMouseMove = throttle((e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const x = (clientX / innerWidth) * 100;
            const y = (clientY / innerHeight) * 100;
            
            heroParticles.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
        }, 16);
        
        document.addEventListener('mousemove', handleMouseMove);
    }
    
    // Hover effects for cards
    document.querySelectorAll('.service-card, .result-card, .testimonial').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images (when added)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Pro:wght@400;500;600&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Analytics and tracking
function trackConversion(eventName, data) {
    // Google Analytics 4 tracking (replace with your tracking ID)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'conversion',
            event_label: data.company || 'unknown',
            value: 1
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: eventName,
            content_category: 'lead_generation'
        });
    }
    
    // Custom tracking
    console.log('Conversion tracked:', eventName, data);
}

// Add CSS for animations and additional styles
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
        }
        
        .error {
            border-color: #ef4444 !important;
        }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .animate-in {
            animation: slideInUp 0.8s ease-out;
        }
        
        .service-card,
        .result-card,
        .testimonial {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .service-card.animate-in,
        .result-card.animate-in,
        .testimonial.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .nav-links.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                padding: 20px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                gap: 16px;
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Export functions for external use
window.NCLR = {
    trackConversion,
    showNotification,
    validateField
};