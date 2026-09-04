---
title: "Tabs vs Spaces, Again"
description: "I use spaces, I ship an EditorConfig, and I still think the fight is a proxy for something that actually matters: don't make the next human guess."
tags: [programming, opinion, git, editorconfig]
thumbnail-img: /assets/img/tabs-vs-spaces.webp
---

![Code editor with indentation highlighted](/assets/img/tabs-vs-spaces.webp)

# Tabs vs Spaces, Again

Yes, still. I have watched this argument outlive frameworks, editors, and at least one career path I no longer have. I am not going to convert you. I am going to tell you what I do and why the *fight* is the wrong object.

## What I type

**Spaces.** Two in some JS/Astro trees, four in Python, whatever `gofmt` says in Go. I don't indent with tab characters in files other people will read, because tabs render as "however wide the next editor decided," and I have lost hours to diffs that were only someone's tabstop.

Tabs are not immoral. They are a width lottery.

## What I actually care about

I care that the file does not change because you opened it.

That means:

- An `.editorconfig` at the repo root so VS Code, the JetBrains family, and the random web IDE agree.
- A `.gitattributes` with `* text=eol=lf` (or `text=auto`) so macOS and a Windows VM don't take turns rewriting every line.
- `git config --global pull.rebase true` and a formatter in CI if the language has one. Formatters ended more wars than blog posts did.

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,astro,css,json,yml,yaml}]
indent_style = space
indent_size = 2

[*.py]
indent_style = space
indent_size = 4

[Makefile]
indent_style = tab
```

Makefiles still need tabs. Reality is not a brand.

## Why the argument keeps coming back

It's a cheap way to talk about taste, seniority, and "how we do things here" without talking about tests, naming, or whether the system is operable. I have sat in rooms where tabs-vs-spaces ran longer than the outage retro.

If a codebase is consistent, I will match it. If it isn't, I will make it consistent and then stop talking. Short git aliases (`st`, `lg`) exist so I actually *look* at the tree — that's how you notice a 400-line "indent only" commit before it lands.

## The line I will argue

Don't mix tabs and spaces in one file. Don't "fix" indentation in the same commit as a logic change. Don't bikeshed a public repo's 20-year-old GNU style unless you are volunteering to convert it and own the blame.

Spaces at home. Match the tree at work. EditorConfig so I never have to have this conversation inside a file again.
