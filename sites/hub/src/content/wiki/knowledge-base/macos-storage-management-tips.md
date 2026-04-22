---
title: "macOS Storage Management Tips"
---
Even though you've turned off Photos, Mail, and Messages in iCloud settings, local data from these apps may still be taking up space on your Mac. The "Music" category in the storage breakdown often includes iTunes-related files or cached music data, even if you don’t actively use the Music app. Here's how to free up that space:

1. Photos (6.2 MB):
    - Open the Photos app, go to Preferences > General, and check if "Copy items to the Photos Library" is enabled. If so, photos may still be stored locally.
    - To clear local data, go to ~/Pictures/Photos Library.photoslibrary, right-click, and select "Show Package Contents." Look for the "Masters" or "Originals" folder and delete unneeded files (be cautious and back up first).
    - Alternatively, if you don’t use Photos at all, you can delete the entire Photos Library file from ~/Pictures/ after ensuring no important data is left.
2. Mail (68.9 MB):
    - Even with iCloud Mail off, local email data may remain. Open the Mail app, go to Mail > Preferences > Accounts, and remove any accounts you don’t use.
    - Clear local email data by deleting files in ~/Library/Mail/. You can navigate there via Finder (Go > Go to Folder) and remove folders related to old accounts or cached emails.
    - If you don’t use Mail at all, you can disable it entirely by removing accounts and deleting the Mail folder in ~/Library/.
3. Music (746.3 MB):
    - The "Music" category often includes iTunes files, cached Apple Music data, or downloaded songs. Check ~/Music/Music/ (or ~/Music/iTunes/ if using an older setup) for large files like .mp3 or .m4a.
    - Open the Music app, go to Preferences > Files, and see if "Copy files to Music Media folder" is enabled. If so, downloaded songs are stored locally.
    - Delete unneeded music files from ~/Music/Music/Media/ or the iTunes folder. If you don’t use the Music app, you can delete the entire Music folder after backing up any important files.
4. General Cleanup Tips:
    - After deleting files, empty the Trash to reclaim the space.
    - Restart your Mac to ensure caches are cleared.
    - Check ~/Library/Caches/ for residual app caches related to Photos, Mail, or Music, and delete those folders (e.g., com.apple.Photos, com.apple.mail, com.apple.music).

This should help free up the space. If you’re unsure about any files, back them up first. Let me know if you need more help!
