---
title: "Cloudflare DNS Setup Guide"
---
This guide explains how to configure your DNS records in Cloudflare for common scenarios like hosting on GitHub Pages or completely disabling email delivery.

---

## 1. Hosting on GitHub Pages
To point your domain to GitHub Pages, you need to add both **A records** (for IPv4) and **AAAA records** (for IPv6).

### A Records (IPv4 addresses)
Add these four records to point your domain to GitHub's servers.
* **Type:** `A`
* **Name:** `@` (or your domain name)
* **Proxy Status:** **DNS Only** (Gray cloud)

| Type | Name | Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| A | @ | 185.199.108.153 | DNS Only |
| A | @ | 185.199.109.153 | DNS Only |
| A | @ | 185.199.110.153 | DNS Only |
| A | @ | 185.199.111.153 | DNS Only |

### AAAA Records (IPv6 addresses)
These ensure your site is reachable via modern IPv6 connections.
* **Type:** `AAAA`
* **Name:** `@`
* **Proxy Status:** **DNS Only** (Gray cloud)

| Type | Name | Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| AAAA | @ | 2606:50c0:8000::153 | DNS Only |
| AAAA | @ | 2606:50c0:8001::153 | DNS Only |
| AAAA | @ | 2606:50c0:8002::153 | DNS Only |
| AAAA | @ | 2606:50c0:8003::153 | DNS Only |

---

## 2. Disabling Email (Null MX & Security)
If you do not use email on this domain and want to tell the world **"do not send email here,"** use these settings. This will cause any emails sent to the domain to "bounce" back as undeliverable.

### The "Null" MX Record
This tells mail servers that there is no mail server here.
* **Type:** `MX`
* **Name:** `@`
* **Mail Server:** `.` (just a single period)
* **Priority:** `0`

### Security Records (SPF & DMARC)
These records prevent scammers from pretending to be you.

**SPF (Sender Policy Framework)**
* **Type:** `TXT`
* **Name:** `@`
* **Content:** `v=spf1 -all`
* *Interpretation: "No server is authorized to send email for me."*

**DMARC**
* **Type:** `TXT`
* **Name:** `_dmarc`
* **Content:** `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;`
* *Interpretation: "If you get an email claiming to be from me, reject it immediately."*

---

## 3. Cloudflare "Proxied" A Record
If you want to use Cloudflare's security features (DDoS protection, CDN, etc.), you "Proxy" the record.
* **Type:** `A`
* **Name:** `@` (or a subdomain like `web`)
* **IPv4 Address:** `192.0.2.1`
* **Proxy Status:** **Proxied** (Orange cloud)

---

## 4. System Records (Information Only)
You generally **do not** need to edit these manually in Cloudflare, but they are good to know:

* **Nameservers:** These tell the internet that Cloudflare is "in charge" of your DNS.
    * `michael.ns.cloudflare.com`
    * `samara.ns.cloudflare.com`
* **SOA (Start of Authority):** This is a master record that contains administrative info about your DNS zone. Cloudflare manages this automatically.

---

## Pro-Tips for Novices
1.  **The "@" Symbol:** In DNS settings, typing `@` is just a shortcut for "my main domain" (e.g., `example.com`).
2.  **TTL (Time to Live):** Set this to **Auto** unless you have a specific reason to change it.
3.  **The Cloud Icon:** * **Orange Cloud:** Traffic goes through Cloudflare (Security + Speed).
    * **Gray Cloud:** Traffic goes directly to your server (Standard DNS).
