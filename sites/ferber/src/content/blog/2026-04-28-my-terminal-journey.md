---
title: "My Terminal Journey: From the 1995 DOS Prompt to Ghostty + Starship"
description: "Three decades at the command line — from the MS-DOS prompt and Windows 95, through PowerShell and Microsoft's Windows Terminal rewrite, a tour of FOSS terminal apps, settling on Termius for the SSH fleet, and finally replacing Terminal.app on macOS with Ghostty and a heavily customized Starship prompt."
tags: [terminal, ghostty, starship, macos, command-line, memoir]
thumbnail-img: /assets/img/terminal-journey-dos-to-ghostty.webp
---

![Retro computing](/assets/img/terminal-journey-dos-to-ghostty.webp)

# My Terminal Journey: From the 1995 DOS Prompt to Ghostty + Starship

I've spent the better part of thirty years staring at a blinking cursor, and the box that cursor lives in has changed more in the last five years than it did in the previous twenty-five. I wanted to write down the whole arc — partly as nostalgia, partly because the *why* behind each move says something about how my work changed along the way.

> **TL;DR:** I went from the **MS-DOS prompt** on Windows 95, to **PowerShell** and Microsoft's from-scratch **Windows Terminal** rewrite, through a long tour of **FOSS terminal apps**, and finally landed on **Termius** for managing my SSH fleet and **Ghostty + Starship** as my daily local terminal on macOS. Each jump solved a real problem the previous tool couldn't.

---

## 1995: It Started at the `C:\>` Prompt

My first command line wasn't a choice — it was just *the computer*. On Windows 95, the real power was one `command.com` away: the **MS-DOS prompt**. `dir`, `cd`, `copy`, `xcopy`, the occasional `edit` to bang out a batch file. If you wanted to actually *do* anything beyond clicking around in Program Manager, you dropped to DOS.

It was primitive — no tabs, no color to speak of, a fixed font, 80×25 characters — but it taught me the thing that's kept me at the keyboard ever since: **the command line is the shortest path between intent and result.** A GUI shows you what someone decided you'd need. A prompt does exactly what you say.

For years that was the whole world: `command.com`, then `cmd.exe` once I moved onto the NT line (Windows 2000, then XP). `cmd` was a genuine upgrade, but let's be honest — it aged into a museum piece. It couldn't even resize properly.

---

## PowerShell Changes the Game

Then, in 2006, **PowerShell** landed and reframed what a Windows shell even was. Instead of pushing dumb text around like Bash or `cmd`, PowerShell passed **objects** down the pipeline. `Get-Process | Where-Object CPU -gt 100 | Stop-Process` wasn't string-scraping — those were real .NET objects with real properties.

For someone drifting toward sysadmin and DevOps work, that was a revelation. Suddenly the shell was an automation engine, not just a place to launch programs. I wrote more PowerShell over the next decade than I'd care to admit — provisioning, Microsoft 365 administration, reporting, the works. (I still SSH into a dedicated M365 PowerShell VM to this day.)

But here's the catch: PowerShell the *language* was brilliant, while the **console window** hosting it was still the same creaky `conhost.exe` from the `cmd` days. Great engine, terrible dashboard.

---

## The Windows Terminal Rewrite

Microsoft finally fixed the *window* in 2019 with **Windows Terminal** — and crucially, they didn't patch the old console, they **rewrote it from scratch** as a modern, GPU-accelerated, open-source app. Tabs. Panes. Real truecolor. Custom fonts and ligatures. A JSON settings file you could version-control. One window that could host PowerShell, `cmd`, *and* WSL side by side.

It was the first time the Windows command line felt genuinely *nice* instead of merely *tolerable*. Microsoft open-sourcing it on GitHub also signaled the bigger shift of that era: the walls between "Windows person" and "Linux person" were coming down, and WSL meant I was suddenly running Ubuntu inside my Windows terminal every day.

That blurring is exactly what sent me wandering.

---

## The FOSS Terminal Tour

Once you've tasted a good terminal, you start *collecting* them. Over the years I tried a bunch of the open-source contenders, each with its own philosophy:

* **Cmder / ConEmu** — my gateway on Windows before Windows Terminal existed; ConEmu could wrangle multiple consoles into one tabbed window.
* **iTerm2** — the long-reigning macOS favorite; powerful to the point of overwhelming.
* **Alacritty** — GPU-accelerated, deliberately minimal, config-file-only. Blazing fast, no tabs (on purpose).
* **Kitty** — fast *and* featureful, with its own clever extensions.
* **WezTerm** — Lua-configurable, cross-platform, multiplexing built in.
* **Hyper** — beautiful, Electron-based, and a good reminder that "web tech for a terminal" has a performance tax.

Every one of them taught me something about what I actually wanted: **fast, truecolor, scriptable config I could check into git, and a sane default experience.** I didn't want a terminal that demanded a weekend of tinkering before it was usable — but I did want one that *rewarded* tinkering.

---

## Settling on Termius for the Fleet

Somewhere in there, my problem changed shape. It stopped being "which terminal renders nicest?" and became "how do I manage *connections to a dozen machines* without losing my mind?" Saved hosts, SSH keys, jump boxes, the same setup mirrored across my laptop and my phone.

That's a different job, and **Termius** is the tool I settled on for it. It's not where I do local dev — it's my **SSH command center**: saved hosts organized into groups, keys synced securely across devices, and a connection list that's identical whether I'm on the Mac or reaching for my phone to check a box from the couch.

I draw a hard line here, and it's saved me a lot of grief: **Termius owns the SSH fleet; my local terminal owns everything else.** Two tools, two jobs — I don't try to collapse them. Termius for "connect me to *that* server, anywhere"; the local terminal for Docker, git, scripts, and day-to-day driving.

---

## The Endgame: Ghostty Replaces Terminal.app

When I moved my daily work fully onto macOS, the stock **Terminal.app** was the obvious starting point — and it's *fine*. It's also stuck in the past: no truecolor, dated rendering, minimal customization. After all the tools I'd tried, settling for it felt like driving a rental.

Enter **[Ghostty](https://ghostty.org/)** — Mitchell Hashimoto's GPU-accelerated terminal (yes, the HashiCorp founder; you can feel the infrastructure-nerd sensibility in it). Written in Zig, fast as anything, native-feeling on macOS, and configured with a clean plain-text file I keep under version control. It's the first terminal that hit every note from my FOSS tour *without* the tradeoffs.

My current Ghostty setup:

* **Theme:** GitHub Dark Default
* **Font:** JetBrains Mono Nerd Font, 14pt (Nerd Font so all the icons in my prompt and file listings render)
* **Splits:** `cmd+d` right, `cmd+shift+d` down, `cmd+opt+arrows` to move between them
* Bar cursor, copy-on-select, a subtle 0.96 opacity, and `cmd+shift+,` to hot-reload the config without restarting

I even made it the **system default terminal** (Ghostty's app menu does it in one click) — now even Finder's right-click "Open in Terminal" lands me in Ghostty. Terminal.app has officially left the building.

---

## All About Starship: The Prompt That Ties It Together

Here's the thing most people miss: the terminal *app* is only half the experience. The other half is the **prompt** — the bit of text in front of every command — and that's where **[Starship](https://starship.rs/)** completely changed my setup.

Starship is a single, blazing-fast, cross-shell prompt written in Rust. Drop one binary in, add one line to your shell config, and it works in zsh, Bash, PowerShell, Fish — *everywhere*. That cross-shell part matters to me: the prompt on my Mac looks identical to the prompt when I SSH into a Linux box, because it's the same `starship.toml` shipped everywhere.

The magic is that it's **context-aware**. The prompt shows you only what's relevant, right now:

* In a git repo? It shows the branch and dirty/clean status.
* In a Node, Python, Ruby, or Rust project? It shows the language version — but *only* in those project directories.
* SSH'd into a server? It surfaces the hostname so I never fat-finger a command on the wrong box. Locally, that hostname stays hidden to keep things clean.

And it's all driven by one human-readable `~/.config/starship.toml`. A few of the tweaks I run:

```toml
# Show the hostname ONLY over SSH — clean prompt locally, clear ID on remote boxes
[hostname]
ssh_only = true

# Only show the Ruby version inside actual Ruby projects, not globally
[ruby]
detect_variables = []
```

Want to know what every segment of your prompt is doing (and how fast it renders)? `starship explain` breaks it down module by module. That kind of transparency is exactly the opposite of where I started in 1995, squinting at a monochrome `C:\>`.

---

## What Thirty Years Taught Me

Looking back, every jump was the same move at a different altitude: **get the friction out from between me and the machine.** DOS removed the GUI middleman. PowerShell turned the shell into an automation engine. Windows Terminal made the window worth looking at. Termius tamed the fleet. Ghostty and Starship made my daily driver fast, beautiful, *and* portable across every machine I touch.

If you're still living in the stock terminal your OS shipped with, consider this your nudge: spend an afternoon with a modern terminal and Starship. The cursor's been blinking the same way since 1995 — but everything around it has gotten *so much better*.
