---
title: "Raspberry Pi for Kids: A Homeschool Curriculum"
description: "A 30-week zero-to-hero Pi 400 curriculum for an 8-year-old homeschooler. From mouse practice to GPIO to Python — progressing at the speed of the kid, not a classroom."
pubDate: 2026-03-10
heroImage: "/assets/img/raspberry-pi.webp"
tags:
  - "raspberry-pi"
  - "homeschool"
  - "kids"
  - "education"
  - "python"
---
Homeschooling gives you the chance to build a tech curriculum that doesn't suck. No cart of locked-down Chromebooks. No mandated "use this educational platform." You pick the tools, you pick the projects, and the kid learns because what they're building is actually theirs.

This is the Pi 400 curriculum I built for my 8-year-old, 3rd-grader. Pi 400 specifically because the keyboard *is* the computer — fewer parts, no lost cables, just plug in a monitor and it works. Thirty weeks of material, self-paced, moving from mouse control through Scratch to Python and GPIO hardware.

## Stage 0 — get comfortable with the Pi (weeks 1–2)

Goal: basic computer literacy, typing, and confidence.

- Startup, login, shutdown
- Mouse and keyboard control
- Raspberry Pi OS desktop — file manager, menus, browser
- **GCompris** (`sudo apt install gcompris-qt`) for puzzle games and logic
- **Tux Typing** or **TypeFaster** for typing drills

End of stage: she can navigate menus, open apps, and type her name without looking at the keys.

Don't skip this stage just because she "already knows computers." The Pi desktop is different from what she's used to, and the point is to build confidence, not speed.

## Stage 1 — visual coding with Scratch (weeks 3–6)

Scratch 3 is preinstalled on PiOS. Drag-and-drop blocks, no syntax to memorize, immediate visual feedback. Concepts we cover:

- Loops
- Events
- Variables
- If/then
- Broadcast messages (this one is huge — it's message-passing before she knows what message-passing is)

**Projects:**

- "Chase the mouse" game
- Interactive story with backgrounds and sprites

End of stage: 2 or 3 working Scratch projects she can demo to grandparents.

## Stage 2 — physical computing with GPIO (weeks 7–10)

This is where programming stops being on-screen and starts being *in the world*. We use Scratch + GPIO or Python + GPIO Zero to control real hardware.

- Starter kit: **CanaKit** or **Freenove** starter (LEDs, resistors, buttons, sensors)
- Basic electronics safety — "don't short the 3.3V rail" kind of basics

**Projects:**

- LED blinking with a button press
- Traffic light simulation

End of stage: a working LED project she can code *and* troubleshoot. When the LED doesn't light up, she knows to check the wiring before she blames the code.

## Stage 3 — first steps in Python (weeks 11–14)

Thonny IDE, also preinstalled. Move from drag-and-drop to typed code.

- `print()`, variables, loops, conditionals
- GPIO Zero for hardware control from Python

**Projects:**

- "Guess the number" game (this is the classic for a reason)
- LED on/off from keyboard input

End of stage: she can type small programs without autocorrect rescuing her, and debug her own syntax errors.

## Stage 4 — creative projects (weeks 15–20)

Blend the stages.

- Weather station with a DHT11 sensor (temperature + humidity)
- Digital pet game in Python
- A simple HTML/CSS site using Geany or Thonny
- File I/O in Python — reading and writing files

End of stage: one project that combines code plus hardware. A real artifact.

## Stage 5 — advanced projects and community (weeks 21–30)

By here she's doing real work.

- **micro:bit** with the Pi (block or Python)
- **Minecraft Pi Edition** Python API — build in-world things with code, which is basically every kid's dream
- [Projects.RaspberryPi.org](https://projects.raspberrypi.org/) — official projects, free
- Write or record something about her favorite project

End of stage: a capstone project. Interactive game controller, weather dashboard, light show — whatever she lands on.

## Tools and resources

**Hardware:**

- [Freenove Raspberry Pi starter kit](https://www.freenove.com/)
- micro:bit + USB cable
- Small speaker or headphones

**Books:**

- *Adventures in Raspberry Pi* (Carrie Anne Philbin)
- *Python for Kids* (Jason R. Briggs)
- *Mission Python: Code a Space Adventure Game* (Sean McManus)

**Online:**

- [Projects.RaspberryPi.org](https://projects.raspberrypi.org/) — free official projects
- [Code Club](https://codeclub.org/) — lesson plans and challenges
- [micro:bit Projects](https://microbit.org/projects/)

## Weekly rhythm

This matters more than any specific lesson.

- **1 day:** new concept
- **1 day:** guided project
- **1 day:** independent creative time — modify or extend projects she's already built
- **1 day:** show and tell. Explain what she made and how it works.
- *Optional weekend:* challenge day. Surprise mini-project.

The show-and-tell day is the one most adults would cut. Keep it. Being able to explain what you built is half of being an engineer.

## Why the Pi instead of a laptop

Because the Pi doesn't hide anything. There's no "settings are managed by your administrator." There's a terminal. There's `/etc/`. When something breaks, there's a reason, and the reason is findable. That's the curriculum, really. Everything else is just the exercises.
