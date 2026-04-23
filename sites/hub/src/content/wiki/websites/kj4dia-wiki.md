---
title: "KJ4DIA.me — Amateur Radio Website"
---
<img src="https://raw.githubusercontent.com/MichalAFerber/kj4dia.me/main/assets/images/kj4dia_logo.png" align="right" width="128" alt="KJ4DIA Logo">

[![Deploy Jekyll site to Pages](https://github.com/MichalAFerber/kj4dia.me/actions/workflows/jekyll.yml/badge.svg)](https://github.com/MichalAFerber/kj4dia.me/actions/workflows/jekyll.yml)

**Live Site:** [kj4dia.me](https://kj4dia.me)
**GitHub:** [MichalAFerber/kj4dia.me](https://github.com/MichalAFerber/kj4dia.me)
**Callsign:** KJ4DIA — Michal Ferber, aka TechGuyWithABeard

Personal amateur radio website serving as a documentation and reference hub — certifications, licenses, links, and emergency communications resources.

---

## Tech Stack

| Component | Details |
|---|---|
| Framework | Jekyll (static site generator) |
| Theme | [Just the Docs](https://just-the-docs.com/) via `jekyll-remote-theme` |
| Color Scheme | Dark mode |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (`jekyll.yml`) — auto-deploys on push to `main` |
| Plugins | `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-include-cache` |

---

## Site Structure

```
kj4dia.me/
├── index.md              # Home page with callsign intro
├── documents.md          # Certifications and licenses
├── links.md              # Amateur radio + emergency comms resources
├── _config.yml           # Jekyll + Just the Docs configuration
├── _includes/            # Custom HTML includes (footer, header)
├── assets/
│   ├── css/              # Custom styles
│   ├── images/
│   │   └── kj4dia_logo.png   # KJ4 (red) + DIA (white) logo, transparent background
│   └── icons/
└── .github/
    └── workflows/
        └── jekyll.yml    # GitHub Pages deploy workflow
```

---

## Logo

Two-tone logo matching the Just the Docs theme aesthetic:
- **KJ4** — red `#d32f2f` (matches Just the Docs brand red)
- **DIA** — white `#ffffff`
- Transparent background, 600×200px
- Available as PNG and SVG

Logo was created to match the style reference at [just-the-docs.com/docs/configuration/#site-logo](https://just-the-docs.com/docs/configuration/#site-logo).

Jekyll config reference:
```yaml
logo: "/assets/images/kj4dia_logo.png"
```

---

## Local Development

**Prerequisites:** Ruby 3.0+, Bundler

```bash
# Clone
git clone https://github.com/MichalAFerber/kj4dia.me.git
cd kj4dia.me

# Install dependencies
bundle install

# Serve locally (http://localhost:4000)
bundle exec jekyll serve
```

---

## Deployment

Deployed automatically via GitHub Actions on every push to `main`. No manual steps required — GitHub Pages builds from the Jekyll workflow.

---

## License

MIT — open source.
