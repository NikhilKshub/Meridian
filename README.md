# Meridian
A small browser-based WebOS made with HTML, CSS, and JavaScript , that lets users experience a operating system directly in the browser

# Screenshots 
### Desktop
![Desktop](assets/latest%20webos%20images/Desktop.png)

### Apps ( Notes + Doodle app )
![Apps](assets/latest%20webos%20images/Apps.png)

### Widget (Hydration tracker)
![Widget](assets/latest%20webos%20images/Widget.png)

**Try it:** [Live Demo](https://nikhilkshub.github.io/Meridian/)

## Features
1. It features Two Apps ( Notes and Doodle App ) and a widget (Hydration widget)
2. App windows can be dragged, closed, and brought to the front when selected.
3. Notes :- a simple notes app where you can write anything you want, write whatever you like.
4. Doodle app :- it allows you to draw anything you want , it uses red color for the drawing on a warm dot grid background. 
5. Hydration Widget :- here you can keep track of your water intake , make sure to drink enough water :) 

## Run it locally
1. Clone this repository
2. Open index.html file in your browser and use the WebOS and that's it, simple..

## How it works
The Doodle app saves each drawing stroke as a list of points instead of only keeping the final pixels on the canvas. When you press Undo, the app removes the last saved stroke and redraws the strokes that are still left.
This works because the canvas itself only knows what has been drawn, not which stroke was drawn last. By saving the strokes separately, the app can remove one and redraw the rest when needed.

## Credits (including AI usage) 
- Me, obviously.. 
- Claude (AI):- It actually helped me understand some concepts, solve bugs, and explore design ideas, theme colors, and fonts. Claude suggested the theme colors and fonts used in the project. It also helped me understand CSS and JavaScript concepts while I was building the project.
- The final design and layout were decided by me. Claude originally suggested a rail-based layout, but I didn't like it, so I changed it to the simpler desktop layout used in the final project.
-And I took the Fonts from Google Fonts .
- Also the background warm dot grid in Doodle app was generated using ChatGPT image generation tool because I couldn't find a suitable background with the right warm color balance.
- The pencil cursor used in the doodle app and the app icons were actually taken from a free icon website(Flaticon) 
