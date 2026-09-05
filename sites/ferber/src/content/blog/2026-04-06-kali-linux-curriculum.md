---
title: "Kali Linux for the Homelab: A Curriculum"
description: "A lab-only Kali plan for a 30-year IT veteran. Same shape as the Python and Rust posts. The internet is not the lab."
tags: [kali, linux, learning, homelab, security]
thumbnail-img: /assets/img/kali-linux-curriculum.webp
---

![A laptop on a desk showing a green terminal, with a small unlabeled network of blank boxes beside it](/assets/img/kali-linux-curriculum.webp)

# Kali Linux for the Homelab: A Curriculum

[Python](/2026-03-03-my-python-learning-plan/) was five weeks to stop reaching for Bash. [Rust](/2026-03-17-learning-rust-my-approach/) was read-it-and-build-a-CLI, not become a compiler engineer. The [Pi for kids](/2026-03-10-raspberry-pi-for-kids-homeschool/) post is a different person and a different computer. This one is mine.

I have spent three decades *defending* networks. I still need to read the tools that show up in a report, on a box I own, without turning the house WAN into a shooting range.

## The box

Kali runs as a **container with a web desktop**, not as the firewall and not as a USB stick I boot the family PC from. LinuxServer's image. Browser session. It can go away when I am done. The [zero-trust](/2026-06-30-zero-trust-homelab-warp-fail2ban/) and [pfSense](/2026-06-01-pfsense-netgate/) posts are how the edge stays boring. Kali does not live there.

If the desktop is up, I am in a lab. If I close the tab, the lab is still contained.

## Ground rules

- **Only systems I own.** A VM I stood up. A deliberately weak app I installed. The homelab subnet in the sample is `10.0.0.0/24` / `lab.example.com`. Real addresses stay off this page.
- **No scanning past the WAN.** No "just checking" a client, a neighbor, or a random IP from a blog. That is not a curriculum. That is a crime.
- **30–60 minutes a day.** Same rule as Python. A weekend OSCP dump is how this becomes a graveyard tab.
- **Write down what you broke.** A note in the vault beats a screenshot you cannot find in six months.

I am not collecting certs in this pass. I am not teaching a child to pentest. I am making the tool names in a report stop being folklore.

## The plan

### Week 1 — the distro, not the myth

Boot the desktop. Update. Find `nmap`, `tcpdump`, `wireshark`, a browser. Learn where *your* notes go so they survive a container recreate. Do not install every metapackage "because Kali." Disk and RAM are not infinite on a lab VM.

End of week: I can open the desktop, run `nmap --version`, and shut it down without taking the house with it.

### Week 2 — recon against a box I built

Stand up a throwaway Ubuntu VM (or a container) whose only job is to be scanned. `nmap` it. Read the ports. Change one service. Scan again. That loop is the whole week.

The [Proxmox](/2026-03-26-proxmox-ubuntu-vm-setup/) post is how I get a guest. The guest is the target. Kali is the glasses.

### Week 3 — a web app I installed on purpose

Put something *meant* to be broken on that guest — OWASP Juice Shop, DVWA, whatever I will actually finish. Browse it from Kali. Intercept my own traffic. Change a cookie *on my app*. Stop when it is no longer my app.

If I cannot name the URL I am hitting as mine, I do not hit it.

### Week 4 — secrets I made

Hash a password I invented. Crack *that* file. Do not download someone else's dump "for practice." The skill is the tool. The dump is other people's lives.

### Week 5 — defend what you just learned

Take one finding from weeks 2–4 and close it on a box I actually use: a package I did not need, a port I did not mean to publish, a default I left on. Write the before and after.

The curriculum is not "I ran Kali." The curriculum is "I can point at a thing I own and say what changed."

## What this is not

It is not a 30-week kids' Pi course. It is not OSCP in a blog post. It is not permission to point `nmap` at `example.com` on the public internet because a tutorial used that name.

The Python plan ends when I can read other people's Python. This one ends when I can read a scan of **my** lab and not panic, and when I can put the tools away without leaving a listener on the LAN.

Same series. Different lab. Same rule: own the target, or do not press enter.
