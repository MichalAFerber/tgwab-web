---
title: "Obsidian Master TODO List"
draft: true
---
Here's your Master TODO list with multiple views.
## How It Works

### The magic query:
```bash
TASK
WHERE !completed
```

This automatically finds:

✅ All checkboxes - [ ] in your entire vault
✅ Only shows uncompleted ones
✅ Updates in real-time as you check things off

### Key Features
1. All Open Tasks
   Shows everything uncompleted, grouped by folder
2. Tasks by Folder
   Separate views for Journal tasks vs Project tasks (adjust folder names to match yours)
3. Task Statistics
   Shows which notes have the most open tasks
4. Recently Completed
   See what you've accomplished in the last 7 days

### Usage

1. Place this file at the root of your vault (or in a "Dashboards" folder)
2. Pin it for quick access
3. Check off tasks anywhere in your vault → they disappear from this list automatically
4. Add new tasks anywhere with - [ ] → they appear here automatically

### Customization
#### Filter Specific Folders

If your tasks are in specific folders, update the queries:

```bash
TASK
FROM "Projects" OR "Journal" OR "Work"
WHERE !completed
```
#### Add Priority Levels

If you use emojis or tags for priority:

```bash
TASK
WHERE !completed AND (contains(text, "🔴") OR contains(text, "urgent"))
SORT file.name ASC
```

Show Only Today's Tasks

```bash
TASK
FROM "Journal/{{date:YYYY}}/{{date:MM MMMM}}/{{date:YYYY-MM-DD}}"
WHERE !completed
```

#### Pro Tip: Task Formats That Work

All these checkbox formats work with Dataview:
```markdown
- [ ] Simple task
- [ ] Task with #todo tag
- [ ] Task with 📅 2026-02-15 due date
- [ ] Task with [due:: 2026-02-15] metadata
- [x] Completed task (won't show in uncompleted queries)
```

