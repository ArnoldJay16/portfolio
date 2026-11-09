/* Renders every page from window.SITE (data/site.js). Edit the data, refresh, done. */
(function () {
  var S = window.SITE, B = document.body, page = B.dataset.page, root = "../".repeat(+B.dataset.depth || 0);
  var local = location.protocol === "file:";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  // Links: add index.html when opened from a folder (file://); stay clean when hosted
  var u = function (p) { var x = root + p; if (local && (x === "" || x.slice(-1) === "/")) x += "index.html"; return x; };
  var NAV = [["Home", "", "home"], ["About", "about/", "about"], ["Skills", "skills/", "skills"], ["Experience", "experience/", "experience"],
    ["Projects", "projects/", "projects"], ["Education", "education/", "education"], ["CV", "cv/", "cv"], ["Contact", "contact/", "contact"]];
  var P = S.projects || [];
  var img = function (src, alt, cls) { return '<img class="' + (cls || "") + '" src="' + esc(root + src) + '" alt="' + esc(alt) + '" loading="lazy" data-ph="' + esc(src) + '">'; };
  var norm = function (x) { return typeof x === "string" ? { src: x } : (x || {}); };
  // Zoomable image: clicking opens the viewer; title/description (optional) show beneath it
  var zimg = function (x, alt, cls) {
    var it = norm(x), a = it.title || alt;
    return '<button type="button" class="zoom z-' + (cls || "g") + '" data-src="' + esc(root + it.src) + '" data-alt="' + esc(a) + '" data-title="' + esc(it.title || "") + '" data-desc="' + esc(it.description || "") +
      '" aria-label="View larger: ' + esc(a) + '">' + img(it.src, a, cls) + "</button>";
  };
  // Thumbnail = the project's first gallery image, unless an optional "image" is set
  var thumbSrc = function (p) { return norm(p.image).src || (p.gallery && p.gallery[0] ? norm(p.gallery[0]).src : ""); };
  var tags = function (a) { return '<p class="tags">' + a.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>"; };
  var badge = function (t) { return '<span class="badge">' + t + "</span>"; };
  var ext = function (url, label, cls) { return url ? '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>" : ""; };
  var social = function () {
    return Object.keys(S.social || {}).filter(function (k) { return S.social[k]; }).map(function (k) {
      var nm = esc(k.charAt(0).toUpperCase() + k.slice(1));
      if (S.social[k].charAt(0) === "[") return '<span class="muted">' + nm + ": [add link]</span>"; // unfinished placeholder: text, not a link
      return '<a href="' + esc(S.social[k]) + '" target="_blank" rel="noopener noreferrer">' + esc(k.charAt(0).toUpperCase() + k.slice(1)) + "</a>"; }).join("");
  };
  var head = function (t, sub) { return '<section class="phead wrap"><h1>' + t + "</h1>" + (sub ? '<p class="lede">' + sub + "</p>" : "") + "</section>"; };

  // A missing image becomes a labelled placeholder that says where to put the file
  document.addEventListener("error", function (e) {
    var t = e.target; if (!t || t.tagName !== "IMG" || !t.dataset.ph) return;
    var d = document.createElement("div"); d.className = t.className + " ph"; d.setAttribute("role", "img"); d.setAttribute("aria-label", t.alt);
    d.innerHTML = "<span>Place image at<br><code>" + esc(t.dataset.ph) + "</code></span>"; t.replaceWith(d);
  }, true);

  function card(p) {
    var s = [p.name, p.description, p.category, p.type, p.year, p.status, p.role].concat(p.tech || []).join(" ").toLowerCase();
    return '<article class="card" data-cat="' + esc(p.category) + '" data-s="' + esc(s) + '"><a class="thumb" href="' + u("projects/" + p.slug + "/") + '">' +
      img(thumbSrc(p), "Thumbnail for " + p.name) + (p.placeholder ? badge("Sample") : "") + "</a>" +
      '<div class="cbody"><p class="meta">' + esc(p.category) + " · " + esc(p.year) + " · " + esc(p.status) + '</p><h3><a href="' + u("projects/" + p.slug + "/") + '">' + esc(p.name) + "</a></h3>" +
      "<p>" + esc(p.description) + "</p>" + tags(p.tech || []) + '<p class="role">Role: ' + esc(p.role) + '</p><p class="clinks"><a class="btn small" href="' + u("projects/" + p.slug + "/") + '">View project</a>' +
      ext(p.github, "Source", "") + ext(p.demo, "Demo", "") + "</p></div></article>";
  }

  var pages = {
    home: function () {
      var tag = S.tagline ? '<p class="tag">' + esc(S.tagline) + "</p>" : "";
      var cv = S.cvFile ? '<a class="btn ghost" href="' + esc(root + S.cvFile) + '" download>Download CV</a>' : "";
      var sel = P.slice(0, 3).map(card).join("");
      return '<section class="hero wrap"><figure class="portrait">' + img(S.photo, "Portrait of " + S.name) + "</figure>" +
        '<div class="htext"><p class="pill"><i></i>' + esc(S.availability) + "</p><h1>" + esc(S.name) + '</h1><p class="htitle">' + esc(S.title) + "</p>" + tag +
        '<p class="lede">' + esc(S.intro) + '</p><p class="cta"><a class="btn" href="' + u("projects/") + '">Explore my work</a>' + cv + '<a class="btn ghost" href="' + u("contact/") + '">Get in touch</a></p></div>' +
        '<a class="scroll" href="#selected" aria-label="Scroll to selected work"><span></span>Scroll</a></section>' +
        '<section class="wrap selected" id="selected"><div class="selhead"><h2>Selected work</h2><a href="' + u("projects/") + '">See all projects</a></div><div class="pgrid">' + sel + "</div></section>";
    },
    about: function () {
      var rows = [["Name", S.name], ["Title", S.title], ["Location", S.location], ["Email", S.email], ["Phone", S.phone], ["Education", S.education[0].degree + ", " + S.education[0].school], ["Occupation", S.occupation], ["Experience", S.years]];
      return head("About me", "Who I am and what I do.") + '<section class="wrap two"><div class="prose">' + S.bio.map(function (b) { return "<p>" + esc(b) + "</p>"; }).join("") +
        "<p>" + esc(S.philosophy) + "</p><h2>Career goals</h2><p>" + esc(S.goals) + '</p></div><aside class="panel"><dl>' +
        rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("") + '</dl><h2>Specialization</h2><ul class="plain">' +
        S.specialization.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></aside></section>";
    },
    skills: function () {
      return head("Skills", "Grouped by area, without made-up percentages.") + '<section class="wrap srows">' +
        Object.keys(S.skills).map(function (c) { return '<div class="srow"><h2>' + esc(c) + "</h2>" + tags(S.skills[c]) + "</div>"; }).join("") + "</section>";
    },
    experience: function () {
      var li = S.experience.map(function (x) {
        var list = function (t, a) { return a && a.length ? "<h3>" + t + "</h3><ul>" + a.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" : ""; };
        return '<li><p class="meta">' + esc(x.dates) + '</p><div><h2>' + esc(x.position) + " " + (x.placeholder ? badge("Dates to confirm") : "") + '</h2><p class="muted">' +
          esc(x.organization) + ", " + esc(x.location) + "</p>" + list("Responsibilities", x.responsibilities) + list("Accomplishments", x.accomplishments) + "</div></li>";
      }).join("");
      return head("Experience") + '<section class="wrap"><ol class="timeline">' + li + "</ol></section>";
    },
    education: function () {
      var ed = S.education.map(function (x) {
        return '<div class="srow"><p class="meta">' + esc(x.year) + "</p><div><h3>" + esc(x.degree) + "</h3><p>" + esc(x.school) + '</p><p class="muted">' + esc(x.major) + ". " + esc(x.note || "") + "</p></div></div>"; }).join("");
      var cr = (S.credentials || []).map(function (c) {
        return '<div class="srow"><p class="meta">' + esc(c.year) + "</p><div><h3>" + esc(c.name) + "</h3><p>" + esc(c.issuer) + "</p>" + (c.id ? '<p class="muted">ID: ' + esc(c.id) + "</p>" : "") + "</div></div>"; }).join("");
      return head("Education") + '<section class="wrap"><div class="srows">' + ed + "</div>" + (cr ? '<h2 class="sub">Certifications</h2><div class="srows">' + cr + "</div>" : "") + "</section>";
    },
    projects: function () {
      var cats = []; P.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); }); cats.sort();
      var chips = '<button class="chip on" data-f="all" type="button">All</button>' + cats.map(function (c) { return '<button class="chip" data-f="' + esc(c) + '" type="button">' + esc(c) + "</button>"; }).join("");
      return head("Projects", "Search by name, tool, category, or year.") + '<section class="wrap"><div class="filters"><label class="sr" for="q">Search projects</label>' +
        '<input id="q" type="search" placeholder="Search by name, tool, category, or year"><div class="chips" role="group" aria-label="Filter by category">' + chips + "</div></div>" +
        '<p id="count" class="muted" aria-live="polite"></p><div class="pgrid" id="grid">' + P.map(card).join("") + '</div><div id="empty" class="emptybox" hidden><h2>No projects match that search</h2><p>Try a different word, or clear the filters.</p><button class="btn ghost" id="clear" type="button">Clear filters</button></div></section>';
    },
    cv: function () {
      var b = S.cvFile ? '<a class="btn" href="' + esc(root + S.cvFile) + '" download>Download CV</a><a class="btn ghost" href="' + esc(root + S.cvFile) + '" target="_blank" rel="noopener noreferrer">View CV online</a>'
        : '<div class="notice"><p><strong>No CV yet.</strong> Add a PDF and set <code>cvFile</code> in data/site.js.</p></div>';
      var viewer = S.cvFile ? '<object class="cvbox" data="' + esc(root + S.cvFile) + '#view=FitH" type="application/pdf" aria-label="CV preview"><div class="notice"><p>Your browser can\'t show the CV here. Use the buttons above to open or download it.</p></div></object>' : "";
      return head("Curriculum vitae", "Read my CV below, or download a copy.") + ((S.analytics || {}).goatcounter ? '<div class="wrap cvstats"><p><strong class="st-v">…</strong><span>Visitors</span></p><p><strong class="st-d">…</strong><span>CV downloads</span></p></div>' : "") + '<section class="wrap"><p class="cta">' + b + "</p>" + viewer + "</section>";
    },
    contact: function () {
      var f = function (id, label, extra, tag) { return '<div class="f"><label for="' + id + '">' + label + "</label><" + (tag || "input") + ' id="' + id + '" ' + extra + '><small class="err" id="' + id + '-e"></small></div>'; };
      return head("Contact", "Send a message or reach me directly.") + '<section class="wrap two"><div class="prose"><dl class="plainl"><dt>Email</dt><dd><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></dd><dt>Phone</dt><dd>" + esc(S.phone) +
        "</dd><dt>Location</dt><dd>" + esc(S.location) + '</dd></dl><p class="soc">' + social() + '</p></div><form id="cf" novalidate data-endpoint="' + esc(S.formEndpoint) + '">' +
        f("n", "Name", 'name="name" required autocomplete="name"') + f("m", "Email", 'name="email" type="email" required autocomplete="email"') + f("s", "Subject", 'name="subject" required') +
        '<div class="f"><label for="b">Message</label><textarea id="b" name="message" rows="6" required></textarea><small class="err" id="b-e"></small></div>' +
        '<input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Send message</button><p id="status" role="status" aria-live="polite"></p></form></section>';
    },
    project: function () {
      var i = P.findIndex(function (p) { return p.slug === B.dataset.slug; });
      if (i < 0) return head("Project not found", '<a href="' + u("projects/") + '">Back to all projects</a>');
      var p = P[i], pv = P[(i - 1 + P.length) % P.length], nx = P[(i + 1) % P.length];
      document.title = p.name + " | " + S.name;
      var sec = function (t, x) { return x ? "<h2>" + t + "</h2><p>" + esc(x) + "</p>" : ""; }; // sections with no text are hidden
      var meta = [["Role", p.role], ["Year", p.year], ["Status", p.status], ["Category", p.category], ["Type", p.type]].map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
      var links = ext(p.url, "Live website", "btn ghost") + ext(p.github, "GitHub", "btn ghost") + ext(p.demo, "Demo", "btn ghost") + ext(p.docs, "Documentation", "btn ghost");
      var gal = (p.gallery || []).map(function (g, n) { var gi = norm(g); return "<figure>" + zimg(g, "Image " + (n + 1) + " of " + p.name) + (gi.title ? "<figcaption>" + esc(gi.title) + "</figcaption>" : "") + "</figure>"; }).join("");
      return '<article class="wrap case"><p class="meta"><a href="' + u("projects/") + '">Projects</a> / ' + esc(p.category) + "</p><h1>" + esc(p.name) + "</h1>" +
        (p.placeholder ? '<p class="notice">Sample project text. Replace it in data/site.js.</p>' : "") + (norm(p.image).src ? zimg(p.image, "Cover image for " + p.name, "cover") : "") +
        '<div class="two"><div class="prose">' + sec("Overview", p.overview) + sec("Objective", p.problem) + sec("Process and solution", p.process) +
        ((p.features || []).length ? "<h2>Key features</h2><ul>" + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" : "") + '</div><aside class="panel"><dl>' + meta + "</dl><h2>Tools</h2>" + tags(p.tech || []) +
        (links ? '<p class="cta">' + links + "</p>" : "") + "</aside></div>" + (gal ? '<h2>Gallery</h2><div class="gal">' + gal + "</div>" : "") +
        (P.length > 1 ? '<nav class="pn" aria-label="Other projects"><a href="' + u("projects/" + pv.slug + "/") + '">Previous: ' + esc(pv.name) + '</a><a href="' + u("projects/" + nx.slug + "/") + '">Next: ' + esc(nx.name) + "</a></nav>" : '<nav class="pn"><a href="' + u("projects/") + '">Back to all projects</a></nav>') + "</article>";
    }
  };

  var nav = NAV.map(function (n) { return '<li><a href="' + u(n[1]) + '"' + (n[2] === page || (page === "project" && n[2] === "projects") ? " aria-current=page" : "") + ">" + n[0] + "</a></li>"; }).join("");
  document.getElementById("app").innerHTML =
    '<a class="skip" href="#main">Skip to content</a><div class="shell"><aside class="side"><div class="sidetop"><a class="logo" href="' + u("") + '">' + esc(S.name) + '</a><p class="stitle">' + esc(S.title) + "</p></div>" +
    '<div class="tools"><button id="theme" aria-label="Switch colour theme" type="button"><span aria-hidden="true">◐</span></button><button id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu" type="button"><span></span><span></span></button></div>' +
    '<nav aria-label="Main"><ul id="menu">' + nav + '</ul></nav><div class="sidebot"><p class="soc">' + social() + '</p><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></div></aside>" +
    '<div class="col"><main id="main">' + pages[page]() + '</main><footer class="foot"><p class="flogo">' + esc(S.name) + '</p><p class="muted">' + esc(S.title) + '</p><p><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a></p><p class="soc">' + social() +
    '</p><ul class="fnav">' + nav + "</ul>" + ((S.analytics || {}).goatcounter ? '<p class="muted small stats">Visitors: <strong class="st-v">…</strong> · CV downloads: <strong class="st-d">…</strong></p>' : "") + '<p class="muted small">© ' + new Date().getFullYear() + " " + esc(S.name) + ". All rights reserved.</p></footer></div></div>";
  if (page !== "project") document.title = S.name + " | " + (page === "home" ? S.title : page.charAt(0).toUpperCase() + page.slice(1));

  // Theme (light by default, saved in localStorage)
  document.getElementById("theme").addEventListener("click", function () {
    var n = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = n;
    try { localStorage.setItem("theme", n); } catch (e) {}
  });
  var burger = document.getElementById("burger"), menu = document.getElementById("menu");
  burger.addEventListener("click", function () { var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { burger.click(); burger.focus(); } });

  // Search + filter
  var grid = document.getElementById("grid");
  if (grid) {
    var cards = [].slice.call(grid.children), q = document.getElementById("q"), chips = [].slice.call(document.querySelectorAll(".chip")),
      empty = document.getElementById("empty"), count = document.getElementById("count"), cat = "all";
    var run = function () {
      var term = q.value.trim().toLowerCase(), n = 0;
      cards.forEach(function (c) { var show = (cat === "all" || c.dataset.cat === cat) && (!term || c.dataset.s.indexOf(term) > -1); c.hidden = !show; if (show) n++; });
      empty.hidden = n > 0; count.textContent = n + (n === 1 ? " project" : " projects");
    };
    q.addEventListener("input", run);
    chips.forEach(function (b) { b.addEventListener("click", function () { cat = b.dataset.f; chips.forEach(function (x) { x.classList.toggle("on", x === b); }); run(); }); });
    document.getElementById("clear").addEventListener("click", function () { q.value = ""; chips[0].click(); q.focus(); });
    run();
  }

  // Image viewer (lightbox) for project images
  var zs = [].slice.call(document.querySelectorAll(".zoom"));
  if (zs.length) {
    var lb = document.createElement("div"); lb.className = "lb"; lb.hidden = true; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = '<button class="lb-x" type="button" aria-label="Close viewer">×</button><button class="lb-p" type="button" aria-label="Previous image">‹</button><button class="lb-n" type="button" aria-label="Next image">›</button>' +
      '<figure class="lb-f"><img alt=""><figcaption hidden></figcaption></figure>';
    document.body.appendChild(lb);
    var li = lb.querySelector("img"), cap = lb.querySelector("figcaption"), bx = lb.querySelector(".lb-x"), bp = lb.querySelector(".lb-p"), bn = lb.querySelector(".lb-n"), list = [], cur = 0, opener = null;
    var show = function (i) {
      cur = (i + list.length) % list.length; var z = list[cur];
      li.src = z.dataset.src; li.alt = z.dataset.alt;
      var t = z.dataset.title, d = z.dataset.desc;
      cap.innerHTML = (t ? "<strong>" + esc(t) + "</strong>" : "") + (d ? "<p>" + esc(d) + "</p>" : ""); cap.hidden = !(t || d);
      bp.hidden = bn.hidden = list.length < 2;
    };
    var close = function () { lb.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); };
    zs.forEach(function (z) {
      z.addEventListener("click", function () {
        if (!z.querySelector("img")) return; // missing image: nothing to zoom
        list = zs.filter(function (x) { return x.querySelector("img"); }); opener = z; show(list.indexOf(z));
        lb.hidden = false; document.body.style.overflow = "hidden"; bx.focus();
      });
    });
    bx.addEventListener("click", close); bp.addEventListener("click", function () { show(cur - 1); }); bn.addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft" && list.length > 1) show(cur - 1);
      else if (e.key === "ArrowRight" && list.length > 1) show(cur + 1);
      else if (e.key === "Tab") { var f = [bx, bp, bn].filter(function (b) { return !b.hidden; }), i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    });
  }

  // Contact form
  var f = document.getElementById("cf");
  if (f) {
    var status = document.getElementById("status"), ids = { name: "n", email: "m", subject: "s", message: "b" };
    f.addEventListener("submit", function (ev) {
      ev.preventDefault(); var ok = true, d = {};
      Object.keys(ids).forEach(function (k) {
        var el = document.getElementById(ids[k]), err = document.getElementById(ids[k] + "-e"), v = el.value.trim(), m = "";
        if (!v) m = "Enter your " + k + ".";
        else if (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) m = "Enter a valid email address.";
        else if (k === "message" && v.length < 10) m = "Write at least 10 characters.";
        err.textContent = m; el.setAttribute("aria-invalid", !!m); if (m && ok) el.focus(); if (m) ok = false; d[k] = v;
      });
      status.className = "";
      if (!ok) { status.textContent = "Please fix the highlighted fields."; status.className = "bad"; return; }
      if (f.elements._gotcha.value) return;
      var ep = f.dataset.endpoint;
      if (!ep) { status.textContent = "The form isn't connected yet, so nothing was sent. Email me directly instead."; status.className = "bad"; return; }
      status.textContent = "Sending…";
      fetch(ep, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw 0; f.reset(); status.textContent = "Message sent. Thank you!"; status.className = "ok"; })
        .catch(function () { status.textContent = "Sending failed. Please try again or email me directly."; status.className = "bad"; });
    });
  }

  // Analytics (optional): set "analytics" in data/site.js. Off when opened from a folder or localhost.
  var A = S.analytics || {};
  if (location.protocol !== "file:" && !/^(localhost|127\.)/.test(location.hostname)) {
    if (A.goatcounter) {
      var g = document.createElement("script"); g.async = true; g.src = "https://gc.zgo.at/count.js";
      g.setAttribute("data-goatcounter", "https://" + A.goatcounter + ".goatcounter.com/count"); document.head.appendChild(g);
    }
    if (A.ga4) {
      var gs = document.createElement("script"); gs.async = true; gs.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(A.ga4); document.head.appendChild(gs);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); }; window.gtag("js", new Date()); window.gtag("config", A.ga4);
    }
    // Count CV clicks: download vs view
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href$='.pdf']"); if (!a) return;
      var dl = a.hasAttribute("download");
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: dl ? "cv-download" : "cv-view", title: dl ? "CV download" : "CV view", event: true });
      if (window.gtag) window.gtag("event", dl ? "cv_download" : "cv_view", { file_name: a.getAttribute("href") });
    });
  }

  // Public counters in the footer (GoatCounter). Needs "Allow adding visitor counts on your website" turned on in its settings.
  if (A.goatcounter && document.querySelector(".st-v")) {
    var gc = function (path, cb) {
      var x = new XMLHttpRequest();
      x.onload = function () { var n = "0"; try { if (x.status === 200) n = JSON.parse(x.responseText).count; } catch (e) {} cb(n, x.status); };
      x.onerror = function () { cb("–", 0); };
      x.open("GET", "https://" + A.goatcounter + ".goatcounter.com/counter/" + encodeURIComponent(path) + ".json"); x.send();
    };
    var put = function (cls) { return function (n) { [].slice.call(document.querySelectorAll("." + cls)).forEach(function (el) { el.textContent = n; }); }; };
    gc("TOTAL", put("st-v"));
    gc("/cv-download", function (n, st) { if (st === 404) gc("cv-download", put("st-d")); else put("st-d")(n); });
  }
})();