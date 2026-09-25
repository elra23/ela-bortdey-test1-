// =============================================================
// ELAINE'S 18TH BIRTHDAY DEBUT — script.js
// =============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAmbientSparkles();
  initParallax();
  buildEighteenGrids();
  initCountdown();
  initReveal();
  initForm();
  initMusic();
});

// ---------- NAV ----------
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- AMBIENT GOLD SPARKLES DRIFTING UPWARD ----------
function initAmbientSparkles() {
  const layer = document.getElementById('ambientSparkles');
  if (!layer) return;
  const count = window.innerWidth < 700 ? 10 : 18;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'drift';
    dot.style.left = Math.random() * 100 + 'vw';
    dot.style.animationDuration = (10 + Math.random() * 14) + 's';
    dot.style.animationDelay = (Math.random() * 14) + 's';
    layer.appendChild(dot);
  }
}

// ---------- PARALLAX ON HERO GARDEN LAYERS ----------
function initParallax() {
  const far = document.querySelector('.layer-far');
  const near = document.querySelector('.layer-near');
  const castle = document.querySelector('.layer-castle');
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        if (far) far.style.transform = `translateY(${y * 0.08}px)`;
        if (near) near.style.transform = `translateY(${y * 0.15}px)`;
        if (castle) castle.style.transform = `translateY(${y * 0.04}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
}

// ---------- BUILD 18 CANDLES / ROSES / TREASURES ----------
function buildEighteenGrids() {
  const candlesGrid = document.getElementById('candlesGrid');
  const rosesGrid = document.getElementById('rosesGrid');
  const treasuresGrid = document.getElementById('treasuresGrid');

  for (let i = 1; i <= 18; i++) {
    if (candlesGrid) {
      candlesGrid.insertAdjacentHTML('beforeend', `
        <div class="candle-card">
          <span class="card-icon candle-icon-flame">🕯️</span>
          <span class="card-number">Candle ${i}</span>
          <span class="card-name">Name Here</span>
        </div>
      `);
    }
    if (rosesGrid) {
      rosesGrid.insertAdjacentHTML('beforeend', `
        <div class="rose-card">
          <span class="card-icon">🌹</span>
          <span class="card-number">Rose ${i}</span>
          <span class="card-name">Name Here</span>
        </div>
      `);
    }
    if (treasuresGrid) {
      treasuresGrid.insertAdjacentHTML('beforeend', `
        <div class="treasure-card">
          <span class="card-icon">🎁</span>
          <span class="card-number">Treasure ${i}</span>
          <span class="card-name">Name Here</span>
        </div>
      `);
    }
  }
}

// ---------- COUNTDOWN ----------
function initCountdown() {
  // October 17, 2026 — time TBA, using midnight as placeholder.
  // Update the hour/minute below once the time is announced.
  const target = new Date('2026-10-17T00:00:00+08:00').getTime();

  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');
  const note = document.getElementById('countdownNote');
  if (!elDays) return;

  note.textContent = 'Exact time to be confirmed once the venue is announced.';

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      note.textContent = 'Today is the day! 🎉';
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    elDays.textContent = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// ---------- REVEAL ON SCROLL (section titles only — restrained) ----------
function initReveal() {
  const targets = document.querySelectorAll('.section-title, .section-eyebrow');
  targets.forEach(t => t.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach(t => observer.observe(t));
}

// ---------- RSVP FORM ----------
function initForm() {
  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('rsvpStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    const action = form.getAttribute('action') || '';
    if (action.includes('REPLACE_WITH_EMAIL')) {
      e.preventDefault();
      status.textContent = 'Form not yet connected — replace REPLACE_WITH_EMAIL in the form action with the real address.';
      return;
    }

    e.preventDefault();
    status.textContent = 'Sending your RSVP...';

    try {
      const formData = new FormData(form);
      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        status.textContent = 'Thank you! Your RSVP has been sent. 💌';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try again.';
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please check your connection and try again.';
    }
  });
}

// ---------- MUSIC ----------
function initMusic() {
  const toggle = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!toggle || !audio) return;

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // Autoplay-adjacent restrictions; ignore silently.
      });
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Pause background music');
    } else {
      audio.pause();
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Play background music');
    }
  });
}
