gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // === Lenis Smooth Scroll ===
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, smoothTouch: false });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);

    // === Custom Cursor (desktop only) ===
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const cur = document.querySelector('.cursor'), fol = document.querySelector('.cursor-follower');
    if (!isMobile && cur && fol) {
        let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;
        gsap.ticker.add(() => {
            cx += (mx - cx) * 0.5; cy += (my - cy) * 0.5;
            gsap.set(cur, { left: cx, top: cy });
            fx += (mx - fx) * 0.15; fy += (my - fy) * 0.15;
            gsap.set(fol, { left: fx, top: fy });
        });
        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => fol.classList.add('active'));
            el.addEventListener('mouseleave', () => { fol.classList.remove('active'); gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' }); });
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                gsap.to(el, { x: (e.clientX - r.left - r.width/2) * 0.2, y: (e.clientY - r.top - r.height/2) * 0.2, duration: 0.3, ease: 'power2.out' });
            });
        });
    } else { if(cur) cur.style.display='none'; if(fol) fol.style.display='none'; }

    // === Loader Timeline ===
    const loader = document.getElementById('loader');
    const tl = gsap.timeline();
    tl.to('.loader-fill', { width: '100%', duration: 1.2, ease: 'power2.inOut', delay: 0.2 })
      .to(loader, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' })
      .set(loader, { display: 'none' })
      .fromTo('.hero-badge', { opacity:0, y:15 }, { opacity:1, y:0, duration:0.5 }, '-=0.3')
      .fromTo('.gsap-line', { opacity:0, y:40 }, { opacity:1, y:0, duration:0.8, stagger:0.15, ease:'power3.out' }, '-=0.3')
      .fromTo('.hero-sub', { opacity:0, y:15 }, { opacity:1, y:0, duration:0.5 }, '-=0.4')
      .fromTo('.hero-actions', { opacity:0, y:15 }, { opacity:1, y:0, duration:0.5 }, '-=0.3')
      .fromTo('.scroll-cue', { opacity:0 }, { opacity:1, duration:0.4 }, '-=0.2');

    // === ScrollTrigger: Fade In ===
    gsap.utils.toArray('.gsap-fade').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 35 }, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            delay: (i % 3) * 0.08
        });
    });

    // === Counter Animation ===
    document.querySelectorAll('.counter').forEach(c => {
        ScrollTrigger.create({ trigger: c, start: 'top 90%', once: true, onEnter: () => {
            gsap.to(c, { innerHTML: +c.dataset.target, duration: 2, snap: { innerHTML: 1 }, ease: 'power2.out' });
        }});
    });

    // === Navbar Scroll ===
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        let cur = '';
        document.querySelectorAll('section[id]').forEach(s => { if(scrollY >= s.offsetTop - 200) cur = s.id; });
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
    });

    // === Hamburger ===
    const ham = document.getElementById('hamburger'), menu = document.getElementById('navMenu');
    ham.addEventListener('click', () => { ham.classList.toggle('active'); menu.classList.toggle('active'); });
    navLinks.forEach(l => l.addEventListener('click', () => { ham.classList.remove('active'); menu.classList.remove('active'); }));

    // === Portfolio Filter ===
    document.querySelectorAll('.fbtn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            document.querySelectorAll('.pcard').forEach(card => {
                const show = f === 'all' || card.classList.contains(f);
                if (show) { card.classList.remove('hide'); gsap.fromTo(card, { opacity:0, scale:0.95 }, { opacity:1, scale:1, duration:0.4, ease:'power2.out' }); }
                else card.classList.add('hide');
            });
            ScrollTrigger.refresh();
        });
    });

    // === Smooth Anchors via Lenis ===
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) lenis.scrollTo(t, { offset: -70, duration: 1.2 });
        });
    });

    // === Premium Contact Form & EmailJS Integration ===
    // Paste your EmailJS credentials here:
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    // Initialize EmailJS with Public Key
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const service = document.getElementById('contactService').value;
            const message = document.getElementById('contactMessage').value.trim();
            const submitBtn = document.getElementById('contactSubmit');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');

            // 1. Show elegant loading state
            submitBtn.style.pointerEvents = 'none';
            submitBtnText.textContent = 'Sending Message...';
            submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';

            // 2. Submit via EmailJS
            const isPlaceholder = EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID';

            const handleSuccess = () => {
                // 3. GSAP animated fade-out of form fields and fade-in of premium success card
                gsap.to(contactForm, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        // Replace form content with a premium glassmorphic success banner
                        contactForm.innerHTML = `
                            <div class="success-card" style="opacity:0; transform:translateY(20px); text-align:center; padding:3.5rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:var(--r-lg); backdrop-filter:blur(10px);">
                                <div class="success-icon" style="width:64px; height:64px; background:rgba(212,168,83,0.12); color:var(--gold); border-radius:50%; display:flex; justify-content:center; align-items:center; margin:0 auto 1.5rem; font-size:1.8rem;">
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                                <h3 style="font-family:var(--display); font-size:1.5rem; color:#fff; margin-bottom:0.75rem;">Message Sent Successfully!</h3>
                                <p style="color:rgba(255,255,255,0.6); font-size:0.95rem; margin-bottom:0; line-height:1.6;">
                                    Thank you for reaching out. We have received your inquiry regarding <strong>${service}</strong> and will get back to you at <strong>${email}</strong> within 24 hours.
                                </p>
                            </div>
                        `;
                        // Fade in the success card using GSAP
                        gsap.to('.success-card', { opacity: 1, translateY: 0, duration: 0.6, ease: 'power3.out' });
                    }
                });
            };

            const handleError = (err) => {
                console.error('EmailJS Error:', err);
                submitBtn.style.pointerEvents = 'auto';
                submitBtnText.textContent = 'Send Message';
                submitBtnIcon.className = 'fa-solid fa-paper-plane';
                alert('Something went wrong sending via EmailJS. Please try again or email us directly at averpackaging@gmail.com');
            };

            // If keys are placeholders, simulate success locally for smooth preview testing
            if (isPlaceholder) {
                console.warn('EmailJS: Running in local demo mode since actual Public Key/Service ID/Template ID are not configured yet. Simulating success...');
                setTimeout(handleSuccess, 1000);
            } else {
                if (typeof emailjs !== 'undefined') {
                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        name: name,
                        email: email,
                        service: service,
                        message: message
                    })
                    .then(handleSuccess)
                    .catch(handleError);
                } else {
                    alert('EmailJS SDK failed to load. Please email us directly at averpackaging@gmail.com');
                }
            }
        });
    }
});
