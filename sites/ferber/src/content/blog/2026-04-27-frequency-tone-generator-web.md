---
title: "A Tone Generator That Is Just a Page"
description: "Web Audio API, a frequency box, Play and Stop. No Pi, no Python, no build. The hardware version still lives on the Raspberry Pi — this file runs in the browser."
tags: [javascript, audio, open-source, tools]
thumbnail-img: /assets/img/frequency-tone-generator-web.webp
---

![Headphones and a tuning fork on a wooden desk beside a closed laptop](/assets/img/frequency-tone-generator-web.webp)

# A Tone Generator That Is Just a Page

The [Raspberry Pi tone generator](/2025-08-09-diy-raspberry-pi-frequency-tone-generator/) is hardware: a board, a speaker, `sounddevice`, a weekend. I still use it when I want something that does not need a browser.

I also wanted the other shape. Type a number in Hz. Press Play. Hear a sine. No apt, no pip, no SD card.

That is [frequency-tone-generator](https://michalferber.me/frequency-tone-generator/). MIT. Web Audio API. Open `index.html`.

## What it is

An oscillator node at the frequency you typed, routed to the speakers. Most browsers will not start audio until you click something — that is the platform, not a bug. Headphones are cleaner than a laptop tin.

There is a chart of ranges people talk about in anecdotal / alternative-medicine sources, and a ZIP of pre-rendered WAVs if you would rather play files offline. The chart is **not medical advice**. The page says so. This post says so. If you need a clinician, this is the wrong tab.

The [vibrational medicine post](/2025-08-10-vibrational-medicine-healing-with-frequencies/) is the why. This file is the speaker.

## What it is not

It is not the Pi. The Pi is for a room that should keep humming if the laptop lid closes. This page is for “I need 440 Hz in the next five seconds and I already have a browser.”

It is not a DAW. One oscillator. Sine. Play / Stop. The README lists waveforms, sweeps, and a PWA as ideas. None of those are in `index.html`. I checked.

It is not a single HTML file in the File Viewer sense. `index.html`, a stylesheet, and the ZIP. Still no build. Still no npm. Double-click the HTML, or throw the folder on GitHub Pages.

## How to run it

```bash
git clone https://github.com/MichalAFerber/frequency-tone-generator.git
open frequency-tone-generator/index.html
```

Or use the [hosted copy](https://michalferber.me/frequency-tone-generator/). Enter `440`. Play. Stop.

If you want a transducer on the floor, build the Pi. If you want a tone in this tab, use the page.
