/* Simple renderer for जयबाबा जी के अमृत मयी श्लोक
   - Fetches `thoughts.json` from same folder
   - Sorts by date (newest first)
   - Renders featured (today/newest) and gallery
   Note: This is a static-site approach. To add a new thought, edit `thoughts.json` and add a new object.
*/
(function() {
  const container = document.getElementById('shlok-root');
  if (!container) return;

  function isoDateToLabel(iso) {
    try {
      const d = new Date(iso + 'T00:00:00');
      const months = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];
      return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    } catch (e) { return iso; }
  }

  function render(thoughts) {
    // sort newest first
    thoughts.sort((a,b)=> (b.date || '').localeCompare(a.date || ''));

    const featured = thoughts[0];

    const html = [];
    html.push('<section class="shlok-page container">');

    if (featured) {
      html.push('<div class="featured">');
      if (featured.image) {
        html.push(`<a href="${encodeURI(featured.image)}" target="_blank" rel="noopener">`);
        html.push(`<img src="${encodeURI(featured.image)}" alt="${featured.title || 'featured image'}" loading="lazy">`);
        html.push('</a>');
      }
      html.push('<div class="featured-body">');
      // 👇 ORDER CHANGED HERE: date → title → text
      html.push(`<div class="meta">${isoDateToLabel(featured.date || '')}</div>`);
      html.push(`<div class="featured-title">${featured.title || ''}</div>`);
      html.push(`<div class="shlok-text">${featured.text || ''}</div>`);
      html.push('</div>');
      html.push('</div>');
    } else {
      html.push('<p>कोई श्लोक उपलब्ध नहीं है।</p>');
    }

    // gallery
    html.push('<h3>सभी श्लोक (नवीनतम ऊपर)</h3>');
    html.push('<div class="shlok-grid">');
    thoughts.forEach(t => {
      html.push('<article class="shlok-card">');
      if (t.image) {
        html.push(`<a href="${encodeURI(t.image)}" target="_blank" rel="noopener">`);
        html.push(`<img src="${encodeURI(t.image)}" alt="${t.title || 'shlok image'}" loading="lazy">`);
        html.push('</a>');
      }
      html.push('<div class="card-body">');
      // 👇 ORDER CHANGED HERE TOO
      html.push(`<div class="meta">${isoDateToLabel(t.date || '')}</div>`);
      html.push(`<div class="title">${t.title || ''}</div>`);
      html.push(`<div class="shlok-text">${t.text || ''}</div>`);
      html.push('</div>');
      html.push('</article>');
    });
    html.push('</div>');

    html.push('</section>');

    container.innerHTML = html.join('\n');
  }

  fetch('thoughts.json', {cache: 'no-store'})
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(data => render(data || []))
    .catch(err => {
      console.warn('Failed to load thoughts.json:', err);
      const fallback = container.getAttribute('data-fallback');
      if (fallback) {
        try { render(JSON.parse(fallback)); return; } catch(e) {}
      }
      container.innerHTML = '<p>श्लोक लोड करने में समस्या हुई। सुनिश्चित करें कि <code>jaibaba_shilok/thoughts.json</code> मौजूद है और सर्वर से पहुंच योग्य है। (जब आप साइट ब्राउज़र में सीधे file:// से खोलते हैं तो fetch काम नहीं कर सकता)।</p>';
    });

})();
