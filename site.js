// Shared motion for the inner pages: scroll progress bar, solid header and fade-in on scroll.
(function(){
  if (!document.querySelector('.progress')) {
    var b = document.createElement('div'); b.className = 'progress'; document.body.appendChild(b);
  }
  var bar = document.querySelector('.progress');
  function prog(){ var m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')'; }
  window.addEventListener('scroll', prog, {passive:true}); prog();

  var sel = '.rv, .head, .card, .gallery a, .rows li, .pair figure, ' +
            '.section-heading, .media-frame, .feature-row, .catalogue-item, .cert-card, .academic-list article, .timeline article, .chapter, .repository-grid article, .route-grid article, .fyp-metric div, .stat-line';
  var items = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function(el, i, all){
    return !el.closest('.phero') && !all.some(function(o){ return o !== el && o.contains(el); });
  });
  items.forEach(function(el){
    el.classList.add('rv');
    var i = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.setProperty('--i', i % 4);
  });
  function showAll(){ items.forEach(function(el){ el.classList.add('in'); }); }
  if (!('IntersectionObserver' in window)) { showAll(); return; }
  var fired = false;
  // once faded in, drop the reveal classes so hover effects on cards work again
  function settle(el){ setTimeout(function(){ el.classList.remove('rv', 'in'); el.style.removeProperty('--i'); }, 1700); }
  var io = new IntersectionObserver(function(es){ fired = true; es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); settle(e.target); } }); }, {rootMargin:'0px 0px -5% 0px'});
  items.forEach(function(el){ io.observe(el); });
  setTimeout(function(){ if (!fired) showAll(); }, 2500);
})();
