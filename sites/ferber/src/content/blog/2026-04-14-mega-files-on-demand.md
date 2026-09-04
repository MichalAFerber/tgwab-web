---
title: "How to Get Files On-Demand with MEGA (Stream Without Filling Your Disk)"
description: "MEGAsync has no native Files On-Demand like OneDrive or iCloud. Here's how to stream your MEGA cloud storage as a virtual network drive using Rclone, MEGAcmd's WebDAV server, or a GUI tool like RaiDrive."
tags: [mega, cloud-storage, rclone, webdav, how-to]
thumbnail-img: /assets/img/mega-files-on-demand.webp
---

![Cloud storage](/assets/img/mega-files-on-demand.webp)

# How to Get Files On-Demand with MEGA

I'm a big fan of [MEGA](https://mega.io/) for its generous free tier and end-to-end encryption, but it has one frustrating gap if you're coming from OneDrive or iCloud: there's no native **Files On-Demand**. You can't just browse your whole cloud as lightweight placeholder files that download only when you open them. The official client wants to mirror everything to your local disk.

I went looking for a way around that, and it turns out there are a few solid options — from a free open-source power-user route to a point-and-click GUI tool. Here's how each one works.

> **TL;DR:** The native MEGAsync desktop client does **not** support Files On-Demand (like OneDrive or iCloud). To stream files on demand without using local disk space, mount your MEGA storage as a virtual network drive using **Rclone**, **MEGAcmd**, or a third-party utility like **RaiDrive**.

---

## The Catch with Native MEGAsync

The standard MEGAsync client strictly uses traditional **two-way mirroring**. If you have 500 GB of data in the cloud and sync that folder, it occupies 500 GB on your local drive — full stop.

The desktop app *does* let you stream individual audio or video files straight to a media player like VLC via the right-click **Stream** menu. But it won't let you browse your entire filesystem natively as "cloud-only shortcuts."

To get a true stream-on-demand setup, use one of the following methods.

---

## Method 1: The FOSS & Power-User Route (Rclone Mount)

If you want a free, open-source, highly customizable solution that integrates cleanly with your normal filesystem, **Rclone** is the gold standard. It authenticates with your MEGA account and mounts it as a virtual local drive.

1. Install **Rclone** and a virtual filesystem driver for your OS — **WinFsp** on Windows, or **macFUSE** on macOS.
2. Open your terminal and run the config wizard:

   ```bash
   rclone config
   ```

3. Create a **New Remote** (e.g. name it `MegaDrive`), choose **MEGA** from the storage list, and enter your credentials.
4. Mount the remote so it streams on demand:

   ```bash
   rclone mount MegaDrive: X: --vfs-cache-mode writes
   ```

   *(Replace `X:` with any open drive letter on Windows, or a local directory path on macOS/Linux.)*

With `--vfs-cache-mode writes`, files are streamed into a temporary cache only when opened and take up zero permanent space on your local disk.

---

## Method 2: The Official CLI Route (MEGAcmd WebDAV)

MEGA ships an advanced command-line suite called **MEGAcmd** with a built-in WebDAV server. You can use it to locally host a streamable link to your cloud drive.

1. Download and install **MEGAcmd** from the official MEGA website.
2. Open the MEGAcmd shell and log in. Pass the email only so the shell prompts for the password instead of leaving it in your history:

   ```bash
   login your-email@example.com
   ```

3. Serve your entire cloud drive over WebDAV:

   ```bash
   webdav /
   ```

4. MEGAcmd outputs a local URL, e.g. `http://127.0.0.1:4443/your-unique-string`.
5. In your OS file manager, choose **Map Network Drive** (File Explorer) or **Connect to Server** (Finder) and paste that local URL.

Your entire MEGA structure appears as a networked hard drive, downloading data temporarily only when you double-click a file.

---

## Method 3: The GUI-Friendly Route (RaiDrive / Air Live Drive)

If you'd rather a fully graphical, set-it-and-forget-it setup without touching a terminal:

* **RaiDrive** (Windows) connects a wide variety of cloud services — including MEGA — directly as network locations.
* Select MEGA from the storage list, sign in, assign a drive letter (like `M:`), and check **Reconnect at program start**.
* It handles the virtual filesystem mapping behind the scenes, closely mimicking OneDrive's Files On-Demand behavior.

---

## Conclusion

MEGA's lack of native Files On-Demand is annoying, but it's far from a dealbreaker once you know the workarounds. My personal pick is **Rclone** — it's free, cross-platform, and once the remote is configured it behaves just like a local drive. If you live in the terminal anyway, **MEGAcmd's WebDAV** server is a tidy official option, and **RaiDrive** is there for anyone who wants zero command-line fuss.
