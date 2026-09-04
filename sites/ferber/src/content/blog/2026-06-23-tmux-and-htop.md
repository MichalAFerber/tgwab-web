---
title: "tmux and htop Like a Pro"
description: "How I actually use tmux on macOS and Linux — a small session manager, the handful of keys that matter — and why my top command is really btop."
tags: [tmux, linux, macos, cli, productivity]
thumbnail-img: /assets/img/tmux-htop.webp
---

![Split terminal session on a dark desk](/assets/img/tmux-htop.webp)

# tmux and htop Like a Pro

I live in Ghostty on the Mac and in SSH sessions everywhere else. The thing that makes that survivable is **tmux**: sessions that outlive a dropped laptop lid, splits that don't depend on the terminal app, and a named place to put "the blog work" versus "the Claude session" versus "the box I am about to reboot."

htop is the other half of "like a pro" that everyone recommends. I installed it, used it, and then aliased `top` to **btop**. Same job, denser picture. I'll cover both.

## tmux: what I actually type

I don't memorize a zoo of `tmux` flags. I have a small wrapper, `~/bin/tm`, that attach-or-creates a session and is nested-safe (it `switch-client`s if I'm already inside tmux).

| Command | What it does |
|---|---|
| `tm` | list sessions |
| `tm blog` | attach or create a session named `blog` |
| `tm kill blog` | kill that session |
| `tm --claude` | attach or create `cc-main` and launch Claude Code |
| `cc` / `ccw` / `ccp` | thin aliases over `tm --claude` for main / work / personal |

The point of the wrapper is not cleverness. It's that I never have to remember whether the session exists. Attach-or-create is the whole API.

Prefix is the default `Ctrl-b`. I didn't remap it. Fighting muscle memory across a dozen boxes is how you lose an afternoon.

## The keys that matter

Learn these and ignore the rest until you need them:

- `Ctrl-b c` — new window
- `Ctrl-b n` / `p` — next / previous window
- `Ctrl-b %` / `"` — split vertical / horizontal
- `Ctrl-b arrow` — move between panes
- `Ctrl-b d` — detach (session keeps running)
- `Ctrl-b [` — copy mode, so you can scroll and search without a mouse

Windows are for *jobs* (edit, logs, a long compile). Panes are for *glancing* (htop next to a tail). If you split until you have six postage stamps, you've lost.

Detaching is the feature. SSH from the MacBook, `tm ops`, start a dist-upgrade, `Ctrl-b d`, close the lid. Tomorrow `tm ops` and you're still in the same shell.

## Nested tmux

I SSH into boxes that already run tmux. Nested prefixes are misery. The wrapper uses `switch-client` when `$TMUX` is set so I don't stack a second server inside the first. If you only remember one "pro" trick, make it that.

## htop, then btop

**htop** is the right upgrade from `top`: color, a process tree, F-keys to kill and renice, no `ps aux | grep` archaeology. On a fresh Ubuntu box I still install it first because it's in the default repos and every how-to assumes it.

On the Macs, `top` is aliased to **btop**. Denser, prettier, same information. The alias lives in chezmoi with the rest of the dotfiles, next to `ls` → `eza` and `cat` → `bat`. I left the names of the old tools in my fingers and swapped the binaries underneath.

```bash
# macOS
brew install tmux htop btop

# Debian/Ubuntu
sudo apt install tmux htop
# btop via the distro package or a GitHub release if apt is ancient
```

If `top` errors after a fresh Mac setup, I forgot to `brew install btop`. That's happened. The alias is not a substitute for the binary.

## A sane default session

When I sit down to real work:

```bash
tm blog          # or tm ops, tm lab
# Ctrl-b %       split
# left pane: $EDITOR
# right pane: htop or a log tail
```

That's "like a pro." Not a 40-binding tmux.conf you copied from a gist in 2014 and don't understand. Named sessions, detach without fear, one process viewer you actually read.
