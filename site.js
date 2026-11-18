(() => {
  'use strict';
  const C = window.CP_CONFIG;
  if (!C) {
    console.error('Casa Panoramic: config.js nu a fost încărcat.');
    return;
  }
  const pages = [
    'index', 'cazare', 'vila-1', 'vila-2',
    'casa-1', 'casa-2', 'facilitati',
    'evenimente', 'gastronomie', 'atractii', 'contact'
  ];
  let page = location.pathname.split('/').pop().replace('.html', '') || 'index';
  if (!pages.includes(page)) page = 'index';
  const lang = localStorage.getItem('cp_lang') === 'en' ? 'en' : 'ro';
  const t = C.text[lang];
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
const url = p => p === 'index' ? '/' : p + '.html';
const a = (p, label, cls = '') => {
  const phone = String(C.contact?.phone || '').trim();
  const tel = phone.replace(/[^\d+]/g, '');

  const isBookingButton =
    label === C.i18n?.ro?.book ||
    label === C.i18n?.en?.book ||
    /solicită disponibilitate|solicita disponibilitate|request availability|check availability/i.test(String(label));

  if (isBookingButton && tel) {
    return `<a href="tel:${tel}" class="${cls}">📞 ${esc(phone)}</a>`;
  }

  return `<a href="${url(p)}" class="${cls}">${label}</a>`;
};

/* ==========================================
   CASA PANORAMIC
   BUTOANE APEL TELEFONIC RO + EN
========================================== */

const cpPhone = String(C.contact?.phone || '').trim();
const cpTel = cpPhone.replace(/[^\d+]/g, '');

function cpCallButtons() {
  if (!cpTel) return;

  document.querySelectorAll('a').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();

    const isCallButton =
      text.includes('solicită disponibilitate') ||
      text.includes('solicita disponibilitate') ||
      text.includes('verifică disponibilitatea') ||
      text.includes('request availability') ||
      text.includes('check availability') ||
      text.includes('book now') ||
      text.includes('contact for availability');

    if (isCallButton) {
      btn.href = 'tel:' + cpTel;
      btn.textContent = '📞 ' + cpPhone;
      btn.removeAttribute('target');
    }
  });
}

// La incarcarea paginii
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cpCallButtons);
} else {
  cpCallButtons();
}

// La schimbarea limbii sau regenerarea continutului
const cpCallObserver = new MutationObserver(() => {
  cpCallButtons();
});

cpCallObserver.observe(document.body, {
  childList: true,
  subtree: true
});

  const img = (src, alt = '', cls = '') =>
    `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`;
  const video = (key, poster) => `
    <video autoplay muted loop playsinline preload="none"
      poster="${esc(poster || C.images.hero)}">
      <source src="${esc(C.videos?.[key] || '')}" type="video/mp4">
    </video>
  `;
  const sectionHead = (eyebrow, title, desc) => `
    <div class="section-head reveal">
      <span class="eyebrow">${eyebrow}</span>
      <h2>${title}</h2>
      <p>${desc}</p>
    </div>
  `;
  // ==========================================
  // HERO
  // ==========================================

const hero = (title, desc, key = 'hero', inner = false, heroImage = null) => {
  const background = heroImage || C.images.hero;

  return `
    <section class="hero ${inner ? 'inner' : ''}">
      <div class="fallback"
        style="background:url('${esc(background)}') center/cover">
      </div>

      ${video('hero', C.images.hero)}

<div class="content">

    <img
        src="/images/logo.png"
        alt="Casa Panoramic Vintileasca"
        class="cp-hero-logo ${page === 'index' ? 'cp-hero-logo-home' : 'cp-hero-logo-inner'}"
    >

    <span class="eyebrow">${t.heroEyebrow}</span>

    <h1>${title}</h1>
        <p>${desc}</p>
        <div class="hero-buttons">
          ${a('cazare', t.explore, 'btn light')}
          ${a('contact', t.book, 'btn outline')}
        </div>
      </div>
    </section>
  `;
};

  const band = (key, title, desc) => `
    <section class="video-band">
      <div class="fallback"
        style="background:url('${esc(C.images.nature)}') center/cover">
      </div>
      ${video(key, C.images.nature)}
      <div class="content reveal">
        <span class="eyebrow">Casa Panoramic · Vrancea</span>
        <h2>${title}</h2>
        <p>${desc}</p>
        ${a('contact', t.book, 'btn light')}
      </div>
    </section>
  `;
  // ==========================================
  // CARDURI CAZARE
  // ==========================================
  const unitCards = () => `
    <div class="cards">
      ${C.units.map(u => `
        <article class="card reveal">
          ${a(u.id, img(u.image, u.name[lang]))}
          <div class="card-body">
            <span class="eyebrow">Casa Panoramic</span>
            <h3>${esc(u.name[lang])}</h3>
            <p>${u.intro?.[lang] || t.unitIntro}</p>
            ${a(u.id, t.details + ' →', 'text-link')}
          </div>
        </article>
      `).join('')}
    </div>
  `;
  // ==========================================
  // GALERIE FOTO
  // ==========================================
  const gallery = (arr = []) => {
    if (!arr.length) return '';
    const images = esc(JSON.stringify(arr));
    return `
      <div class="cp-gallery-grid">
        ${arr.map((src, i) => `
          <button
            class="cp-gallery-item"
            type="button"
            data-lightbox-open
            data-images="${images}"
            data-index="${i}"
            aria-label="${lang === 'ro' ? 'Deschide fotografia' : 'Open photo'} ${i + 1}"
          >
            ${img(src, 'Casa Panoramic ' + (i + 1))}
            <span class="cp-gallery-zoom" aria-hidden="true">↗</span>
          </button>
        `).join('')}
      </div>
    `;
  };
  // ==========================================
  // SLIDER FOTO
  // ==========================================
  const slider = (arr = []) => {
    if (!arr.length) return '';
    const images = esc(JSON.stringify(arr));
    return `
      <div class="slider" data-slider>
        <div class="slider-viewport">
          <div class="slider-track">
            ${arr.map((src, i) => `
              <button
                class="cp-slide"
                type="button"
                data-lightbox-open
                data-images="${images}"
                data-index="${i}"
                aria-label="Mărește fotografia ${i + 1}"
              >
                ${img(src, 'Casa Panoramic ' + (i + 1))}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="slider-controls">
          <button type="button" data-prev aria-label="Previous">←</button>
          <button type="button" data-next aria-label="Next">→</button>
        </div>
      </div>
    `;
  };
  // ==========================================
  // REELS - AUTOMAT DIN CONFIG.JS
  // ==========================================
  const unitVideos = u => {
    if (!u.videos || typeof u.videos !== 'object') return '';
    const titles = {
      camera: {
        ro: 'Descoperă camerele',
        en: 'Discover the Rooms'
      },
      cameraInt: {
        ro: 'Interiorul casei',
        en: 'Inside the House'
      },
      cameraSureaga: {
        ro: 'Turul camerei',
        en: 'Room Tour'
      },
      foisor: {
        ro: 'Foișor și relaxare',
        en: 'Gazebo and Relaxation'
      },
      upstairs: {
        ro: 'Descoperă etajul',
        en: 'Discover the Upper Floor'
      },
      view: {
        ro: 'Priveliști panoramice',
        en: 'Panoramic Views'
      }
    };
    const entries = Object.entries(u.videos).filter(
      ([, src]) => typeof src === 'string' && src.trim()
    );
    if (!entries.length) return '';
    const total = entries.length;
    return `
      <div class="cp-unit-reels-block" id="unit-videos">
        <div class="cp-unit-reels-heading">
          <span class="eyebrow">CASA PANORAMIC · VIDEO</span>
          <p>
            ${lang === 'ro'
              ? 'Explorează proprietatea prin videoclipuri. Glisează pentru a descoperi mai mult.'
              : 'Explore the property through videos. Swipe to discover more.'}
          </p>
        </div>
        <div class="cp-reels" data-reels
          tabindex="0"
          aria-label="${lang === 'ro' ? 'Galerie video' : 'Video gallery'}">
          <div class="cp-reels-viewport">
            <div class="cp-reels-track">
              ${entries.map(([key, src], i) => {
                const fallback = key
                  .replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, c => c.toUpperCase());
                const title = titles[key]
                  ? titles[key][lang]
                  : fallback;
                return `
                  <article class="cp-reel"
                    aria-label="${esc(title)}">
                    <video
                      muted
                      playsinline
                      webkit-playsinline
                      preload="${i === 0 ? 'metadata' : 'none'}"
                      disablepictureinpicture
                      controlslist="nodownload noremoteplayback"
                      aria-label="${esc(title)}"
                    >
                      <source
                        src="${esc(src)}"
                        type="video/mp4">
                    </video>
                    <div class="cp-reel-shade"></div>
                    <div class="cp-reel-overlay">
                      <span class="cp-reel-label">
                        CASA PANORAMIC
                      </span>
                      <h3>${esc(title)}</h3>
                    </div>
                    <button
                      class="cp-reel-toggle"
                      type="button"
                      aria-label="${lang === 'ro' ? 'Oprește videoclipul' : 'Pause video'}"
                    >
                      <span class="cp-reel-toggle-icon">Ⅱ</span>
                    </button>
                    <div class="cp-reel-error" hidden>
                      <span>
                        ${lang === 'ro'
                          ? 'Videoclipul nu poate fi redat.'
                          : 'This video cannot be played.'}
                      </span>
                      <button type="button" data-retry-video>
                        ${lang === 'ro' ? 'Reîncearcă' : 'Retry'}
                      </button>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
          <button class="cp-reels-prev"
            type="button"
            aria-label="${lang === 'ro' ? 'Videoclip anterior' : 'Previous video'}">
            ‹
          </button>
          <button class="cp-reels-next"
            type="button"
            aria-label="${lang === 'ro' ? 'Videoclip următor' : 'Next video'}">
            ›
          </button>
          <div class="cp-reels-counter">
            <span data-reels-current>01</span>
            <span class="cp-reels-separator">/</span>
            <span>${String(total).padStart(2, '0')}</span>
          </div>
          <div class="cp-reels-progress"
            role="progressbar"
            aria-label="${lang === 'ro' ? 'Progres videoclip' : 'Video progress'}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0">
            <div class="cp-reels-progress-fill"></div>
          </div>
        </div>
        <p class="cp-reels-hint">
          ${lang === 'ro'
            ? 'Glisează pentru următorul clip · Apasă pe video pentru pauză'
            : 'Swipe for the next video · Tap to pause'}
        </p>
      </div>
    `;
  };
  // ==========================================
  // FACILITĂȚI
  // ==========================================
 
const featureGrid = () => {
  const facilityImages = [
    "/images/ciubar&sauna.jpg",
    "/images/sauna.jpg",
    "/images/tiroliana.png",
    "/images/gratare.jpg",
    "/images/balta.jpg",
    "/images/playground.jpg",
    "/images/sala-de-evenimente.jpg",
    "/images/camera-de-jocuri.jpg"
  ];

  return `
    <div class="cp-facilities-grid">
      ${t.features.map((f, i) => `
        <article class="cp-facility-card reveal">
          <img
            src="${esc(facilityImages[i] || '')}"
            alt="${esc(f)}"
            loading="lazy"
          >

          <div class="cp-facility-overlay">
            <h3>${esc(f)}</h3>
            <span class="cp-facility-line"></span>
          </div>
        </article>
      `).join('')}
    </div>
  `;
};

  // ==========================================
  // FACILITĂȚI PERSONALIZABILE PE UNITATE
  // ==========================================
  // ID-urile corespund celor din config.js.
  // Poți adăuga/șterge texte fără să modifici restul paginii.
  const unitFeatureOverrides = {
    'casa-1': { remove: ['living'], add: [] }, // David
    'casa-2': { remove: [], add: [] },
    'vila-1': { remove: [], add: [] },
    'vila-2': { remove: [], add: [] }
  };
  const unitFeatures = (u, source = 'unitFeatures') => {
    const cfg = unitFeatureOverrides[u.id] || { remove: [], add: [] };
    const base = Array.isArray(t[source]) ? t[source] : [];
    const custom = u[source]; // opțional, direct în config.js
    const list = Array.isArray(custom) ? custom : base;
    const remove = cfg.remove || [];
    const additions = (cfg.add || []).map(x =>
      typeof x === 'string' ? x : (x[lang] || x.ro || '')
    );
    const result = [...list.filter(x => !remove.some(term =>
      String(x).toLocaleLowerCase().includes(term.toLocaleLowerCase())
    )), ...additions];
    return [...new Set(result.filter(Boolean))];
  };
  const unitFeatureGrid = u => `
    <div class="feature-grid">
      ${unitFeatures(u, 'features').map((f, i) => `
        <article class="feature reveal">
          <div class="symbol">${['♨','✧','↗','♧','≈','☼','✦','❋'][i % 8]}</div>
          <h3>${esc(f)}</h3>
        </article>
      `).join('')}
    </div>`;
  // ==========================================
  // GALERIE GENERALĂ: ACELEAȘI IMAGINI PE SITE
  // ==========================================
  const overallGallery = () => {
    const sources = Array.isArray(C.images?.gallery) && C.images.gallery.length
      ? C.images.gallery
      : C.units.flatMap(u => u.gallery || []);
    const photos = [...new Set(sources.filter(Boolean))];
    if (!photos.length) return '';
    // Dublarea permite derularea fără salt la capăt.
    const all = [...photos, ...photos];
    const data = esc(JSON.stringify(photos));
    return `
<div class="cp-overall-gallery">
  ${sectionHead(
    t.gallery,
    lang === 'ro' ? 'Descoperă Casa Panoramic' : 'Discover Casa Panoramic',
    ''
  )}
        <div class="cp-overall-window">
          <div class="cp-overall-track" style="--cp-photo-count:${photos.length}">
            ${all.map((src, i) => `
              <button type="button" class="cp-overall-photo"
                data-lightbox-open data-images="${data}"
                data-index="${i % photos.length}"
                ${i >= photos.length ? 'tabindex="-1" aria-hidden="true"' : ''}
                aria-label="${lang === 'ro' ? 'Deschide fotografia' : 'Open photo'} ${(i % photos.length) + 1}">
                ${img(src, 'Casa Panoramic ' + ((i % photos.length) + 1))}
                <span aria-hidden="true">↗</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>`;
  };
  // CSS inclus direct în site.js; nu trebuie modificat style.css.
  const overallCSS = `
    .cp-overall-gallery{width:100%;min-width:0}
    .cp-overall-window{width:100%;overflow:hidden;
      -webkit-mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent);
      mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent)}
    .cp-overall-track{--cp-gap:16px;display:flex;gap:var(--cp-gap);width:max-content;
      animation:cp-overall-move 65s linear infinite;will-change:transform}
    .cp-overall-photo{position:relative;flex:0 0 290px;width:290px;height:205px;
      border:0;padding:0;border-radius:12px;overflow:hidden;background:#e9e1d8;cursor:pointer}
    .cp-overall-photo img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .35s}
    .cp-overall-photo:hover img{transform:scale(1.04)}
    .cp-overall-photo span{position:absolute;right:12px;bottom:12px;background:#0008;color:white;
      border-radius:50%;width:32px;height:32px;display:grid;place-items:center}
    .cp-overall-window:hover .cp-overall-track,
    .cp-overall-window:focus-within .cp-overall-track{animation-play-state:paused}
    @keyframes cp-overall-move{to{transform:translateX(calc(-50% - var(--cp-gap) / 2))}}
    .cp-unit-features-section,.cp-overall-section{padding-top:65px;padding-bottom:65px}
    @media(max-width:767px){
      .cp-overall-track{--cp-gap:12px;animation-duration:48s}
      .cp-overall-photo{flex-basis:220px;width:220px;height:160px}
      .cp-unit-features-section,.cp-overall-section{padding-top:42px;padding-bottom:42px}
    }
    @media(prefers-reduced-motion:reduce){
      .cp-overall-track{animation:none}
      .cp-overall-window{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
    }
  `;


const sights = () => {
  const attractions = page === 'index'
    ? (C.attractions || []).slice(0, 3)
    : (C.attractions || []);

  return `
    <div class="cp-attractions-grid">
      ${attractions.map(item => `
        <article
          class="cp-attraction-card reveal"
          id="${esc(item.id)}"
        >
          <div class="cp-attraction-image">
            <img
              src="${esc(item.image)}"
              alt="${esc(item.name)}"
              loading="lazy"
            >
          </div>

          <div class="cp-attraction-content">
            <span class="cp-attraction-distance">
              📍 ${esc(item.distance)}
            </span>

            <h3>${esc(item.name)}</h3>

            <p>${esc(item.description)}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
};


  // ==========================================
  // HOMEPAGE
  // ==========================================
  const home = () => `
    ${hero(t.heroTitle, t.heroDesc)}
    <section class="section">
      <div class="container split">
        <div class="image-wrap reveal">
          ${img(C.images.behindCasa, 'Priveliște')}
        </div>
        <div class="reveal">
          <span class="eyebrow">${t.welcomeEyebrow}</span>
          <h2>${t.welcomeTitle}</h2>
          <p>${t.welcomeDesc}</p>
          <div class="stat-row">
            <div class="stat">
              <strong>${C.stats.guests}</strong>
              <span>${lang === 'ro' ? 'Oaspeți' : 'Guests'}</span>
            </div>
            <div class="stat">
              <strong>${C.stats.units}</strong>
              <span>${lang === 'ro' ? 'Unități' : 'Units'}</span>
            </div>
                        <div class="stat">
              <strong>${C.stats.land}</strong>
              <span>${lang === 'ro' ? 'Teren' : 'Land'}</span>
            </div>
            <div class="stat">
              <strong>${C.stats.locations}</strong>
              <span>${lang === 'ro' ? 'Locații' : 'Locations'}</span>
            </div>
          </div>
          <div class="mt">
            ${a('facilitati', t.discover, 'btn')}
          </div>
        </div>
      </div>
    </section>
    <section class="section alt">
      <div class="container">
        ${sectionHead('CASA PANORAMIC', t.stayTitle, t.stayDesc)}
        ${unitCards()}
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${sectionHead(t.facilities, t.facilityTitle, t.facilityDesc)}
        ${featureGrid()}

      </div>
    </section>
    <section class="section alt">
      <div class="container">
        ${sectionHead(t.events, t.eventsTitle, t.eventsDesc)}
        <div class="duo-images">
          ${img(C.images.events[0], 'Evenimente')}
          <div class="middle">
            <span class="eyebrow">CASA PANORAMIC</span>
            <h3>Locul unde fiecare întâlnire devine o poveste</h3>
            <p>Bucură-te de timp de calitate alături de cei dragi, într-un cadru natural deosebit, cu spații generoase, intimitate și toate condițiile pentru momente de neuitat. Fie că sărbătorești o ocazie specială sau pur și simplu vrei să evadezi din agitația cotidiană, aici găsești atmosfera potrivită.</p>
            ${a('evenimente', t.details, 'btn')}
          </div>
          ${img(C.images.events[1], 'Evenimente')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${sectionHead(t.food, t.foodTitle, t.foodDesc)}
        <div class="photo-triptych">
          ${C.images.gastronomy.map(s =>
            img(s, 'Gastronomie')
          ).join('')}
        </div>
        <div class="center mt">
          ${a('gastronomie', t.details, 'btn')}
        </div>
      </div>
    </section>
    <section class="section alt">
      <div class="container">
        ${sectionHead(
          t.attractions,
          t.attractionsTitle,
          t.attractionsDesc
        )}
        ${sights()}
        <div class="center mt">
          ${a('atractii', t.more, 'btn')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${overallGallery()}
      </div>
    </section>
    ${band('events', t.contactTitle, t.contactDesc)}
  `;
  // ==========================================
  // PAGINA FIECĂREI CASE
  // ==========================================
  const unitPage = u => `
${hero(u.name[lang], '', true, u.heroImage || u.image)}
    <!-- Galeria individuală + descrierea + Reels rămân împreună -->
    <section class="section cp-unit-main-section">
      <div class="container">
        <div class="unit-layout">
          <div>${slider(u.gallery || [])}</div>
          <div class="reveal">
            <span class="eyebrow">CASA PANORAMIC · ${t.stay}</span>
            <h2>${esc(u.name[lang])}</h2>
            <p>${u.intro?.[lang] || t.unitIntro}</p>
            <ul class="checklist">
              ${unitFeatures(u).map(x => `<li>${esc(x)}</li>`).join('')}
            </ul>
            <p class="notice">
              ${lang === 'ro' ? 'Tarif orientativ la nivel de complex:' : 'Indicative resort-wide rate:'}
              ${esc(C.price)}/${lang === 'ro' ? 'noapte/cameră' : 'night/room'}.
              ${lang === 'ro' ? '' : ''}
            </p>
${a('contact', t.book, 'btn')}
          </div>
        </div>
        ${unitVideos(u)}
      </div>
    </section>
    <!-- 1. Facilități personalizate pe casă -->
    <section class="section cp-unit-features-section">
      <div class="container">
        ${sectionHead(t.facilities, t.facilityTitle, t.facilityDesc)}
${featureGrid()}
      </div>
    </section>
    <!-- 2. Galerie generală comună, derulare continuă -->
    <section class="section alt cp-overall-section">
      <div class="container">${overallGallery()}</div>
    </section>
    <!-- 3. Alege locul tău de relaxare: toate unitățile -->
    <section class="section alt">
      <div class="container">
        ${sectionHead(
          'CASA PANORAMIC · VRANCEA',
          lang === 'ro' ? 'Alege locul tău de relaxare' : 'Choose Your Place to Relax',
          t.stayDesc
        )}
        ${unitCards()}
      </div>
    </section>
    <!-- 4. Întreaga secțiune video natură -->
    ${band('nature', t.natureTitle, t.natureDesc)}
  `;





  // ==========================================
  // JS Galerie Gastronomie
  // ==========================================
  const gastronomieGallery = () => `
    <div class="gastronomie-gallery">
        ${(C.images.gastronomieGallery || []).map(src => `
            <div class="gastronomie-gallery-item">
                <img src="${esc(src)}" alt="Punct gastronomic Casa Panoramic" loading="lazy">
            </div>
        `).join('')}
    </div>
`;


// JS Galerie Evenimente
const eventsGallery = () => `
    <div class="cp-events-extra">

        <div class="gastronomie-gallery">
            ${(C.images.eventsGallery || []).map(src => `
                <div class="gastronomie-gallery-item">
                    <img
                        src="${esc(src)}"
                        alt="Evenimente Casa Panoramic"
                        loading="lazy"
                    >
                </div>
                
            `).join('')}
        </div>
        <div class="cp-events-attraction">
            <span class="eyebrow">DESCOPERĂ ÎMPREJURIMILE</span>

            <h2>O aventură la doar câțiva pași</h2>

            <p>
                Descoperă traseul către Crucea de pe
                Muntele Piatra și Trovanții Uriașilor,
                o experiență în mijlocul naturii,
                cu priveliști spectaculoase asupra
                Văii Râmnicului.
            </p>

            <a href="atractii.html#crucea-muntele-piatra"
               class="cp-events-attraction-btn">
                Descoperă Crucea de pe Muntele Piatra
                <span aria-hidden="true">→</span>
            </a>
        </div>


    </div>
`;


  // ==========================================
  // PAGINI STANDARD
  // ==========================================
  const standard = () => {
    let title, desc, key = 'nature', body = '';
    if (page === 'cazare') {
      title = t.stayTitle;
      desc = t.stayDesc;
      body = `
        <section class="section">
          <div class="container">${unitCards()}</div>
        </section>
        ${band('accommodation', t.natureTitle, t.natureDesc)}
      `;
    }
    if (page === 'facilitati') {
      title = t.facilityTitle;
      desc = t.facilityDesc;
      body = `
        <section class="section">
          <div class="container">${featureGrid()}</div>
        </section>
        ${band('nature', t.natureTitle, t.natureDesc)}
      `;
    }
    if (page === 'evenimente') {
      title = t.eventsTitle;
      desc = t.eventsDesc;
      key = 'events';
      body = `
        <section class="section">
              ${page === 'evenimente' ? eventsGallery() : ''}
        </section>
        ${band('nature', t.natureTitle, t.natureDesc)}
      `;
    }
    if (page === 'gastronomie') {
      title = t.foodTitle;
      desc = t.foodDesc;
      key = 'gastronomy';
      body = `
        <section class="section">
          <div class="container">

            ${gastronomieGallery()}
            <p class="center mt notice">
              ${lang === 'ro'
                ? 'Meniul, prețurile și disponibilitatea sunt oferite la cerere.'
                : 'Menu, prices and availability upon request.'}
            </p>
            <div class="center">
${a('contact', t.book, 'btn')}
            </div>
          </div>
        </section>
      `;
    }
    if (page === 'atractii') {
      title = t.attractionsTitle;
      desc = t.attractionsDesc;
      body = `
        <section class="section">
          <div class="container">
            ${sights()}
            <div class="center mt">
              ${a('contact', t.book, 'btn')}
            </div>
          </div>
        </section>
        ${band('nature', t.natureTitle, t.natureDesc)}
      `;
    }
    if (page === 'contact') {
      title = t.contactTitle;
      desc = t.contactDesc;
      body = `
        <section class="section">
          <div class="container contact-grid">
            <div>
              <span class="eyebrow">CASA PANORAMIC</span>
              <h2>${t.contactTitle}</h2>
              <p>${t.contactDesc}</p>
              <p>Vintileasca, Vrancea, România</p>
              ${C.contact.phone ? `
                <p>
                  <a href="tel:${esc(C.contact.phone)}">
                    ${esc(C.contact.phone)}
                  </a>
                </p>
              ` : ''}
              ${C.contact.email ? `
                <p>
                  <a href="mailto:${esc(C.contact.email)}">
                    ${esc(C.contact.email)}
                  </a>
                </p>
              ` : ''}
              <a class="btn outline" target="_blank"
                rel="noopener" href="${esc(C.contact.maps)}">
                ${t.location}
              </a>
            </div>
            <form id="contact-form">
              <input required name="name" placeholder="${t.formName}">
              <input required type="email" name="email"
                placeholder="${t.formEmail}">
              <textarea required name="message"
                placeholder="${t.formMessage}"></textarea>
              <button class="btn" type="submit">${t.send}</button>
              <p class="notice">${t.formNote}</p>
            </form>
          </div>
        </section>
      `;
    }
    return hero(title, desc, key, true) + body;
  };

/* ==========================================
   CASA PANORAMIC - HERO VIDEO CONTINUOUS
   ========================================== */

(() => {
    const STORAGE_KEY = 'cp_hero_video_position';
    const VIDEO_URL = '/videos/hero-video.mp4';

    const initHeroVideo = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const heroVideo = [...hero.querySelectorAll('video')]
            .find(video => {
                const src = video.currentSrc ||
                    video.getAttribute('src') ||
                    video.querySelector('source')?.getAttribute('src') ||
                    '';

                return src.includes('hero-video.mp4');
            });

        if (!heroVideo) return;

        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.autoplay = true;
        heroVideo.playsInline = true;

        let savedPosition = 0;

        try {
            savedPosition = Number(
                sessionStorage.getItem(STORAGE_KEY)
            ) || 0;
        } catch (e) {}

        const restorePosition = () => {
            if (!Number.isFinite(heroVideo.duration)) return;

            const duration = heroVideo.duration;

            if (duration <= 0) return;

            const position = savedPosition % duration;

            try {
                heroVideo.currentTime = position;
            } catch (e) {}

            heroVideo.play().catch(() => {});
        };

        if (heroVideo.readyState >= 1) {
            restorePosition();
        } else {
            heroVideo.addEventListener(
                'loadedmetadata',
                restorePosition,
                { once: true }
            );
        }

        const savePosition = () => {
            try {
                sessionStorage.setItem(
                    STORAGE_KEY,
                    String(heroVideo.currentTime || 0)
                );
            } catch (e) {}
        };

        heroVideo.addEventListener('timeupdate', savePosition);
        window.addEventListener('pagehide', savePosition);
    };

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initHeroVideo
        );
    } else {
        initHeroVideo();
    }
})();


  // ==========================================
  // HEADER
  // ==========================================
  const header = () => `
    <header class="site-header" id="header">
      <div class="container nav">
<a class="brand" href="index.html">
  <img
    src="/images/logo.png"
    alt="Casa Panoramic Vintileasca"
    class="brand-logo"
  >
</a>
        <nav class="nav-links" id="nav-links">
          ${a('index', t.home)}
          <div class="dropdown">
            <button class="dropdown-toggle"
              type="button" aria-expanded="false">
              ${t.stay} ▾
            </button>
            <div class="dropdown-menu">
              ${a('cazare', t.stay)}
              ${C.units.map(u => a(u.id, u.name[lang])).join('')}
            </div>
          </div>
          ${a('facilitati', t.facilities)}
          ${a('evenimente', t.events)}
          ${a('gastronomie', t.food)}
          ${a('atractii', t.attractions)}
          ${a('contact', t.contact)}
        </nav>
        <div class="nav-actions">
          <button class="lang" id="lang-switch"
            type="button" aria-label="Switch language">
            ${lang === 'ro' ? 'EN' : 'RO'}
          </button>
          ${a('contact', t.book, 'btn light')}
          <button class="menu-toggle" id="menu-toggle"
            aria-label="Menu" aria-expanded="false">
            ☰
          </button>
        </div>
      </div>
    </header>
  `;
  // ==========================================
  // FOOTER
  // ==========================================
  const footer = () => `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
<a href="index.html" class="footer-brand-logo">
    <img
        src="/images/logo.png"
        alt="Casa Panoramic Vintileasca"
        loading="lazy"
    >
</a>
            <p>${t.footer}</p>
            <p>Vintileasca, Vrancea, România</p>
          </div>
          <div>
            <h3>${t.discover}</h3>
            ${a('cazare', t.stay)}
            ${a('facilitati', t.facilities)}
            ${a('evenimente', t.events)}
            ${a('gastronomie', t.food)}
          </div>
          <div>
            <h3>${t.contact}</h3>
            ${a('atractii', t.attractions)}
            ${a('contact', t.contact)}
            <a target="_blank" rel="noopener"
              href="${esc(C.contact.maps)}">
              ${t.location}
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          © ${new Date().getFullYear()}
          Casa Panoramic · Vintileasca, Vrancea
        </div>
      </div>
    </footer>
  `;
  // ==========================================
  // RANDARE
  // ==========================================
  document.documentElement.lang = lang;
  const currentUnit = C.units.find(u => u.id === page);
  document.title = `${
    page === 'index'
      ? 'Casa Panoramic'
      : currentUnit?.name[lang] || page
  } | Vintileasca, Vrancea`;
  const app = $('#app');
  if (!app) {
    console.error('Casa Panoramic: lipsește elementul #app.');
    return;
  }
  app.innerHTML =
    header() +
    '<main>' +
    (
      page === 'index'
        ? home()
        : currentUnit
          ? unitPage(currentUnit)
          : standard()
    ) +
    '</main>' +
    footer() +
    `
      <div class="cp-lightbox" id="cp-lightbox"
        role="dialog" aria-modal="true"
        aria-label="Galerie foto" hidden>
        <button class="cp-lb-close" type="button"
          aria-label="Close">×</button>
        <button class="cp-lb-prev" type="button"
          aria-label="Previous">‹</button>
        <div class="cp-lb-content">
          <img alt="">
          <div class="cp-lb-count"></div>
        </div>
        <button class="cp-lb-next" type="button"
          aria-label="Next">›</button>
      </div>
    ` +
    (
      C.contact.phone
        ? `<a class="floating-contact"
            href="tel:${esc(C.contact.phone)}"
            aria-label="Call">📞</a>`
        : ''
    );
  const cpShowcaseStyle = document.createElement('style');
  cpShowcaseStyle.id = 'cp-overall-showcase-style';
  cpShowcaseStyle.textContent = overallCSS;
  document.head.appendChild(cpShowcaseStyle);
  // ==========================================
  // NAVIGAȚIE
  // ==========================================
  $('#lang-switch')?.addEventListener('click', () => {
    localStorage.setItem(
      'cp_lang',
      lang === 'ro' ? 'en' : 'ro'
    );
    location.reload();
  });
  $('#menu-toggle')?.addEventListener('click', () => {
    const h = $('#header');
    h.classList.toggle('open');
    $('#menu-toggle').setAttribute(
      'aria-expanded',
      h.classList.contains('open')
    );
  });
  $('.dropdown-toggle')?.addEventListener('click', () => {
    const d = $('.dropdown');
    d.classList.toggle('active');
    $('.dropdown-toggle').setAttribute(
      'aria-expanded',
      d.classList.contains('active')
    );
  });
  const sc = () =>
    $('#header')?.classList.toggle('scrolled', scrollY > 30);
  window.addEventListener('scroll', sc, { passive: true });
  sc();
  // ==========================================
    // ANIMAȚII
  // ==========================================
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(e => {
      observer.observe(e);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(e => {
      e.classList.add('visible');
    });
  }
  // ==========================================
  // SLIDER FOTO
  // ==========================================
  document.querySelectorAll('[data-slider]').forEach(el => {
    let index = 0;
    const track = el.querySelector('.slider-track');
    const count = track.children.length;
    if (!count) return;
    const go = n => {
      index = (n + count) % count;
      track.style.transform = `translateX(-${index * 100}%)`;
    };
    el.querySelector('[data-prev]').onclick = () => go(index - 1);
    el.querySelector('[data-next]').onclick = () => go(index + 1);
    let timer = null;
    const startTimer = () => {
      clearInterval(timer);
      if (count > 1) {
        timer = setInterval(() => go(index + 1), 5000);
      }
    };
    startTimer();
    el.addEventListener('mouseenter', () => clearInterval(timer));
    el.addEventListener('mouseleave', startTimer);
    let start = 0;
    el.addEventListener('touchstart', e => {
      start = e.touches[0].clientX;
    }, { passive: true });
    el.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - start;
      if (Math.abs(delta) > 40) {
        go(index + (delta < 0 ? 1 : -1));
      }
    }, { passive: true });
  });
  // ==========================================
  // REELS VIDEO
  // ==========================================
  document.querySelectorAll('[data-reels]').forEach(reels => {
    const track = reels.querySelector('.cp-reels-track');
    const slides = [...reels.querySelectorAll('.cp-reel')];
    const counter = reels.querySelector('[data-reels-current]');
    const progress = reels.querySelector('.cp-reels-progress');
    const progressFill = reels.querySelector('.cp-reels-progress-fill');
    const prev = reels.querySelector('.cp-reels-prev');
    const next = reels.querySelector('.cp-reels-next');
    if (!slides.length) return;
    let current = 0;
    let visible = false;
    let userPaused = false;
    let startX = 0;
    let startY = 0;
    let pointerMoved = false;
    const getVideo = index =>
      slides[index]?.querySelector('video');
    const getToggle = index =>
      slides[index]?.querySelector('.cp-reel-toggle');
    const getError = index =>
      slides[index]?.querySelector('.cp-reel-error');
    // Toate videoclipurile sunt permanent fără sunet.
    slides.forEach((slide, index) => {
      const v = getVideo(index);
      v.muted = true;
      v.defaultMuted = true;
      v.volume = 0;
      v.loop = false;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      // Evităm încărcarea simultană a tuturor clipurilor.
      if (index > 0) {
        v.preload = 'none';
      }
    });
    const updateToggle = () => {
      slides.forEach((slide, index) => {
        const button = getToggle(index);
        const icon = button.querySelector('.cp-reel-toggle-icon');
        const v = getVideo(index);
        const paused = v.paused;
        icon.textContent = paused ? '▶' : 'Ⅱ';
        button.setAttribute(
          'aria-label',
          paused
            ? (lang === 'ro' ? 'Pornește videoclipul' : 'Play video')
            : (lang === 'ro' ? 'Oprește videoclipul' : 'Pause video')
        );
        slide.classList.toggle(
          'cp-reel-paused',
          paused
        );
      });
    };
    const pauseAll = () => {
      slides.forEach((slide, index) => {
        const v = getVideo(index);
        v.pause();
        v.muted = true;
      });
      updateToggle();
    };
    const showError = (index, message = '') => {
      const error = getError(index);
      if (!error) return;
      error.hidden = false;
      console.warn(
        'Casa Panoramic - video indisponibil:',
        getVideo(index)?.currentSrc ||
        getVideo(index)?.querySelector('source')?.src,
        message
      );
    };
    const hideError = index => {
      const error = getError(index);
      if (error) error.hidden = true;
    };
    const playCurrent = () => {
      pauseAll();
      if (!visible || document.hidden || userPaused) {
        updateToggle();
        return;
      }
      const v = getVideo(current);
      v.muted = true;
      v.volume = 0;
      if (v.error) {
        showError(current, 'Eroare de încărcare.');
        return;
      }
      const promise = v.play();
      if (promise && typeof promise.then === 'function') {
        promise
          .then(() => {
            hideError(current);
            updateToggle();
          })
          .catch(err => {
            if (err.name === 'NotAllowedError') {
              userPaused = true;
              updateToggle();
            } else if (err.name !== 'AbortError') {
              showError(current, err.message);
            }
          });
      }
      updateToggle();
    };
    const updateProgress = () => {
      const v = getVideo(current);
      let percent = 0;
      if (Number.isFinite(v.duration) && v.duration > 0) {
        percent = Math.min(
          100,
          Math.max(0, (v.currentTime / v.duration) * 100)
        );
      }
      progressFill.style.width = percent + '%';
      progress.setAttribute('aria-valuenow', String(Math.round(percent)));
    };
    const goTo = index => {
      pauseAll();
      current = (index + slides.length) % slides.length;
      userPaused = false;
      track.style.transform =
        `translate3d(-${current * 100}%, 0, 0)`;
      counter.textContent =
        String(current + 1).padStart(2, '0');
      const v = getVideo(current);
      // Resetăm doar videoclipul la care navigăm.
      try {
        v.currentTime = 0;
      } catch (e) {}
      progressFill.style.width = '0%';
      progress.setAttribute('aria-valuenow', '0');
      playCurrent();
    };
    const togglePlayback = () => {
      const v = getVideo(current);
      if (!v.paused) {
        userPaused = true;
        v.pause();
        updateToggle();
      } else {
        userPaused = false;
        playCurrent();
      }
    };
    prev.addEventListener('click', e => {
      e.stopPropagation();
      goTo(current - 1);
    });
    next.addEventListener('click', e => {
      e.stopPropagation();
      goTo(current + 1);
    });
    // Butonul central Play/Pause.
    slides.forEach((slide, index) => {
      const v = getVideo(index);
      const toggle = getToggle(index);
      const retry = slide.querySelector('[data-retry-video]');
      toggle.addEventListener('click', e => {
        e.stopPropagation();
        if (index === current) {
          togglePlayback();
        }
      });
      // Click direct pe video.
      slide.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        if (pointerMoved) return;
        if (index === current) {
          togglePlayback();
        }
      });
      v.addEventListener('timeupdate', () => {
        if (index === current) updateProgress();
      });
      v.addEventListener('loadedmetadata', () => {
        hideError(index);
        if (index === current) {
          updateProgress();
        }
      });
      v.addEventListener('playing', () => {
        hideError(index);
        updateToggle();
      });
      v.addEventListener('pause', updateToggle);
      v.addEventListener('error', () => {
        showError(index, 'Fișier sau format incompatibil.');
      });
      v.addEventListener('ended', () => {
        if (index === current && !userPaused) {
          goTo(current + 1);
        }
      });
      retry.addEventListener('click', e => {
        e.stopPropagation();
        hideError(index);
        v.load();
        if (index === current) {
          userPaused = false;
          v.addEventListener('loadeddata', playCurrent, {
            once: true
          });
        }
      });
    });
    // ========================================
    // SWIPE PE TELEFON
    // ========================================
    reels.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      pointerMoved = false;
    }, { passive: true });
    reels.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        pointerMoved = true;
      }
    }, { passive: true });
    reels.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        goTo(current + (dx < 0 ? 1 : -1));
      }
      if (pointerMoved) {
        setTimeout(() => {
          pointerMoved = false;
        }, 250);
      }
    }, { passive: true });
    // ========================================
    // AUTOPLAY DOAR CÂND E VIZIBIL
    // ========================================
    if ('IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) {
          if (!userPaused) playCurrent();
        } else {
          pauseAll();
        }
      }, { threshold: 0.35 });
      visibilityObserver.observe(reels);
    } else {
      visible = true;
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAll();
      } else if (!userPaused) {
        playCurrent();
      }
    });
    // Tastele funcționează când sliderul are focus.
    reels.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(current - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(current + 1);
      }
      if (
        (e.key === ' ' || e.key === 'Enter') &&
        e.target === reels
      ) {
        e.preventDefault();
        togglePlayback();
      }
    });
    // Starea inițială.
    counter.textContent = '01';
    progressFill.style.width = '0%';
    updateToggle();
    // Ascundem săgețile dacă există un singur clip.
    if (slides.length === 1) {
      prev.hidden = true;
      next.hidden = true;
    }
  });

 
/* ==========================================
   CASA PANORAMIC
   LIGHTBOX UNIVERSAL V3
   SISTEM INDEPENDENT, FARA CONFLICTE
========================================== */

(() => {
  'use strict';

  const initLightbox = () => {

    if (document.getElementById('cp-photo-viewer-v3')) return;

    const selectors = [
      '.gastronomie-gallery',
      '.cp-traseu-gallery',
      '.cp-attractions-grid',
      '.cp-facilities-grid',
      '.gallery',
      '.unit-gallery',
      '.overall-gallery',
      '[data-slider]',
      '[data-lightbox-open]'
    ];

    const gallerySelector = selectors.join(', ');

    const viewer = document.createElement('div');

    viewer.id = 'cp-photo-viewer-v3';

    viewer.innerHTML = `
      <button class="cpv-close" type="button"
        aria-label="Închide galeria">×</button>

      <button class="cpv-prev" type="button"
        aria-label="Imaginea anterioară">‹</button>

      <div class="cpv-content">
        <img class="cpv-image" alt="Casa Panoramic">
        <div class="cpv-counter"></div>
      </div>

      <button class="cpv-next" type="button"
        aria-label="Imaginea următoare">›</button>
    `;

    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Galerie foto');

    document.body.appendChild(viewer);

    const style = document.createElement('style');

    style.textContent = `
      #cp-photo-viewer-v3 {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
        display: none !important;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,.96) !important;
      }

      #cp-photo-viewer-v3.cpv-active {
        display: flex !important;
      }

      #cp-photo-viewer-v3 .cpv-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% - 140px);
        height: 90vh;
        position: relative;
      }

      #cp-photo-viewer-v3 .cpv-image {
        display: block;
        width: auto !important;
        height: auto !important;
        max-width: 100% !important;
        max-height: 85vh !important;
        object-fit: contain !important;
        border-radius: 8px;
      }

      #cp-photo-viewer-v3 button {
        position: absolute;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white !important;
        background: rgba(255,255,255,.12) !important;
        border: 1px solid rgba(255,255,255,.2) !important;
        cursor: pointer;
      }

      #cp-photo-viewer-v3 .cpv-close {
        top: 20px;
        right: 25px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        font-size: 32px;
      }

      #cp-photo-viewer-v3 .cpv-prev,
      #cp-photo-viewer-v3 .cpv-next {
        top: 50%;
        transform: translateY(-50%);
        width: 55px;
        height: 65px;
        border-radius: 12px;
        font-size: 36px;
      }

      #cp-photo-viewer-v3 .cpv-prev {
        left: 20px;
      }

      #cp-photo-viewer-v3 .cpv-next {
        right: 20px;
      }

      #cp-photo-viewer-v3 button:hover {
        background: rgba(255,255,255,.25) !important;
      }

      #cp-photo-viewer-v3 .cpv-counter {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        letter-spacing: 2px;
      }

      body.cpv-body-open {
        overflow: hidden !important;
      }

      @media (max-width: 768px) {
        #cp-photo-viewer-v3 .cpv-content {
          width: 100%;
          height: 85vh;
          padding: 0 12px;
        }

        #cp-photo-viewer-v3 .cpv-image {
          max-height: 75vh !important;
        }

        #cp-photo-viewer-v3 .cpv-prev,
        #cp-photo-viewer-v3 .cpv-next {
          width: 38px;
          height: 48px;
          font-size: 25px;
        }

        #cp-photo-viewer-v3 .cpv-prev {
          left: 5px;
        }

        #cp-photo-viewer-v3 .cpv-next {
          right: 5px;
        }

        #cp-photo-viewer-v3 .cpv-close {
          top: 15px;
          right: 15px;
          width: 42px;
          height: 42px;
        }
      }
    `;

    document.head.appendChild(style);

    const image = viewer.querySelector('.cpv-image');
    const counter = viewer.querySelector('.cpv-counter');

    let photos = [];
    let current = 0;
    let previousFocus = null;
    let startX = 0;

    const isOpen = () =>
      viewer.classList.contains('cpv-active');

    const show = index => {
      if (!photos.length) return;

      current = (index + photos.length) % photos.length;

      image.src = photos[current].src;
      image.alt = photos[current].alt || 'Casa Panoramic';

      counter.textContent =
        `${current + 1} / ${photos.length}`;

      const multiple = photos.length > 1;

      viewer.querySelector('.cpv-prev').hidden = !multiple;
      viewer.querySelector('.cpv-next').hidden = !multiple;
    };

    const open = (items, index, trigger) => {
      if (!items.length) return;

      photos = items;
      previousFocus = trigger;

      viewer.classList.add('cpv-active');
      document.body.classList.add('cpv-body-open');

      show(index);

      viewer.querySelector('.cpv-close').focus();
    };

    const close = () => {
      viewer.classList.remove('cpv-active');
      document.body.classList.remove('cpv-body-open');

      image.removeAttribute('src');
      photos = [];

      if (previousFocus?.focus) {
        previousFocus.focus();
      }
    };

    const move = direction => {
      if (photos.length > 1) {
        show(current + direction);
      }
    };

    // CLICK PE GALERII
    document.addEventListener('click', event => {

      if (viewer.contains(event.target)) return;

      const trigger =
        event.target.closest('[data-lightbox-open]');

      if (trigger) {
        let sourceImages = [];

        try {
          sourceImages = JSON.parse(
            trigger.dataset.images || '[]'
          );
        } catch (error) {
          console.warn('Galerie invalidă:', error);
        }

        if (Array.isArray(sourceImages) && sourceImages.length) {
          event.preventDefault();
          event.stopImmediatePropagation();

          open(
            sourceImages.map(src => ({
              src: typeof src === 'string' ? src : src.src,
              alt: typeof src === 'string' ? '' : (src.alt || '')
            })).filter(item => item.src),
            Number(trigger.dataset.index) || 0,
            trigger
          );
        }

        return;
      }

      const clickedImage = event.target.closest('img');

      if (!clickedImage) return;

      const gallery =
        clickedImage.closest(gallerySelector);

      if (!gallery) return;

      if (event.target.closest('button')) return;

      const galleryImages = [
        ...gallery.querySelectorAll('img')
      ].filter(img => img.currentSrc || img.src);

      const index = galleryImages.indexOf(clickedImage);

      if (index < 0) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      open(
        galleryImages.map(img => ({
          src: img.currentSrc || img.src,
          alt: img.alt || ''
        })),
        index,
        clickedImage
      );
    }, true);

    viewer.querySelector('.cpv-close')
      .addEventListener('click', close);

    viewer.querySelector('.cpv-prev')
      .addEventListener('click', () => move(-1));

    viewer.querySelector('.cpv-next')
      .addEventListener('click', () => move(1));

    viewer.addEventListener('click', event => {
      if (event.target === viewer) close();
    });

    document.addEventListener('keydown', event => {
      if (!isOpen()) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      }
    }, true);

    viewer.addEventListener('touchstart', event => {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewer.addEventListener('touchend', event => {
      const difference =
        event.changedTouches[0].clientX - startX;

      if (Math.abs(difference) < 45) return;

      move(difference < 0 ? 1 : -1);
    }, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }

})();



  // ==========================================
  // FORMULAR CONTACT - WEB3FORMS
  // ==========================================

  const form = $('#contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      const isRO = lang === 'ro';

      const formData = new FormData(form);

      // Cheia Web3Forms
      formData.set(
        'access_key',
        '3b15f82c-1379-40e7-87ff-238c187d697b'
      );

      // Subiectul emailului
      formData.set(
        'subject',
        'Mesaj nou de pe Casa Panoramic'
      );

      // Identificarea formularului
      formData.set('from_name', 'Casa Panoramic - Website');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isRO
          ? 'Se trimite...'
          : 'Sending...';
      }

      try {
        const response = await fetch(
          'https://api.web3forms.com/submit',
          {
            method: 'POST',
            body: formData
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          alert(
            isRO
              ? 'Mesajul a fost trimis cu succes! Vă vom contacta în cel mai scurt timp.'
              : 'Your message has been sent successfully! We will contact you as soon as possible.'
          );

          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }

      } catch (error) {
        console.error('Web3Forms error:', error);

        alert(
          isRO
            ? 'Mesajul nu a putut fi trimis. Vă rugăm să încercați din nou.'
            : 'Your message could not be sent. Please try again.'
        );

      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
})();

/* ==========================================
   CASA PANORAMIC
   WHATSAPP + BACK TO TOP UNIVERSAL
========================================== */

(() => {
  const initFloatingButtons = () => {

    // Evitam adaugarea dubla
    if (document.getElementById('cp-floating-actions')) return;

    // Preluam numarul din config.js
    const phone = window.CP_CONFIG?.contact?.phone || '';

    // Format international pentru WhatsApp
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappPhone = cleanPhone.startsWith('0')
      ? '40' + cleanPhone.substring(1)
      : cleanPhone;

    const whatsappMessage = encodeURIComponent(
      'Bună ziua! Aș dori mai multe informații despre cazarea la Casa Panoramic.'
    );

    const container = document.createElement('div');
    container.id = 'cp-floating-actions';

    container.innerHTML = `
      ${whatsappPhone ? `
        <a
          href="https://wa.me/${whatsappPhone}?text=${whatsappMessage}"
          class="cp-float-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactează-ne pe WhatsApp"
          title="Scrie-ne pe WhatsApp"
        >
          <svg viewBox="0 0 32 32"
               width="27" height="27"
               fill="currentColor"
               aria-hidden="true">
            <path d="M16 .8A15.1 15.1 0 0 0 3 23.6L.9 31l7.6-2A15.2 15.2 0 1 0 16 .8zm0 27.5a12.3 12.3 0 0 1-6.3-1.7l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.4 12.4 0 1 1 16 28.3zm6.8-9.3c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-1 1.2-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.4 3.5 1.6 3.8c.2.2 2.7 4.1 6.5 5.7.9.4 1.6.6 2.1.7.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z"/>
          </svg>
        </a>
      ` : ''}

      <button
        type="button"
        class="cp-float-top"
        aria-label="Înapoi sus"
        title="Înapoi sus"
      >
        <svg viewBox="0 0 24 24"
             width="25" height="25"
             fill="none"
             stroke="currentColor"
             stroke-width="2.2"
             stroke-linecap="round"
             stroke-linejoin="round"
             aria-hidden="true">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    `;

    document.body.appendChild(container);

    const topButton = container.querySelector('.cp-float-top');

    const updateScroll = () => {
      topButton.classList.toggle(
        'cp-top-visible',
        window.scrollY > 350
      );
    };

    window.addEventListener('scroll', updateScroll, {
      passive: true
    });

    updateScroll();

    topButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingButtons);
  } else {
    initFloatingButtons();
  }
})();
/* ==========================================
   CASA PANORAMIC
   ASCUNDE .HTML DIN URL
========================================== */

(() => {
  const path = window.location.pathname;

  if (path.endsWith('.html')) {
    const cleanPath = path.replace(/\.html$/, '');

    window.history.replaceState(
      null,
      '',
      cleanPath + window.location.search + window.location.hash
    );
  }
})();
