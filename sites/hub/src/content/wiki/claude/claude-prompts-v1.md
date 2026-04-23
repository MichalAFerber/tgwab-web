---
title: "claude-prompts-v1"
---
## Reference
- [AGENT.md: The Universal Agent Configuration File](https://github.com/agentmd/agent.md) 

## Error free writing
```bash
Please check the following text for any factual, logical, or grammatical errors.
```

## The POTATO Prompt
```bash
Whenever I type the word 'Potato' followed by an idea, act as a Hostile Critic. Point out three specific ways my argument could fail, two assumptions I’m making without proof, and one counter-argument I haven't addressed. Do not be polite; be precise.
```

## The Brain Dump Processor
```bash
I'm going to dump everything on my mind right now ideas, tasks, worries, half-thoughts. Don't judge or filter anything. Once I'm done, organize it into: things I need to act on, things I need to think about more, and things I can let go of completely.
```
## Emojify
```bash
Add relevant emojis to enhance {}. Follow these rules:
    1. Insert emojis at natural breaks in the text
    2. Never place two emojis next to each other
    3. Keep all original text unchanged
    4. Choose emojis that match the context and tone
    Return only the emojified text.
```

## Explain like I am 5
```bash
Explain {} in simple terms that a 5-year-old would understand:
    1. Use basic vocabulary
    2. Include simple analogies
    3. Break down complex concepts
    Return only the simplified explanation.
```

## Fix grammar and spelling
```bash
Fix the grammar and spelling of {}. Preserve all formatting, line breaks, and special characters. Do not add or remove any content. Return only the corrected text.
```

## Generate glossary
```bash
Create a glossary of important terms, concepts, and phrases from {}. Format each entry as "Term: Definition". Sort entries alphabetically. Return only the glossary.
```

## Generate table of contents
```bash
Generate a hierarchical table of contents for {}. Use appropriate heading levels (H1, H2, H3, etc.). Include page numbers if present. Return only the table of contents.
```

## Make Shorter
```bash
Reduce {} to half its length while preserving these elements:
    1. Main ideas and key points
    2. Essential details
    3. Original tone and style
    Return only the shortened text.
```

## Make Longer
```bash
Expand {} to twice its length by:
    1. Adding relevant details and examples
    2. Elaborating on key points
    3. Maintaining the original tone and style
    Return only the expanded text.
```

## Rewrite as a tweet
```bash
Rewrite {} as a single tweet with these requirements:
    1. Maximum 280 characters
    2. Use concise, impactful language
    3. Maintain the core message
    Return only the tweet text.
```

## Rewrite as a tweet thread
```bash
Convert {} into a Twitter thread following these rules:
    1. Each tweet must be under 240 characters
    2. Start with "THREAD START" on its own line
    3. Separate tweets with "---"
    4. End with "THREAD END" on its own line
    5. Make content engaging and clear
    Return only the formatted thread.
```

## Simplify
```bash
Simplify {} to a 6th-grade reading level (ages 11-12). Use simple sentences, common words, and clear explanations. Maintain the original key concepts. Return only the simplified text.
```

## Summarize
```bash
Create a bullet-point summary of {}. Each bullet point should capture a key point. Return only the bullet-point summary.
```

