---
title: "Git Aliases and Shell Functions I Actually Use"
description: "A short gitconfig, a tmux wrapper, and the command names I refuse to retype — st, lg, tm, and the modern-unix swaps sitting under ls and cat."
tags: [git, zsh, shell, dotfiles, productivity]
thumbnail-img: /assets/img/git-aliases.webp
---

![Laptop with a git log graph on screen](/assets/img/git-aliases.webp)

# Git Aliases and Shell Functions I Actually Use

I don't have a 200-line `alias` museum. I have a handful of names I type every day, shipped through chezmoi so the Mac Mini and the MacBook don't drift. If it isn't in this post, I probably type the real command.

## Git

```bash
git config --global pull.rebase true
git config --global init.defaultBranch main
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.st "status -sb"
git config --global rerere.enabled true
```

**`st`** is status, short, with branch. I run it the way some people tap a spacebar.

**`lg`** is the graph. Feature branches, the accidental commit on `main`, the rebase I need to see. `--all --decorate` or it isn't useful.

`pull.rebase true` because merge commits from `git pull` are noise I don't want in a repo I own. `rerere` because I have resolved the same conflict twice and I am not proud of it.

Force-push is `--force-with-lease` or it is a lecture I give myself. That isn't an alias. It's a scar.

## The shell names I overrode

These live in `.zshrc`, not git:

| I type | It runs |
|---|---|
| `ls` | `eza --group-directories-first --icons` |
| `ll` | `eza -lah --icons --git` |
| `cat` | `bat --paging=never` |
| `top` | `btop` |
| `cd` | `z` (zoxide) |

I did **not** alias `grep` to `rg` or `find` to `fd`. Different flags. Muscle memory from a 1998 `grep -r` should still work when I am on a box that only has grep.

On Debian, `bat` is `batcat` and `fd` is `fdfind`. Two symlinks in `~/.local/bin` and the aliases stay identical. That's the only distro-shame in the set.

## tmux is a function (almost)

`tm` is a small script in `~/bin`, not a one-line alias. Attach-or-create, nested-safe. `tm blog`, `tm --claude`, `cc` as a wrapper. The wrapper *is* the workflow; the keybinds are in the [tmux post](/2026-06-23-tmux-and-htop/).

`rcc` / `rmini` SSH to the Mini and attach the Claude session. That's the closest thing I have to "remote desktop for the terminal."

## What I will not alias

- `rm` to `rm -i`. I want the dangerous command to feel dangerous.
- `git push` to anything that implies `--force`.
- Secrets. Tokens go in `~/.config/secrets.env`, chmod 600, sourced, never in the alias file, never in chezmoi.

## The test

If I can't remember the alias on a fresh VM, it shouldn't exist. `st` and `lg` pass. A four-layer `!git` function that formats a commit with cowsay does not.

Keep the list short enough to memorize. Put it in git. Apply it with chezmoi. That's the whole "dotfiles as infrastructure" pitch, at the scale of two letters.
