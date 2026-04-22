---
title: "Learning Rust: My Approach as a 30-Year IT Veteran"
description: "Ubuntu is quietly rewriting the core of the OS in Rust. I don't need to become a Rust developer — I need to read it, tweak it, and build a couple of CLI tools. Here's the plan."
pubDate: 2026-03-17
heroImage: "/assets/img/website-code.avif"
tags:
  - "rust"
  - "learning"
  - "linux"
  - "ubuntu"
---
Ubuntu has been quietly rewriting core system utilities in Rust. `sudo-rs` is replacing `sudo` on the roadmap. `uutils` is a Rust reimplementation of GNU coreutils that's already shipping in some distributions. If I'm running Ubuntu in production — and I am — then sooner or later I'm going to be staring at a Rust source file trying to figure out why something broke.

I'm not becoming a Rust developer. I'm a 30-year IT guy, not a junior who's going to spend nine months mastering ownership and lifetimes. What I need is narrower: **read it, tweak it, and build the occasional CLI tool** that compiles to a fast, self-contained binary I can drop on any box.

Here's how I'm scoping it.

## Step 1 — Read and tweak Rust code

Goal: open a `sudo-rs` source file or a `uutils` PR and actually follow what's happening.

**Timeframe:** 1–2 weeks at ~30 min/day.

**Focus:**

- Variables and mutability (`let` vs `let mut`)
- Functions and type annotations
- `match` and pattern matching
- Ownership and borrowing (references vs mutable references) — just enough to not be confused
- Basic error handling with `Result` and `?`

**Resources:**

- [Rust By Example](https://doc.rust-lang.org/rust-by-example/) — the format I actually learn from. Code first, prose second.
- [The Rust Book](https://doc.rust-lang.org/book/), chapters 1–5. Stop before lifetimes. I'll come back if a real problem demands it.
- `rust-analyzer` in VS Code for inline type hints. Non-negotiable.

I'm deliberately skipping lifetimes and advanced trait work in this pass. The goal is to read, not to author production code.

## Step 2 — Build small CLI tools

Goal: muscle memory with `cargo`, crates, and the basic flow of producing a working binary.

**Timeframe:** 2–3 weeks at 30–60 min/day.

**Projects I'm going to build:**

1. **Network reachability checker.** Feed it a file of hostnames or IPs, get back which are reachable and their response time. This replaces a Bash script I already use.
2. **Log file summarizer.** Point it at `/var/log/syslog` or an Apache access log, get back top N error messages with counts. Same premise — I have a Bash version today.
3. *(Bonus)* A `fastfetch`-style info fetcher that just prints CPU/memory stats the way I want to see them.

**Skills that fall out of those:**

- `cargo new` and `cargo run`
- Pulling in crates from [crates.io](https://crates.io)
- Parsing CLI args with `clap`
- Reading files and stdin
- Colored output with `colored`

Building things I'd actually use is how I learn a language. Toy projects from a tutorial don't stick.

## Where I'm stopping

If I never go past Step 2, I'll already be able to:

- Understand and tweak Rust-based system utilities when they break.
- Write my own high-performance CLI tools instead of Bash scripts that fall over at scale.
- Be ready when more of Ubuntu's core is Rust-based — because it will be.

That's the bar. Not "Rust developer." Not "contribute to the language." Read, tweak, ship small tools. Anything beyond that can wait until I have a real reason.

Book me on this one in about a month. If I don't have at least one of those three tools compiled and running, tell me I said so.
