---
title: "pfSense on a Netgate 4200"
description: "The edge is an appliance, not a Pi. Firewall and NAT only. DNS and DHCP live elsewhere so a pfSense reboot does not take the house with it."
tags: [homelab, pfsense, networking, firewall]
thumbnail-img: /assets/img/pfsense-netgate.webp
---

![A compact network appliance at the front of a homelab rack](/assets/img/pfsense-netgate.webp)

# pfSense on a Netgate 4200

I used to let the edge box be everything: firewall, DHCP, DNS, VPN, a package list that looked like a resume. Then I rebooted it for an update and the house lost leases and names until it came back.

The Netgate 4200 runs **pfSense Plus**. WAN on one 2.5 GbE, LAN on another. Stateful firewall and NAT. That is the job. [Unbound](/2026-05-26-unbound-dns-two-years-later/) and Kea live on dedicated VMs I can reboot without dropping the internet.

## Why an appliance, not a Pi router

AES-NI, ECC RAM, four 2.5 GbE ports, a serial console, a config that restores onto a replacement in minutes. A Pi can pass packets. It is also an SD card and a USB NIC away from an afternoon. The edge is the wrong place to be cute.

WAN is residential cable. Serial is 115200 8N1 when the GUI is a brick. I am not publishing the public IP, the LAN CIDR, or the rule dump. Those fingerprint the house.

## The firewall is inbound on an interface

Rules are per-interface, top-down, first match wins, on traffic *entering* that interface. Default-deny on WAN. Aliases for groups of hosts — named things beat scattered addresses. Floating rules apply across interfaces and are the usual reason "my rule is not matching."

Port forwards auto-create the associated firewall rule. Do not also hand-make one. Outbound NAT stays automatic until you need Hybrid.

`/conf/config.xml` *is* the firewall. Download it after every meaningful change. Console option **16** restores a recent config when you have firewalled yourself out. Option **11** restarts the GUI without a reboot. AutoConfigBackup if you have a Netgate account. A fresh install plus that XML is a rebuilt edge.

```sh
pfctl -s rules
pfctl -s states
pfctl -F state          # kills connections — forces re-eval
```

Do not `pfctl -d` unless you mean "open everything for a minute."

## What moved off the box

DNS resolver: **off**. DHCP: **off**. They were a single point of failure sitting on the one device that also has to take a firmware. The [zero-trust](/2026-06-30-zero-trust-homelab-warp-fail2ban/) post is WARP and Fail2ban. This box is still the NAT boundary those tunnels and forwards sit behind.

VPN on the Netgate is still a maybe. WireGuard is built in and would be the default if I concentrate it here. I will not pretend a lab I have not finished.

## The trap

pfSense *can* run Suricata, HAProxy, Unbound, Kea, a captive portal, and your dignity. A homelab learns that consolidating them onto the edge makes the edge a config-sprawl nightmare. Run the firewall on the firewall. Keep serial access. Back up the XML. Let DNS and DHCP lose a VM without losing the WAN.
