# Reverse Worlds Platformer (HTML5 Canvas)

A small platformer inspired by classic side-scrollers. Progression runs backwards: World 8, 7, ... down to 1.

This project does not include or use any Nintendo assets or code. It is an original work for educational/demo purposes only.

## Run locally

- Option 1: Open `index.html` directly in a modern browser (file URL)
- Option 2: Serve with a simple HTTP server:

```bash
# Python 3
python3 -m http.server 8080 --directory /workspace
# Then open http://localhost:8080/index.html
```

## Controls

- Move: Arrow keys or WASD
- Jump: Space or Up
- Reset: R

## Notes

- Tile size is 48px. Canvas is 960x540.
- Levels are defined in `src/worlds/levels.js`. Start index is `START_WORLD_INDEX` which points to World 8.
- Rendering is placeholder rectangles; you can swap in sprites later.

## Legal

This project is not affiliated with or endorsed by Nintendo. Do not use trademarked names or assets.