(function () {

  // ==========================================================================
  // STARFIELD
  // ==========================================================================

  var sf = document.getElementById('starfield');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sf) {
    for (var i = 0; i < 70; i++) {
      var s = document.createElement('div');
      s.className = 'star';
      var sz = Math.random() * 1.6 + 0.4;
      s.style.cssText =
        'width:' + sz + 'px;' +
        'height:' + sz + 'px;' +
        'left:' + Math.random() * 100 + '%;' +
        'top:' + Math.random() * 100 + '%;' +
        '--dur:' + (4 + Math.random() * 6) + 's;' +
        '--delay:' + (Math.random() * 6) + 's;' +
        '--lo:' + (0.05 + Math.random() * 0.1) + ';' +
        '--hi:' + (0.25 + Math.random() * 0.35);
      if (Math.random() > 0.8) s.style.background = 'rgba(201, 168, 76, 0.7)';
      if (reduceMotion) s.style.animation = 'none';
      sf.appendChild(s);
    }
  }


  // ==========================================================================
  // NAVIGATION - mobile menu
  // ==========================================================================

  var mobMenu = document.getElementById('mob-menu');
  var hamBtn  = document.getElementById('ham');

  function toggleMob() {
    if (!mobMenu || !hamBtn) return;
    var isOpen = mobMenu.classList.toggle('open');
    hamBtn.setAttribute('aria-expanded', String(isOpen));
  }

  function closeMob() {
    if (!mobMenu || !hamBtn) return;
    mobMenu.classList.remove('open');
    hamBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobMenu && hamBtn) {
    document.addEventListener('click', function (e) {
      if (mobMenu.classList.contains('open') && !mobMenu.contains(e.target) && !hamBtn.contains(e.target)) {
        closeMob();
      }
    });
    window.addEventListener('scroll', function () {
      if (mobMenu.classList.contains('open')) closeMob();
    }, { passive: true });
  }

  // active nav link highlight on scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  var navObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var id = e.target.getAttribute('id');
        navLinks.forEach(function (a) {
          a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(function (s) { navObs.observe(s); });


  // ==========================================================================
  // FADE IN ON SCROLL
  // ==========================================================================

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('show');
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.fade').forEach(function (el) { obs.observe(el); });


  // ==========================================================================
  // SCROLL TO TOP BUTTON
  // ==========================================================================

  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) window.addEventListener('scroll', function () {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });


  // ==========================================================================
  // HTML ESCAPING (for data-driven rendering)
  // ==========================================================================

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }


  // ==========================================================================
  // EXPERIENCE - render from data/experience.js
  // ==========================================================================

  // Color an experience chip by the Toolkit group that lists it,
  // matching on the tool name before any "(...)" detail.
  var _toneByTool = null;
  function toolTone(label) {
    if (typeof TOOLKIT === 'undefined') return null;
    if (!_toneByTool) {
      _toneByTool = {};
      TOOLKIT.forEach(function (g) {
        g.tools.concat(g.aliases || []).forEach(function (t) {
          var key = t.replace(/&amp;/g, '&').replace(/\s*\(.*\)$/, '').toLowerCase();
          _toneByTool[key] = g.tone;
        });
      });
    }
    return _toneByTool[label.toLowerCase()] || null;
  }

  function renderExperience() {
    var el = document.getElementById('exp-list');
    if (!el || typeof EXPERIENCE === 'undefined') return;

    el.innerHTML = EXPERIENCE.map(function (job) {
      var bulId = 'buls-' + job.id;
      var chipId = 'chips-' + job.id;
      var visBuls = job.visibleBullets || job.bullets.length;
      var visChips = job.visibleChips || job.chips.length;

      var buls = job.bullets.map(function (b, i) {
        return '<li' + (i >= visBuls ? ' class="exp-bul-hidden"' : '') + '>' + esc(b) + '</li>';
      }).join('');
      var bulToggle = job.bullets.length > visBuls
        ? '<button class="exp-bul-toggle" onclick="toggleBuls(\'' + bulId + '\', this)" data-more="Show all" data-less="Show less">Show all</button>'
        : '';

      var chips = job.chips.map(function (c, i) {
        var tone = toolTone(c);
        return '<span class="exp-chip' + (tone ? ' tone-' + tone : '') + (i >= visChips ? ' exp-chip-hidden' : '') + '">' + esc(c) + '</span>';
      }).join('');
      var hiddenCount = job.chips.length - visChips;
      var chipToggle = hiddenCount > 0
        ? '<button class="exp-chip-toggle" onclick="toggleChips(\'' + chipId + '\', this)">+' + hiddenCount + ' more</button>'
        : '';

      return '<div class="exp-item">' +
        '<div class="exp-line"><div class="exp-dot"></div><div class="exp-line-bar"></div></div>' +
        '<div>' +
          '<div class="exp-dates">' + esc(job.dates.replace(' - ', ' \u2013 ')) + '</div>' +
          '<div class="exp-co">' + esc(job.company) + ' &middot; ' + esc(job.location) + '</div>' +
          '<div class="exp-role">' + esc(job.role) + '</div>' +
          '<ul class="exp-buls" id="' + bulId + '">' + buls + '</ul>' +
          bulToggle +
          '<div class="exp-chips" id="' + chipId + '">' + chips + chipToggle + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  renderExperience();


  // ==========================================================================
  // TOOLKIT - render from data/toolkit.js
  // ==========================================================================

  function renderToolkit() {
    var el = document.getElementById('toolkit-grid');
    if (!el || typeof TOOLKIT === 'undefined') return;

    el.innerHTML = TOOLKIT.map(function (group) {
      var tone = group.tone ? ' tone-' + group.tone : '';
      return '<div class="toolkit-group' + tone + '">' +
        '<div class="toolkit-group-name">' + group.name + '</div>' +
        '<div class="toolkit-tools">' +
          group.tools.map(function (t) { return '<span class="toolkit-tool' + tone + '">' + t + '</span>'; }).join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  renderToolkit();


  // ==========================================================================
  // CERTIFICATIONS - render from data + expand / collapse groups
  // ==========================================================================

  function renderCertifications() {
    if (typeof CERTIFICATIONS === 'undefined') return;

    // Featured cards
    var featEl = document.getElementById('cert-featured');
    if (featEl) {
      featEl.innerHTML = CERTIFICATIONS.featured.map(function (cert) {
        var ac = cert.accent === 'copper' ? 'orange' : cert.accent;
        var inner =
          '<div class="cert-feat-card cert-feat-card--' + ac + '">' +
            '<div class="cert-feat-label cert-feat-label--' + ac + '">' + cert.category + '</div>' +
            '<div class="cert-feat-name">' + cert.name + '</div>' +
            '<div class="cert-feat-meta">' + cert.issuer + '</div>' +
          '</div>';
        return cert.link
          ? '<a href="' + cert.link + '" target="_blank" rel="noopener" class="cert-feat-link">' + inner + '</a>'
          : inner;
      }).join('');
    }

    // Group items
    var groupsEl = document.getElementById('cert-groups-all');
    if (groupsEl) {
      groupsEl.innerHTML = CERTIFICATIONS.groups.map(function (group) {
        var items = group.items.map(function (item) {
          var nameEl = item.link
            ? '<a href="' + item.link + '" target="_blank" rel="noopener" class="cert-link">' + item.name + '</a>'
            : '<span class="cert-name">' + item.name + '</span>';
          return '<div class="cert-item">' + nameEl + '<span class="cert-meta">' + item.issuer + '</span></div>';
        }).join('');
        return (
          '<div class="cert-group">' +
            '<button class="cert-group-header" aria-expanded="false" onclick="toggleCert(this.parentElement)">' +
              '<div><span class="cert-group-name">' + group.name + '</span><span class="cert-count">' + group.items.length + '</span></div>' +
              '<span class="cert-chevron"></span>' +
            '</button>' +
            '<div class="cert-group-body">' + items + '</div>' +
          '</div>'
        );
      }).join('');
    }
  }

  renderCertifications();

  function toggleCert(el) {
    var isOpen = el.classList.toggle('open');
    var hdr = el.querySelector('.cert-group-header');
    if (hdr) hdr.setAttribute('aria-expanded', String(isOpen));
  }

  function toggleBuls(id, btn) {
    var ul = document.getElementById(id);
    var expanded = ul.classList.toggle('expanded');
   btn.textContent = expanded ? btn.dataset.less : btn.dataset.more;
  }
  window.toggleBuls = toggleBuls;

  function toggleAllCerts(btn) {
    var el = document.getElementById('cert-groups-all');
    var visible = el.style.display === 'block';
    el.style.display = visible ? 'none' : 'block';
    btn.textContent = visible ? 'View all certifications' : 'Hide certifications';
  }
  window.toggleAllCerts = toggleAllCerts;

  // ==========================================================================
  // HOMEPAGE SELECTED WORK - featured projects from data/projects.js
  // ==========================================================================

  function renderFeaturedProjects() {
    var el = document.getElementById('home-featured-projects');
    if (!el || typeof PROJECTS === 'undefined') return;

    var CAT_LABELS = {
      automation: 'Automation',
      process: 'Process Improvement',
      data: 'Data and Analytics',
      financial: 'Financial Reporting',
      systems: 'Systems and IT'
    };

    var featured = PROJECTS.filter(function (p) { return p.featured; });
    el.innerHTML = featured.map(function (p) {
      var tools = (p.tools || []).slice(0, 3).map(function (t) {
        return '<span class="tool-chip">' + esc(t.label) + '</span>';
      }).join('');
      return '<a class="feat-proj-card" href="/projects/' + esc(p.slug) + '">' +
        '<div class="feat-proj-cat">' + esc(CAT_LABELS[p.category] || p.category) + '</div>' +
        '<div class="feat-proj-name">' + esc(p.name) + '</div>' +
        '<div class="feat-proj-impact">' + esc(p.impact || p.preview) + '</div>' +
        '<div class="feat-proj-tools">' + tools + '</div>' +
        '<div class="feat-proj-link">Read more &rarr;</div>' +
      '</a>';
    }).join('');
  }

  renderFeaturedProjects();

  // ==========================================================================
  // EXPERIENCE - expand / collapse chips
  // ==========================================================================

  function toggleChips(id, btn) {
    var wrap = document.getElementById(id);
    var expanded = wrap.classList.toggle('expanded');
    if (!btn.dataset.original) btn.dataset.original = btn.textContent;
    btn.textContent = expanded ? 'Show less' : btn.dataset.original;
  }


  // ==========================================================================
  // ABOUT - fun facts rotator
  // ==========================================================================

  var funPhrases = [
    "Has strong opinions about folder naming conventions.",
    "Outvoted by two cats on most major decisions.",
    "Has never met a process I didn't want to map.",
    "Has a color coding system for everything. Yes, everything.",
    "The person at every job who ends up knowing how everything works, whether it's their job or not.",
    "Gets unreasonably satisfied when an automation runs for the first time."
  ];

  var funOrder = [];

  function shuffleFun() {
    funOrder = funPhrases.map(function (v, i) { return i; }).sort(function () {
      return Math.random() - 0.5;
    });
  }
  shuffleFun();

  var funIdx = 0;

  function rotateFun() {
    var el = document.getElementById('fun-text');
    if (!el) return;
    if (funIdx >= funOrder.length) { shuffleFun(); funIdx = 0; }
    el.classList.remove('visible');
    setTimeout(function () {
      el.textContent = funPhrases[funOrder[funIdx]];
      funIdx++;
      el.classList.add('visible');
    }, 150);
  }


  // ==========================================================================
  // CONTACT MODAL
  // ==========================================================================

  var _modalTrigger = null;
  function openModal() {
    var modal = document.getElementById('contact-modal');
    if (!modal) return;
    _modalTrigger = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input, button, textarea, [tabindex]');
    if (first) first.focus();
  }

  function closeModal() {
    var modal = document.getElementById('contact-modal');
    if (!modal) return;
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (_modalTrigger) { _modalTrigger.focus(); _modalTrigger = null; }
  }

  function handleModalClick(e) {
    var modal = document.getElementById('contact-modal');
    if (!modal) return;
    if (e.target === modal) closeModal();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var modal = document.getElementById('contact-modal');
      if (modal && modal.classList.contains('open')) closeModal();
      var panel = document.getElementById('chat-panel');
      if (panel && panel.classList.contains('open')) panel.classList.remove('open');
    }
  });

  var _cf = document.getElementById('contact-form');
  if (_cf) _cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this;
    var btn = form.querySelector('.form-submit');
    var errEl = document.getElementById('form-error');
    if (btn.disabled) return;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    if (errEl) errEl.style.display = 'none';

    fetch('https://formspree.io/f/xvzwovee', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (r) {
      if (r.ok) {
        document.getElementById('modal-form-wrap').style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        form.reset();
      } else {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        if (errEl) errEl.style.display = 'block';
      }
    }).catch(function () {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      if (errEl) errEl.style.display = 'block';
    });
  });


  // ==========================================================================
  // EXPOSE GLOBALS (called from inline onclick handlers in HTML)
  // ==========================================================================

  window.rotateFun       = rotateFun;
  window.toggleChips     = toggleChips;
  window.openModal       = openModal;
  window.closeModal      = closeModal;
  window.handleModalClick = handleModalClick;
  window.toggleMob       = toggleMob;
  window.closeMob        = closeMob;
  window.toggleCert      = toggleCert;

})();