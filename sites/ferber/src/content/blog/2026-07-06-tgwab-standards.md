---
title: "Standards Across a Hundred Repos"
description: "A private Class D repo — DEV-STANDARDS.md v2.53, a product registry, templates, and CI that fails a bad citation. Public READMEs do not hyperlink it. Agents get told no with a section number."
tags: [devops, github, standards, agents]
thumbnail-img: /assets/img/tgwab-standards.webp
---

![A rulebook open on a desk in front of a grid of identical small notebooks](/assets/img/tgwab-standards.webp)

# Standards Across a Hundred Repos

A private wiki is a memory. It is not a gate. The estate is on the order of **120** GitHub repos across two owners. If "how we ship" only lives in a note, agents (and tired humans) invent a second way by Thursday.

So there is a standards repo. Class D: private, no `LICENSE`, all rights reserved. It holds what has **no natural home in any one product** — the superset, the boilerplate, the registry. A File Viewer build spec stays in the File Viewer repo. Pull product docs in here and they rot within a month. That is the one rule that keeps it from becoming a lying source of truth.

I am not linking it. The standards themselves say so: this repo is private, so a hyperlink in a public Class A README is a 404. The version stamp is what the launch gate checks. `v2.53.0` as of today. Sections **§1–§19 are frozen anchors**. New material goes in an existing section or at the end. We do not renumber because product repos cite these numbers.

## Classes, decided before the first commit

Every repo is exactly one class, written in the first paragraph of its README:

- **A** — public, MIT, always. Viewers, free tools, the Octocat in the footer.
- **B** — takes money: private, no MIT, all rights reserved. ResizeWizard Pro lives here. A public companion (docs, a tools package) MAY be its own Class A. The paid core never goes public. You cannot un-ring an MIT bell.
- **C** — micro-projects on GitHub Pages. Public, MIT, no custom domain, no Astro migration. Cheatsheets, the FS25 mod, the tree browser.
- **D** — this repo, internal tooling, LAN-only surfaces. Private, no license file.

The class is decided *upfront*. No "we'll open it later." No "let's monetize the one that has been public a year."

## How a product consumes it

1. **Stamp the version** in the README. Plain text, never a hyperlink. Deviations are one line: `§N—rule—reason—date—permanent|review`. No record, no deviation — an unrecorded MUST is a release blocker.
2. **Copy the plumbing** from `templates/` into the homes the structure doc names (`public/`, `functions/`, `.github/`), not the repo root. `_headers`, `robots.txt`, the contact-form email spec, the CI workflow, the branch ruleset. Starting points. Tighten per project; loosen only with a reason in that README.
3. **Register it** in `REGISTRY.md` before the first commit — class, series, status, where the design docs live. One hundred twenty rows, last I counted.

CI on the standards repo range-checks `DS §N` citations so a runbook cannot point at a section that does not exist. A separate script rolls the branch ruleset across every active repo. A transfer to the org **does not carry the ruleset** — recreating it is part of the move, not a follow-up.

## Agents get told no

Agents read the monolith. Footer year computed at build, not a literal `2024`. Lint that actually runs. Apex and www not both 200. One deploy path. Public Class A does not link a private repo.

A wiki sentence that says "please remember SEO" does not fail a job. A standard that CI can clone does.

I still review the PRs that change the standard itself. Changing the gate changes every repo that walks through it.

## What this is not

It is not a style guide about tabs. [That post](/2026-07-28-tabs-vs-spaces/) exists. This is ops: identity, stack, hosting, email, forms, analytics, required pages, classes, SEO, headers, DNS house style, a11y, CI, secrets, launch, change management, decommissioning.

Product specs stay with the code. The registry is the map. The templates are the kit. The citations are the teeth.

If you have three sites and a gist, you do not need this. If you have a hundred repos and agents that will happily open a second deploy path, you do.
