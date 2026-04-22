---
title: "IP Cow Domain Parking"
---
![Parked Domain Preview](https://raw.githubusercontent.com/MichalAFerber/ipcow-domain-parking/main/screenshot.png)

![Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages?logo=cloudflare)
![GitHub Repo stars](https://img.shields.io/github/stars/MichalAFerber/ipcow.com-domain-parking?style=social)
![GitHub forks](https://img.shields.io/github/forks/MichalAFerber/ipcow.com-domain-parking?style=social)
![License](https://img.shields.io/github/license/MichalAFerber/ipcow.com-domain-parking)

A clean, modern, reusable **domain parking page template** used across the **IP Cow Network**, deployed via **Cloudflare Pages**.

🔗 **Live Parking Service:**  
All domains parked on IP Cow display this landing page template at:  
**https://park.ipcow.com**

---

## 🚀 Overview

This project provides a standardized domain parking page for all domains parked using **IP Cow DNS**. The page is:

- Globally routed via **Cloudflare’s Anycast Edge Network**
- Hosted as a **static site on Cloudflare Pages**
- Reused automatically across all parked domains
- Designed for a clean UX and inquiry capture

---

## 🧩 Features

- Minimal, modern UI
- Inquiry form (Tally or provider of your choice)
- Cloudflare edge delivery
- Fully reusable across parked domains
- Easy to fork and customize

---

## 📦 Repo Structure

```bash

📂 (root)
├── assets/
│   └── parked-preview.png  ← Screenshot used in README
├── index.html              ← Parking page template
├── robots.txt
├── sitemap.xml
├── LICENSE
└── README.md

````

---

## ⚙ Deployment

This site is deployed using **Cloudflare Pages** with:

- No build step (static HTML)
- Custom domain support
- Global CDN + DDoS protection
- Automatic reuse for all parked domains

---

## 🛠 Setup & Customization

1. Clone or fork the repository
2. Replace branding or background image in `/assets/`
3. Update the form handler in `index.html` (Tally, Formspark, etc.)

Example verbiage in `index.html`:

```html
<h1>example.com</h1>
<p>This domain is parked using IP Cow’s edge-optimized DNS network powered by Cloudflare’s global anycast backbone.</p>
````

---

## 📄 License

This project is licensed under the **MIT License** — feel free to fork and reuse.
See the [LICENSE](LICENSE) file for details.

---

## 📫 Contact

Created and maintained by: **Michal Ferber**
Also known as: **TechGuyWithABeard**

- 🌐 Blog & Portfolio: michalferber.me
- 🐄 Domain services: ipcow.com
- 📍 All domains park here: park.ipcow.com
