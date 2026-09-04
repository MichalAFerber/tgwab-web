---
title: "IMDb Movie File Fixer: Names Plex Can Live With"
description: "A Python script that turns Millers.2013.1080p.BluRay.x264.YIFY.mp4 into Miller's (2013).mp4 — grammar, year, IMDb check, a log file, and a backup first."
tags: [python, plex, media, scripts, homelab]
thumbnail-img: /assets/img/imdb-movie-file-fixer.webp
---

![A messy stack of discs next to a tidy row of identical cases on a shelf](/assets/img/imdb-movie-file-fixer.webp)

# IMDb Movie File Fixer: Names Plex Can Live With

Plex will play `Dont.Breathe.2016.720p.WEBRip.x264.AAC-ETRG.mkv`. It will also display that atrocity in the library, match the wrong title, and leave you scraping posters for a movie you already own.

I wrote a Python script so I would stop renaming files by hand: [IMDbMovieFileFixer](https://github.com/MichalAFerber/IMDbMovieFileFixer). It is a script. It is not a product. It will eat a folder if you point it at the wrong path. Backup first.

## What it does

```
Millers.2013.1080p.BluRay.x264.YIFY.mp4
Dont.Breathe.2016.720p.WEBRip.x264.AAC-ETRG.mkv
```

becomes:

```
Miller's (2013).mp4
Don't Breathe (2016).mkv
```

- Strip the scene noise: resolution, codec, group tags.
- Default format `{title} ({year}).{ext}`.
- Grammar: `Dont` → `Don't`, and the other apostrophes English actually uses.
- Ask IMDb whether that title exists; log the official name and any discrepancy.
- Duplicate filenames get ` [1]`, ` [2]`, not an overwrite.
- A timestamped log in the project directory: every rename, every miss, every error.

Extensions it will touch: `.mp4`, `.mkv`, `.avi`, `.mov`, `.wmv`. Everything else in the folder is ignored. TV shows are out of scope — episodic names are a different parser and I will not pretend this is Sonarr.

## How you run it

Python 3.6+, `requests`, `beautifulsoup4`. Virtualenv if you are civilized. Open the script, set `folder_path`, run it.

```bash
python -m venv env
source env/bin/activate
pip install requests beautifulsoup4
python IMDBMovieFileFixer.py
```

There is a one-second sleep between IMDb hits. If you have a large shelf, raise it. IMDb will rate-limit you, and scraping HTML is how this breaks the week they redesign the search page. The selectors live in `search_imdb`. When they rot, that is the function you fix — not a reason to rewrite it in Go.

## What it is not

It is not FileBot. It is not TinyMediaManager. It is not a dry-run unless you add one. My other scripts in the [scripts collection](https://github.com/MichalAFerber/scripts) take `--dry-run` as a religion. This one grew up as a one-folder hammer and logs *after* the rename. Use the log to put names back. Better: copy the folder, run against the copy, then promote.

It is also not a license to hammer IMDb. Their conditions of use exist. Be polite. Batch. Sleep. If you need a commercial pipeline, pay for a data source that wants to be an API.

Plex matchers still need a clean name. This script is the cleanup. It will not fetch artwork, it will not write NFO files, it will not talk to the Plex API. After a pass, you refresh the library and see whether the matcher finally agrees with the spine.

## Why I still have it

Because scene names are a virus, and I got tired of being the immune system with Finder. Grammar in a title is not cosmetic — `Millers` vs `Miller's` is a different match. The log is the only reason I trust it: I can see what it thought, what IMDb said, and what it wrote.

If you want a GUI, you already know the apps. If you want a hundred-line Python file you can read on a Saturday and point at a folder you backed up, this is that. GPL-3. Fork it, add `--dry-run`, send a PR. I will take the dry-run.
