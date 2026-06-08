const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Image Extensions
html = html.replace(/\.\/assets\/([a-zA-Z0-9_]+)\.(png|jpg|jpeg)/g, './assets/$1.webp');

// 2. Reduce Background Animation Thrashing
// .desktop-bg-glow::before and ::after
html = html.replace(/animation: blobDrift1 20s ease-in-out infinite;/g, '/* animation removed for performance */');
html = html.replace(/animation: blobDrift2 18s ease-in-out infinite;/g, '/* animation removed for performance */');
html = html.replace(/animation: blobDrift1 15s ease-in-out infinite;/g, '/* animation removed for performance */');

// .glass-card::before (shimmerSweep)
html = html.replace(/animation: shimmerSweep 8s ease-in-out infinite;/g, 'transition: left 0.8s ease;');
html = html.replace(/.glass-card::before {\s+content: '';/g, '.glass-card::before {\n      content: \'\';\n      opacity: 0;');
html = html.replace(/.glass-card:hover::before {\n/g, '.glass-card:hover::before {\n      opacity: 1;\n');

// .deco-sparkle animations
html = html.replace(/animation: sparkleFloat 5s ease-in-out infinite;/g, '');
html = html.replace(/animation: sparkleFloat2 7s ease-in-out infinite;/g, '');
html = html.replace(/animation: sparkleFloat 6s ease-in-out infinite;/g, '');
html = html.replace(/animation: sparkleFloat2 8s ease-in-out infinite;/g, '');

// .ambientMesh
html = html.replace(/animation: meshFlow/g, '/* animation: meshFlow */');

// 3. Optimize Glassmorphism
// Replace high blur with lower blur on service-cards and masonry items
html = html.replace(/backdrop-filter: blur\(36px\) saturate\(200\%\);/g, 'backdrop-filter: blur(12px) saturate(120%);');
html = html.replace(/-webkit-backdrop-filter: blur\(36px\) saturate\(200\%\);/g, '-webkit-backdrop-filter: blur(12px) saturate(120%);');

html = html.replace(/backdrop-filter: blur\(40px\) saturate\(200\%\);/g, 'backdrop-filter: blur(12px) saturate(120%);');
html = html.replace(/-webkit-backdrop-filter: blur\(40px\) saturate\(200\%\);/g, '-webkit-backdrop-filter: blur(12px) saturate(120%);');

// masonry-item had no backdrop filter directly but service card did
html = html.replace(/backdrop-filter: blur\(25px\) saturate\(180\%\);/g, 'backdrop-filter: blur(12px) saturate(120%);');
html = html.replace(/-webkit-backdrop-filter: blur\(25px\) saturate\(180\%\);/g, '-webkit-backdrop-filter: blur(12px) saturate(120%);');

// 4. Micro-Interactions (Add subtle lift/glow to hover states)
// .service-card:hover
html = html.replace(
  /\.service-card:hover::before {/g,
  `.service-card:hover { transform: translateY(-4px) scale(1.01); }\n    .service-card:hover::before {`
);

// .btn-hero:active -> .btn-hero:hover and active
html = html.replace(
  /\.btn-hero:active {/g,
  `.btn-hero:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(107, 59, 87, 0.15); }\n    .btn-hero:active {`
);

// 5. Scroll Reveal - We will insert IntersectionObserver in the JS section
// First, make sections hidden initially by adding a class to main blocks
// Add .reveal-on-scroll to masonry-container items, service-cards, etc in JS or CSS
const observerScript = `
    /* ----------------------------------------------------
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ---------------------------------------------------- */
    const initScrollReveals = () => {
      const observerOptions = {
        root: document.querySelector('.app-shell') || null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Elements to reveal
      document.querySelectorAll('.service-card, .masonry-item, .insta-post-card, .review-card').forEach((el, index) => {
        el.classList.add('fade-in');
        // Add staggered delay based on index modulo for rows
        el.style.transitionDelay = \`\${(index % 3) * 0.1}s\`;
        observer.observe(el);
      });
    };
    
    // Call it after DOM content loaded
`;

if (!html.includes('initScrollReveals()')) {
  html = html.replace(
    /document\.addEventListener\("DOMContentLoaded", \(\) => {/g,
    `document.addEventListener("DOMContentLoaded", () => {\n      initScrollReveals();\n`
  );
  html = html.replace(
    /const convertEmojisToAppleStyle =/g,
    `${observerScript}\n    const convertEmojisToAppleStyle =`
  );
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Optimizations applied successfully!');
