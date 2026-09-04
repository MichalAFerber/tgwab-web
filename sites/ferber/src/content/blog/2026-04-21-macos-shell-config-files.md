---
title: "Where macOS Keeps Its Shell Config Files: A zsh & bash Map"
description: "A practical map of zsh and bash configuration files on macOS — .zshrc, .zprofile, .bash_profile, .bashrc and their system-wide counterparts in /etc — plus the exact load order for login, interactive, and script shells."
tags: [macos, zsh, bash, shell, dotfiles, how-to]
thumbnail-img: /assets/img/macos-shell-config.webp
---

![Terminal](/assets/img/macos-shell-config.webp)

# Where macOS Keeps Its Shell Config Files

If you've ever tried to add something to your `$PATH`, set up an alias, or drop in a fancy prompt on your Mac, you've probably run into the same confusing question I did: *which* config file am I supposed to edit? `.zshrc`? `.zprofile`? `.bash_profile`? And why didn't my change take effect until I opened a brand-new terminal window?

The short answer is that macOS shells load a *specific set of files in a specific order*, and which files get read depends on whether the shell is **interactive**, a **login shell**, or just running a **script**. Get that mental model right and the whole thing stops feeling like guesswork.

Here's the map I keep in my back pocket.

> **TL;DR:** On macOS, shell config files split into **user-level** files (in your home directory `~`, hidden by default) and **system-wide** files (in `/etc/`). Depending on whether a shell is interactive, a login shell, or running a script, it reads files like `.zshrc`, `.zprofile`, `.bash_profile`, or `.bashrc` in a strict load order.

---

## 1. Zsh Configuration Files

Since macOS Catalina, `zsh` is the default shell. It looks for configuration files in both system-wide and user-specific directories.

### System-Wide / Global Files

These apply to **all users** on the Mac, so modifying them requires `sudo`. (Quick note: `/etc` is actually a symbolic link to `/private/etc`.)

* `/etc/zshenv` — Read first by *every* instance of zsh, including background scripts.
* `/etc/zprofile` — Read for login shells. macOS uses this to initialize the system path via `/usr/libexec/path_helper`.
* `/etc/zshrc` — Read for interactive shells.
* `/etc/zlogin` — Read for login shells, after the other config files.
* `/etc/zlogout` — Read when a login shell exits.

### User-Level Files

These live in your home directory (`~`, or `/Users/YOUR_USERNAME/`). They're hidden files prefixed with a dot (`.`), and by default they may not even exist until you — or a tool like Oh My Zsh — create them.

* `~/.zshenv` — Always read. Ideal for personal environment variables.
* `~/.zprofile` — Read for login shells. Often used instead of `.zshrc` for environment variables, to speed up opening new terminal tabs.
* `~/.zshrc` — **The big one.** Read for interactive shells; this is where personal aliases, prompt tweaks, and plugin configs go.
* `~/.zlogin` — Read at the end of the login shell startup sequence.
* `~/.zlogout` — Read when your personal login shell session ends.

> **Pro tip:** You can move the user-level location entirely by setting the `$ZDOTDIR` environment variable elsewhere — handy for cleaning up your home directory or syncing your dotfiles with Git.

### Zsh Load Order at a Glance

For a login + interactive shell (what you get with a normal new Terminal window), zsh reads them in this order:

```
/etc/zshenv   →  ~/.zshenv
/etc/zprofile →  ~/.zprofile
/etc/zshrc    →  ~/.zshrc
/etc/zlogin   →  ~/.zlogin
```

A non-interactive script only reads the `zshenv` files. That's why putting interactive-only goodies (aliases, prompt themes) in `.zshenv` can cause surprises.

---

## 2. Bash Configuration Files

Even though it's no longer the default, `bash` (still the old v3.2 for licensing reasons) ships with macOS for backward compatibility.

### System-Wide / Global Files

* `/etc/profile` — System-wide init file read by login shells.
* `/etc/bashrc` — System-wide file read by interactive non-login shells.

### User-Level Files

These live in your home directory and control your bash sessions:

* `~/.bash_profile` — Read by login shells. Since Terminal.app opens new windows as login shells, this is the file bash actually reads on a Mac.
* `~/.bash_login` — Read by login shells *only if* `~/.bash_profile` doesn't exist.
* `~/.profile` — Read by login shells if *neither* `.bash_profile` nor `.bash_login` exists.
* `~/.bashrc` — Read by interactive non-login shells.

> **Heads up:** Because macOS treats new terminal windows as **login** shells, `~/.bashrc` gets ignored unless you explicitly source it from `~/.bash_profile`. The standard fix is to add this line to your `.bash_profile`:
>
> ```bash
> [ -f ~/.bashrc ] && . ~/.bashrc
> ```

---

## 3. Supplementary System Paths Worth Knowing

When you're troubleshooting `$PATH` issues specifically, two more system locations matter — they feed macOS's `path_helper` binary, which assembles your default path:

* `/etc/paths` — A plain text file listing the default system-wide path entries, in order.
* `/etc/paths.d/` — A directory where third-party installers (Git, Go, etc.) drop single-line files containing paths they want appended to the system `$PATH`.

If a tool's command "can't be found" right after install but works in a fresh terminal, `path_helper` reading a new file in `/etc/paths.d/` is usually why.

---

## Conclusion

Once you internalize the **login vs. interactive vs. script** distinction, the pile of dotfiles stops being mysterious. My personal rule of thumb on macOS:

- **Environment variables and `$PATH`** → `~/.zprofile` (zsh) or `~/.bash_profile` (bash)
- **Aliases, prompt, plugins, anything interactive** → `~/.zshrc` (zsh) or `~/.bashrc` (bash)

Stick to that and you'll rarely wonder why a change "didn't take."
