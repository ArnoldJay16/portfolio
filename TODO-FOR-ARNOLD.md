# Things Arnold still needs to fill in

Edit `data/site.js` (the text file). Search it for `[` to find every placeholder. Save, push to GitHub, then check the live site.
Anything in [square brackets] on the website is unfinished.

## Text to replace (data/site.js)
- [ ] `tagline`: a short one-line tagline shown on the home page
- [ ] `philosophy`: creative philosophy (About page)
- [ ] `bio`: the last paragraph (what inspired you, what you like to create, projects you've worked on)
- [ ] Experience > `accomplishments`: a real accomplishment for the IT Society entry
- [ ] Project > `process`: how you approached the activities and the solution (the requirements ask for Problem and Solution)
- [ ] `social`: real GitHub and LinkedIn links. Leave a link empty (`""`) to hide it. Facebook and Instagram can be added the same way

## Things to decide or double-check
- [ ] Work experience: the CV lists FR Calirayas Photography and Printing Services (2023 to present) and CCSA Production Team (2024 to 2025). Add them to `experience` if you want them on the site
- [ ] Certificates in the CV (e.g. Excellence in Visual Arts Leadership, 2023): add under `credentials` if you want them shown. Each needs name, issuer, year
- [ ] Graduation year: the site says 2030 (expected) but the CV says 2029. Make them match
- [ ] CV privacy: the CV is public and includes a home address and phone number. Use a public version without the address if you prefer
- [ ] `years`: confirm "5 years" is how you want your experience described

## Accounts to create (Arnold's own)
- [ ] Contact form: create a form at formspree.io with YOUR email, then replace `formEndpoint` so messages reach you. Send a test message
- [ ] Analytics: create a Google Analytics 4 property with a Web data stream for `https://arnoldjay16.github.io`, copy the `G-…` ID into `"analytics": { "goatcounter": "", "ga4": "G-…" }`. Or use GoatCounter instead
- [ ] Search: add the site to Google Search Console (URL prefix property), verify, and submit `sitemap.xml`

## Final check before presenting
- [ ] No `[brackets]` left anywhere on the site
- [ ] Every menu page and the project page open on the live address
- [ ] CV views and downloads work
- [ ] Phone and tablet widths look right
