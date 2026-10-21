#!/usr/bin/env python3
"""Generates the portfolio from data/site.json. Run: python3 build.py"""
import json, html, shutil
from pathlib import Path

R = Path(__file__).parent
D = json.loads((R / "data/site.json").read_text(encoding="utf-8"))
e = lambda s: html.escape(str(s), quote=True)
URL = D["siteUrl"].rstrip("/")
NAV = [("Home", ""), ("About", "about/"), ("Skills", "skills/"), ("Experience", "experience/"),
       ("Projects", "projects/"), ("Education", "education/"), ("CV", "cv/"), ("Contact", "contact/")]
PAL = [("#7A1F3D", "#B58A98"), ("#B58A98", "#7A1F3D"), ("#4A1426", "#B58A98"), ("#E0CFD4", "#7A1F3D"), ("#6E5560", "#E0CFD4")]
CV_OK = (R / D["cvFile"]).exists()
P = D["projects"]


def art(seed, v, w=800, h=600, bg="#EFE3E6"):
    a, b = PAL[seed % len(PAL)]
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="{bg}"/>'
    if v == 0:
        s += f'<circle cx="{w*.64}" cy="{h*.42}" r="{h*.27}" fill="{a}"/><path d="M{w*.1} {h} V{h*.55} a{w*.15} {w*.15} 0 0 1 {w*.3} 0 V{h}z" fill="{b}"/>'
    elif v == 1:
        s += f'<rect x="{w*.12}" y="{h*.18}" width="{w*.34}" height="{h*.64}" fill="{b}"/><circle cx="{w*.66}" cy="{h*.62}" r="{h*.2}" fill="{a}"/>'
    else:
        s += f'<path d="M0 {h*.8} Q{w*.3} {h*.3} {w*.6} {h*.6} T{w} {h*.4}" stroke="{a}" stroke-width="{h*.06}" fill="none"/><circle cx="{w*.25}" cy="{h*.3}" r="{h*.12}" fill="{b}"/>'
    return s + "</svg>"


img_dir = R / "assets/img"
for i, p in enumerate(P):
    for v in range(3):
        (img_dir / f"{p['slug']}-{v}.svg").write_text(art(i, v), encoding="utf-8")
(img_dir / "portrait.svg").write_text(art(0, 0, 600, 750, "#E0CFD4"), encoding="utf-8")
(img_dir / "og-image.svg").write_text(art(0, 1, 1200, 630), encoding="utf-8")


def pimg(p, v=0, root=""):
    return root + (p.get("image") or f"assets/img/{p['slug']}-{v}.svg")


def links(root):
    out = ""
    for k, u in D["social"].items():
        if u:
            out += f'<a href="{e(u)}" target="_blank" rel="noopener noreferrer">{e(k.capitalize())}</a>'
    return out


def layout(path, title, desc, body, depth):
    root = "../" * depth
    full = f"{D['name']} | {title}" if title else f"{D['name']} | {D['title']}"
    nav = "".join(
        f'<li><a href="{root}{h}" {"aria-current=page" if h == path else ""}>{n}</a></li>' for n, h in NAV)
    social = links(root)
    short = e(D.get("shortName") or D["name"].split()[0])
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(full)}</title><meta name="description" content="{e(desc)}">
<link rel="canonical" href="{URL}/{path}"><meta property="og:type" content="website"><meta property="og:title" content="{e(full)}">
<meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{URL}/{path}"><meta property="og:image" content="{URL}/assets/img/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<script>try{{var t=localStorage.getItem("theme")||"light";document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/css/style.css"><link rel="icon" href="{root}assets/img/favicon.svg"></head>
<body><a class="skip" href="#main">Skip to content</a>
<div class="shell"><aside class="side"><div class="sidetop"><a class="logo" href="{root}">{e(D["name"])}</a><p class="stitle">{e(D["title"])}</p></div>
<div class="tools"><button id="theme" aria-label="Switch colour theme" type="button"><span aria-hidden="true">◐</span></button>
<button id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu" type="button"><span></span><span></span></button></div>
<nav aria-label="Main"><ul id="menu">{nav}</ul></nav>
<div class="sidebot"><p class="soc">{social}</p><a href="mailto:{e(D["email"])}">{e(D["email"])}</a></div></aside>
<div class="col"><main id="main">{body}</main>
<footer class="foot"><p class="flogo">{e(D["name"])}</p><p class="muted">{e(D["title"])}</p><p><a href="mailto:{e(D["email"])}">{e(D["email"])}</a></p>
<p class="soc">{social}</p><ul class="fnav">{nav}</ul><p class="muted small">© <span id="yr">2026</span> {e(D["name"])}. All rights reserved.</p></footer></div></div>
<script src="{root}assets/js/main.js"></script></body></html>'''


def head(t, sub=""):
    return f'<section class="phead wrap"><h1>{t}</h1>{f"<p class=lede>{sub}</p>" if sub else ""}</section>'


def card(p, root):
    ex = ""
    for k, lab in (("github", "Source"), ("demo", "Demo")):
        if p.get(k):
            ex += f'<a href="{e(p[k])}" target="_blank" rel="noopener noreferrer">{lab}</a>'
    s = " ".join([p["name"], p["description"], p["category"], p["type"], p["year"], p["status"], p["role"], *p["tech"]]).lower()
    tag = '<span class="badge">Sample</span>' if p.get("placeholder") else ""
    return f'''<article class="card" data-cat="{e(p["category"])}" data-s="{e(s)}">
<a class="thumb" href="{root}projects/{p["slug"]}/"><img src="{pimg(p, 0, root)}" alt="Placeholder artwork for {e(p["name"])}" loading="lazy" width="800" height="600">{tag}</a>
<div class="cbody"><p class="meta">{e(p["category"])} · {e(p["year"])} · {e(p["status"])}</p>
<h3><a href="{root}projects/{p["slug"]}/">{e(p["name"])}</a></h3><p>{e(p["description"])}</p>
<p class="tags">{"".join(f"<span>{e(t)}</span>" for t in p["tech"])}</p>
<p class="role">Role: {e(p["role"])}</p><p class="clinks"><a class="btn small" href="{root}projects/{p["slug"]}/">View project</a>{ex}</p></div></article>'''


def home():
    has_photo = bool(D["photo"]) and (R / D["photo"]).exists()
    photo = D["photo"] if has_photo else "assets/img/portrait.svg"
    cap = "" if has_photo else f"<figcaption>Place your photo at {e(D['photo'])}</figcaption>"
    tag = f'<p class="tag">{e(D["tagline"])}</p>' if D["tagline"] else ""
    cv = f'<a class="btn ghost" href="{D["cvFile"]}" download>Download CV</a>' if CV_OK else ""
    sel = "".join(card(p, "") for p in P[:3])
    return f'''<section class="hero wrap"><figure class="portrait"><img src="{photo}" alt="Portrait of {e(D["name"])}" width="600" height="750">{cap}</figure>
<div class="htext"><p class="pill"><i></i>{e(D["availability"])}</p>
<h1>{e(D["name"])}</h1><p class="htitle">{e(D["title"])}</p>{tag}<p class="lede">{e(D["intro"])}</p>
<p class="cta"><a class="btn" href="projects/">Explore my work</a>{cv}<a class="btn ghost" href="contact/">Get in touch</a></p></div>
<a class="scroll" href="#selected" aria-label="Scroll to selected work"><span></span>Scroll</a></section>
<section class="wrap selected" id="selected"><div class="selhead"><h2>Selected work</h2><a href="projects/">See all projects</a></div><div class="pgrid">{sel}</div></section>'''


def about():
    rows = [("Name", D["name"]), ("Title", D["title"]), ("Location", D["location"]), ("Email", D["email"]), ("Phone", D["phone"]),
            ("Education", D["education"][0]["degree"]), ("Occupation", D["occupation"]), ("Experience", D["years"])]
    dl = "".join(f"<dt>{k}</dt><dd>{e(v)}</dd>" for k, v in rows)
    sp = "".join(f"<li>{e(s)}</li>" for s in D["specialization"])
    bio = "".join(f"<p>{e(b)}</p>" for b in D["bio"])
    return head("About me", "Who I am and what I do.") + f'''<section class="wrap two"><div class="prose">{bio}
<h2>Design philosophy</h2><p>{e(D["philosophy"])}</p><h2>Career goals</h2><p>{e(D["goals"])}</p></div>
<aside class="panel"><dl>{dl}</dl><h2>Specialization</h2><ul class="plain">{sp}</ul></aside></section>'''


def skills():
    g = "".join(f'<div class="srow"><h2>{e(c)}</h2><p class="tags">{"".join(f"<span>{e(t)}</span>" for t in v)}</p></div>' for c, v in D["skills"].items())
    return head("Skills", "Grouped by area, without made-up percentages.") + f'<section class="wrap srows">{g}</section>'


def experience():
    items = ""
    for x in D["experience"]:
        tag = '<span class="badge">Placeholder</span>' if x.get("placeholder") else ""
        items += f'''<li><p class="meta">{e(x["dates"])}</p><div><h2>{e(x["position"])} {tag}</h2><p class="muted">{e(x["organization"])}, {e(x["location"])}</p>
<h3>Responsibilities</h3><ul>{"".join(f"<li>{e(r)}</li>" for r in x["responsibilities"])}</ul>
<h3>Accomplishments</h3><ul>{"".join(f"<li>{e(r)}</li>" for r in x["accomplishments"])}</ul></div></li>'''
    return head("Experience") + f'<section class="wrap"><ol class="timeline">{items}</ol></section>'


def education():
    ed = ""
    for x in D["education"]:
        tag = '<span class="badge">Placeholder</span>' if x.get("placeholder") else ""
        ed += f'<div class="srow"><p class="meta">{e(x["year"])}</p><div><h3>{e(x["degree"])} {tag}</h3><p>{e(x["school"])}</p><p class="muted">{e(x["major"])}. {e(x.get("note", ""))}</p></div></div>'
    cr = ""
    for c in D["credentials"]:
        cid = f'<p class="muted">ID: {e(c["id"])}</p>' if c.get("id") else ""
        cr += f'<div class="srow"><p class="meta">{e(c["year"])}</p><div><h3>{e(c["name"])}</h3><p>{e(c["issuer"])}</p>{cid}</div></div>'
    cs = f'<h2 class="sub">Certifications</h2><div class="srows">{cr}</div>' if cr else ""
    return head("Education") + f'<section class="wrap"><div class="srows">{ed}</div>{cs}</section>'


def projects():
    cats = sorted({p["category"] for p in P})
    chips = '<button class="chip on" data-f="all" type="button">All</button>' + "".join(f'<button class="chip" data-f="{e(c)}" type="button">{e(c)}</button>' for c in cats)
    return head("Projects", "Sample entries are marked. Replace them in data/site.json.") + f'''<section class="wrap">
<div class="filters"><label class="sr" for="q">Search projects</label><input id="q" type="search" placeholder="Search by name, technology, category, or year">
<div class="chips" role="group" aria-label="Filter by category">{chips}</div></div>
<p id="count" class="muted" aria-live="polite"></p><div class="pgrid" id="grid">{"".join(card(p, "../") for p in P)}</div>
<div id="empty" class="emptybox" hidden><h2>No projects match that search</h2><p>Try a different word, or clear the filters.</p><button class="btn ghost" id="clear" type="button">Clear filters</button></div></section>'''


def cv():
    if CV_OK:
        b = f'<a class="btn" href="../{D["cvFile"]}" download>Download CV</a><a class="btn ghost" href="../{D["cvFile"]}" target="_blank" rel="noopener noreferrer">View CV online</a>'
    else:
        b = f'<div class="notice"><p><strong>No CV uploaded yet.</strong> Save your PDF as <code>{e(D["cvFile"])}</code>, run <code>python3 build.py</code>, and the download and view buttons will appear here.</p></div>'
    return head("Curriculum vitae", "Download my latest CV, or read it in your browser.") + f'<section class="wrap"><p class="cta">{b}</p></section>'


def contact():
    ep = e(D["formEndpoint"])
    return head("Contact", "Send a message or reach me directly.") + f'''<section class="wrap two"><div class="prose"><dl class="plainl"><dt>Email</dt><dd><a href="mailto:{e(D["email"])}">{e(D["email"])}</a></dd>
<dt>Phone</dt><dd>{e(D["phone"])}</dd><dt>Location</dt><dd>{e(D["location"])}</dd></dl><p class="soc">{links("../")}</p></div>
<form id="cf" novalidate data-endpoint="{ep}"><div class="f"><label for="n">Name</label><input id="n" name="name" required autocomplete="name"><small class="err" id="n-e"></small></div>
<div class="f"><label for="m">Email</label><input id="m" name="email" type="email" required autocomplete="email"><small class="err" id="m-e"></small></div>
<div class="f"><label for="s">Subject</label><input id="s" name="subject" required><small class="err" id="s-e"></small></div>
<div class="f"><label for="b">Message</label><textarea id="b" name="message" rows="6" required minlength="10"></textarea><small class="err" id="b-e"></small></div>
<input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Send message</button><p id="status" role="status" aria-live="polite"></p></form></section>'''


def detail(i, p):
    li = ""
    for k, lab in (("url", "Live website"), ("github", "GitHub"), ("demo", "Demo"), ("docs", "Documentation")):
        if p.get(k):
            li += f'<a class="btn ghost" href="{e(p[k])}" target="_blank" rel="noopener noreferrer">{lab}</a>'
    pv, nx = P[i - 1], P[(i + 1) % len(P)]
    meta = "".join(f"<dt>{k}</dt><dd>{e(v)}</dd>" for k, v in (("Role", p["role"]), ("Year", p["year"]), ("Status", p["status"]), ("Category", p["category"]), ("Type", p["type"])))
    note = '<p class="notice">This is a sample project. Replace it with real work in data/site.json.</p>' if p.get("placeholder") else ""
    gal = "".join(f'<img src="{pimg(p, v, "../../")}" alt="Placeholder image {v + 1} for {e(p["name"])}" loading="lazy">' for v in (1, 2))
    return f'''<article class="wrap case"><p class="meta"><a href="../">Projects</a> / {e(p["category"])}</p><h1>{e(p["name"])}</h1>{note}
<img class="cover" src="{pimg(p, 0, "../../")}" alt="Placeholder cover artwork for {e(p["name"])}" width="800" height="600">
<div class="two"><div class="prose"><h2>Overview</h2><p>{e(p["overview"])}</p><h2>Objective</h2><p>{e(p["problem"])}</p>
<h2>Process and solution</h2><p>{e(p["process"])}</p><h2>Key features</h2><ul>{"".join(f"<li>{e(f)}</li>" for f in p["features"])}</ul></div>
<aside class="panel"><dl>{meta}</dl><h2>Tools</h2><p class="tags">{"".join(f"<span>{e(t)}</span>" for t in p["tech"])}</p>{f'<p class="cta">{li}</p>' if li else ""}</aside></div>
<h2>Gallery</h2><div class="gal">{gal}</div>
<nav class="pn" aria-label="Other projects"><a href="../{pv["slug"]}/">Previous: {e(pv["name"])}</a><a href="../{nx["slug"]}/">Next: {e(nx["name"])}</a></nav></article>'''


pages = {
    "": (None, D["intro"], home(), 0),
    "about/": ("About", f"About {D['name']}: education, experience, and goals.", about(), 1),
    "skills/": ("Skills", "Programming, frontend, game development, art, and animation skills.", skills(), 1),
    "experience/": ("Experience", "Professional experience timeline.", experience(), 1),
    "projects/": ("Projects", "Searchable portfolio of web, game, database, and art projects.", projects(), 1),
    "education/": ("Education", "Education and credentials.", education(), 1),
    "cv/": ("CV", "View or download my CV.", cv(), 1),
    "contact/": ("Contact", "Get in touch by email or the contact form.", contact(), 1),
}
for i, p in enumerate(P):
    pages[f"projects/{p['slug']}/"] = (p["name"], p["description"], detail(i, p), 2)

for path, (t, d, b, depth) in pages.items():
    out = R / path / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(layout(path, t, d, b, depth), encoding="utf-8")

nf = layout("404.html", "Page not found", "Page not found.",
            '<section class="wrap phead"><h1>Page not found</h1><p class="lede">That address does not exist. <a href="/">Go to the home page</a> or use the menu above.</p></section>', 0)
for _, h in NAV:
    nf = nf.replace(f'href="{h}"', f'href="/{h}"')
nf = nf.replace('href="assets/', 'href="/assets/').replace('src="assets/', 'src="/assets/')
(R / "404.html").write_text(nf, encoding="utf-8")
(R / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {URL}/sitemap.xml\n")
(R / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                               "".join(f"<url><loc>{URL}/{p}</loc></url>\n" for p in pages) + "</urlset>\n")
(img_dir / "favicon.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#4A1426"/><circle cx="16" cy="16" r="7" fill="#D9879F"/></svg>')
print(f"Built {len(pages)} pages. CV found: {CV_OK}")
