/* ===============================================
   LESLY NAVARRO — PORTFOLIO JAVASCRIPT
   =============================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // 1. CUSTOM CURSOR & FOLLOWER
    // ========================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0,
        mouseY = 0;
    let followerX = 0,
        followerY = 0;

    // Track mouse position and update main cursor immediately
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follow effect for the second ring
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1; // 0.1 controls smoothness/lag
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect over interactive elements
    const hoverElements = 'a, button, .project-card, .social-card, .tool-bubble';
    document.querySelectorAll(hoverElements).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = '#e879f9'; // Hover pink-light
            follower.style.borderColor = '#e879f9';
            follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = '#c084fc'; // Default purple-pale
            follower.style.borderColor = '#a855f7'; // Default purple-light
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // ========================
    // 2. NAVBAR SCROLL EFFECT
    // ========================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        // Toggles the class to add background/border after 60px of scroll
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ========================
    // 3. HAMBURGER MENU TOGGLE (MOBILE)
    // ========================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        // Minor optimization: check 'display' property reliably
        const isNavOpen = window.getComputedStyle(navLinks).display === 'flex';

        if (isNavOpen) {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px'; // Assumed header height
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(9, 2, 15, 0.97)'; // Dark bg with transparency
            navLinks.style.padding = '2rem 5%';
            navLinks.style.borderBottom = '1px solid rgba(168, 85, 247, 0.2)'; // border
        }
    });

    // Close the menu when a link inside it is clicked on mobile view
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) { // Only on mobile viewports
                navLinks.style.display = 'none';
            }
        });
    });

    // ========================
    // 4. PARTICLE BACKGROUND CANVAS
    // ========================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth,
        H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const PARTICLES = [];
    // Adjust particle count based on screen size for performance
    const COUNT = Math.floor(W * H / 14000);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.5 + 0.3; // Random radius
            this.vx = (Math.random() - 0.5) * 0.3; // Velocity X
            this.vy = (Math.random() - 0.5) * 0.3; // Velocity Y
            this.alpha = Math.random() * 0.5 + 0.1; // Random opacity
            const colors = ['168,85,247', '124,58,237', '219,39,119', '192,132,252'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Wrap around edges to restart motion from the other side
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) PARTICLES.push(new Particle());

    // Draws lines connecting particles close to each other
    function drawConnections() {
        for (let i = 0; i < PARTICLES.length; i++) {
            for (let j = i + 1; j < PARTICLES.length; j++) {
                const dx = PARTICLES[i].x - PARTICLES[j].x;
                const dy = PARTICLES[i].y - PARTICLES[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) { // Max connection distance
                    ctx.beginPath();
                    ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
                    ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
                    // Opacity fades as distance increases
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Main canvas animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        PARTICLES.forEach(p => { p.update();
            p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Redraw canvas on window resize to maintain full screen effect
    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });

    // ========================
    // 5. STATS BAND COUNTER (ANIMATED NUMBERS)
    // ========================
    function countUp(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        // Step is calculated to make the animation duration roughly uniform across different targets
        const step = Math.max(1, Math.floor(target / 60)); // Assumes 60 steps for full animation
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target;
                clearInterval(timer); }
            el.textContent = current + suffix;
        }, 30); // 30ms step time
    }

    // Uses Intersection Observer to start counting when the stats band is scrolled into view
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-num').forEach(el => countUp(el));
                statObserver.disconnect(); // Stop observing after it has triggered once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    const statsBand = document.querySelector('.stats-band');
    if (statsBand) statObserver.observe(statsBand);

    // ========================
    // 6. ANIMATED SKILL BARS
    // ========================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
                    // Add width with a staggering delay for visual effect
                    setTimeout(() => {
                        fill.style.width = fill.getAttribute('data-w') + '%';
                    }, i * 150);
                });
                skillObserver.unobserve(entry.target); // Stop observing after trigger
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% visible

    const skillsSection = document.querySelector('.skills-section, #habilidades');
    if (skillsSection) skillObserver.observe(skillsSection);

    // ========================
    // 7. SCROLL REVEAL ANIMATIONS
    // ========================
    const revealElements = document.querySelectorAll(
        '.project-card, .social-card, .skill-item, .tool-bubble, .stat-item, .quote-container'
    );
    // Initially add the reveal class to all specified elements via CSS (implied presence of class)
    // revealElements.forEach(el => el.classList.add('reveal')); // Assuming class is added in CSS based on revealElements presence

    // Reveal elements individually with a small delay based on index when scrolled to
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================
    // 8. 3D TILT EFFECT ON CARDS
    // ========================
    // Applies mouse-follow transform rotations for a 3D feel
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5; // Mouse X relative to card center (-0.5 to 0.5)
            const y = (e.clientY - rect.top) / rect.height - 0.5; // Mouse Y relative to card center (-0.5 to 0.5)
            card.style.transform = `translateY(-8px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`; // Adjust numbers for rotation intensity
        });
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========================
    // 9. ACTIVE NAV LINK ON SCROLL
    // ========================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            // Find the currently viewed section based on scroll position
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        // Set active link color and clear others
        navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + current ?
                'var(--purple-pale)' : ''; // Default purple-pale for active section
        });
    });

    // ========================
    // 10. GLITTER SPARKLES EFFECT ON HERO NAME
    // ========================
    // Spawns ephemeral decorative star elements behind mouse on hover
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        heroName.addEventListener('mousemove', (e) => {
            const spark = document.createElement('span');
            spark.textContent = ['✦', '✧', '★', '·'][Math.floor(Math.random() * 4)];
            spark.style.cssText = `
        position:fixed; pointer-events:none; z-index:999;
        left:${e.clientX}px; top:${e.clientY}px;
        font-size:${Math.random()*10+8}px;
        color:${['#c084fc','#e879f9','#f59e0b'][Math.floor(Math.random()*3)]};
        animation: sparkle 0.8s ease-out forwards;
        transform: translate(-50%,-50%);
      `;
            document.body.appendChild(spark);
            // Spark elements are removed automatically by CSS animation 'forwards' and the sparkle animation definition
            setTimeout(() => spark.remove(), 800); // 800ms animation duration
        });
    }

    // Inject CSS keyframe animation for sparkles directly into head
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
    @keyframes sparkle {
      0% { opacity:1; transform:translate(-50%,-50%) scale(1); }
      100% { opacity:0; transform:translate(-50%,-150%) scale(0.3); }
    }
  `;
    document.head.appendChild(sparkleStyle);

    // ========================
    // 11. TYPING EFFECT IN ROLE TEXT
    // ========================
    // Cycled through roles array with typing and erasing animation
    const roles = ['Frontend Developer', 'UI Designer', 'Web Creator', 'CSS Artist'];
    let roleIndex = 0,
        charIndex = 0,
        typing = true;
    const roleEl = document.querySelector('.hero-role');

    if (roleEl) {
        const typedSpan = document.createElement('span');
        typedSpan.className = 'typed';
        // roleEl.innerHTML = ''; // Keep static dots and just append the typed span if desired.
        roleEl.appendChild(typedSpan);

        function typeRole() {
            const role = roles[roleIndex];
            if (typing) {
                // Typing motion
                typedSpan.textContent = role.slice(0, ++charIndex);
                if (charIndex === role.length) {
                    typing = false;
                    // Hold full text briefly
                    setTimeout(typeRole, 1800);
                    return;
                }
            } else {
                // Erasing motion
                typedSpan.textContent = role.slice(0, --charIndex);
                if (charIndex === 0) {
                    typing = true;
                    // Advance role index and pause briefly
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeRole, 400);
                    return;
                }
            }
            // Stagger typing speed vs erasing speed
            setTimeout(typeRole, typing ? 80 : 45);
        }
        // Start initial typing
        setTimeout(typeRole, 1200);
    }

    console.log('%c✦ Portafolio de Lesly Brenda Navarro Serva', 'color:#c084fc;font-size:16px;font-weight:bold;');
    console.log('%cFrontend Developer · UI Designer · Web Creator', 'color:#a855f7;font-size:12px;');
});