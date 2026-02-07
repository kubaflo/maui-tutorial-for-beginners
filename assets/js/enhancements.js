// Reading Progress Bar + Scroll to Top + Table of Contents
document.addEventListener('DOMContentLoaded', function() {
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
});
