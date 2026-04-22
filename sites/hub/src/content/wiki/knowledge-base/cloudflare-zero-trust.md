---
title: "Cloudflare Zero Trust"
---
**Architecture Summary**

```
Internet / WARP Clients
        ↓
Cloudflare Edge (Atlanta)
        ↓
homelab tunnel (89c486fb...)
        ↓
pi4a + pi4b (redundant connectors)
        ↓
192.168.50.0/24 (pfSense LAN)
```

**What routes traffic where:**

- `*.mykk.us` → wildcard CNAME in DNS → tunnel → NPM at `192.168.50.11:80` → individual services
- `pfsense.mykk.foo` → tunnel → `https://192.168.50.1` (noTLSVerify)
- `pve.mykk.foo` → tunnel → `https://192.168.50.23:8006` (noTLSVerify)
- `192.168.50.0/24` CIDR → WARP clients get full subnet access for SSH/direct IP

**When you add a new self-hosted service:**

1. Add proxy host in NPM pointing to the service — it's immediately live at `newservice.mykk.us` via the wildcard, no other changes needed
2. If you want a `mykk.foo` URL instead, add a published application route in the tunnel and a ZT Access application to protect it

**When you add a new internal service that needs direct access:**

Nothing — CIDR routing already covers all of 192.168.50.x

**When you add a new device that needs remote access:**

Install Cloudflare One Client → enroll in `techguywithabeard` org → device gets full tunnel access automatically

**Things that live in the Cloudflare dashboard:**

- https://dash.cloudflare.com/8a0d49b1f3fdcdadec135562ec8a4fdc/tunnels/89c486fb-1b05-4d9c-be9f-d826019f988b/overview
- https://dash.cloudflare.com/8a0d49b1f3fdcdadec135562ec8a4fdc/one/networks/connectors
	- **Zero Trust → Networks → Tunnels → homelab → Published application routes** — individual service URLs (pfSense, PVE, NPM)
	- **Zero Trust → Networks → Tunnels → homelab → CIDR routes** — subnet routing
- https://dash.cloudflare.com/8a0d49b1f3fdcdadec135562ec8a4fdc/one/access-controls/apps
	- **Zero Trust → Access controls → Applications** — ZT Access policies protecting pfSense and PVE
	- **Zero Trust → Team & Resources → Devices → Management → Enrollment** — controls who can enroll WARP
	- **Zero Trust → Team & Resources → Devices → Default profile → Split Tunnels** — controls what traffic WARP routes through the tunnel
- https://dash.cloudflare.com/8a0d49b1f3fdcdadec135562ec8a4fdc/mykk.us/dns/records
	- **Cloudflare DNS → mykk.us** — wildcard CNAME pointing to tunnel, do not touch individual A records (they're gone now)
- https://dash.cloudflare.com/8a0d49b1f3fdcdadec135562ec8a4fdc/mykk.foo/dns/records
