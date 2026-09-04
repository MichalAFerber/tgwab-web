---
title: "UploadWizard: Client Files, Your Brand, Your Bucket"
description: "A white-label intake portal — magic-link sign-in, custom domain, virus scan — where files go to the client's S3, not mine. What shipped, what the dedicated droplet taught me, and why I folded it onto the public web box."
tags: [products, saas, cloudflare, caddy, storage]
thumbnail-img: /assets/img/uploadwizard.webp
---

![A laptop drop zone next to folders and a USB stick landing in a storage crate](/assets/img/uploadwizard.webp)

# UploadWizard: Client Files, Your Brand, Your Bucket

I got tired of "please email me the PDF" turning into a 25 MB bounce, a WeTransfer page with someone else's ads, and a Dropbox folder I would forget to close.

[UploadWizard](https://uploadwizard.app) is the other shape: a branded upload portal on *their* domain, files landing in *their* bucket. I never hold the bytes. That is the product, not a slogan on a landing page that then POSTs to my S3.

## What it actually does

A business gets a portal. Clients sign in with a magic link or a six-digit code — no password to reset, no "forgot my login" ticket. Access is checked against the member list the business already has (SQL Server today; the API is the seam). They drop files. The files go to Wasabi, AWS S3, Azure Blob, or GCS — whichever bucket the business connected.

Professional plan and up: point a CNAME at us, HTTPS shows up. No certificate homework on their side. Caddy's on-demand TLS asks the app "is this hostname allowed?" before it will mint a cert. If the name is not in the tenant table, there is no certificate. That is the whole custom-domain story.

White-label means logo, colors, favicon, custom CSS. The client should never see the word UploadWizard. If they do, the branding failed.

The rest is the boring security I would demand if I were the customer: virus scanning, size and type limits, retention, an audit trail, credentials encrypted at rest. Admins can always pull a file. Whether a client can delete their own is a per-business toggle.

## The pricing I will defend

Starter is $9/month (or $90/year): one business, 250 members, S3, magic link. Professional is $29/$290: custom domain, all storage backends, scanning, email-forward of uploads. Enterprise is a conversation. Thirty-day trial on the paid plans. Cancel before day 31 and you were never charged.

That is not "free forever" like [ResizeWizard](/2026-04-23-resizewizard/). This is a server, a database, a vault, and someone else's object storage. The bill has to exist. The trial exists so a club treasurer can try it without a procurement cycle.

## What I tore down

I ran UploadWizard on its own cloud droplet for a while. Dedicated IP, dedicated Caddy, dedicated Postgres. In June 2026 I folded the app onto the public web box I already operate — restored the database with row-parity, copied the encryption key so tenant credentials still decrypted, merged the wildcard and on-demand TLS into that box's Caddyfile, destroyed the droplet the same day.

The dedicated box was a luxury. The product is the Caddyfile, the Postgres, and the vault. A second public IPv4 that only existed so I could say "it has its own server" was a bill and a heartbeat and a DNS-01 token that, it turned out, had already been revoked and was living on cached certs. I found that during the move. I minted a scoped token for the `uploadwizard.app` zone and kept going.

Nightly: dump the database to a path that already rides the backup chain, then the rest of the stack. Named Docker volumes are how you *think* you have a backup until you restore a tarball of bind mounts and the database is not in it. I will not make that mistake twice.

## What this is not

It is not the [File Viewer](/2026-06-29-file-viewer-family/) family. Those apps never upload. UploadWizard exists because some workflows *must* take a file from a person who is not you and put it in a bucket you control. Different constraint, different product.

It is also not "we store it for you, cheap." I do not want a second copy of someone else's membership roster on a disk I own. Bring your own storage or do not use it.

The local lab copy of the stack is for development. Production is the public hostname. If you cannot explain the TLS ask endpoint in one sentence, you are not ready to onboard a custom domain.

Small SaaS. Real tenants. Files that are not mine. That is the launch, not a feature matrix.
