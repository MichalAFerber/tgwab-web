---
title: "Control D on a Nintendo Switch: Bedtime, Filters, and One Activity Log"
description: "How I use Control D to shut my daughter's internet off at night, filter what she can reach, and see what her devices ask for, including the Nintendo Switch, which can't run Control D on its own."
tags: [dns, homelab, privacy, networking, how-to]
---

# Control D on a Nintendo Switch: Bedtime, Filters, and One Activity Log

My daughter has five devices that reach the internet: an Apple TV, an iPad, a [Raspberry Pi 5](/2026-03-10-raspberry-pi-for-kids-homeschool/), a Chromebook, and a Nintendo Switch. I wanted three things from all of them, managed from one place:

1. **Internet off on a schedule.** Off in the evening, back on in the morning, without me walking around the house unplugging things.
2. **Filtering.** No ads. Nothing from domains that are brand new or have a bad reputation. Nothing adult or otherwise not for her. I've locked it down to the handful of sites she actually uses and we've approved, with an allow list for the ones a category block would otherwise catch.
3. **An audit trail.** One place to see what her devices are asking for.

[Control D](https://controld.com) does all three, and the plan I'm on runs about $4 a month. Four of her devices can talk to Control D directly. The Switch can't, so it needs a small resolver on the network. This post covers both halves: the Control D dashboard, then the resolver and the Switch.

## How Control D is organized

Four ideas cover everything below:

- **Profile.** A set of rules: which filters are on, which services are blocked, your custom rules, and a default rule for everything else.
- **Endpoint.** A device (or a network) that uses a profile. Each endpoint gets its own resolver address, and each endpoint has an **Enforced Profile**.
- **Schedule.** A weekly calendar on an endpoint that swaps in a different profile during the windows you choose. Outside those windows, the enforced profile applies.
- **Analytics.** Per-endpoint logging. At **Full Analytics**, you get the **Activity Log**: every query, from every device, with a timestamp.

The one thing to hold on to: **schedules belong to endpoints, not profiles.** Every device that shares an endpoint shares its schedule.

## Job 1: Internet off on a schedule

A schedule swaps in a profile, so first you build the profile it swaps in.

1. **Make a "Block Everything" profile.** Create a new profile and set its **Default Rule** to block. With no other rules, every lookup fails.
2. **Open the endpoint** under Endpoints and select the schedule icon beside **Enforced Profile**.
3. **Add the windows.** A window can't cross midnight, so an overnight block is two windows: one from the evening start to the end of the day, and one from midnight to the morning end on the next day. The copy icon beside a day copies its windows to other days.
4. **Check the timezone** shown below the calendar, then select **Save schedule**.

One documented quirk: a window that ends at the end of the day leaves a one-minute gap between 23:59 and 00:00. I can live with a minute.

## Job 2: Filters and the allow list

Filtering lives on the daytime profile, the one the endpoint enforces outside the schedule.

**Filters** are Control D's category lists. The ones doing the work for me:

- **Ads & Trackers**
- **Malware** and **Phishing**, for the bad-reputation half
- **New Domains**, for recently registered domains, which is where a lot of junk lives
- **Adult Content**, plus the other categories that aren't for a kid: **Dating**, **Gambling**, **Drugs**, and so on

**Custom Rules** are where the allow list lives. Control D gives a custom rule one of three actions: **Block**, **Bypass**, or **Redirect**. **Bypass** resolves the domain normally even when a filter, a blocked service, or the default rule would have caught it, and the most specific rule wins. So when a site she needs lands in a blocked category, it gets a Bypass rule instead of me loosening the whole category.

That is how you end up with a device that reaches a short, parent-approved list of sites and not much else.

## Job 3: One audit trail

Edit each endpoint and set its analytics level to **Full Analytics**. That's the level that keeps the Activity Log, the per-query history. Two things worth knowing before you turn it on:

- Raw query logs are kept for **one month at most**. Summary statistics last longer.
- You choose where the data is stored under **Preferences → Account → Storage Region**, and you can delete all of it from **Preferences**.

If you want the log to say *which* device asked for something, give each device its own endpoint. The trade-off is that each of those endpoints then needs its own copy of the schedule.

## Why the Switch needs help

The other four devices can use Control D's encrypted resolvers directly; the setup page for each endpoint walks you through the platform. The Switch can't. It only speaks plain DNS on port 53, with no DNS over HTTPS and no DNS over TLS.

Control D's answer for plain-DNS devices is **Legacy DNS**: resolver IP addresses you can type into anything. The catch is that its IPv4 resolvers only enforce your profile for source IP addresses Control D knows are yours. When your ISP changes your home's public address, the Switch keeps resolving, just without your profile. No bedtime, no filters, and no error to tell you. Everything looks fine.

So the Switch doesn't talk to Control D at all. It talks to a small resolver on my network, and that resolver talks to Control D over HTTPS.

## Build the resolver

The resolver is **ctrld**, Control D's own open-source DNS forwarder. It needs almost nothing. Mine is a Debian container on Proxmox with one core and 256 MB of RAM, and it keeps no state. Any always-on Linux box with a fixed address works; a Raspberry Pi is plenty.

In the examples, the resolver is at `192.168.1.53` and the Switch at `192.168.1.60`. Use your own addresses.

**1. Get the endpoint's resolver ID.** In the Control D dashboard, open the endpoint the Switch will use (the one with the schedule) and copy its DNS-over-HTTPS address: `https://dns.controld.com/` followed by the resolver ID. Treat that ID like a password: anyone with it can resolve through your profile, and their queries land in your Activity Log.

**2. Install ctrld.** Download the Linux tarball for your architecture from the [Control-D-Inc/ctrld releases](https://github.com/Control-D-Inc/ctrld/releases), check it against the release's `checksums.txt`, and install the binary:

```bash
sudo install -m 0755 ctrld /usr/local/bin/ctrld
sudo mkdir -p /etc/controld
```

**3. Write the config** at `/etc/controld/ctrld.toml`, and make it readable only by root (`chmod 600`), since it holds the resolver ID:

```toml
[service]
  # If Control D is unreachable, fail instead of quietly
  # answering through the box's own resolver.
  leak_on_upstream_failure = false
  # No local cache, so ctrld never serves an answer from before the schedule changed.
  cache_enable = false

[listener.0]
  ip   = "192.168.1.53"
  port = 53

[upstream.0]
  name     = "Control D - Kids"
  type     = "doh"
  endpoint = "https://dns.controld.com/YOUR_RESOLVER_ID"
  timeout  = 5000
```

**4. Start it as a service:**

```bash
sudo ctrld service start --config /etc/controld/ctrld.toml
```

That installs and enables a systemd service and leaves the box's own DNS settings alone. Don't confuse it with `ctrld start`, which rewrites the host's DNS. That's the wrong behavior for a machine whose only job is answering other devices.

**5. Test it** from another machine on the network:

```bash
dig @192.168.1.53 example.com
```

Outside the schedule, you get a real address. Inside it, you get `0.0.0.0` with status `NOERROR`. `SERVFAIL` means ctrld can't reach Control D.

## Point the Switch at it

Two ways, and I use the first.

**A DHCP reservation.** Give the Switch a fixed address, with the resolver as its **only** DNS server. I run [Kea](/2026-05-25-omada-kea/), so mine looks like this:

```json
{
  "hw-address": "aa:bb:cc:dd:ee:ff",
  "ip-address": "192.168.1.60",
  "hostname": "nintendo-switch",
  "option-data": [
    { "name": "domain-name-servers", "data": "192.168.1.53" }
  ]
}
```

The Switch's MAC address is under **System Settings → Internet**. It picks up the change at its next lease renewal, or right away when it reconnects.

**Or set it on the console.** Under **System Settings → Internet → Internet Settings**, pick your network, then **Change Settings → DNS Settings → Manual**, and enter the resolver as the primary DNS.

Either way, list **one** server. If you add a second resolver as a fallback, the Switch fails over to it the moment Control D starts blocking, and bedtime stops existing.

## The traps

These are the ones that bit me, or would have:

- **`leak_on_upstream_failure` defaults to `true` on Linux.** With `true`, when Control D is unreachable, ctrld answers through the box's own resolver, and the schedule silently stops applying. Set it to `false`, and the Switch simply has no DNS when the upstream is down. It fails closed.
- **A blocked answer isn't an error.** Blocks come back as `NOERROR` with `0.0.0.0`. A health check that looks for `NOERROR` can't tell a working resolver from one that's blocking everything. Check for `SERVFAIL` instead.
- **The Switch checks its own connection.** At night the console reports no connection, which is the point. During the day, your daytime profile has to let through `ctest.cdn.nintendo.net` and `conntest.nintendowifi.net`, or the Switch reports no connection all day. Bypass rules fix it.
- **A manual DNS setting on the console bypasses all of this.** Anyone who can type `8.8.8.8` into the Switch's DNS settings is out. I accepted that risk. If you don't, block outbound ports 53 and 853 from the Switch's address at your firewall. On a flat network, also refuse it at your LAN resolvers, since that traffic never crosses the firewall.

## What DNS can't do

A DNS block stops *new* lookups. It doesn't cut a connection that's already open, and it doesn't touch a game that never goes online. At bedtime, what she notices is that the eShop and the streaming apps stop working, not that the console turns off.

For play time itself, Nintendo's own **Nintendo Switch Parental Controls** app is the right tool: daily play-time limits, a bedtime alarm, and restrictions by game rating. Control D and the Parental Controls app do different jobs, and I use both.

## Where it landed

One dashboard, five devices, one bedtime. The iPad, Apple TV, Chromebook, and Pi talk to Control D directly. The Switch talks to a 256 MB container that talks to Control D. When something gets blocked that shouldn't be, it's a Bypass rule and thirty seconds. And when I want to know what her devices have been reaching, it's all in one Activity Log.
