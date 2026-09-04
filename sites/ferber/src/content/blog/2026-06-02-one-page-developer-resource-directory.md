---
title: "How I'd Build a One-Page Developer Resource Directory"
description: "A blueprint for a fast, self-hosted start page for IT work: JSON-backed cards, keyboard-first search, workflow categories instead of a junk drawer of links."
tags: [web, javascript, productivity, self-hosted, how-to]
thumbnail-img: /assets/img/developer-resource-directory.webp
---

![Developer resource directory on a workstation](/assets/img/developer-resource-directory.webp)

# How I'd Build a One-Page Developer Resource Directory

I already run a start page. The version I keep wanting is dumber and faster than most "bookmark managers": one HTML file, a JSON list of tools, instant client-side filter, and categories that match how I actually work — not "Cool Websites" and "Misc."

Curation beats quantity. If the page takes more than a second to become useful, it's a failed homepage.

## Structure

No backend. HTML, a little CSS (Tailwind is fine), and a `links.json` the page fetches once.

- **Header:** a search bar with `/` or `Ctrl+K` to focus, plus a dark/light toggle.
- **Filters:** sticky category chips that instant-filter the grid.
- **Grid:** cards with a name, one sentence, and a small tag: tool, docs, or community.

That's the whole product. Someone should be able to fork it, drop in their own JSON, and ship it to GitHub Pages in a minute.

## Keyboard First

IT people hate taking their hands off the keyboard. Focus search on `/`. Arrow keys move between cards. Enter opens the link. Star a card and store the stars in `localStorage` so favorites float to the top on the next load.

If it needs a mouse to be usable, the design is wrong.

## Categories That Match the Work

Group by job, not by "type of website."

### Daily utilities

- **[CyberChef](https://gchq.github.io/CyberChef/)** — encode, decode, hash, decompress, without opening five tabs.
- **[JSON Crack](https://jsoncrack.com/)** — paste JSON, get a graph.
- **[Explainshell](https://explainshell.com/)** — what every flag on a command actually does.
- **[regex101](https://regex101.com/)** — write, test, and explain a regex in one place.

### Docs and cheatsheets

- **[DevDocs](https://devdocs.io/)** — a pile of API docs, searchable, offline-first.
- **[Learn X in Y Minutes](https://learnxinyminutes.com/)** — a language as a commented file.
- **[cheat.sh](https://cheat.sh/)** — cheat sheets in the browser or via `curl`.

### Network and cloud

- **[DNS Checker](https://dnschecker.org/)** — propagation across a few dozen resolvers.
- **[Can I use](https://caniuse.com/)** — browser support tables.
- **[SSL Labs](https://www.ssllabs.com/ssltest/)** — what your TLS config actually is.

### Security hygiene

- **[Have I Been Pwned](https://haveibeenpwned.com/)** — which breaches have your address.
- **[VirusTotal](https://www.virustotal.com/)** — one file, many engines.
- **[dnsleaktest.com](https://www.dnsleaktest.com/)** — whether the VPN is lying.
- **[JustDeleteMe](https://justdeleteme.xyz/)** — the actual delete-account URL for a service.

I also keep a short list of **self-hosted stand-ins for paid SaaS** next to those: [yt-dlp](https://github.com/yt-dlp/yt-dlp), [Ollama](https://github.com/ollama/ollama), [n8n](https://github.com/n8n-io/n8n), [Bitwarden](https://github.com/bitwarden/server), [Plausible](https://github.com/plausible/analytics), [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy). Those aren't "links to click during an outage." They're the things I'd rather run than rent.

## The JSON Shape

Keep each record boring and complete:

```json
{
  "name": "CyberChef",
  "url": "https://gchq.github.io/CyberChef/",
  "blurb": "Encode, decode, hash, and decompress in the browser.",
  "category": "utilities",
  "kind": "tool",
  "tags": ["encoding", "forensics"]
}
```

Filter is `input.value` against `name + blurb + tags`. Category chips are an extra `AND`. No fuzzy library required until the list is huge, and if the list is huge you already failed at curation.

## What I Would Not Put on It

People-search, face-search, and "what's this random EXE" directories. A start page is for tools you trust at 7 a.m., not a junk drawer of OSINT novelty. If a link would embarrass you on a client screenshare, it doesn't belong.

## Ship It Ugly, Then Stop

The useful version is a single page you open a hundred times a week. Resist turning it into a product: no accounts, no sync, no comments, no "AI search." JSON on disk, filter in the browser, deploy wherever you already host static files.

That's the directory. Everything else is decoration.
