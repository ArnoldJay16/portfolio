# Arnold Jay R. Villalobos - Portfolio

Static website (HTML, CSS, JavaScript). No build step for content: every page reads `data/site.js`.

## Edit content
1. Open `data/site.js`, change text, save, refresh the browser. Home, Projects, project pages, About, Skills, Experience, Education, CV and Contact all update from this one file.
2. Empty social links are hidden. Empty `accomplishments` or `credentials` hide their sections.

## Where images go
- Profile photo: `assets/images/profile.jpg`
- Graphic Design project: `assets/images/graphic-design-project/` with `cover.jpg`, `01.jpg`, `02.jpg`, `03.jpg`
- Other names or formats: change `photo`, `image` and `gallery` in `data/site.js`.
- Missing images show a box naming the file to add.
- Clicking a project image opens a viewer. Fill in `title` and `description` for that image in `data/site.js` and they appear beneath it. Leave them empty and nothing is shown. Plain file paths (strings) still work and simply have no caption.
- Compress images before adding them (under about 300 KB each; WebP is fine).

## CV
`assets/cv/Arnold_Villalobos_CV.pdf` is a draft built from the details provided. Replace it with the final PDF using the same file name.

## Add another project later
Add an entry to `projects` in `data/site.js` (copy the existing one, give it a new `slug`), then double-click `update-pages.bat` (Windows) or run `python3 make_pages.py` to create its page and update `sitemap.xml`.

## Contact form
It reports success only when a service accepts the message. Create a free form at formspree.io and paste its URL into `formEndpoint`. Never put private API keys in this repo.

## Run locally
Open `index.html` directly, or run `python3 -m http.server 8000` and visit http://localhost:8000.

## Deploy to GitHub Pages
1. Create a repository and upload everything in this folder (keep `.nojekyll`).
2. Settings > Pages > Deploy from a branch > `main` / root. Enable Enforce HTTPS.
3. Put the live address in `siteUrl` (data/site.js), double-click `update-pages.bat` (or run `python3 make_pages.py`), and push again so canonical links and the sitemap are correct.

## Deployment checklist
- [ ] Public URL opens without login, HTTPS on
- [ ] Every menu link works, desktop and mobile
- [ ] Open `/projects/graphic-design-project/` directly
- [ ] Images load, no placeholders left
- [ ] CV downloads and opens in a new tab
- [ ] Contact form delivers a real test message
- [ ] Dark mode works and persists
- [ ] Phone, tablet and desktop layouts look right
- [ ] `sitemap.xml` and `robots.txt` load
- [ ] No console errors

## Notes
Fonts (Fraunces, Work Sans) load from Google Fonts. Colours are variables at the top of `assets/css/style.css`. The social-preview image is `assets/images/og-image.jpg` (add one, 1200x630).

## Analytics (visitors and CV downloads, shown in the footer)
1. Create a free site at goatcounter.com (no cookies). In its Settings, turn ON "Allow adding visitor counts on your website".
2. In `data/site.js` set `"analytics": { "goatcounter": "your-code", "ga4": "" }`.
3. The footer then shows "Visitors" (all page views) and "CV downloads". CV clicks are recorded as the event `cv-download` (and `cv-view` for the View online link). The full dashboard stays in GoatCounter.
Nothing is recorded from a local folder or localhost. Google Analytics 4 is also supported through `"ga4": "G-..."`, but it cannot show public counters.
After changing `siteUrl`, adding a project, or renaming a project slug, double-click `update-pages.bat`.
