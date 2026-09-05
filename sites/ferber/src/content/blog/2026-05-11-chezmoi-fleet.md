---
title: "chezmoi for the Fleet"
description: "One dotfiles repo, three kinds of target: macOS and Windows via chezmoi, Linux servers by SSH push. Secrets never committed. Edit the source, not the live file."
tags: [dotfiles, chezmoi, macos, linux, homelab]
thumbnail-img: /assets/img/chezmoi-fleet.webp
---

![Two matching laptops on a desk, each with the same stack of blank cards](/assets/img/chezmoi-fleet.webp)

# chezmoi for the Fleet

The [starter pack](/2026-04-09-new-dev-starter-pack-2026/) already said the sentence: chezmoi is Terraform for `$HOME`. This post is how the repo actually splits, because I do not run chezmoi on the Linux servers.

One source. Three kinds of target:

- **macOS** — full tree: zsh, Ghostty, starship, git, tmux, `bin/`. chezmoi.
- **Windows** — pwsh + Windows Terminal. chezmoi. Unix shell files gated off.
- **Linux fleet** — a portable subset (tmux, starship, gitconfig, gitignore, terminfo) **pushed over SSH from a Mac**. Not chezmoi. chezmoi on a headless box that I barely log into is a second control plane I do not want.

[Welcome Message v2](/2026-05-28-welcome-message-v2/) is why the MOTD stopped being `curl | bash` on machines I have named. [Git aliases](/2026-04-02-git-aliases-and-shell-functions/) live in this tree on the Macs.

## Never edit the live file

A new Mac:

```sh
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply MichalAFerber
```

A Windows box:

```powershell
winget install twpayne.chezmoi Git.Git Microsoft.PowerShell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
# new terminal, then:
chezmoi init --apply MichalAFerber
```

That source repo is private. The command is the pattern, not an invitation to clone my `$HOME`. After that:

```sh
chezmoi edit ~/.zshrc   # source, not the live file
chezmoi diff
chezmoi apply
chezmoi update          # pull + apply
```

`chezmoi edit`, not `vim ~/.zshrc` "just this once." If it is not in the repo, it is a surprise on the laptop I did not bring.

OS differences are templates plus `.chezmoiignore` (itself a template). Not a second repo. macOS is not Ubuntu. Ghostty + Starship is the Mac login. `ls` → `eza`, `cat` → `bat`, `top` → `btop` on the Macs. The names in my fingers stay.

Linux servers get a push script from the chezmoi-managed Mac: all hosts, or a named list. The subset is boring on purpose.

## What is not in the repo

**Secrets.** `~/.config/secrets.env`, chmod 600. Listed in `.chezmoiignore`. Recreate by hand on a new machine. `dot_zshenv` sources it if present. chezmoi can know the *path*. It does not get the contents.

**`~/.ssh/config`.** Hand-maintained on the admin workstation. Copied with `scp` to the machines I SSH *from*. Leaf servers do not get a full client config — that is dead `ProxyCommand`s on a box that never originates fleet SSH. The firewall appliance does not get one either. Keys are per machine. No shared private key.

## curl|bash stays for strangers

The welcome-message one-liner is still in that README. I do not run it on a box I have already named. GitHub Actions tests installers on a clean image. If Ubuntu LTS breaks I want a red X, not a surprise after login.

Apply from git on the Macs and the Windows box. Push a subset to Linux. Diff before apply. Keep `$HOME` boring enough that the second Mac is not a project.
