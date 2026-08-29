const SOCIALS = {
  instagram: "https://www.instagram.com/developersatyam/",
  linkedin: "https://www.linkedin.com/in/satyamofficial/",
  github: "https://github.com/devSatyamm",
  esperInstagram: "https://www.instagram.com/esper.labs/"
};

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPopSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(360, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.14, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

function playSuccessChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const startTime = ctx.currentTime + idx * 0.06;
    gain.gain.setValueAtTime(0.14, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.26);
  });
}

function playShatterSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300 + i * 180, ctx.currentTime + i * 0.03);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + i * 0.03 + 0.1);
    gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.03 + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.03);
    osc.stop(ctx.currentTime + i * 0.03 + 0.11);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initNavbarAndSound();
  initMascot();
  initHeroRunner();
  initWorkflowPipeline();
  initLayersAppMesh();
  initSentinelTimeline();
  initSecurityToggles();
  initFeaturesCarousel();
  initScrollPaletteWatcher();
  initSocialHover();
  initEarlyAccessModal();
  initOfflineSuite();
});

function initServiceWorker() {
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('[Esper] PWA Service Worker registered successfully:', reg.scope);
      }).catch((err) => {
        console.log('[Esper] Service Worker registration failed (normal on file://):', err.message);
      });
    });
  }
}

function initNavbarAndSound() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const onIcon = document.getElementById('soundOnIcon');
  const offIcon = document.getElementById('soundOffIcon');
  const mobileBtn = document.getElementById('mobileNavToggle');
  const mobileDropdown = document.getElementById('mobileDropdown');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (onIcon) onIcon.classList.toggle('hidden', !soundEnabled);
      if (offIcon) offIcon.classList.toggle('hidden', soundEnabled);
      if (soundEnabled) playPopSound();
    });
  }

  if (mobileBtn && mobileDropdown) {
    mobileBtn.addEventListener('click', () => {
      mobileDropdown.classList.toggle('hidden');
      playClickSound();
    });

    mobileDropdown.querySelectorAll('.fc-mobile-nav-link').forEach(l => {
      l.addEventListener('click', () => mobileDropdown.classList.add('hidden'));
    });
  }
}

function initMascot() {
  const mascot = document.getElementById('mascotSvg');
  const eyeL = document.getElementById('eyeL');
  const eyeR = document.getElementById('eyeR');
  const refL = document.getElementById('eyeRefL');
  const refR = document.getElementById('eyeRefR');
  if (!mascot || !eyeL || !eyeR) return;

  setInterval(() => {
    eyeL.setAttribute('r', '1');
    eyeR.setAttribute('r', '1');
    if (refL) refL.classList.add('hidden');
    if (refR) refR.classList.add('hidden');
    
    setTimeout(() => {
      eyeL.setAttribute('r', '11');
      eyeR.setAttribute('r', '11');
      if (refL) refL.classList.remove('hidden');
      if (refR) refR.classList.remove('hidden');
    }, 150);
  }, 3800);

  function updateMascotGaze(clientX, clientY) {
    const rect = mascot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (clientX - centerX) / (window.innerWidth / 2)));
    const dy = Math.max(-1, Math.min(1, (clientY - centerY) / (window.innerHeight / 2)));
    
    const ox = dx * 6;
    const oy = dy * 4;

    eyeL.setAttribute('cx', String(80 + ox));
    eyeL.setAttribute('cy', String(95 + oy));
    eyeR.setAttribute('cx', String(120 + ox));
    eyeR.setAttribute('cy', String(95 + oy));
    
    if (refL) refL.setAttribute('cx', String(76 + ox));
    if (refL) refL.setAttribute('cy', String(91 + oy));
    if (refR) refR.setAttribute('cx', String(116 + ox));
    if (refR) refR.setAttribute('cy', String(91 + oy));
  }

  window.addEventListener('mousemove', (e) => {
    updateMascotGaze(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      updateMascotGaze(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

function initHeroRunner() {
  const promptInput = document.getElementById('heroPromptInput');
  const runBtn = document.getElementById('heroRunBtn');
  const runText = document.getElementById('heroRunText');
  const chaosGroup = document.getElementById('heroChaosGroup');
  const outcomeCard = document.getElementById('heroOutcomeCard');
  const resetBtn = document.getElementById('heroResetBtn');
  const presetPills = document.querySelectorAll('.fc-preset-pill');
  const mascotBox = document.getElementById('heroMascotBox');

  let isExecuting = false;

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playPopSound();
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (promptInput) promptInput.value = pill.getAttribute('data-text') || '';
    });
  });

  function execute() {
    if (isExecuting) return;
    isExecuting = true;
    playPopSound();
    if (runText) runText.textContent = "EXECUTING...";

    const chaosCards = document.querySelectorAll('.fc-chaos-card');
    chaosCards.forEach((c) => {
      c.style.transform = `scale(0.1) translate(0, -100px) rotate(180deg)`;
      c.style.opacity = '0';
    });

    if (mascotBox) {
      mascotBox.style.transform = 'scale(1.2) rotate(10deg)';
      setTimeout(() => mascotBox.style.transform = 'scale(1.2) rotate(-10deg)', 200);
      setTimeout(() => mascotBox.style.transform = 'scale(1) rotate(0deg)', 400);
    }

    setTimeout(() => {
      isExecuting = false;
      if (runText) runText.textContent = "RUN ESPER";
      if (chaosGroup) chaosGroup.classList.add('hidden');
      if (outcomeCard) outcomeCard.classList.remove('hidden');
      playSuccessChime();
    }, 650);
  }

  if (runBtn) runBtn.addEventListener('click', execute);
  if (promptInput) {
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') execute();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      playClickSound();
      if (outcomeCard) outcomeCard.classList.add('hidden');
      if (chaosGroup) chaosGroup.classList.remove('hidden');
      const chaosCards = document.querySelectorAll('.fc-chaos-card');
      chaosCards.forEach(c => {
        c.style.transform = '';
        c.style.opacity = '1';
      });
    });
  }
}

function initWorkflowPipeline() {
  const nodes = document.querySelectorAll('.fc-stage-node');
  const tokens = document.querySelectorAll('.fc-token-highlight');
  const stageText = document.getElementById('pipelineStepText');

  const stageLabels = [
    "STAGE 01: NATURAL INTENT PARSING",
    "STAGE 02: MULTI-STEP DAG PLANNER",
    "STAGE 03: CROSS-APP DISPATCH MESH",
    "STAGE 04: 24/7 CONDITION SENTINEL",
    "STAGE 05: DISRUPTION AUTO-ADAPTATION"
  ];

  function setStage(idx) {
    playPopSound();
    nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
    tokens.forEach((t, i) => t.classList.toggle('active', i === idx));
    if (stageText) stageText.textContent = stageLabels[idx] || stageLabels[0];
  }

  nodes.forEach((n, i) => n.addEventListener('click', () => setStage(i)));
  tokens.forEach((t, i) => t.addEventListener('click', () => setStage(i)));
}

function initLayersAppMesh() {
  const appBtns = document.querySelectorAll('.fc-app-btn');
  const screen = document.getElementById('layersAppScreen');
  if (!appBtns.length || !screen) return;

  const appScreens = {
    calendar: `
      <div class="fc-app-card pop-card bg-cream">
        <div class="app-screen-header">
          <span>📅 Apple / Google Calendar</span>
          <span class="badge-pill bg-mint">● Free Window</span>
        </div>
        <div class="app-screen-body">
          <h4 class="font-display">Dinner Reservation: 5:00 PM – 6:30 PM</h4>
          <p>Reserved 90-minute table at Artisan Lounge. Focus mode auto-engaged.</p>
        </div>
      </div>
    `,
    maps: `
      <div class="fc-app-card pop-card bg-cream">
        <div class="app-screen-header">
          <span>🗺️ Google / Apple Maps</span>
          <span class="badge-pill bg-sky">14 min ETA</span>
        </div>
        <div class="app-screen-body">
          <h4 class="font-display">Artisan Lounge (1.8 km)</h4>
          <p>Optimal route calculated. Ride pick-up scheduled for 4:40 PM departure.</p>
        </div>
      </div>
    `,
    messages: `
      <div class="fc-app-card pop-card bg-cream">
        <div class="app-screen-header">
          <span>💬 iMessage / WhatsApp</span>
          <span class="badge-pill bg-coral">Delivered</span>
        </div>
        <div class="app-screen-body">
          <h4 class="font-display">Sarah Jenkins</h4>
          <p>"Hey Sarah! Booked Artisan Lounge for 5 PM. Directions & calendar invite synced!"</p>
        </div>
      </div>
    `,
    payments: `
      <div class="fc-app-card pop-card bg-cream">
        <div class="app-screen-header">
          <span>💳 Apple / Google Wallet</span>
          <span class="badge-pill bg-mint">SAVED ₹350</span>
        </div>
        <div class="app-screen-body">
          <h4 class="font-display">Table Pass #4029</h4>
          <p>15% early diner coupon applied. Digital pass added to Wallet.</p>
        </div>
      </div>
    `,
    travel: `
      <div class="fc-app-card pop-card bg-cream">
        <div class="app-screen-header">
          <span>✈️ Uber / Transit Dispatch</span>
          <span class="badge-pill bg-lavender">Confirmed</span>
        </div>
        <div class="app-screen-body">
          <h4 class="font-display">Express Cab Dispatched</h4>
          <p>Driver allocated for 4:40 PM pickup. Live tracking active.</p>
        </div>
      </div>
    `
  };

  appBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playPopSound();
      appBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const appKey = btn.getAttribute('data-app') || 'calendar';
      screen.innerHTML = appScreens[appKey] || appScreens.calendar;
    });
  });
}

function initSentinelTimeline() {
  const timeVal = document.getElementById('sentinelTimeVal');
  const weatherVal = document.getElementById('sentinelWeatherVal');
  const transitVal = document.getElementById('sentinelTransitVal');
  const disruptBtn = document.getElementById('triggerDisruptionBtn');
  const grid = document.getElementById('sentinelNodesGrid');
  const banner = document.getElementById('sentinelHealedBanner');

  const sentinelStates = [
    { time: '04:15 PM', weather: 'Sunny (28°C)', transit: 'Normal (14m ETA)' },
    { time: '04:35 PM', weather: 'Rain Alert 🌧️', transit: 'Traffic Surge (+8m)' },
    { time: '04:50 PM', weather: 'Heavy Downpour', transit: 'Cab Dispatched Early' }
  ];

  let loopIndex = 0;
  setInterval(() => {
    loopIndex = (loopIndex + 1) % sentinelStates.length;
    const s = sentinelStates[loopIndex];
    if (timeVal) timeVal.textContent = s.time;
    if (weatherVal) weatherVal.textContent = s.weather;
    if (transitVal) transitVal.textContent = s.transit;
  }, 3000);

  if (disruptBtn && grid) {
    let isAdapted = false;
    disruptBtn.addEventListener('click', () => {
      playShatterSound();
      disruptBtn.disabled = true;
      disruptBtn.textContent = "HEALING PLAN IN REAL-TIME...";

      const nodes = grid.querySelectorAll('.sentinel-plan-node');
      nodes.forEach(n => {
        const rx = (Math.random() - 0.5) * 140;
        const ry = (Math.random() - 0.5) * 90;
        const rot = (Math.random() - 0.5) * 30;
        n.style.transform = `translate(${rx}px, ${ry}px) rotate(${rot}deg) scale(0.9)`;
      });

      setTimeout(() => {
        isAdapted = !isAdapted;
        
        nodes[0].className = `sentinel-plan-node pop-card ${isAdapted ? 'bg-mint' : 'bg-butter'}`;
        nodes[0].querySelector('.node-h').textContent = isAdapted ? "🚕 Express Cab Dispatched" : "🚂 Express Train Departure";
        nodes[0].querySelector('.node-p').textContent = isAdapted ? "Auto-booked cab 10m earlier to beat rain." : "Scheduled for 4:30 PM platform 4.";

        nodes[1].className = `sentinel-plan-node pop-card ${isAdapted ? 'bg-mint' : 'bg-sky'}`;
        nodes[1].querySelector('.node-h').textContent = isAdapted ? "☕ Artisan Lounge (Indoor)" : "🏞️ Rooftop Cafe Table";
        nodes[1].querySelector('.node-p').textContent = isAdapted ? "Shifted table from terrace to cozy indoor booth." : "Terrace seating reserved at 5:00 PM.";

        nodes[2].className = `sentinel-plan-node pop-card ${isAdapted ? 'bg-mint' : 'bg-lavender'}`;
        nodes[2].querySelector('.node-h').textContent = isAdapted ? "📲 Sarah Auto-Updated" : "📱 Sarah Notified";
        nodes[2].querySelector('.node-p').textContent = isAdapted ? "Sent updated cafe pin & ETA message." : "Meeting at the outdoor garden.";

        nodes.forEach(n => {
          n.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        });

        if (banner) banner.classList.toggle('hidden', !isAdapted);
        disruptBtn.disabled = false;
        disruptBtn.textContent = isAdapted ? "RESET SENTINEL" : "⚡ SIMULATE DISRUPTION";
        playSuccessChime();
      }, 700);
    });
  }
}

function initSecurityToggles() {
  document.querySelectorAll('.fc-security-card').forEach(card => {
    card.addEventListener('click', () => {
      playClickSound();
      const toggle = card.querySelector('.sec-toggle');
      if (toggle) toggle.classList.toggle('active');
    });
  });
}

function initFeaturesCarousel() {
  const tabs = document.querySelectorAll('.fc-carousel-tab');
  const box = document.getElementById('featureDisplayBox');
  if (!tabs.length || !box) return;

  const featureData = [
    {
      badge: "CORE FEATURE 01",
      heading: "Natural Intent Parsing",
      body: "Understands unstructured, messy human voice and extracts exact parameters with zero hallucinations."
    },
    {
      badge: "CORE FEATURE 02",
      heading: "Multi-Step DAG Planner",
      body: "Generates resilient execution dependency graphs, verifying each step before triggering local actions."
    },
    {
      badge: "CORE FEATURE 03",
      heading: "Cross-App Dispatch Mesh",
      body: "Hooks directly into system-level APIs to operate rides, calendars, maps, and chats in parallel."
    },
    {
      badge: "CORE FEATURE 04",
      heading: "Self-Healing Itinerary",
      body: "When delays strike, Esper automatically recalculates downstream bookings and updates invitees."
    },
    {
      badge: "CORE FEATURE 05",
      heading: "Hardware Enclave Vault",
      body: "Sensitive credentials and financial approvals remain locked on-device with required biometric confirmation."
    }
  ];

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      playPopSound();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = featureData[idx];
      box.innerHTML = `
        <div class="fc-feature-card-inner">
          <span class="fc-feature-badge pop-card bg-butter">${data.badge}</span>
          <h3 class="fc-feature-heading font-display">${data.heading}</h3>
          <p class="fc-feature-body">${data.body}</p>
        </div>
      `;
    });
  });
}

function initScrollPaletteWatcher() {
  const sections = document.querySelectorAll('.fc-section');
  const html = document.documentElement;

  const paletteMap = {
    'hero': '#F6D76A',
    'workflow': '#F2A6B8',
    'layers': '#9DD9E8',
    'sentinel': '#A8D8B8',
    'security': '#C7B9E8',
    'features': '#F5F0E8',
    'footer-cta': '#E8E2D8'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const color = paletteMap[id];
        if (color) {
          html.style.backgroundColor = color;
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

function initSocialHover() {
  document.querySelectorAll('.fc-typo-social-link').forEach(link => {
    link.addEventListener('mouseenter', () => playPopSound());
  });
}

const SUPABASE_CONFIG = {
  url: window.ESPER_SUPABASE_URL || "https://ybbgkyjpfwaudxyzeqbb.supabase.co",
  anonKey: window.ESPER_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYmdreWpwZndhdWR4eXplcWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Nzk5MzIsImV4cCI6MjEwMzU1NTkzMn0.Ev6GY3uW81CbvXEcA9df_s8DKMhQw8fan6OLas07510"
};

const CLOUD_FALLBACK_API = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a04c2a76fa5a90';
const waitlistChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('esper_cloud_sync_v4') : null;

let supabaseClient = null;
let realtimeChannel = null;

function initSupabaseCounter() {
  if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      subscribeToSupabaseRealtime();
      console.log('[Esper] Supabase client & Realtime initialized successfully.');
    } catch (err) {
      console.warn('[Esper] Supabase init fallback:', err.message);
    }
  }
}

function subscribeToSupabaseRealtime() {
  if (!supabaseClient) return;

  try {
    realtimeChannel = supabaseClient
      .channel('esper-waitlist-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist',
          filter: 'id=eq.esper_global'
        },
        (payload) => {
          if (payload.new && typeof payload.new.count !== 'undefined') {
            const liveCount = Number(payload.new.count);
            console.log('[Esper Realtime] Received live counter update:', liveCount);
            animateCounterUpdate(liveCount);
          }
        }
      )
      .subscribe((status) => {
        console.log('[Esper Realtime Status]:', status);
      });
  } catch (e) {
    console.warn('[Esper Realtime Subscription Error]:', e);
  }
}

function getLocalCount() {
  return parseInt(localStorage.getItem('esper_global_count_v4') || '0', 10);
}

function setLocalCount(num) {
  localStorage.setItem('esper_global_count_v4', num.toString());
}

function animateCounterUpdate(targetNumber) {
  setLocalCount(targetNumber);
  const countDisplay = document.getElementById('waitlistCountDisplay');
  if (!countDisplay) return;

  const currentRaw = parseInt(countDisplay.textContent.replace(/,/g, ''), 10);
  const startNumber = isNaN(currentRaw) ? 0 : currentRaw;

  if (startNumber === targetNumber) {
    countDisplay.textContent = Number(targetNumber).toLocaleString();
    return;
  }

  const duration = 450;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.round(startNumber + (targetNumber - startNumber) * easeProgress);
    countDisplay.textContent = Number(current).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      countDisplay.textContent = Number(targetNumber).toLocaleString();
    }
  }
  requestAnimationFrame(step);
}

async function fetchGlobalCloudCount() {
  if (supabaseClient && navigator.onLine) {
    try {
      const { data, error } = await supabaseClient
        .from('waitlist')
        .select('count')
        .eq('id', 'esper_global')
        .single();

      if (!error && data && typeof data.count !== 'undefined') {
        const count = Number(data.count);
        animateCounterUpdate(count);
        return count;
      }
    } catch (err) {}
  }

  if (navigator.onLine) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(CLOUD_FALLBACK_API, { 
        signal: controller.signal, 
        cache: 'no-store' 
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        if (data && data.data && typeof data.data.count === 'number') {
          const liveCount = data.data.count;
          animateCounterUpdate(liveCount);
          return liveCount;
        }
      }
    } catch (e) {}
  }

  const cached = getLocalCount();
  animateCounterUpdate(cached);
  return cached;
}

async function incrementGlobalCloudCount() {
  if (!navigator.onLine) {
    const localEstimated = getLocalCount() + 1;
    setLocalCount(localEstimated);

    try {
      const items = getStoredOfflineItems();
      items.unshift({
        id: 'atomic-waitlist-' + Date.now(),
        type: 'queued',
        title: 'Sync Waitlist Spot to Cloud Database',
        detail: 'Atomic Postgres increment waiting for network reconnect',
        status: 'waiting',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      saveOfflineItems(items);
    } catch (e) {}

    animateCounterUpdate(localEstimated);
    return localEstimated;
  }

  let finalCount = getLocalCount() + 1;

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.rpc('increment_waitlist_counter');
      if (!error && typeof data !== 'undefined' && data !== null) {
        finalCount = Number(data);
        animateCounterUpdate(finalCount);
        return finalCount;
      }
    } catch (err) {
      console.warn('[Esper] Supabase RPC fallback:', err.message);
    }
  }

  try {
    const checkRes = await fetch(CLOUD_FALLBACK_API, { cache: 'no-store' });
    let latest = getLocalCount();
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      if (checkData && checkData.data && typeof checkData.data.count === 'number') {
        latest = checkData.data.count;
      }
    }
    finalCount = latest + 1;
    setLocalCount(finalCount);

    fetch(CLOUD_FALLBACK_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'esper_global_counter',
        data: { count: finalCount }
      })
    }).catch(() => {});
  } catch (e) {}

  if (waitlistChannel) {
    waitlistChannel.postMessage({ type: 'CLOUD_COUNT_UPDATED', count: finalCount });
  }

  animateCounterUpdate(finalCount);
  return finalCount;
}

function initEarlyAccessModal() {
  const modal = document.getElementById('earlyAccessModal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('closeModalBtn');
  const doneBtn = document.getElementById('modalDoneBtn');
  const claimBtn = document.getElementById('claimEarlyAccessBtn');
  const formView = document.getElementById('modalFormView');
  const successView = document.getElementById('modalSuccessView');
  const ticketNumber = document.getElementById('ticketNumber');
  const ticketPassId = document.getElementById('ticketPassId');
  const canvas = document.getElementById('confettiCanvas');

  if (!modal) return;

  initSupabaseCounter();

  fetchGlobalCloudCount();

  if (waitlistChannel) {
    waitlistChannel.onmessage = (event) => {
      if (event.data && typeof event.data.count === 'number') {
        animateCounterUpdate(event.data.count);
      }
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'esper_global_count_v4') {
      animateCounterUpdate(getLocalCount());
    }
  });

  openBtns.forEach(b => {
    b.addEventListener('click', async () => {
      playClickSound();
      modal.classList.remove('hidden');
      if (formView) formView.classList.remove('hidden');
      if (successView) successView.classList.add('hidden');
      
      animateCounterUpdate(getLocalCount());
      const live = await fetchGlobalCloudCount();
      animateCounterUpdate(live);
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  if (claimBtn) {
    claimBtn.addEventListener('click', async () => {
      claimBtn.disabled = true;
      claimBtn.innerHTML = `<span>RESERVING SPOT...</span>`;

      const assignedSpot = await incrementGlobalCloudCount();
      localStorage.setItem('esper_my_spot', assignedSpot.toString());

      playSuccessChime();
      if (ticketNumber) ticketNumber.textContent = '#' + assignedSpot;
      if (ticketPassId) ticketPassId.textContent = `Spot #${assignedSpot} in Line`;

      if (formView) formView.classList.add('hidden');
      if (successView) successView.classList.remove('hidden');
      triggerCelebration(canvas);

      claimBtn.disabled = false;
      claimBtn.innerHTML = `<span>⚡ YES, I WANT IT!</span><span class="claim-arrow">→</span>`;
    });
  }
}

function triggerCelebration(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#F6D76A', '#F2A6B8', '#9DD9E8', '#A8D8B8', '#C7B9E8'];
  const particles = [];
  const count = 75;
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      alpha: 1
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.rot += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

const OFFLINE_STORAGE_KEYS = {
  ITEMS: 'esper_offline_saved_items_v2',
  BRAIN_DUMP: 'esper_offline_braindump_draft_v2',
  ASK_PERMISSION: 'esper_ask_before_continue_v2'
};

function getStoredOfflineItems() {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEYS.ITEMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  
  return [
    {
      id: 'item-1',
      type: 'queued',
      title: 'Find cheapest flight to Delhi',
      detail: 'Waiting for live airline search mesh',
      status: 'waiting',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'item-2',
      type: 'plan',
      title: 'Choreograph weekend schedule under ₹10,000',
      detail: 'Local 3-step dependency DAG created on-device',
      status: 'saved',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
}

function saveOfflineItems(items) {
  try {
    localStorage.setItem(OFFLINE_STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {}
}

function initOfflineSuite() {
  const overlay = document.getElementById('esperOfflineOverlay');
  const restoredModal = document.getElementById('esperOnlineRestoredOverlay');
  const offlineIndicatorBtn = document.getElementById('offlineIndicatorBtn');
  const closeOfflineViewBtn = document.getElementById('closeOfflineViewBtn');
  const closeRestoredBtn = document.getElementById('closeRestoredBtn');
  const dismissRestoredBtn = document.getElementById('dismissRestoredBtn');
  const reviewRestoredBtn = document.getElementById('reviewRestoredBtn');

  const actionBtns = document.querySelectorAll('.fc-offline-action-btn');
  const panelTell = document.getElementById('panelTell');
  const panelThought = document.getElementById('panelThought');
  const panelPlan = document.getElementById('panelPlan');
  const panelReminder = document.getElementById('panelReminder');
  const panelSaved = document.getElementById('panelSaved');

  const tellInput = document.getElementById('tellInput');
  const tellSubmitBtn = document.getElementById('tellSubmitBtn');
  const tellResponse = document.getElementById('tellMascotResponse');
  const sampleChips = document.querySelectorAll('.sample-chip');

  const brainDumpTextarea = document.getElementById('brainDumpTextarea');
  const brainDumpStats = document.getElementById('brainDumpStats');
  const saveThoughtBtn = document.getElementById('saveThoughtBtn');
  const autoSaveTag = document.getElementById('thoughtAutoSaveIndicator');

  const planGoalInput = document.getElementById('planGoalInput');
  const generatePlanBtn = document.getElementById('generatePlanBtn');
  const planStepsContainer = document.getElementById('planGeneratedSteps');

  const reminderTextInput = document.getElementById('reminderTextInput');
  const reminderPresetBtns = document.querySelectorAll('.reminder-preset-btn');
  const setReminderBtn = document.getElementById('setReminderBtn');

  const savedItemsList = document.getElementById('savedItemsList');
  const savedTabBtns = document.querySelectorAll('.saved-tab-btn');
  const savedCountBadge = document.getElementById('savedCountBadge');
  const askPermissionToggle = document.getElementById('askBeforeContinuingToggle');

  let activeTabFilter = 'all';
  let selectedReminderMins = 5;

  if (askPermissionToggle) {
    const savedPref = localStorage.getItem(OFFLINE_STORAGE_KEYS.ASK_PERMISSION);
    if (savedPref !== null) {
      askPermissionToggle.checked = savedPref === 'true';
    }
    askPermissionToggle.addEventListener('change', () => {
      localStorage.setItem(OFFLINE_STORAGE_KEYS.ASK_PERMISSION, askPermissionToggle.checked.toString());
      playClickSound();
    });
  }

  if (brainDumpTextarea) {
    const draft = localStorage.getItem(OFFLINE_STORAGE_KEYS.BRAIN_DUMP) || '';
    brainDumpTextarea.value = draft;
    updateBrainDumpStats(draft);

    brainDumpTextarea.addEventListener('input', () => {
      const val = brainDumpTextarea.value;
      localStorage.setItem(OFFLINE_STORAGE_KEYS.BRAIN_DUMP, val);
      updateBrainDumpStats(val);
      if (autoSaveTag) {
        autoSaveTag.textContent = "✓ Auto-saved to device memory";
      }
    });
  }

  function updateBrainDumpStats(text) {
    if (!brainDumpStats) return;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    brainDumpStats.textContent = `${words} words · ${chars} characters`;
  }

  function openPanel(panelId) {
    playClickSound();
    [panelTell, panelThought, panelPlan, panelReminder, panelSaved].forEach(p => {
      if (p) p.classList.add('hidden');
    });

    const target = document.getElementById(panelId);
    if (target) {
      target.classList.remove('hidden');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (panelId === 'panelSaved') {
      renderSavedList(activeTabFilter);
    }
  }

  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'tell') openPanel('panelTell');
      else if (action === 'thought') openPanel('panelThought');
      else if (action === 'plan') openPanel('panelPlan');
      else if (action === 'reminder') openPanel('panelReminder');
      else if (action === 'saved') openPanel('panelSaved');
    });
  });

  document.querySelectorAll('.panel-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const parent = btn.closest('.fc-offline-panel');
      if (parent) parent.classList.add('hidden');
    });
  });

  function handleTellEsper() {
    const query = tellInput.value.trim();
    if (!query) return;

    playPopSound();
    tellInput.value = '';

    const lower = query.toLowerCase();
    const isOnlineQuery = /flight|hotel|cab|uber|weather|email|message|chat|live|book|ticket|search|google|delhi|mumbai|sarah/i.test(lower);

    let items = getStoredOfflineItems();

    if (isOnlineQuery) {
      tellResponse.textContent = `"I can't do that online part yet. But I can hold on to it."`;
      items.unshift({
        id: 'item-' + Date.now(),
        type: 'queued',
        title: query,
        detail: 'Waiting for internet connection',
        status: 'waiting',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      tellResponse.textContent = `"I've processed this on-device for you. Saved to local memory!"`;
      items.unshift({
        id: 'item-' + Date.now(),
        type: 'thought',
        title: query,
        detail: 'Local on-device note',
        status: 'saved',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    saveOfflineItems(items);
    updateBadges();
  }

  if (tellSubmitBtn) tellSubmitBtn.addEventListener('click', handleTellEsper);
  if (tellInput) {
    tellInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleTellEsper();
    });
  }

  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-val') || '';
      if (tellInput) tellInput.value = val;
      handleTellEsper();
    });
  });

  if (saveThoughtBtn) {
    saveThoughtBtn.addEventListener('click', () => {
      const content = brainDumpTextarea.value.trim();
      if (!content) return;

      playSuccessChime();
      const items = getStoredOfflineItems();
      items.unshift({
        id: 'item-' + Date.now(),
        type: 'thought',
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        detail: content,
        status: 'saved',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      saveOfflineItems(items);
      updateBadges();

      brainDumpTextarea.value = '';
      localStorage.removeItem(OFFLINE_STORAGE_KEYS.BRAIN_DUMP);
      updateBrainDumpStats('');
      if (autoSaveTag) autoSaveTag.textContent = "✓ Saved as new thought!";
    });
  }

  if (generatePlanBtn && planGoalInput && planStepsContainer) {
    generatePlanBtn.addEventListener('click', () => {
      const goal = planGoalInput.value.trim();
      if (!goal) return;

      playPopSound();
      planStepsContainer.classList.remove('hidden');
      planStepsContainer.innerHTML = `
        <div class="plan-step-item pop-card bg-cream">
          <span>1️⃣</span>
          <span>Define scope & isolate prerequisites for: <em>${goal}</em></span>
        </div>
        <div class="plan-step-item pop-card bg-cream">
          <span>2️⃣</span>
          <span>Execute core milestones with local focus block</span>
        </div>
        <div class="plan-step-item pop-card bg-mint">
          <span>3️⃣</span>
          <span>Review deliverables & lock final checklist</span>
        </div>
      `;

      const items = getStoredOfflineItems();
      items.unshift({
        id: 'item-' + Date.now(),
        type: 'plan',
        title: goal,
        detail: '3-step on-device execution plan',
        status: 'saved',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      saveOfflineItems(items);
      updateBadges();
    });
  }

  reminderPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      reminderPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedReminderMins = parseInt(btn.getAttribute('data-mins') || '5', 10);
    });
  });

  if (setReminderBtn && reminderTextInput) {
    setReminderBtn.addEventListener('click', () => {
      const text = reminderTextInput.value.trim();
      if (!text) return;

      playSuccessChime();
      const items = getStoredOfflineItems();
      items.unshift({
        id: 'item-' + Date.now(),
        type: 'reminder',
        title: text,
        detail: `Local alert in ${selectedReminderMins} mins`,
        status: 'saved',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      saveOfflineItems(items);
      updateBadges();

      if ('Notification' in window && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      setTimeout(() => {
        playSuccessChime();
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ Esper Reminder', { body: text, icon: 'favicon.svg' });
        } else {
          alert(`⏰ Esper Reminder: ${text}`);
        }
      }, selectedReminderMins * 60 * 1000);

      reminderTextInput.value = '';
      alert(`✓ Reminder set for "${text}" in ${selectedReminderMins} minutes.`);
    });
  }

  savedTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      savedTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTabFilter = btn.getAttribute('data-filter') || 'all';
      renderSavedList(activeTabFilter);
    });
  });

  function renderSavedList(filter) {
    if (!savedItemsList) return;
    const items = getStoredOfflineItems();
    const filtered = items.filter(item => {
      if (filter === 'all') return true;
      if (filter === 'queued') return item.type === 'queued';
      if (filter === 'thoughts') return item.type === 'thought';
      if (filter === 'plans') return item.type === 'plan';
      if (filter === 'reminders') return item.type === 'reminder';
      return true;
    });

    if (filtered.length === 0) {
      savedItemsList.innerHTML = `
        <div class="text-center py-4 text-muted font-display" style="padding: 24px; color: var(--ink-muted);">
          No saved items in this category yet.
        </div>
      `;
      return;
    }

    savedItemsList.innerHTML = filtered.map(item => {
      const isWaiting = item.status === 'waiting';
      return `
        <div class="saved-item-card pop-card bg-offwhite" data-id="${item.id}">
          <div class="saved-item-info">
            <div class="saved-item-title">${escapeHtml(item.title)}</div>
            <span class="saved-item-tag ${isWaiting ? 'tag-waiting' : 'tag-local'}">
              ${isWaiting ? 'Waiting for internet' : 'Saved locally'}
            </span>
            <span class="saved-item-date">${item.timestamp || ''}</span>
          </div>
          <button class="saved-item-del-btn" data-del="${item.id}" title="Delete">🗑️</button>
        </div>
      `;
    }).join('');

    savedItemsList.querySelectorAll('.saved-item-del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound();
        const id = btn.getAttribute('data-del');
        const updated = getStoredOfflineItems().filter(i => i.id !== id);
        saveOfflineItems(updated);
        updateBadges();
        renderSavedList(activeTabFilter);
      });
    });
  }

  function updateBadges() {
    const items = getStoredOfflineItems();
    const queued = items.filter(i => i.type === 'queued').length;
    const thoughts = items.filter(i => i.type === 'thought').length;
    const plans = items.filter(i => i.type === 'plan').length;
    const reminders = items.filter(i => i.type === 'reminder').length;

    if (savedCountBadge) savedCountBadge.textContent = items.length;
    const tabAll = document.getElementById('tabCountAll');
    const tabQueued = document.getElementById('tabCountQueued');
    const tabThoughts = document.getElementById('tabCountThoughts');
    const tabPlans = document.getElementById('tabCountPlans');
    const tabReminders = document.getElementById('tabCountReminders');

    if (tabAll) tabAll.textContent = items.length;
    if (tabQueued) tabQueued.textContent = queued;
    if (tabThoughts) tabThoughts.textContent = thoughts;
    if (tabPlans) tabPlans.textContent = plans;
    if (tabReminders) tabReminders.textContent = reminders;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function setNetworkState(isOnline) {
    if (offlineIndicatorBtn) {
      offlineIndicatorBtn.classList.toggle('hidden', isOnline);
    }

    if (!isOnline) {
      playPopSound();
      if (overlay) {
        overlay.classList.remove('hidden');
      }
      updateBadges();
    } else {
      if (overlay) {
        overlay.classList.add('hidden');
      }

      const items = getStoredOfflineItems();
      const queuedItems = items.filter(i => i.type === 'queued');

      const pendingWaitlistSync = queuedItems.find(i => i.id.startsWith('atomic-waitlist-'));
      if (pendingWaitlistSync) {
        incrementGlobalCloudCount().then((assigned) => {
          console.log('[Esper] Atomically synced offline waitlist reservation. Spot:', assigned);
          const updated = getStoredOfflineItems().filter(i => !i.id.startsWith('atomic-waitlist-'));
          saveOfflineItems(updated);
          updateBadges();
        });
      }

      if (queuedItems.length > 0 && restoredModal) {
        playSuccessChime();
        restoredModal.classList.remove('hidden');
        
        const qCount = document.getElementById('restoredQueueCount');
        const qSummary = document.getElementById('restoredActionsSummary');
        if (qCount) qCount.textContent = queuedItems.length;
        if (qSummary) {
          qSummary.innerHTML = queuedItems.map(item => `
            <div class="pop-card bg-offwhite p-2 mb-1" style="padding: 8px 12px; font-size: 0.9rem; font-weight: 700;">
              ⚡ ${escapeHtml(item.title)}
            </div>
          `).join('');
        }
      }
    }
  }

  window.addEventListener('online', () => setNetworkState(true));
  window.addEventListener('offline', () => setNetworkState(false));

  if (offlineIndicatorBtn) {
    offlineIndicatorBtn.addEventListener('click', () => {
      if (overlay) overlay.classList.remove('hidden');
      playClickSound();
    });
  }

  if (closeOfflineViewBtn) {
    closeOfflineViewBtn.addEventListener('click', () => {
      if (overlay) overlay.classList.add('hidden');
      playClickSound();
    });
  }

  if (closeRestoredBtn) {
    closeRestoredBtn.addEventListener('click', () => {
      restoredModal.classList.add('hidden');
    });
  }
  if (dismissRestoredBtn) {
    dismissRestoredBtn.addEventListener('click', () => {
      restoredModal.classList.add('hidden');
    });
  }
  if (reviewRestoredBtn) {
    reviewRestoredBtn.addEventListener('click', () => {
      restoredModal.classList.add('hidden');
      if (overlay) overlay.classList.remove('hidden');
      openPanel('panelSaved');
    });
  }

  updateBadges();
  if (!navigator.onLine) {
    setNetworkState(false);
  }
}
