const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Basic Helmet protections
app.use(helmet());

// Add a CSP tailored for this static site (adjust if you load other external hosts)
app.use((req, res, next) => {
  // Allowlist for YouTube and common hosts used by embeds and CDNs
  const csp = [
    "default-src 'self' https:",
    // scripts from self, YouTube, and common CDNs (keep 'unsafe-inline' for now because the page uses inline styles/scripts)
    "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https://cdnjs.cloudflare.com",
    // styles: allow Google Fonts and inline styles
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // images: allow YouTube thumbnails, googlevideo, data URIs
    "img-src 'self' data: https://i.ytimg.com https://*.googlevideo.com https:",
    // media (audio/video)
    "media-src 'self' data: https://*.googlevideo.com https:",
    // connections for AJAX or player requests
    "connect-src 'self' https://www.youtube.com https://s.ytimg.com https://*.googlevideo.com https:",
    // frames: allow YouTube and youtube-nocookie for privacy-enhanced embeds
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.facebook.com",
    "font-src 'self' https://fonts.gstatic.com"
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  next();
});

// Simple request logging to help debug blocked requests when testing
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Serve static files from project root
app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Website server running at http://localhost:${port}`);
});
