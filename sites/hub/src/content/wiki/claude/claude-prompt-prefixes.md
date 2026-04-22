---
title: "Claude Prompt Command Modifiers"
draft: true
---
> These are **prompt prefix conventions**, not true slash commands. Claude has no built-in slash command parser — these work because you're instructing the model in plain language. Think of them as shorthand prompting patterns.

---

## Output Format & Length

| Command | Effect |
|---|---|
| `/BRIEFLY` | Forces a very short answer |
| `/TLDR` | Summarizes a long text in a few lines |
| `/EXEC SUMMARY` | Quick executive-style summary |
| `/CHECKLIST` | Turns a response into a checklist |
| `/STEP-BY-STEP` | Lays out reasoning step by step |
| `/FORMAT AS [format]` | Enforces a specific format (table, XML, JSON, Markdown, etc.) |
| `/SCHEMA` | Generates a structured outline or data model |
| `/BEGIN WITH / END WITH [text]` | Forces the response to start or end with something specific |
| `/EXPAND` | Go deeper on a topic or section |
| `/CONDENSE` | Make an existing response shorter without losing meaning |
| `/TRANSLATE [language]` | Translate content to another language |

---

## Persona & Tone

| Command | Effect |
|---|---|
| `/ACT AS [role]` | Makes Claude speak in a specific role |
| `/TONE [style]` | Changes the tone — formal, witty, empathetic, blunt, etc. |
| `/DEV MODE` | Simulates a raw, technical developer style |
| `/PM MODE` | Gives a project-management perspective |
| `/JARGON` | Asks Claude to use domain-specific technical vocabulary |
| `/ELI5` | Explain Like I'm 5 — simplifies for a lay audience |
| `/AUDIENCE [type]` | Adapts the response to a specific audience |
| `/REWRITE AS [style]` | Rephrases content in a requested style |
| `/ANALOGIZE` | Explain using analogies |

---

## Analysis & Reasoning

| Command | Effect |
|---|---|
| `/COMPARE` | Puts two or more things side by side |
| `/PROS AND CONS` | Simple pros/cons breakdown — distinct from SWOT |
| `/SWOT` | Produces a Strengths / Weaknesses / Opportunities / Threats analysis |
| `/MULTI-PERSPECTIVE` | Shows several points of view |
| `/PARALLEL LENSES` | Examines a topic from multiple angles simultaneously |
| `/COUNTERARGUMENT` | Steelman the opposing position |
| `/DEVIL'S ADVOCATE` | Argue against the stated position |
| `/FIRST PRINCIPLES` | Rebuilds reasoning from fundamental basics |
| `/CHAIN OF THOUGHT` | Shows intermediate reasoning steps |
| `/SOCRATIC` | Use the Socratic method — guide via questions rather than answers |
| `/TIMELINE` | Present events or steps as a chronological timeline |
| `/SYSTEMATIC BIAS CHECK` | Asks Claude to identify potential biases in the response |

---

## Quality & Self-Evaluation

| Command | Effect |
|---|---|
| `/REFLECTIVE MODE` | Prompts Claude to reflect on and critique its own answer |
| `/EVAL-SELF` | Asks for a critical self-evaluation of the response |
| `/CRITIQUE` | Critically evaluate the thing provided |
| `/DELIBERATE THINKING` | Forces slower, more methodical reasoning — less pattern-matching |

---

## Structured Prompting

| Command | Effect |
|---|---|
| `/ROLE: [role] TASK: [task] FORMAT: [format]` | Explicitly defines all three dimensions of the prompt in one shot |

---

*Last updated: April 2026*
