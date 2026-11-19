// Shared interactions: progress bar, header, phone menu, page transitions, cursor, magnetic buttons,
// tilt cards, word reveals, rotating role, project filter, lightbox, back-to-top, fade-ins and counters.
(function(){
  var root = document.documentElement;
  root.classList.add('js');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- progress, header, back-to-top ---------- */
  if (!document.querySelector('.progress')) { var pb = document.createElement('div'); pb.className = 'progress'; document.body.appendChild(pb); }
  var bar = document.querySelector('.progress'), top = document.getElementById('top');
  var tt = document.createElement('button');
  tt.className = 'totop'; tt.setAttribute('aria-label', 'Back to top');
  tt.innerHTML = '<svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="25"/></svg><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(tt);
  var ring = tt.querySelector('circle');
  tt.addEventListener('click', function(){ window.scrollTo({top: 0, behavior: 'smooth'}); });
  function onScroll(){
    var m = document.documentElement.scrollHeight - innerHeight, p = m > 0 ? scrollY / m : 0;
    bar.style.transform = 'scaleX(' + p + ')';
    ring.style.strokeDashoffset = 157 * (1 - p);
    tt.classList.toggle('show', scrollY > 600);
    if (top) top.classList.toggle('scrolled', scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, {passive: true}); onScroll();

  /* ---------- phone menu ---------- */
  var mb = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (mb && nav) {
    mb.addEventListener('click', function(){ mb.setAttribute('aria-expanded', nav.classList.toggle('open')); });
    nav.addEventListener('click', function(e){ if (e.target.tagName === 'A') nav.classList.remove('open'); });
  }

  /* ---------- page transitions: native view transitions, with a fade fallback ---------- */
  if (!('onpagereveal' in window)) {
    document.body.classList.add('entering');
    document.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || a.hasAttribute('data-lb')) return;
      var href = a.getAttribute('href') || '';
      if (!/^[\w-]+\.html(#.*)?$/.test(href) || a.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function(){ location.href = a.href; }, 280);
    });
    window.addEventListener('pageshow', function(){ document.body.classList.remove('leaving'); });
  }

  /* ---------- custom cursor, magnetic buttons, tilt, hero parallax (mouse only) ---------- */
  if (fine) {
    var dot = document.createElement('div'), cr = document.createElement('div');
    dot.className = 'cursor-dot'; cr.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(cr);
    var mx = -100, my = -100, rx = -100, ry = -100, running = false;
    function loop(){
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      cr.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      if (Math.abs(mx - rx) + Math.abs(my - ry) > .3) requestAnimationFrame(loop); else running = false;
    }
    document.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY; document.body.classList.add('cursor-on');
      if (!running) { running = true; requestAnimationFrame(loop); }
    });
    document.addEventListener('mouseleave', function(){ document.body.classList.remove('cursor-on'); });
    document.addEventListener('mouseover', function(e){ document.body.classList.toggle('cursor-hover', !!e.target.closest('a, button, [data-lb]')); });

    document.querySelectorAll('.btn, .social a, .filters button').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * .25 + 'px,' + y * .3 + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });

    document.querySelectorAll('.pcard figure, .news figure, .card .pic, .cta figure').forEach(function(el){
      el.classList.add('tilt');
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      var g = document.createElement('span'); g.className = 'glare'; el.appendChild(g);
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = 'perspective(800px) rotateY(' + (x - .5) * 10 + 'deg) rotateX(' + (.5 - y) * 10 + 'deg)';
        el.style.setProperty('--gx', x * 100 + '%'); el.style.setProperty('--gy', y * 100 + '%');
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });

    var hero = document.querySelector('.hero'), hbg = document.querySelector('.hero-bg');
    if (hero && hbg) {
      hero.addEventListener('mousemove', function(e){
        var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        hbg.style.transform = 'scale(1.06) translate(' + (-x * 22) + 'px,' + (-y * 16) + 'px)';
      });
      hero.addEventListener('mouseleave', function(){ hbg.style.transform = ''; });
    }
  }

  /* ---------- rotating role, typed out ---------- */
  var rot = document.querySelector('.rotator');
  if (rot) {
    var words = rot.getAttribute('data-words').split('|'), wi = 0, ci = words[0].length, del = true;
    setTimeout(function tick(){
      if (del) { ci--; if (ci <= 0) { del = false; ci = 0; wi = (wi + 1) % words.length; } }
      else { ci++; if (ci >= words[wi].length) { rot.textContent = words[wi]; del = true; setTimeout(tick, 1800); return; } }
      rot.textContent = words[wi].slice(0, ci) || ' ';
      setTimeout(tick, del ? 40 : 75);
    }, 2600);
  }

  /* ---------- word-by-word heading reveal ---------- */
  var heads = Array.prototype.slice.call(document.querySelectorAll('.head h2, .sec-title, .phero h1, .chapter h3'));
  heads.forEach(function(h){
    var n = 0;
    (function wrap(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(c){
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(part){
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var o = document.createElement('span'); o.className = 'w';
            var i = document.createElement('span'); i.textContent = part; i.style.setProperty('--wi', n++);
            o.appendChild(i); frag.appendChild(o);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') wrap(c);
      });
    })(h);
    h.classList.add('words');
  });

  /* ---------- project filter ---------- */
  var fbtns = document.querySelectorAll('.filters button');
  fbtns.forEach(function(b){
    b.addEventListener('click', function(){
      fbtns.forEach(function(x){ x.classList.toggle('on', x === b); });
      var f = b.getAttribute('data-f');
      document.querySelectorAll('.pcard').forEach(function(c){
        var show = f === 'all' || (' ' + c.getAttribute('data-cat') + ' ').indexOf(' ' + f + ' ') > -1;
        c.classList.toggle('out', !show);
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lbItems = Array.prototype.slice.call(document.querySelectorAll('[data-lb]'));
  if (lbItems.length) {
    var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img alt=""><p></p><button class="x" aria-label="Close">×</button><button class="prev" aria-label="Previous">‹</button><button class="next" aria-label="Next">›</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p'), cur = 0;
    var info = function(el){
      var a = el.tagName === 'A' ? el : null, img = el.querySelector('img');
      var cap = el.querySelector('figcaption');
      return {s: (a && a.getAttribute('href')) || (img && img.getAttribute('src')), c: (cap && cap.textContent) || (img && img.getAttribute('alt')) || ''};
    };
    var show = function(i){ cur = (i + lbItems.length) % lbItems.length; var d = info(lbItems[cur]); lbImg.src = d.s; lbImg.alt = d.c; lbCap.textContent = d.c; };
    var close = function(){ lb.classList.remove('open'); };
    lbItems.forEach(function(el, i){ el.addEventListener('click', function(e){ e.preventDefault(); show(i); lb.classList.add('open'); }); });
    lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', function(){ show(cur - 1); });
    lb.querySelector('.next').addEventListener('click', function(){ show(cur + 1); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---------- fade-ins, heading reveals and counters on scroll ---------- */
  var sel = '.rv, .head, .card, .pcard, .svc article, .counts div, .news a, .places li, .mosaic figure, .cta > *, .gallery a, .rows li, .pair figure, .step, .chapter, .code, .dgrid figure, .bigvid, .bigimg, .nums div, .foot .cols > div, .filters';
  var items = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function(el, i, all){
    return !el.closest('.hero') && !el.closest('.phero') && !all.some(function(o){ return o !== el && o.contains(el); });
  });
  items.forEach(function(el){
    el.classList.add('rv');
    var i = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.setProperty('--i', i % 6);
  });
  function settle(el){ setTimeout(function(){ el.classList.remove('rv', 'in'); el.style.removeProperty('--i'); }, 1500); }
  function showAll(){ items.forEach(function(el){ el.classList.add('in'); }); heads.forEach(function(h){ h.classList.add('shown'); }); }
  if (!('IntersectionObserver' in window)) { showAll(); return; }
  var fired = false;
  var io = new IntersectionObserver(function(es){ fired = true; es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); settle(e.target); } }); }, {rootMargin: '0px 0px -6% 0px'});
  items.forEach(function(el){ io.observe(el); });
  var ho = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('shown'); ho.unobserve(e.target); } }); }, {rootMargin: '0px 0px -4% 0px'});
  heads.forEach(function(h){ ho.observe(h); });
  setTimeout(function(){ if (!fired) showAll(); }, 2500);

  var co = new IntersectionObserver(function(es){ es.forEach(function(e){
    if (!e.isIntersecting) return; co.unobserve(e.target);
    var b = e.target, n = parseFloat(b.getAttribute('data-n')), d = +(b.getAttribute('data-d') || 0), s = b.getAttribute('data-s') || '', t0 = performance.now();
    var em = b.querySelector('em'), suffix = em ? em.outerHTML : '';
    (function step(t){ var p = Math.min(1, (t - t0) / 1600); b.innerHTML = (n * (1 - Math.pow(1 - p, 3))).toFixed(d) + s + suffix; if (p < 1) requestAnimationFrame(step); })(t0);
  }); }, {threshold: .5});
  document.querySelectorAll('b[data-n]').forEach(function(b){ co.observe(b); });
})();

/* ===== liquid glass: refraction filter, moving highlight, photo tags ===== */
(function(){
  var root = document.documentElement;
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = '<filter id="lg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="4" result="n"/><feGaussianBlur in="n" stdDeviation="2" result="nb"/><feDisplacementMap in="SourceGraphic" in2="nb" scale="34" xChannelSelector="R" yChannelSelector="G"/></filter>';
  document.body.appendChild(svg);
  // Chromium renders SVG filters inside backdrop-filter; other engines keep the frosted blur
  if (window.chrome) root.classList.add('lg-refract');

  var labels = {research: 'Research', ai: 'AI', hardware: 'Hardware'};
  document.querySelectorAll('.pcard[data-cat]').forEach(function(c){
    var f = c.querySelector('figure'); if (!f) return;
    var t = document.createElement('span'); t.className = 'ptag';
    t.textContent = c.getAttribute('data-cat').split(' ').map(function(k){ return labels[k] || k; }).join(' \u00b7 ');
    f.appendChild(t);
  });

  var GSEL = '.top .wrap,.social a,.btn,.chips span,.chips a,.filters button,.totop,.lb button,.lb p,.dgrid figcaption,.ptag';
  document.addEventListener('pointermove', function(e){
    var el = e.target.closest && e.target.closest(GSEL); if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, {passive: true});
})();

/* ===== hero: live EEG traces with a stimulus-locked P300 bump ===== */
(function(){
  var cv = document.querySelector('.hero-eeg'); if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
  var names = ['Fz', 'Cz', 'Pz', 'P3', 'P4', 'PO7', 'PO8', 'Oz'], ch = [];
  for (var i = 0; i < names.length; i++) ch.push({fa: 8.5 + Math.random() * 3, ft: 4 + Math.random() * 2.5, fb: 16 + Math.random() * 8, p: Math.random() * 6.28, q: Math.random() * 6.28, g: .6 + .5 * (i > 1 && i < 7)});
  var PX = 240, EPOCH = 3.2, t0 = performance.now(), running = false, visible = true;
  function size(){ var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function sig(c, u){
    var v = .5 * Math.sin(6.283 * c.fa * u + c.p) + .32 * Math.sin(6.283 * c.ft * u + c.q) + .14 * Math.sin(6.283 * c.fb * u + c.p * 2) + .1 * Math.sin(u * 211 + c.q) * Math.sin(u * 37);
    var e = ((u % EPOCH) + EPOCH) % EPOCH;
    v -= c.g * 1.9 * Math.exp(-Math.pow(e - .3, 2) / .0035);   // positive deflection ~300 ms after the marker (drawn upward)
    v += c.g * .7 * Math.exp(-Math.pow(e - .18, 2) / .0012);
    return v;
  }
  function draw(now){
    var t = (now - t0) / 1000, n = ch.length, lane = H * .84 / n, top = H * .1, amp = lane * .26;
    ctx.clearRect(0, 0, W, H);
    // stimulus markers
    ctx.lineWidth = 1; ctx.setLineDash([3, 6]); ctx.strokeStyle = 'rgba(230,86,22,.22)';
    var first = Math.ceil(t / EPOCH) * EPOCH;
    for (var m = first; (m - t) * PX < W; m += EPOCH) { var mx = (m - t) * PX; ctx.beginPath(); ctx.moveTo(mx, top - 10); ctx.lineTo(mx, top + lane * n); ctx.stroke(); }
    ctx.setLineDash([]);
    ctx.font = '600 11px "DM Sans", sans-serif'; ctx.textAlign = 'right';
    for (var k = 0; k < n; k++) {
      var c = ch[k], y0 = top + lane * (k + .5), grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(230,86,22,.08)'); grad.addColorStop(.55, 'rgba(230,86,22,.32)'); grad.addColorStop(1, 'rgba(230,86,22,.6)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.3; ctx.beginPath();
      for (var x = 0; x <= W; x += 3) { var y = y0 + amp * sig(c, t + x / PX); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = 'rgba(189,189,189,.45)'; ctx.fillText(names[k], W - 14, y0 - lane * .28);
    }
  }
  function loop(now){ if (!running) return; draw(now); requestAnimationFrame(loop); }
  function start(){ if (!running && visible && W) { running = true; requestAnimationFrame(loop); } }
  size(); draw(performance.now()); start();
  window.addEventListener('resize', function(){ size(); draw(performance.now()); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) start(); else running = false; }).observe(cv);
  document.addEventListener('visibilitychange', function(){ if (document.hidden) running = false; else start(); });
})();

/* portrait frame tilts with the mouse */
(function(){
  var f = document.querySelector('.hero-photo');
  if (!f || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  f.classList.add('tilt');
  f.addEventListener('mousemove', function(e){
    var r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    f.style.transform = 'perspective(900px) rotateY(' + (x - .5) * 12 + 'deg) rotateX(' + (.5 - y) * 12 + 'deg)';
    f.style.setProperty('--mx', x * 100 + '%'); f.style.setProperty('--my', y * 100 + '%');
  });
  f.addEventListener('mouseleave', function(){ f.style.transform = ''; });
})();
