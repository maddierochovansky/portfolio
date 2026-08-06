(function () {

  // ==========================================================================
  // STARFIELD
  // ==========================================================================

  var sf = document.getElementById('starfield');
  for (var i = 0; i < 130; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    var sz = Math.random() * 2 + 0.4;
    s.style.cssText =
      'width:' + sz + 'px;' +
      'height:' + sz + 'px;' +
      'left:' + Math.random() * 100 + '%;' +
      'top:' + Math.random() * 100 + '%;' +
      '--dur:' + (2 + Math.random() * 5) + 's;' +
      '--delay:' + (Math.random() * 6) + 's;' +
      '--lo:' + (0.05 + Math.random() * 0.15) + ';' +
      '--hi:' + (0.4 + Math.random() * 0.55);
    
    // Add random color variations
    if (Math.random() > 0.7) {
      s.style.background = 'rgba(201, 168, 76, 0.8)'; // Gold stars
    } else if (Math.random() > 0.9) {
      s.style.background = 'rgba(241, 175, 167, 0.8)'; // Pink stars
    }
    
    sf.appendChild(s);
  }


  // ==========================================================================
  // METEORS
  // ==========================================================================

  var cv = document.getElementById('meteors');
  if (cv) {
  var ctx = cv.getContext('2d');

  function rsz() {
    cv.width = innerWidth;
    cv.height = innerHeight;
  }
  rsz();
  window.addEventListener('resize', rsz);

  function Meteor(init) {
    this.reset(init);
  }

  Meteor.prototype.reset = function (init) {
    this.x = Math.random() * innerWidth * 1.4 - innerWidth * 0.2;
    this.y = init ? Math.random() * -innerHeight : -80;
    this.len = 90 + Math.random() * 130;
    this.spd = 1.6 + Math.random() * 2.2;
    this.ang = Math.PI / 4 + (Math.random() - 0.5) * 0.25;
    this.w = 0.4 + Math.random() * 0.9;
    this.life = 0;
    this.maxLife = 70 + Math.random() * 110;
    this.peak = 0.25 + Math.random() * 0.4;
  };

  Meteor.prototype.draw = function () {
    this.life++;
    var fi = 18, fo = 22, a;
    if (this.life < fi) {
      a = (this.life / fi) * this.peak;
    } else if (this.life > this.maxLife - fo) {
      a = ((this.maxLife - this.life) / fo) * this.peak;
    } else {
      a = this.peak;
    }
    if (this.life >= this.maxLife) this.reset();

    var tx = this.x - Math.cos(this.ang) * this.len;
    var ty = this.y - Math.sin(this.ang) * this.len;
    this.x += Math.cos(this.ang) * this.spd;
    this.y += Math.sin(this.ang) * this.spd;

    var g = ctx.createLinearGradient(tx, ty, this.x, this.y);
    g.addColorStop(0, 'transparent');
    g.addColorStop(1, 'rgba(201,168,76,' + a + ')');
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = g;
    ctx.lineWidth = this.w;
    ctx.stroke();
  };

  var meteors = [];
  var animPaused = false;
  var animFrame = null;

  for (var i = 0; i < 10; i++) meteors.push(new Meteor(true));

  function animLoop() {
    if (animPaused) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (var i = 0; i < meteors.length; i++) meteors[i].draw();
    animFrame = requestAnimationFrame(animLoop);
  }
  animLoop();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      animPaused = true;
      if (animFrame) cancelAnimationFrame(animFrame);
    } else {
      animPaused = false;
      animLoop();
    }
  });

  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        if (animPaused && !document.hidden) { animPaused = false; animLoop(); }
      } else {
        animPaused = true;
        if (animFrame) cancelAnimationFrame(animFrame);
      }
    });
  }, { threshold: 0 }).observe(cv);
  } // end if (cv)


  // ==========================================================================
  // NAVIGATION - mobile menu
  // ==========================================================================

  function toggleMob() {
  var ham = document.getElementById('ham');
  var isOpen = document.getElementById('mob-menu').classList.toggle('open');
  ham.setAttribute('aria-expanded', String(isOpen));
}

function closeMob() {
  document.getElementById('mob-menu').classList.remove('open');
  document.getElementById('ham').setAttribute('aria-expanded', 'false');
}
  document.addEventListener('click', function (e) {
    var m = document.getElementById('mob-menu');
    if (
      m.classList.contains('open') &&
      !m.contains(e.target) &&
      !document.getElementById('ham').contains(e.target)
    ) {
      m.classList.remove('open');
      document.getElementById('ham').setAttribute('aria-expanded', 'false')
    }
  });
  window.addEventListener('scroll', function () {
    var m = document.getElementById('mob-menu');
    if (m.classList.contains('open')) m.classList.remove('open');
    document.getElementById('ham').setAttribute('aria-expanded', 'false')
  }, { passive: true });

  // ==========================================================================
  // NAV DROPDOWN - JS click toggle
  // CSS :hover alone breaks on touch devices and has a gap issue on desktop
  // ==========================================================================

  var _dropdownBtn  = document.querySelector('.nav-dropdown-btn');
  var _dropdownMenu = document.querySelector('.nav-dropdown-menu');

  if (_dropdownBtn && _dropdownMenu) {
    _dropdownBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = _dropdownMenu.classList.toggle('open');
      _dropdownBtn.setAttribute('aria-expanded', String(isOpen));
    });

    _dropdownMenu.addEventListener('click', function () {
      _dropdownMenu.classList.remove('open');
      _dropdownBtn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', function (e) {
      if (!_dropdownBtn.contains(e.target) && !_dropdownMenu.contains(e.target)) {
        _dropdownMenu.classList.remove('open');
        _dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _dropdownMenu.classList.contains('open')) {
        _dropdownMenu.classList.remove('open');
        _dropdownBtn.setAttribute('aria-expanded', 'false');
        _dropdownBtn.focus();
      }
    });
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
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  });


  // ==========================================================================
  // PROJECT CARDS - expand / collapse
  // ==========================================================================

  function toggleProj(el) {
    var isOpen = el.classList.toggle('open');
    var btn = el.querySelector('.proj-toggle');
    if (btn) btn.setAttribute('aria-expanded', String(isOpen));
  }

  // hide non-automation projects on load (default filter state)
  document.querySelectorAll('.proj[data-cat]').forEach(function (p) {
    if (p.dataset.cat !== 'automation') p.classList.add('hidden');
  });

  function filterProj(cat, btn) {
    document.querySelectorAll('.proj-filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    document.querySelectorAll('.proj[data-cat]').forEach(function (p) {
      if (cat === 'all' || p.dataset.cat === cat) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
        if (p.classList.contains('open')) toggleProj(p);
      }
    });
  }


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
  // HOMEPAGE PROJECT SHOWCASE - data-driven
  // ==========================================================================

  function renderHomeProjectShowcase() {
    if (typeof PROJECTS === 'undefined') return;

    var featuredEl = document.getElementById('home-featured-projects');
    var lanesEl = document.getElementById('home-project-lanes');
    var proofEl = document.getElementById('projects-proof');
    if (!featuredEl || !lanesEl || !proofEl) return;

    var CAT_LABELS = {
      automation: 'Automation',
      process: 'Process Improvement',
      data: 'Data and Analytics',
      financial: 'Financial Reporting',
      systems: 'Systems and IT',
      web: 'Web and Digital'
    };
    var CAT_ORDER = ['automation', 'process', 'data', 'financial', 'systems', 'web'];

    function esc(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function trunc(str, n) {
      if (!str || str.length <= n) return str || '';
      return str.slice(0, n - 1).trim() + '...';
    }

    function buildToolChips(project) {
      if (!project.tools || !project.tools.length) return '';
      return project.tools.slice(0, 3).map(function (tool) {
        var tClass = tool.type ? ' tc-' + esc(tool.type) : '';
        return '<span class="tool-chip' + tClass + '">' + esc(tool.label) + '</span>';
      }).join('');
    }

    var total = PROJECTS.length;
    var complete = PROJECTS.filter(function (p) { return p.status === 'complete'; }).length;
    var ongoing = PROJECTS.filter(function (p) { return p.status === 'ongoing'; }).length;
    var autoSystems = PROJECTS.filter(function (p) { return p.category === 'automation' || p.category === 'systems'; }).length;

    proofEl.innerHTML = [
      { value: total + '+', label: 'Documented projects' },
      { value: complete, label: 'Completed builds' },
      { value: ongoing, label: 'Active initiatives' },
      { value: autoSystems, label: 'Automation and systems projects' }
    ].map(function (metric) {
      return '<div class="project-proof-chip">' +
        '<div class="project-proof-value">' + esc(metric.value) + '</div>' +
        '<div class="project-proof-label">' + esc(metric.label) + '</div>' +
      '</div>';
    }).join('');

    var featured = PROJECTS.filter(function (p) { return p.featured; }).slice(0, 4);
    if (!featured.length) featured = PROJECTS.slice(0, 4);

    featuredEl.innerHTML = featured.map(function (p) {
      var catLabel = CAT_LABELS[p.category] || p.category;
      return '<a class="feat-proj-card" href="/projects/' + esc(p.slug) + '">' +
        '<div class="feat-proj-cat">' + esc(catLabel) + '</div>' +
        '<div class="feat-proj-name">' + esc(p.name) + '</div>' +
        '<div class="feat-proj-outcome">Outcome</div>' +
        '<div class="feat-proj-impact">' + esc(p.impact || p.preview || '') + '</div>' +
        '<div class="feat-proj-tools">' + buildToolChips(p) + '</div>' +
        '<div class="feat-proj-link">Read case study &rarr;</div>' +
      '</a>';
    }).join('');

    lanesEl.innerHTML = CAT_ORDER.map(function (cat) {
      var items = PROJECTS.filter(function (p) { return p.category === cat; });
      if (!items.length) return '';

      var lead = items.find(function (p) { return p.featured; }) || items[0];
      return '<a class="projects-lane-link" href="/projects?cat=' + esc(cat) + '">' +
        '<div class="projects-lane-top">' +
          '<span class="projects-lane-name">' + esc(CAT_LABELS[cat] || cat) + '</span>' +
          '<span class="projects-lane-count">' + esc(items.length) + ' projects</span>' +
        '</div>' +
        '<div class="projects-lane-note">' + esc(trunc(lead.impact || lead.preview || '', 88)) + '</div>' +
      '</a>';
    }).join('');
  }

  renderHomeProjectShowcase();

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
  // EXPOSE GLOBALS
  // (called from inline onclick handlers in HTML - will be cleaned up later)
  // ==========================================================================

  function injectProjectFlowCta() {
    var projWrap = document.querySelector('.proj-page .wrap');
    if (!projWrap || document.querySelector('.proj-page-flow')) return;

    var flow = document.createElement('div');
    flow.className = 'proj-page-section proj-page-flow fade';
    flow.innerHTML =
      '<div class="proj-page-section-label">What Next</div>' +
      '<p class="proj-flow-copy">If this project looks similar to what your team is dealing with, start with the portfolio for role fit or use the work-with-me page for project-based support.</p>' +
      '<div class="proj-flow-actions">' +
        '<a href="/projects" class="btn-outline">Browse All Projects</a>' +
        '<a href="/work-with-me" class="btn-gold">Work With Me</a>' +
      '</div>';

    projWrap.appendChild(flow);
    if (typeof obs !== 'undefined') obs.observe(flow);
  }

  injectProjectFlowCta();

  window.filterProj      = filterProj;
  window.rotateFun       = rotateFun;
  window.toggleChips     = toggleChips;
  window.openModal       = openModal;
  window.closeModal      = closeModal;
  window.handleModalClick = handleModalClick;
  window.toggleMob       = toggleMob;
  window.closeMob        = closeMob;
  window.toggleProj      = toggleProj;
  window.toggleCert      = toggleCert;

})();