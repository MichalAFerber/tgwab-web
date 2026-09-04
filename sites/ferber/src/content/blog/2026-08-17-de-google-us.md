---
title: "de-google.us: A Map, Not a Manifesto"
description: "The site I built for leaving Google and Apple as landlords — password manager first, real accounts, passkeys, triage the logins that can hurt you, and do not blow up Gmail on a Saturday."
tags: [privacy, foss, proton, products]
thumbnail-img: /assets/img/de-google-us.webp
---

![A paper map and a set of keys on a sunlit table](/assets/img/de-google-us.webp)

# de-google.us: A Map, Not a Manifesto

The [OnePlus 12 post](/2026-05-19-degoogling-my-oneplus-12/) is what I run on a phone. [de-google.us](https://de-google.us/) is the other half: what leaving looks like when you have a job, a family, and an outlook.com address from the year 2000 you are frankly scared to touch.

I run an IT company. I am a Microsoft Partner. I have a Google developer account I cannot delete and an Apple ID because the laptops require one. I am in the same trap the site is written for. That is why it is not a manifesto. It is a map. [degoog.us](https://degoog.us/) is the same door.

You did not pick Google or Apple. The phone store did. Two doors, a carrier, a welded account, and fifteen years of photos, mail, and "Sign in with Google" sitting on a shelf you do not own. Throwing the phone in a lake is not a plan. One change this week is.

## Tier 0: the button

If you do nothing else on the whole site, do this.

The biggest hold is not the inbox. It is **Sign in with Google** / **Sign in with Apple**. Every click made them the landlord of that account. The recipe site, the store, the school portal — they do not know you. They know Google says it is you. Lock the Google account and every one of those doors locks at the same time.

Three steps, none of them a weekend project:

1. **Get a password manager.** Bitwarden is free and open source. Proton Pass if you are already looking at Proton. The Google button was solving "I cannot remember passwords." Something you own can solve that.
2. **From now on, make a real account.** When the page offers Google *or* email, pick email. Ten extra seconds. The manager fills it in.
3. **Use passkeys where you can.** Same one-click feel. You hold the key. They do not advertise this, because it does not need them.

You have not changed email. You have not touched photos. You took the master key out of their pocket.

## Triage the pile you already gave away

You are not going to fix a hundred logins this weekend. Ask one question: **if Google locked me out tomorrow, what would this cost me?**

- **Pile 1 — money and identity.** Bank, cards, taxes, health, government, the email itself, anything that bills monthly. Ten or fifteen accounts. Set a real password next to the Google login so the account stands on its own. This is the pile you fix.
- **Pile 2 — annoying.** Shopping, streaming, forums you actually use. Next time you are in the account anyway, take the minute. Drift, not a project.
- **Pile 3 — you would not miss.** The recipe site from 2019. Do nothing.

Some sites will not let you set a password at all. Google *is* the only key. For Pile 1 that is a real decision: accept the chain, or make a fresh account the proper way. For Pile 2 and 3, shrug.

Finishing was never the goal. Pile 1 done is, for practical purposes, done.

## Three landlords, not one blob

**Google** watches. The lock is sprawl: a thousand threads that do not feel like a cage until they are. Easiest of the three to loosen, because most of it is habit. That is why the site starts here.

**Apple** pampers. The lock is comfort. Photos on the iPad, texts on the Mac, blue bubbles. Privacy is not the main problem. Independence is. Decide if you even care before you spend effort.

**Microsoft** employs. Work identity, Teams, the login that pays the mortgage. For a lot of people it stays at work and that is correct. For anyone self-employed it is the deepest lock, and the move is *containment*, not leaving. I have made that peace. The [replace-SaaS post](/2026-07-07-replace-saas-with-open-source/) is the same sentence: own the domain, rent the MTA, do not pick a fight that takes the job with it.

## Mail is a move, not a deletion

Moving the inbox is the biggest page on the site, and the instruction is slow on purpose. Two weekends, not one. Proton is the default I point people at — Switzerland, usable free tier, Easy Switch. Tutanota and Fastmail are fine; the shape is the same.

Weekend 1: import, **do not close Gmail**, forward and keep a copy, live in Proton for a week. Weekend 2: update the ten accounts where the address is the recovery key, tell the humans once, ignore the long tail. Keep forwarding at least a year. Most thoughtful people never close the old mailbox. A dormant Gmail catching a property-tax notice is a safety net. Killing it to feel free can absolutely hurt you.

That is the [recovery-email](/2026-07-09-recovery-email-architecture/) idea from the other side: the address is load-bearing. Treat it that way.

## What this site is not

It is not the phone FOSS stack. CoMaps, HeliBoard, Immich — that is the OnePlus post. It is not FixDNS. It is not "delete your Google developer account" (I cannot delete mine). It is a sequence: stop the new bleeding, patch what can hurt you, move mail like a house, leave the landlords that do not actually have a grip.

Start at [de-google.us/start-here](https://de-google.us/start-here/). One button this week. The rest of the map waits.
