---
title: "A New Dev Starter Pack (2026)"
description: "What I actually install on a new Mac or Ubuntu box: Ghostty, chezmoi, a small brew list, git defaults, and the rule that secrets never go in the repo."
tags: [macos, linux, dotfiles, git, productivity]
thumbnail-img: /assets/img/new-dev-starter-pack.webp
---

![Clean workstation with a coffee mug and an open laptop](/assets/img/new-dev-starter-pack.webp)

# A New Dev Starter Pack (2026)

The 2025 title can retire. This is the pack I would give a new machine — or a new human who already knows another language and does not need a "what is a terminal" lecture.

It is not a rice screenshot. It is not 80 VS Code extensions. I already keep [those](/2025-06-10-favorite-vscode-extensions/) and a [free-tools list](/2025-06-24-free-tools-used-regularly/) elsewhere.

## 1. A real terminal and a real prompt

On a Mac: **Ghostty**, JetBrains Mono Nerd Font, **Starship**. Make Ghostty the default terminal so Finder's "Open in Terminal" doesn't dump you into 1999.

On a server: skip Ghostty (no GUI). Install Starship so SSH looks like home.

```bash
brew install --cask ghostty font-jetbrains-mono-nerd-font
brew install starship
```

## 2. Dotfiles as code

**chezmoi.** Init from the repo, apply, never edit `~/.zshrc` "just this once."

```bash
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply git@github.com:michalferber/dotfiles.git
```

Edit → `chezmoi diff` → `chezmoi apply` → commit → `chezmoi update` on the other Mac. That's Terraform for `$HOME`.

## 3. The brew list

```bash
brew install starship zsh-autosuggestions zsh-syntax-highlighting \
  fzf eza bat ripgrep fd zoxide btop git-delta chezmoi tmux
```

That's: a prompt, two zsh plugins, fuzzy find, modern `ls`/`cat`/`grep`/`find`/`cd`/`top`, a pager for git diffs, tmux. I aliased several of those (`ls` → eza, `cat` → bat, `top` → btop) so the old names still work — details in the [aliases post](/2026-09-01-git-aliases-and-shell-functions/).

If the box is Ubuntu, the names change (`batcat`, `fdfind`) and `eza` may need a different source. The *jobs* don't change.

## 4. Git, on purpose

```bash
git config --global user.name "Michal Ferber"
git config --global user.email "you@your-domain"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global alias.st "status -sb"
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global rerere.enabled true
```

SSH key to GitHub, not HTTPS passwords. `gh` if you live in PRs.

## 5. Secrets stay off git

```bash
# ~/.config/secrets.env  chmod 600  NOT in chezmoi
export CF_API_TOKEN='...'
```

`.zshrc` sources it if present. The token that was once pasted into a file that got committed is why this is item five, not a footnote.

## 6. Language managers, not system Python

`nodenv` (or fnm) for Node. Don't `sudo npm -g` on a Mac you care about. Python via the plan I already wrote, not `python3` from 2019 as your only interpreter. Rust when you have a CLI to build, not on day one.

## 7. What I skip on day one

- A window manager religion.
- Docker Desktop if you don't need it yet. Colima or a remote Docker host when you do.
- Nextcloud, a mail server, and a dashboard. That's [self-hosting 101](/2026-06-16-self-hosting-101/), week two.
- Ten VS Code themes.

## The 30-minute version

1. Install Homebrew (Mac) or the equivalent compilers (Ubuntu).
2. Install Ghostty + Starship + the brew list.
3. chezmoi init from git.
4. Git identity + `st`/`lg`.
5. `secrets.env`.
6. Reboot once so PATH and fonts stop lying.

Then go do the work. The starter pack is so you stop tinkering with the starter pack.
