---
title: "My Python Learning Plan"
description: "A 5-week plan to go from reading Python to writing small, useful programs — structured for someone who already knows other languages and doesn't need hand-holding."
pubDate: 2025-10-15
heroImage: "/assets/img/visual_studio_code.webp"
tags:
  - "python"
  - "learning"
  - "programming"
---
I've written real production code in C#, Bash, PowerShell, and enough JavaScript to be dangerous. Python has been sitting in the gap my whole career, and I've avoided it mostly because every "Learn Python" resource I open is either aimed at someone who's never typed `for` before or bolts the language onto a data-science curriculum I don't care about.

So I built my own plan. Five weeks, enough to stop reaching for Bash when I should be reaching for Python, structured the way I'd want to learn any new language — operators first, syntax fast, write things that matter as soon as possible.

## The plan

### Week 1, Phase 1 — basics

`print()`, variables, data types (`str`, `int`, `float`, `bool`), type conversion, `input()`. A day, maybe two. The only reason this phase exists is to get the muscle memory down. Practice: print a greeting, take a name and age from input, print a custom message.

### Week 1, Phase 2 — operators and strings

Arithmetic, comparison, logical. f-strings. `.upper()`, `.lower()`, `.replace()`, `.strip()`. Slicing. Practice: a username generator that combines strings, a calculator that does math.

If you already know any curly-brace language, this is a day.

### Week 1, Phase 3 — control flow

`if` / `elif` / `else`, `while`, `for`, `range()`. Practice: guess-the-number game. Loop through a list. Done.

### Week 2 — collections

Lists (`append`, `remove`, `sort`, indexing, slicing). Dictionaries (keys, values, `.get()`). Practice: grocery list app, phonebook.

Python's dict is honestly the feature I've been missing in Bash for years. The "oh, I can just do `{name: value, name: value}`" moment is the point.

### Week 3 — functions and modules

Defining functions, parameters, return values. Importing `math`, `random`, `datetime`. Practice: BMI calculator function, dice roll simulator with `random.randint()`.

### Week 4 — classes

Define a class, create an object. `self.name`, methods. Practice: `Car` class with attributes and methods, `BankAccount` with `deposit()` and `withdraw()`.

This is the week where I stop being comfortable. OOP in Python is different enough from C# that I want to spend real time here rather than skim.

### Week 5 — final project

Pick one and build it:

- Text-based to-do list manager
- Budget tracker
- Quiz game

Something I'd actually use. Not a tutorial project, a real tool.

## Ground rules

- **30–60 minutes a day, every day.** Consistency beats marathon sessions.
- **Build something from scratch every week.** Not a tutorial walkthrough — something small of my own, even if it's ugly.
- **Done means reading other people's Python and following it.** That's the bar. Not "mastered the language." Not "can pass a senior Python interview." Read it, make small changes, move on.

Linking back here when I finish the final project. If I don't, you get to point and laugh.
