// Shared motion for the inner pages: scroll progress bar and fade-in on scroll.
(function(){
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  function prog(){ var m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')'; }
  window.addEventListener('scroll', prog, {passive:true}); prog();

  var sel = '.section-heading, .hero .lede, .media-frame, .feature-row, .catalogue-item, .cert-card, .academic-list article, .timeline article, .chapter, .repository-grid article, .route-grid article, .fyp-metric div, .stat-line';
  var items = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function(el){ return !el.closest('.rv'); });
  // stagger items that sit side by side in the same grid
  items.forEach(function(el){
    el.classList.add('rv');
    var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.setProperty('--i', Math.min(sibs % 4, 3));
  });
  function showAll(){ items.forEach(function(el){ el.classList.add('in'); }); }
  if (!('IntersectionObserver' in window)) { showAll(); return; }
  var fired = false;
  var io = new IntersectionObserver(function(es){ fired = true; es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -5% 0px'});
  items.forEach(function(el){ io.observe(el); });
  // if the observer never reports (very old browsers), show everything
  setTimeout(function(){ if (!fired) showAll(); }, 2500);
})();
