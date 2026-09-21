# Meridian

A browser-based desktop (Web OS) built with plain HTML, CSS, and JavaScript.

**[Live Demo](https://nikhilkshub.github.io/Meridian/)**

## Screenshots

| Desktop | Terminal | Music Player |
|---|---|---|
| ![Desktop](assets/screenshots/desktop.png) | ![Terminal](assets/screenshots/terminal.png) | ![Music](assets/screenshots/music.png) |

| Calculator | Notes | Paint |
|---|---|---|
| ![Calculator](assets/screenshots/calculator.png) | ![Notes](assets/screenshots/notes.png) | ![Paint](assets/screenshots/paint.png) |

| Snake | Pomodoro | Boot Screen |
|---|---|---|
| ![Snake](assets/screenshots/snake.png) | ![Pomodoro](assets/screenshots/pomodoro.png) | ![Boot](assets/screenshots/boot.png) |

## What it is
Meridian is a small desktop environment that runs entirely in the browser — windows you can drag, minimize, and maximize, a macOS-style dock, wallpaper, desktop widgets, and seven working apps, all built from three plain files with no framework and no backend.
The name comes from the idea of a sun crossing its highest point — a still, deliberate moment rather than a busy sci-fi theme. That's also why the whole interface leans warm and minimal.

## Features
- **Window manager** — draggable, focusable windows with minimize, maximize, z-index focus stacking; smooth open/close motion.
- **Dock** — a macOS-style icon dock with hover lift animation and tooltips, auto-hides while a window is maximized and reappears when the mouse reaches the bottom edge.
- **Terminal** — a small command interpreter (`help`, `open <app>`, `theme <color>`, `echo`, `joke`, and more) that can open other apps and re-theme the whole OS live.
- **Music Player** — drag-and-drop local audio files into a playlist, play/pause/skip, adjust volume, with a spinning vinyl animation and a "Now Playing" mini-strip on the desktop.
- **Notes** — a rich-text editor (bold/italic/underline) that saves as you type.
- **Calculator** — a standard calculator with keyboard-style buttons.
- **Pomodoro Timer** — Focus, Short Break, Long Break, and Custom duration modes.
- **Paint** — pencil, line, rectangle, and circle tools, a color palette plus custom color picker, adjustable brush size, undo, and clear; drawing persists across reloads.
- **Snake** — canvas-based, with grid-aligned movement, a live score and saved best score.
- **Desktop widgets** — a Tasks list and a Hydration tracker, both persistent; a sundial-style clock widget; a rotating quote-of-the-day.
- **Right-click menu** — refresh, arrange open windows into a grid, and replace the wallpaper.
- **Boot/landing screen** — an animated wordmark reveal with a live clock and a sign-in style "Enter" action into the desktop.
- **Persistence** — notes, the Paint canvas, Snake's best score, tasks, hydration count, and wallpaper all gets saved via `localStorage`.

## How it's built
No React, no backend, no build step. Three files:
- `index.html` — the structure: boot screen, dock, widgets, window containers.
- `style.css` — the entire visual design, color system, and animations.
- `script.js` — the window manager and every app's logic.

The window manager is the core of the project — one list in the code keeps track of every app (its name and starting size), and two functions handle creating a window when you open an app and removing it when you close one. Each app's actual content (buttons, layout, etc.) doesn't exist until you open that app — it gets built and inserted into the window at that moment, not loaded upfront. A couple of apps run ongoing background processes while open,Snake's game loop and Music's audio playback —and those are explicitly stopped when their window closes, so nothing keeps running invisibly after you close it.

Paint and Snake use the Canvas API directly. Music uses the `<audio>` element plus `URL.createObjectURL()` to play local files without ever uploading them anywhere. Persistent data goes through a small pair of `saveToStorage`/`loadFromStorage` helpers built on `localStorage`, with JSON used to store anything that isn't already a plain string.

## Running it locally

Clone the repository and open `index.html` in a browser. That's it — nothing to install.

## Why I made it

I found out about Stardance by Hackclub through a friend, and while looking through the challenges, the WebOS challenge immediately caught my attention. I had never really thought about making an operating system that runs inside a browser before, but I liked the idea and wanted to see what I could build with it.
My first idea for Meridian was very different from what it looks like now. I wanted the whole desktop to feel like a space environment, with planets moving around, orbital paths, stars, galaxies, and space-themed apps. I also came up with the wormhole idea from that concept. Around the same time, I saw a reel of someone creating a wormhole effect in their own space-themed website, which also inspired me to try something similar. I thought it would be fun to have something hidden in the desktop that could basically pull everything into a wormhole and reset the system.
The problem was that the more I tried to build the space-themed version, the more complicated it became. I kept running into problems trying to make the desktop, windows, and applications fit naturally into the theme, and eventually I felt like the theme itself was getting in the way of the WebOS I actually wanted to make.
So I ended up rebuilding a large part of Meridian and changed the visual direction toward a neo-brutalist style. And for that neo brutalist style webos that i named as Nebula OS I did not want to completely throw away the original idea and because of it some of the space-inspired parts stayed in the project, especially the wormhole feature was kept in the project but after feedback that it looked AI-generated and leaned too heavily on AI-written code, I rebuilt it from scratch under a different name (##Meridian) and a different process: instead of asking for finished code, I worked through each piece — the window manager, then each app, then persistence, then the full visual pass — concept by concept, writing the code myself.

## AI usage
I used Claude and chatgpt throughout development, but not to generate the project for me. My process was: Claude explained a concept (how a window manager tracks state, how canvas resizing works, how localStorage persistence works, etc.), and I wrote the actual code myself. Where I got stuck or couldnt figure out something or introduced a bug, I brought the broken code back and we traced through it together to find the actual cause, rather than having it rewritten for me.

Claude also helped with visual design decisions (color system, layout, animation choices) and caught real bugs in code I'd written (a stray character breaking z-index focus, a typo in a `display` property, a missing event listener) by walking through the logic rather than guessing.

Meridian is not an AI-powered application — it doesn't call any AI API, and nothing in the running app depends on AI. AI was part of how I learned to build it, not part of what it does.

## Built with

HTML5 · CSS3 · JavaScript · Canvas API · localStorage

## Credits

Built by Nikhil Kunwar.

## License

[MIT](LICENSE) — free to use, modify, and distribute.
