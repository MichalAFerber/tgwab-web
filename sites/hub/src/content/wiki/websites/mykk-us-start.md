---
title: "start.mykk.us 🚀"
---
A minimal, self-hostable web start page inspired by start.me. Built with simple HTML/CSS/JS for lightweight deployment.

## 📦 Features

- Clean, responsive dashboard layout
- Customizable widgets / quick links
- Easy theming via CSS variables
- No server‑side components — runs entirely as static site

## 🏠 Self‑hosting Guide

### 1. Clone the repo

```bash
git clone https://github.com/MichalAFerber/start.mykk.us.git
cd start.mykk.us
````

### 2. Serve locally

Choose your preferred static‑file server:

- **Using Node.js `http-server`**:

```bash
npm install -g http-server
http-server .
```

- **Using Python**:

```bash
# Python 3
python3 -m http.server 8000
```

- **Using PHP**:

```bash
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.
### 3. Deploy on the web

Host on any static hosting platform:

- **GitHub Pages**

    1. Push your repo to GitHub.
    2. In Settings → Pages, set **branch**: `main` and **folder**: `/ (root)`.
    3. Visit `https://<your‑github‑username>.github.io/start.mykk.us/`.
- **Netlify / Vercel / Cloudflare Pages**  
    Just point to the repo; default build output is the root directory.

## ⚙️ Configuration

### Quick links & widgets

Edit `data/links.json` (or similar file) to personalize:

```json
[
  {
    "label": "GitHub",
    "url": "https://github.com",
    "icon": "github"
  },
  {
    "label": "Docs",
    "url": "https://docs.start.mykk.us",
    "icon": "book"
  }
]
```

Customize look via CSS variables in `styles/theme.css`:

```css
:root {
  --bg-color: #fff;
  --text-color: #222;
  --accent-color: #007acc;
  --widget-bg: #f7f7f7;
}
```

Change these to tweak light/dark mode, colors, spacing, etc.

### Custom CSS / JS

For advanced customizations:

- Add your own CSS in `styles/custom.css`
- Add JS (e.g. widgets, search integration) in `scripts/custom.js`

Those files are optional and will override defaults if present.

## 🧪 Testing & Development

- Live‑reload while editing HTML/CSS/JS with tools like `live-server`
- Lint styles and JS using your preferred toolchain (`stylelint`, `ESLint`, etc.)

## 👥 Contributing

1. **Fork** the repository
2. Create a descriptive **branch**
3. Make changes and **commit** with clear messages
4. Submit a **Pull Request**
5. We'll **review** & merge your enhancements!

## 🔗 Useful links

- [GitHub Pages setup](https://docs.github.com/en/get-started/quickstart/hello-world) ([GitHub](https://github.com/?utm_source=chatgpt.com "GitHub · Build and ship software on a single, collaborative platform ..."), [YouTube](https://www.youtube.com/watch?pp=0gcJCfwAo7VqN5tD&v=277gRTVtw2I&utm_source=chatgpt.com "How to Get Started with GitHub (as a new developer) - YouTube"), [GitHub Docs](https://docs.github.com/get-started/quickstart/hello-world?utm_source=chatgpt.com "Hello World - GitHub Docs"))
- [Creating a pull request on GitHub](https://docs.github.com/en/get-started/quickstart/hello-world) ([GitHub Docs](https://docs.github.com/get-started/quickstart/hello-world?utm_source=chatgpt.com "Hello World - GitHub Docs"))

## 📜 License

MIT License

## 🚀 TL;DR

| Setup Step    | What to Do                              |
| ------------- | --------------------------------------- |
| `git clone`   | Clone the repo                          |
| Static Server | Use Python / Node / PHP locally         |
| Deploy        | Use GitHub Pages, Netlify, Vercel, etc. |
| Customize     | Edit JSON, CSS, JS                      |
| Contribute    | Fork → PR → merge                       |
