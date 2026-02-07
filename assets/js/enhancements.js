// Reading Progress Bar + Scroll to Top + Table of Contents
document.addEventListener('DOMContentLoaded', function() {
  // Smooth page entrance animation
  var mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(12px)';
    mainContent.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    requestAnimationFrame(function() {
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'translateY(0)';
    });
  }

  // Reading Progress Bar
  var progressBar = document.createElement('div');
  progressBar.id = 'reading-progress';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#a855f7,#6366f1);z-index:99999;transition:width 0.1s linear;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    var winScroll = document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });

  // Scroll to Top Button
  var scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-top-btn';
  scrollBtn.innerHTML = '↑';
  scrollBtn.title = 'Back to top';
  scrollBtn.style.cssText = 'position:fixed;bottom:2rem;left:2rem;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#6366f1);color:white;border:none;font-size:1.2rem;cursor:pointer;opacity:0;transform:translateY(20px);transition:all 0.3s ease;z-index:9999;box-shadow:0 4px 15px rgba(168,85,247,0.4);display:flex;align-items:center;justify-content:center;';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.transform = 'translateY(0)';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.transform = 'translateY(20px)';
    }
  });

  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Auto-generate Table of Contents for chapter pages
  var mainContent = document.querySelector('.main-content');
  if (!mainContent) return;

  var headings = mainContent.querySelectorAll('h2, h3');
  if (headings.length < 3) return; // Only show TOC if enough headings

  // Don't add TOC to homepage
  if (document.querySelector('.hero-section')) return;

  var toc = document.createElement('nav');
  toc.className = 'chapter-toc';
  toc.innerHTML = '<div class="toc-header">On This Page</div>';
  var tocList = document.createElement('ul');
  tocList.className = 'toc-list';

  headings.forEach(function(h, i) {
    if (!h.id) h.id = 'heading-' + i;
    var li = document.createElement('li');
    li.className = 'toc-item' + (h.tagName === 'H3' ? ' toc-sub' : '');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.replace(/^#+ /, '');
    a.addEventListener('click', function(e) {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, null, '#' + h.id);
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });

  toc.appendChild(tocList);

  // Insert TOC after first heading or banner
  var banner = mainContent.querySelector('.chapter-banner');
  var firstH1 = mainContent.querySelector('h1');
  var insertAfter = banner || firstH1;
  if (insertAfter && insertAfter.nextSibling) {
    insertAfter.parentNode.insertBefore(toc, insertAfter.nextSibling);
  }

  // Highlight active TOC item on scroll
  var tocLinks = tocList.querySelectorAll('a');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        tocLinks.forEach(function(link) { link.classList.remove('active'); });
        var activeLink = tocList.querySelector('a[href="#' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(function(h) { observer.observe(h); });

  // Keyboard Shortcuts for chapter navigation
  document.addEventListener('keydown', function(e) {
    // Ignore if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    // Left arrow or 'p' = Previous chapter
    if (e.key === 'ArrowLeft' || (e.key === 'p' && !e.ctrlKey && !e.metaKey)) {
      var prevLink = document.querySelector('a[href*="Previous"], .main-content a:has(> :contains("Previous"))');
      // Find prev/next links in the footer nav text
      var allLinks = mainContent.querySelectorAll('a');
      for (var i = 0; i < allLinks.length; i++) {
        if (allLinks[i].textContent.indexOf('←') !== -1 || allLinks[i].textContent.indexOf('Previous') !== -1) {
          window.location.href = allLinks[i].href;
          return;
        }
      }
    }

    // Right arrow or 'n' = Next chapter
    if (e.key === 'ArrowRight' || (e.key === 'n' && !e.ctrlKey && !e.metaKey)) {
      var allLinks2 = mainContent.querySelectorAll('a');
      for (var j = 0; j < allLinks2.length; j++) {
        if (allLinks2[j].textContent.indexOf('→') !== -1 || allLinks2[j].textContent.indexOf('Next') !== -1) {
          window.location.href = allLinks2[j].href;
          return;
        }
      }
    }

    // 't' = scroll to top
    if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // '?' = show keyboard shortcuts
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      showShortcutsModal();
    }
  });

  // Shortcuts modal
  function showShortcutsModal() {
    var existing = document.getElementById('shortcuts-modal');
    if (existing) { existing.remove(); return; }

    var modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
    modal.innerHTML = '<div style="background:#1a1040;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:2rem;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
      '<h3 style="color:#a855f7;margin:0 0 1rem;font-size:1.1rem;">⌨️ Keyboard Shortcuts</h3>' +
      '<div style="display:grid;grid-template-columns:auto 1fr;gap:0.5rem 1rem;font-size:0.9rem;">' +
      '<kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:monospace;color:#f0f0f5;">←</kbd><span style="color:#c8c8d8;">Previous chapter</span>' +
      '<kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:monospace;color:#f0f0f5;">→</kbd><span style="color:#c8c8d8;">Next chapter</span>' +
      '<kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:monospace;color:#f0f0f5;">t</kbd><span style="color:#c8c8d8;">Scroll to top</span>' +
      '<kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:monospace;color:#f0f0f5;">?</kbd><span style="color:#c8c8d8;">Show shortcuts</span>' +
      '</div>' +
      '<p style="color:#7a7a94;font-size:0.8rem;margin:1rem 0 0;">Press any key or click to close</p>' +
      '</div>';

    modal.addEventListener('click', function() { modal.remove(); });
    document.addEventListener('keydown', function closeModal(e) {
      if (e.key !== '?') { modal.remove(); document.removeEventListener('keydown', closeModal); }
    });
    document.body.appendChild(modal);
  }
});
