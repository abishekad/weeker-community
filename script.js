document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVIGATION =====

    // Highlight active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Mobile Navigation Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Handle resize to reset menu state if needed
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // ===== SMOOTH SCROLLING FOR ANCHORS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = document.querySelector('.main-nav').offsetHeight;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu
                    const mobileMenu = document.querySelector('.nav-links');
                    const hamburger = document.querySelector('.mobile-menu-toggle');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        if (hamburger) hamburger.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            }
        });
    });

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .timeline-item, .stat-box, .about-content p, .milestone-item, .anim-smooth-fade').forEach(el => {
        el.classList.add('fade-element');
        observer.observe(el);
    });

    // ===== STICKY HEADER =====
    const mainNav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // ===== VIDEO AUDIO TOGGLE =====
    const video = document.querySelector('.hero-video');
    const audioBtn = document.getElementById('video-audio-toggle');

    if (video && audioBtn) {
        // Set initial icon
        audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';

        audioBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });
    }

    // ===== IMAGE SLIDER LOGIC (Generic) =====
    // This handles both Home slider and Volunteer slider if they use the same class structure
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
        initSlider(slider, 7000);
    });

    function initSlider(container, intervalTime = 7000) {
        const track = container.querySelector('.slider-track');
        const slides = container.querySelectorAll('.slide');
        const nextBtn = container.querySelector('.next-btn');
        const prevBtn = container.querySelector('.prev-btn');

        if (track && slides.length > 0) {
            let currentIndex = 0;
            const totalSlides = slides.length;
            let slideTimer;

            function updateSlider() {
                const width = slides[0].clientWidth;
                track.style.transform = `translateX(-${currentIndex * width}px)`;
            }

            function nextSlide() {
                currentIndex++;
                if (currentIndex >= totalSlides) currentIndex = 0;
                updateSlider();
                resetTimer();
            }

            function prevSlide() {
                currentIndex--;
                if (currentIndex < 0) currentIndex = totalSlides - 1;
                updateSlider();
                resetTimer();
            }

            function startTimer() {
                slideTimer = setInterval(nextSlide, intervalTime);
            }

            function resetTimer() {
                clearInterval(slideTimer);
                startTimer();
            }

            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);

            startTimer();
            window.addEventListener('resize', updateSlider);
        }
    }

    // ===== STATS COUNTER ANIMATION =====
    const statBoxes = document.querySelectorAll('.stat-number');
    if (statBoxes.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    if (!isNaN(target)) {
                        animateCounter(entry.target, target);
                    }
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statBoxes.forEach(box => statObserver.observe(box));
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // ===== VIDEO AUTOPLAY FIX =====
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
        v.play().catch(e => console.log("Autoplay prevented", e));
    });

    // ===== BACK TO TOP =====
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== VOLUNTEER FORM EMAIL LOGIC =====
    const volunteerForm = document.querySelector('.volunteer-form');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const interest = document.getElementById('interest').value;
            const message = document.getElementById('message').value;

            const recipient = 'susaimani.sagayam@gmail.com';
            const subject = encodeURIComponent('New Volunteer Registration - WCDT');
            const body = encodeURIComponent(
                `Name: ${fullName}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n` +
                `Area of Interest: ${interest}\n` +
                `Message: ${message}\n`
            );

            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        });
    }
});
