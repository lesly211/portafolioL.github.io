document.addEventListener('DOMContentLoaded', () => {

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0,
        mouseY = 0;
    let followerX = 0,
        followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .project-card, .social-card, .tool-bubble').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = '#e879f9';
            follower.style.borderColor = '#e879f9';
            follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = '#c084fc';
            follower.style.borderColor = '#a855f7';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });


    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        const open = navLinks.style.display === 'flex';
        navLinks.style.display = open ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(9,2,15,0.97)';
        navLinks.style.padding = '2rem 5%';
        navLinks.style.borderBottom = '1px solid rgba(168,85,247,0.2)';
        if (open) navLinks.style.display = 'none';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) navLinks.style.display = 'none';
        });
    });

    // ========================
    // PARTÍCULAS
    // ========================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth,
        H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const PARTICLES = [];
    const COUNT = Math.floor(W * H / 14000);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.5 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.5 + 0.1;
            const colors = ['168,85,247', '124,58,237', '219,39,119', '192,132,252'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
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

    function drawConnections() {
        for (let i = 0; i < PARTICLES.length; i++) {
            for (let j = i + 1; j < PARTICLES.length; j++) {
                const dx = PARTICLES[i].x - PARTICLES[j].x;
                const dy = PARTICLES[i].y - PARTICLES[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
                    ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
                    ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        PARTICLES.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });


    function countUp(el) {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current + (el.getAttribute('data-suffix') || '');
        }, 30);
    }


    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                document.querySelectorAll('.stat-num').forEach(el => countUp(el));
                statObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsBand = document.querySelector('.stats-band');
    if (statsBand) statObserver.observe(statsBand);

    // ========================
    // SKILL BARS
    // ========================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
                    setTimeout(() => {
                        fill.style.width = fill.getAttribute('data-w') + '%';
                    }, i * 150);
                });
                skillObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills-section, #habilidades');
    if (skillsSection) skillObserver.observe(skillsSection);

    // ========================
    // SCROLL REVEAL
    // ========================
    const revealElements = document.querySelectorAll(
        '.project-card, .social-card, .skill-item, .tool-bubble, .stat-item, .quote-container'
    );
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================
    // TILT 3D EN TARJETAS
    // ========================
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========================
    // ACTIVE NAV LINK ON SCROLL
    // ========================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + current ?
                'var(--purple-pale)' : '';
        });
    });

    // ========================
    // GLITTER SPARKLES ON HERO NAME
    // ========================
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
            setTimeout(() => spark.remove(), 800);
        });
    }

    // CSS para sparkle
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
    @keyframes sparkle {
      0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
      100% { opacity:0; transform:translate(-50%,-150%) scale(0.3); }
    }
  `;
    document.head.appendChild(sparkleStyle);

    // ========================
    // TYPING EFFECT EN ROL
    // ========================
    const roles = ['Frontend Developer', 'UI Designer', 'Web Creator', 'CSS Artist'];
    let roleIndex = 0,
        charIndex = 0,
        typing = true;
    const roleEl = document.querySelector('.hero-role');
    if (roleEl) {
        const dot1 = document.createElement('span');
        dot1.textContent = ' · ';
        dot1.className = 'dot';
        const dot2 = document.createElement('span');
        dot2.textContent = ' · ';
        dot2.className = 'dot';
        const typed = document.createElement('span');
        roleEl.innerHTML = '';
        roleEl.appendChild(typed);

        function typeRole() {
            const role = roles[roleIndex];
            if (typing) {
                typed.textContent = role.slice(0, ++charIndex);
                if (charIndex === role.length) {
                    typing = false;
                    setTimeout(typeRole, 1800);
                    return;
                }
            } else {
                typed.textContent = role.slice(0, --charIndex);
                if (charIndex === 0) {
                    typing = true;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeRole, 400);
                    return;
                }
            }
            setTimeout(typeRole, typing ? 80 : 45);
        }
        setTimeout(typeRole, 1200);
    }

    console.log('%c✦ Portafolio de Lesly Brenda Navarro Serva', 'color:#c084fc;font-size:16px;font-weight:bold;');
    console.log('%cFrontend Developer · UI Designer · Web Creator', 'color:#a855f7;font-size:12px;');
});