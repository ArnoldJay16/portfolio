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
  var tags = function (a) { return '<p class="tags">' + a.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>"; };
  var badge = function (t) { return '<span class="badge">' + t + "</span>"; };
  var ext = function (url, label, cls) { return url ? '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>" : ""; };
  var social = function () {
    return Object.keys(S.social || {}).filter(function (k) { return S.social[k]; }).map(function (k) {
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
      img(p.image, "Cover image for " + p.name) + (p.placeholder ? badge("Sample") : "") + "</a>" +
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
        "<h2>Creative philosophy</h2><p>" + esc(S.philosophy) + "</p><h2>Career goals</h2><p>" + esc(S.goals) + '</p></div><aside class="panel"><dl>' +
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
      return head("Curriculum vitae", "Download my latest CV, or read it in your browser.") + '<section class="wrap"><p class="cta">' + b + "</p></section>";
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
      var meta = [["Role", p.role], ["Year", p.year], ["Status", p.status], ["Category", p.category], ["Type", p.type]].map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
      var links = ext(p.url, "Live website", "btn ghost") + ext(p.github, "GitHub", "btn ghost") + ext(p.demo, "Demo", "btn ghost") + ext(p.docs, "Documentation", "btn ghost");
      var gal = (p.gallery || []).map(function (g, n) { return img(g, "Image " + (n + 1) + " of " + p.name); }).join("");
      return '<article class="wrap case"><p class="meta"><a href="' + u("projects/") + '">Projects</a> / ' + esc(p.category) + "</p><h1>" + esc(p.name) + "</h1>" +
        (p.placeholder ? '<p class="notice">Sample project text. Replace it in data/site.js.</p>' : "") + img(p.image, "Cover image for " + p.name, "cover") +
        '<div class="two"><div class="prose"><h2>Overview</h2><p>' + esc(p.overview) + "</p><h2>Objective</h2><p>" + esc(p.problem) + "</p><h2>Process and solution</h2><p>" + esc(p.process) +
        "</p><h2>Key features</h2><ul>" + (p.features || []).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + '</ul></div><aside class="panel"><dl>' + meta + "</dl><h2>Tools</h2>" + tags(p.tech || []) +
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
    '</p><ul class="fnav">' + nav + '</ul><p class="muted small">© ' + new Date().getFullYear() + " " + esc(S.name) + ". All rights reserved.</p></footer></div></div>";
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
})();
