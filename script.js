// FAQ Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Tabs
    const faqTabs = document.querySelectorAll('.faq-tab');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    faqTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs and categories
            faqTabs.forEach(t => t.classList.remove('active'));
            faqCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding category
            this.classList.add('active');
            document.querySelector(`.faq-category[data-category="${category}"]`).classList.add('active');
        });
    });

    // Contact Form Handling (client-side validation + GDPR)
    const contactForm = document.getElementById('contactForm');
    
    // Check for success message in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showFormMessage('✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        // Remove success parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const privacyConsent = document.getElementById('privacy-consent').checked;
            
            if (!name || !email || !message) {
                e.preventDefault();
                showFormMessage('⚠️ Please fill in all required fields.', 'error');
                return false;
            }
            
            if (name.length < 2) {
                e.preventDefault();
                showFormMessage('⚠️ Name must be at least 2 characters long.', 'error');
                return false;
            }
            
            if (message.length < 10) {
                e.preventDefault();
                showFormMessage('⚠️ Message must be at least 10 characters long.', 'error');
                return false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showFormMessage('⚠️ Please enter a valid email address.', 'error');
                return false;
            }
            
            // GDPR consent check
            if (!privacyConsent) {
                e.preventDefault();
                showFormMessage('⚠️ You must agree to the Privacy Policy to submit this form.', 'error');
                return false;
            }
            
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        });
    }

    // Migliore gestione touch per mobile - FIX per Safari iOS
    function enableTouchHover(selector) {
        // Verifica se è un dispositivo touch
        if (!('ontouchstart' in window) && !(navigator.maxTouchPoints > 0)) return;

        const els = document.querySelectorAll(selector);
        
        els.forEach(el => {
            let touchMoved = false;
            
            // Rileva se l'utente sta scrollando o toccando
            el.addEventListener('touchstart', function(e) {
                touchMoved = false;
            }, { passive: true });

            el.addEventListener('touchmove', function() {
                touchMoved = true;
            }, { passive: true });

            // Applica l'effetto hover solo se NON ha scrollato
            el.addEventListener('touchend', function(e) {
                if (!touchMoved) {
                    // Rimuovi touch da tutti gli altri elementi
                    document.querySelectorAll(selector).forEach(other => {
                        if (other !== el) {
                            other.classList.remove('touch');
                        }
                    });
                    
                    // Toggle sulla classe touch per questo elemento
                    el.classList.toggle('touch');
                    
                    // Rimuovi automaticamente dopo 1.5 secondi
                    if (el.classList.contains('touch')) {
                        if (el._touchTimeout) clearTimeout(el._touchTimeout);
                        el._touchTimeout = setTimeout(() => {
                            el.classList.remove('touch');
                        }, 1500);
                    } else {
                        if (el._touchTimeout) {
                            clearTimeout(el._touchTimeout);
                            el._touchTimeout = null;
                        }
                    }
                }
            }, { passive: true });
        });
        // Nota: il listener global touchend è stato rimosso da qui per evitare duplicati
    }

    // Attiva touch hover su phone mockup e feature cards
    enableTouchHover('.phone-mockup');
    enableTouchHover('.feature-content');
    
    // Aggiungo UNA sola volta il listener globale per rimuovere lo stato quando si tocca fuori
    document.addEventListener('touchend', function(e) {
        if (!e.target.closest('.phone-mockup') && !e.target.closest('.feature-content')) {
            document.querySelectorAll('.phone-mockup.touch, .feature-content.touch').forEach(active => {
                active.classList.remove('touch');
                if (active._touchTimeout) {
                    clearTimeout(active._touchTimeout);
                    active._touchTimeout = null;
                }
            });
        }
    }, { passive: true });
});

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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