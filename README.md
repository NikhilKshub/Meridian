# Meridian
A small browser-based desktop (Web OS) built with plain HTML, CSS, and JavaScript.

## In Action
| Boot Screen | Minimal Desktop Environment |
|---|---|
| ![Boot Screen](assets/latest%20webos%20images/Boot.png) | ![Desktop](assets/latest%20webos%20images/Desktop.png) |

| Calculator App | Notes App |
|---|---|
| ![Calculator](assets/latest%20webos%20images/Calculator.png) | ![Notes](assets/latest%20webos%20images/Notes.png) |

## Quick Start
To explore Meridian, simply click the **[Live Demo Link](https://nikhilkshub.github.io/Meridian/)**. No installations, account sign-ups, or extensions required. 

## What it is
Meridian is a small desktop environment that runs entirely in the browser: draggable, minimizable, maximizable windows, a macOS-style dock, and a couple of working apps, all from three plain files with no framework and no backend.
This is the first, smaller build in the Meridian line — a focused version built to nail the fundamentals of a web desktop (window manager, dock, boot sequence) before growing into a bigger one.

## Features
- **Window manager** — draggable, focusable windows with minimize, maximize, and z-index focus stacking.
- **Dock** — a macOS-style icon dock with hover-lift animation and tooltips; auto-hides while a window is maximized and reappears when the mouse reaches the bottom edge.
- **Boot screen** — an animated wordmark reveal with a live clock and an "Enter" action into the desktop.
- **Notes** — a rich-text editor with bold, italic, and underline.
- **Calculator** — a standard calculator with keyboard-style buttons.
- **Desktop quote widget** — a rotating quote shown on the desktop each time you boot in.

## How it works
The window manager is the core of the project — one object in the code (`apps`) lists every app by name with its starting size, and two functions handle creating a window when you open an app and removing it when you close one. Each app's actual content doesn't exist until you open it — it's built and inserted into the window at that moment, not loaded upfront. This keeps the base desktop light: everything not currently open is just a dock icon, not a chunk of hidden DOM.

## Running it locally
Clone the repository and open `index.html` in a browser. That's it — nothing to install.

## Built with
HTML5 · CSS3 · JavaScript

## Credits
Built by Nikhil Kunwar.

## License
[MIT](LICENSE) — free to use, modify, and distribute.
