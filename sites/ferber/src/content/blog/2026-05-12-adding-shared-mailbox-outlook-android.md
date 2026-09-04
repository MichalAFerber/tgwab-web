---
title: "Adding a Shared Mailbox in Outlook for Android"
description: "How to attach an Exchange Online shared mailbox to Outlook on Android — the steps, the Full Access permission it actually needs, and what to check when it fails."
tags: [outlook, android, microsoft-365, how-to, exchange]
thumbnail-img: /assets/img/outlook-android-shared-mailbox.webp
---

![Adding a shared mailbox on Android](/assets/img/outlook-android-shared-mailbox.webp)

# Adding a Shared Mailbox in Outlook for Android

Shared mailboxes are easy on the desktop and oddly fussy on a phone. If the mailbox is already granted on the back end, Outlook for Android can attach it in about a minute. If the permission is wrong, the app will sit there and look broken.

This is for **Exchange Online**. The "Add a Shared Mailbox" path does not work against on-premises Exchange.

## Prerequisites

- Outlook for Android installed from the Play Store and updated.
- Your own work account already signed in and able to send and receive.
- **Full Access** on the shared mailbox. Send As alone is not enough for mobile to attach it.

An admin sets Full Access in the Exchange admin center: Recipients → Mailboxes → the shared mailbox → Delegation → Read and manage.

## Steps

1. Open the **Outlook** app.
2. Tap your **profile picture or initials** in the top-left corner.
3. Tap the **gear icon** (Settings) in the bottom-left.
4. Under **Mail Accounts**, tap **Add Mail Account**.
5. Tap **Add a Shared Mailbox**.
6. If prompted, select your work account — the one that has permission to the shared mailbox.
7. Enter the shared mailbox address and tap **Add Shared Mailbox**.
8. Wait a few seconds. The shared mailbox appears in the account list, reachable from the profile menu in the top-left.

## Switching Between Mailboxes

Tap the profile icon in the top-left and pick the mailbox you want. Yours and the shared mailbox show up as separate entries.

## Troubleshooting

- **"Add a Shared Mailbox" is missing.** Update Outlook from the Play Store. Older builds hide the option.
- **Error when adding.** Permissions are probably not applied yet. Confirm Full Access, wait a few minutes for Exchange to replicate, and try again.
- **Mailbox shows but no mail loads.** Give the first sync 5–10 minutes, then force-close and reopen Outlook.
- **It works on desktop and fails on the phone.** Desktop Outlook can often open a shared mailbox with Autodiscover even when mobile cannot. Recheck Full Access, not Send As.

Once it's attached, treat it like any other account in the app: notifications, focused inbox, and send-from all follow whatever the admin granted on that mailbox.
