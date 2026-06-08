const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. CSS Overrides for Premium Tactile Feedback
const cssOverrides = `
  <style id="premium-micro-interactions">
    /* ----------------------------------------------------
       PREMIUM MICRO-INTERACTIONS (SPRING PHYSICS & TOUCH)
       ---------------------------------------------------- */
    /* Spring physics for natural release */
    .btn-hero, .header-btn, .btn-modal-cta, .service-card, .masonry-item, .review-card, .insta-post-card, .story-highlight {
      transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
      will-change: transform;
    }

    /* Crisp touch/active states */
    .btn-hero:active, .header-btn:active, .btn-modal-cta:active, .service-card:active, .masonry-item:active, .review-card:active, .insta-post-card:active, .story-highlight:active {
      transform: scale(0.96) !important;
      box-shadow: 0 4px 10px rgba(107, 59, 87, 0.08) !important;
    }

    /* Fast, snappy scroll reveals */
    .fade-in {
      transition: opacity 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
    }

    /* Subtle luxury glass reflections */
    .glass-card::before, .service-card::before {
      background: linear-gradient(105deg, transparent, rgba(255, 255, 255, 0.15), transparent) !important;
      transition: left 0.8s ease-out, opacity 0.3s ease !important;
      opacity: 0;
    }
    
    .glass-card:hover::before, .service-card:hover::before,
    .glass-card:active::before, .service-card:active::before {
      opacity: 1 !important;
      left: 120% !important; /* Move the faint reflection across on touch */
    }
  </style>
`;

if (!html.includes('id="premium-micro-interactions"')) {
  // Inject before closing </head>
  html = html.replace('</head>', `${cssOverrides}\n</head>`);
}

// 2. Adjust Stagger Delay in IntersectionObserver JS
html = html.replace(
  /el\.style\.transitionDelay\s*=\s*`\$\{\(index\s*%\s*3\)\s*\*\s*0\.1\}s`;/g,
  'el.style.transitionDelay = `${(index % 3) * 0.08}s`;'
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Micro-interactions applied successfully.');
