# KatyStage — How Everything Works

A quick guide so you can jump in and build things without needing to know how to code.

---

## How to Talk to Claude

Just type what you want in plain English. You don't need any special commands or technical knowledge. Examples:

> "Make me a landing page with our logo and a contact form"
> "Change the button color to pink"
> "Add a countdown timer to the homepage"
> "Make the hero text bigger and bold"

Claude writes the code directly into this folder on the computer. That's it — just describe what you want.

---

## ultrathink — Deep Mode

Add the word **ultrathink** anywhere in your message when the task is important or complex. It makes Claude think much harder and longer before answering.

**Use it when:**
- You're making a big design decision
- Something keeps going wrong and normal replies aren't fixing it
- You want Claude to really plan something before touching the code

**Examples:**
> "ultrathink — build me a full dashboard with charts, a sidebar and login page"
> "The layout looks broken on mobile, ultrathink and fix it properly"

Without ultrathink Claude still does great work — it's just extra firepower for the hard stuff.

---

## RuFLO — The Agent Swarm

RuFLO is installed in the background. You don't need to do anything special to use it. What it does:

- Splits big tasks across **multiple AI agents** working in parallel (like having a team instead of one person)
- Saves credits by routing simple tasks to lighter models automatically
- Makes large builds faster

You'll see it kick in on its own during complex tasks. If Claude mentions "agents" or "swarm" — that's RuFLO doing its thing.

---

## Obsidian — Your Notes App

Obsidian is a notes app that saves files directly into this project folder. This makes it powerful:

- Write down ideas, requirements, or inspiration → Claude can read those notes
- Keep a list of things you want to change
- Document what the project is supposed to look like

**How to open it:** Find Obsidian in your Applications folder and open the `KatyStage` folder as a vault.

**Tip:** Create a note called `ideas.md` and just dump thoughts in there. Then tell Claude: *"Read my ideas.md and build what's in there."*

---

## Push & Pull — Saving Your Work

Think of it like Google Docs auto-save, but for code.

| Word | What it means | When to use it |
|------|--------------|----------------|
| **Push** | Saves everything to GitHub (the cloud) | After Claude finishes something you like |
| **Pull** | Downloads the latest version from GitHub | When starting a new session or syncing |

**Just say it to Claude:**
> "Push everything to GitHub"
> "Pull the latest changes"

Claude handles the commands. You never need to touch a terminal.

---

## Vercel — Your Live Website

Vercel hosts the website so anyone with the link can see it. Once it's connected to GitHub:

- Every time you push → **the website updates automatically** within about 30 seconds
- You get a live URL to share with people
- You can preview changes before they go live

To connect (one-time setup, done once):
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import the **KatyStage** repo
4. Click Deploy — done

After that, every push is a live deploy. No extra steps.

---

## Quick Reference Card

| You want to... | Say this |
|---------------|----------|
| Build something new | "Make me a [thing]" |
| Change something | "Change the [thing] to [new thing]" |
| Fix something broken | "The [thing] isn't working, fix it" |
| Go deep on something complex | Add **ultrathink** to your message |
| Save your work | "Push to GitHub" |
| Get latest version | "Pull from GitHub" |
| See it live | Push → Vercel auto-deploys |
| Write down ideas | Open Obsidian, save to this folder |

---

*This project lives at: `/Users/katyvanvogelpoel/Desktop/KatyStage`*
*GitHub: [github.com/ddzkd25gkd-crypto/KatyStage](https://github.com/ddzkd25gkd-crypto/KatyStage)*
