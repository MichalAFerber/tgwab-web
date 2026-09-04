---
title: "Cheap, Private Cloud Backup with WebDAV + Cryptomator"
description: "A practical guide to building a zero-knowledge cloud backup for just a few dollars a month: pair a cheap WebDAV storage provider with Cryptomator's client-side encryption so your provider never sees your plaintext."
tags: [cryptomator, webdav, backup, encryption, privacy, rclone, homelab]
thumbnail-img: /assets/img/cryptomator-webdav-backup.webp
---

![Encrypted backup](/assets/img/cryptomator-webdav-backup.webp)

# Cheap, Private Cloud Backup with WebDAV + Cryptomator

Cloud storage has never been cheaper — you can rent a terabyte for the price of a coffee. The catch? With most providers, you're handing them your files *in the clear* and trusting them (and whoever breaches them) to behave. I wanted backups that were both **cheap** and **private**, where the provider physically cannot read my data.

The answer turned out to be a two-part combo I've come to love: a low-cost **WebDAV** storage provider for the dumb-but-cheap storage, and **[Cryptomator](https://cryptomator.org/)** sitting in front of it to encrypt everything on my machine before it ever leaves. The result is true zero-knowledge backup for a few dollars a month. Here's how to set it up.

> **TL;DR:** Rent cheap storage from a provider that speaks **WebDAV**, mount it as a network drive, then create a **Cryptomator** vault on that drive. Cryptomator encrypts your files (and even the filenames) locally with AES-256, so the cloud only ever stores ciphertext. Strong privacy, pennies per gigabyte.

---

## Why This Combo Works

There are two separate problems in "private cloud backup," and this stack solves each with the cheapest tool for the job:

* **Storage** is a commodity. You don't need a fancy sync client with a slick app — you need bytes parked somewhere reliable. **WebDAV** is a decades-old, boring, universally supported protocol that lets you mount remote storage like a local drive. Tons of budget providers offer it.
* **Privacy** is *your* job, not the provider's. **Cryptomator** is open-source, audited, client-side encryption. It turns a folder into an encrypted "vault" — file contents *and* filenames are scrambled with AES-256 before upload. The provider sees a pile of meaningless `.c9r` files and nothing else.

Because the encryption happens entirely on your machine, it doesn't matter that the storage provider is cheap or that WebDAV itself isn't fancy. The provider is just holding ciphertext.

---

## Step 1 — Pick a Cheap WebDAV Provider

Any provider that supports WebDAV works. A few popular budget-friendly options:

* **Hetzner Storage Box** — my pick. Roughly a few euros a month for a terabyte, with WebDAV, SMB, SSH/SFTP, and snapshots built in.
* **Koofr** — privacy-friendly, cheap tiers, native WebDAV.
* **pCloud** — WebDAV available on paid plans (lifetime plans exist).
* **Mailbox.org / Infomaniak kDrive** — bundled WebDAV storage if you already use them.
* **Self-hosted Nextcloud** — if you run your own box, you already have WebDAV for the cost of the hardware.

> **Tip:** You don't need the provider to offer *any* encryption or zero-knowledge features — Cryptomator handles that. Optimize purely for **price, reliability, and WebDAV support**.

---

## Step 2 — Mount the WebDAV Storage

You want the remote storage to appear as a local drive so Cryptomator can write its vault there.

**Option A — OS-native:**

* **Windows:** File Explorer → *Map network drive* → enter the WebDAV URL (e.g. `https://your-host/webdav`).
* **macOS:** Finder → *Go → Connect to Server* (`⌘K`) → enter `https://your-host/webdav`.
* **Linux:** mount via `davfs2` or your file manager's "Connect to Server."

**Option B — rclone (recommended for reliability):**

The native macOS/Windows WebDAV clients can be flaky under heavy I/O. [rclone](https://rclone.org/) is rock-solid:

```bash
rclone config        # create a new remote, type: webdav, point it at your provider
rclone mount mybackup: /Users/you/CloudBackup --vfs-cache-mode writes
```

That mounts your WebDAV storage at `~/CloudBackup`, streaming on demand with no permanent local copy.

---

## Step 3 — Create a Cryptomator Vault on the Mounted Drive

1. Download and install **Cryptomator** (free on desktop; Windows/macOS/Linux).
2. Click **Add Vault → Create New Vault**.
3. When asked *where* to store it, choose a folder **on your mounted WebDAV drive** (e.g. `~/CloudBackup/Vault`). This is the key step — the encrypted vault files live on the cloud storage.
4. Set a **strong password** and **save the recovery key somewhere safe and offline** (a password manager, printed in a safe). If you lose the password *and* the recovery key, the data is gone for good — that's the whole point of zero-knowledge.

> **Don't confuse the two WebDAVs.** This guide uses WebDAV in two unrelated places. (1) The *remote cloud provider* speaks WebDAV so you can park encrypted bytes off-site. (2) Cryptomator, when unlocking a vault, spins up a *local-only* server to present your decrypted files — and per the [volume-type docs](https://docs.cryptomator.org/desktop/volume-type/) it can do that via WebDAV or, better, **FUSE**: WinFsp on Windows (bundled), **macFUSE** on macOS (install it once — it's not bundled for licensing reasons), or `fuse3` on Linux. FUSE is faster and more app-compatible than the local WebDAV fallback, so install the FUSE driver for your OS and select it in Cryptomator's preferences.

---

## Step 4 — Back Up Your Files

1. In Cryptomator, **Unlock** the vault with your password. It mounts as a normal-looking virtual drive.
2. Drag your documents, photos, archives — whatever you're backing up — into that unlocked drive.
3. Cryptomator encrypts each file on the fly and writes the ciphertext to the WebDAV-backed folder, which syncs to the cloud.
4. **Lock** the vault when done. On the server, all that exists is encrypted `.c9r` blobs with scrambled names.

To automate it, point a scheduled `rclone copy` (or your backup tool of choice) at the **unlocked** vault path, or sync the encrypted vault folder directly — either way the cloud only ever holds ciphertext.

---

## A Few Practical Tips

* **Guard the recovery key like cash.** It's the only way back in if you forget the password. Store it offline.
* **Keep versions/snapshots on the storage side.** Cryptomator encrypts; it doesn't version. Providers like Hetzner Storage Box offer snapshots — enable them so a bad sync or ransomware can't nuke your only copy.
* **Mind the 3-2-1 rule.** This stack is a great *off-site, encrypted* leg of a backup strategy — not your only copy. Keep a local backup too.
* **Test a restore.** A backup you've never restored from is a hope, not a backup. Periodically unlock the vault on a second machine and confirm files open.

---

## Conclusion

For the cost of a cheap WebDAV plan and ten minutes of setup, you get genuinely private, off-site backup where the provider is mathematically locked out of your data. **WebDAV** keeps it cheap and portable; **Cryptomator** keeps it yours. I've been running this exact setup against a Hetzner Storage Box and it's been quietly bulletproof.
