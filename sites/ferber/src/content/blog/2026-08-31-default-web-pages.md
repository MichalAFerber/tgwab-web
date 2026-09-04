---
title: "Default Web Pages: The Splash You Were Never Meant to Keep"
description: "A recreation archive of what a fresh install actually serves — IIS 1995 through 2022, nginx, Apache, Caddy, and the framework 404s — byte-exact where the original still exists."
tags: [web, history, archive, nginx, iis, open-source]
thumbnail-img: /assets/img/default-web-pages.webp
---

![A CRT monitor showing color bars and a checkmark beside a stack of old manuals](/assets/img/default-web-pages.webp)

# Default Web Pages: The Splash You Were Never Meant to Keep

"Welcome to nginx!" is not a homepage. It is a confession that nobody finished the install.

I collected those confessions: [default-web-pages](https://michalaferber.github.io/default-web-pages/). IIS from 1995 through Windows Server 2022. nginx, Apache, Caddy. The reverse-proxy 404s. The framework welcome rockets. A gallery with screenshots, plus the files themselves.

The pages stay © their owners. The archive structure, the gallery, and two first-party splashes are MIT. This is identification and history, not a theme pack.

## Why bother

You see these in the wild more than people admit. A forgotten vhost. A container that bound 80 and nobody put an index on it. "It works!" on Apache is 45 bytes and a shrug. Spring Boot's whitelabel 404. Varnish Guru Meditation. Traefik's `404 page not found`. They are fingerprints. They are also how a lot of us learned the server was up.

I wanted a place that was honest about *which* default: upstream nginx vs. the RHEL test page are not the same file. Ubuntu's Apache splash is packaging, not the httpd project. Distro is the page.

## The Microsoft lineage

There is **no IIS 9**. Microsoft jumped 8.5 to 10 to line up with Windows 10.

| IIS | Windows | The page |
|---|---|---|
| 1.0–3.0 | NT 3.51 / NT 4 | Lost. Documented, not recreated. |
| 4.0 | NT 4 Option Pack | "Welcome to IIS 4.0!" three-tab site |
| 5.0 / 5.1 | 2000 / XP | `iisstart.asp` + `localstart.asp` |
| 6.0 | Server 2003 | "Under Construction" — reconstructed markup, verified text |
| 7.0 / 7.5 | Vista through 2008 R2 | blue IIS7 splash |
| 8.0 / 8.5 | 8 / 2012 | microsoft.com/web era |
| 10 | Win10 / Server 2016+ | "IIS Windows" / "IIS Windows Server" |

Almost everything is byte-exact from a live box, a git blob, or a real package. Two exceptions, labeled in place: IIS 6.0 surrounding markup, and 1.0–3.0 which simply does not survive. IIS files keep CRLF. Byte counts match live `Content-Length`s where I could check (689 for 7.x, 703 for 10 Server).

## Linux servers, proxies, frameworks

nginx "Welcome to nginx!" and the RHEL cousin. Apache "It works!", Ubuntu default, Rocky test page. Caddy's slanted congratulations.

Then the things that sit in front: Tomcat ROOT, HAProxy 503, Squid error, Envoy "no healthy upstream," Kong "no Route matched," APISIX, OpenLiteSpeed, Tinyproxy, Traffic Server.

Then the scaffolds: Django rocket, "Yay! You're on Rails!", Flask/Werkzeug 404, Laravel welcome, Express `Cannot GET /`, FastAPI JSON 404, Next.js 404, Phoenix, Gin, Echo, Sinatra's ditty, CRA, Vue "You did it!", Hono, Koa, Rocket, CodeIgniter, CakePHP, Slim, Spark, Python `http.server`, Go `net/http`, ASP.NET Core, Astro.

If you have stood up a box in the last twenty years, you have seen at least three of these and shipped one by accident.

## How to use it

The gallery is the index. Each entry is a screenshot plus the source or the rendered page. `SOURCES.md` maps origin. `NOTICE.md` is the trademark and seal caveat people forget when they copy an IIS GIF into a slide deck.

This is not a honeypot. If you want a fake IIS for a decoy, that is someone else's Docker image. This repo is so I can look at a screenshot and say "that is Ubuntu Apache, not upstream." And so the 45-byte "It works!" does not vanish when the next LTS deletes the package.

Clone it if you collect this stuff. Open the gallery if you just need to name the splash. Either way, replace yours with a real page.
