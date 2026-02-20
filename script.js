document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    let isProjectHovered = false;

    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            if (!isProjectHovered) {
                // Dynamic Background Color Math based on position
                const width = window.innerWidth;
                const height = window.innerHeight;

                const xPercent = posX / width;
                const yPercent = posY / height;

                const r = Math.round(247 - (xPercent * (247 - 235)) - (yPercent * (247 - 234)));
                const g = Math.round(245 - (xPercent * (245 - 220)) - (yPercent * (245 - 221)));
                const b = Math.round(242 - (xPercent * (242 - 208)) - (yPercent * (242 - 208)));

                document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                document.body.style.animationPlayState = 'paused';
            }
        });

        const links = document.querySelectorAll('a, button, input, textarea, label, .project-card, .range');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(176, 92, 61, 0.1)';
            });
            link.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // --- Hide Navbar on Scroll Down ---
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });

    // --- Number Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = target / 40;

                if (c < target) {
                    counter.innerText = `${Math.ceil(c + increment)}`;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const displayObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                if (entry.target.classList.contains('metrics') && !counted) {
                    // Delay the counter start slightly so the user sees the dynamic effect on page load
                    setTimeout(() => {
                        runCounters();
                    }, 1000);
                    counted = true;
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.reveal-text, .reveal-up, .fade-in, .fade-in-up, .metrics');

    setTimeout(() => {
        animateElements.forEach(el => displayObserver.observe(el));
    }, 100);

    // --- Simple Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = null;

                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- Parallax Effect on About Image ---
    const studioImg = document.querySelector('.parallax-img');
    const studioSection = document.querySelector('.studio');

    if (studioImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollSpeed = 0.4;
            const distance = window.scrollY - studioSection.offsetTop;

            if (Math.abs(distance) < window.innerHeight * 1.5) {
                studioImg.style.transform = `translateY(${distance * scrollSpeed}px)`;
            }
        });
    }

    // --- Form Range Slider Dynamics ---
    const range = document.getElementById('project_budget');
    const bubble = document.querySelector('.bubble');

    if (range && bubble) {
        const setBubble = (range, bubble) => {
            const val = range.value;
            const min = range.min ? range.min : 0;
            const max = range.max ? range.max : 100;
            const newVal = Number(((val - min) * 100) / (max - min));

            // Format number to currency (Indian Rupees)
            const formatter = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            });

            bubble.innerHTML = formatter.format(val) + (val == max ? '+' : '');

            // Position bubble
            bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
        };

        range.addEventListener("input", () => {
            setBubble(range, bubble);
        });

        // Init bubble on load
        setBubble(range, bubble);
    }

    // --- EmailJS Form Handling ---
    const form = document.getElementById('inquiry-form');
    const msgDiv = document.getElementById('form-message');
    const btnLoader = document.querySelector('.btn-loader');
    const btnText = document.querySelector('.btn-submit span');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // UI Loading state
            btnLoader.classList.remove('hidden');
            btnText.style.opacity = '0';

            // Note: In a real environment, you need to replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID'
            // with actual credentials from an EmailJS account. 
            // For the demo purpose, we will simulate a successful send after 1.5 seconds if real API isn't configured.

            // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            //     .then(function() { ...

            setTimeout(() => {
                // Remove Loading State
                btnLoader.classList.add('hidden');
                btnText.style.opacity = '1';

                // Provide Success message
                msgDiv.innerHTML = "Thank you for your inquiry! We've received your questionnaire and our team will email you shortly.";
                msgDiv.className = 'success form-message';
                msgDiv.classList.remove('hidden');

                // Reset form
                form.reset();
                if (range && bubble) setBubble(range, bubble); // reset bubble
            }, 1500);

            // Error handling block would normally go here.
        });
    }

    // --- Mobile Menu ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';

            if (!isVisible) {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--nav-bg)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '2rem 5%';
                navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            }
        });
    }

    // --- Make Project Images Clickable & Dynamic Backgrounds ---
    const allProjectCards = document.querySelectorAll('.project-card');
    const projectBgColors = ['#eae8e3', '#e2e6e8', '#e8e5e1', '#e4e2de', '#e6e9e6', '#e7e5e8', '#e3e4e1'];

    allProjectCards.forEach((card, index) => {
        // 1. Only Image wrapper is clickable
        const imgWrapper = card.querySelector('.img-wrapper');
        const customLink = card.getAttribute('data-link') || 'project-detail.html';

        if (imgWrapper) {
            imgWrapper.style.cursor = 'pointer';
            imgWrapper.addEventListener('click', (e) => {
                // If they didn't explicitly click the anchor tag inside the overlay
                if (!e.target.closest('a')) {
                    window.location.href = customLink;
                }
            });
        }

        // 2. Dynamic background color when hovering over the project
        card.addEventListener('mouseenter', () => {
            isProjectHovered = true;
            // override the CSS pulse animation
            document.body.style.animationPlayState = 'paused';
            document.body.style.backgroundColor = projectBgColors[index % projectBgColors.length];
        });

        card.addEventListener('mouseleave', () => {
            isProjectHovered = false;
            // return to CSS animation
            document.body.style.backgroundColor = '';
            document.body.style.animationPlayState = 'running';
        });
    });
});
