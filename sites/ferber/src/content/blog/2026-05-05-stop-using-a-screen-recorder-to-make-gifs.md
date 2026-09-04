---
title: "Stop Using a Screen Recorder to Make GIFs"
description: "Trim, crop, and convert a video clip to GIF or WebP in one ffmpeg command — no screen recorder, no extra quality loss, no babysitting a capture window."
tags: [ffmpeg, gif, webp, how-to, video]
thumbnail-img: /assets/img/ffmpeg-tiktok-to-gif.webp
---

![Film strip becoming a square GIF frame](/assets/img/ffmpeg-tiktok-to-gif.webp)

# Stop Using a Screen Recorder to Make GIFs

You want a clip from a video — a specific region, a specific duration — turned into a GIF or WebP. The obvious instinct is to pull up a screen recorder, hit record, manually crop the window, and hope for the best.

Don't do that. It's the worst possible approach: you lose quality, you get inconsistent frame rates, and you're babysitting a recording session instead of just getting the file you want. ffmpeg does this in one command, and it will look better.

## The One-Pass Approach

No intermediate files. No multi-step pipeline. Trim, crop, and convert all at once:

```bash
ffmpeg -i input.mp4 \
  -ss 00:00:02 -to 00:00:05 \
  -filter_complex "[0:v]crop=w=400:h=400:x=100:y=200,fps=15,scale=480:-1:flags=lanczos[v]" \
  -map "[v]" \
  output.gif
```

Breaking that down:

- `-ss` / `-to` — start and end timestamps. Swap `-to` for `-t` if you'd rather specify a duration than an end time.
- `crop=w:h:x:y` — width, height, and the x/y coordinates of the top-left corner of the crop box.
- `fps=15` — output frame rate. Lower means a smaller file. 15 fps is plenty for most clips.
- `scale=480:-1` — output width; height calculates automatically to keep the aspect ratio.
- `flags=lanczos` — use Lanczos when resizing. It's slower than the default and noticeably better.

Put `-ss` *after* `-i` if you need frame-accurate cuts. Put it *before* `-i` if you want ffmpeg to seek fast and you can live with being a few frames off.

## Finding Your Crop Coordinates

If you don't already know where the region starts, grab a single frame:

```bash
ffmpeg -i input.mp4 -ss 00:00:03 -frames:v 1 frame.png
```

Open that PNG in anything that shows pixel coordinates while you hover — GIMP, Photoshop, even Preview on a Mac. Find the top-left corner of the region you want, note the x and y values, and plug them into the crop filter.

## GIF vs. WebP — Just Use WebP

If you have any choice in where the clip will be used, pick WebP over GIF. The syntax is nearly identical:

```bash
ffmpeg -i input.mp4 \
  -ss 00:00:02 -to 00:00:05 \
  -vf "crop=400:400:100:200,fps=15,scale=480:-1:flags=lanczos" \
  -loop 0 \
  output.webp
```

`-loop 0` means loop forever, same behavior as a GIF.

Animated WebP files are significantly smaller than GIFs at the same quality — often less than half the size. Browser support has been universal for years. The only reason to still reach for GIF is if you're pasting into something ancient that doesn't support WebP.

## Why Not a Screen Recorder?

Every step of the screen-recorder workflow is fighting you:

- You're capturing whatever your monitor renders, so quality is capped at your display resolution and refresh rate.
- You have to position and size a capture window by hand, which is never precise.
- The output still needs to be converted and cropped, so you're adding steps, not removing them.
- Any UI chrome, notification, or cursor that wanders in ruins the clip.

ffmpeg has one job and it does it well. The command looks intimidating the first time. Once you've run it once, you'll use it every time.
