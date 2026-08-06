# Cave Animation Engine

## Version
Current development version: V12

A browser-based 2D character deformation and animation system developed for audiovisual and artistic applications.

The engine combines:

- image-based characters
- editable skeleton poses
- mesh deformation
- procedural animation
- sci-fi inspired interface design

---

# Running Locally (required)

The engine loads images, poses, and animations via `fetch()` (for `manifest.json` files and saved `.json` poses/animations), and `Save Pose` uses the browser's File System Access API. Both of these need the page to be served over `http://` — opening `index.html` directly as a `file://` path will cause the manifest fetches to fail silently (dropdowns stay empty) and can block the folder picker on Save.

Any simple local server works. From inside `Cave_Animation_Engine_/`:

**Python (already installed on macOS):**
```
python3 -m http.server 8000
```
Then open `http://localhost:8000/index.html` in Chrome or Edge.

**Node, if you have it installed:**
```
npx serve .
```
This prints the local URL to open (usually `http://localhost:3000`).

**VS Code:** the "Live Server" extension works too — right-click `index.html` → "Open with Live Server".

Leave the terminal/server running while you work; stop it with `Ctrl+C` when done.

---

# Core Features

## Image System

- Load a saved image from the `select saved image` dropdown (populated from `images/manifest.json`) — loads immediately on selection, no separate Load button
- Images live in `images/` (PNG/JPG/JPEG)
- Prepare images for deformation via `Create Mesh`

## Pose System

- Load a saved pose from the `select saved pose` dropdown (populated from `poses/manifest.json`) — loads immediately on selection, no separate Load button
- Create default poses (`New Pose`)
- Drag and edit joints
- Save custom poses (`Save Pose`) — in Chrome/Edge this writes the pose **directly into `poses/`** and updates `poses/manifest.json` automatically (see Manifest System below); you'll be asked to pick the `poses/` folder once, then it's remembered. Other browsers fall back to a normal file download that needs to be moved into `poses/` manually.

Supported joints:

- nose
- neck
- shoulders
- elbows
- wrists
- hips
- knees
- ankles

---

# Mesh Deformation

The engine creates a triangle-based deformation mesh.

Workflow:

1. Load image
2. Load or create pose
3. Create mesh
4. Move skeleton joints
5. Mesh follows the skeleton

The deformation system uses:

- mesh points
- bone binding
- triangle texture mapping

The skeleton controls the image without destroying the original texture.

---

# Animation System

Animations are split across `animation.js` (procedural presets + dropdown wiring) and `animationManager.js` (JSON playback, procedural fallback, intensity/speed control).

Selecting an option in `select animation` loads and plays it immediately — no separate Play button needed (Play still works too, it's just redundant now).

Current animations:

## None

Stops any playing animation and resets the skeleton and mesh to the canonical **default/start pose** (`createDefaultPose()`) — a full, deterministic reset that never carries over distortion from whatever animation was playing before.

## Breathing

Subtle body expansion.

## Walking

Leg movement with connected mesh deformation. Uses recorded `style/walking.json` if present, otherwise falls back to a procedural gait.

## Hip Hop

Rhythmic body movement:

- shoulders
- arms
- bounce

## Techno

Pulse based movement:

- hands
- body rhythm

## Ceremony

Slow gesture movement inspired by performance and calligraphy.

---

# Manifest System

The `select saved image`, `select saved pose`, and `select animation` dropdowns are all populated the same way: a browser can't list a folder's contents directly, so each folder keeps a small `manifest.json` file naming what's inside, and `presetLibrary.js` fetches it on page load.

| Folder | Manifest | Format |
|---|---|---|
| `images/` | `images/manifest.json` | `{ "images": ["cave.png", "vogel.jpg"] }` — full filename with extension |
| `poses/` | `poses/manifest.json` | `{ "poses": ["cave", "pose_bird"] }` — name only, `.json` assumed |
| `style/` | `style/manifest.json` | `{ "animations": ["walking", "walking_full"] }` — name only, `.json` assumed, added on top of the built-in procedural presets |

**Adding an image or animation manually:** drop the file into the folder, then add its name to that folder's `manifest.json`, then reload the page.

**Adding a pose:** just click `Save Pose` — see Pose System above. In Chrome/Edge this writes the file and updates the manifest for you automatically; no manual JSON editing needed.

---

# Project Structure

```
Cave_Animation_Engine_
│
├── index.html
├── engine.js            (image, pose, mesh, save/load, rendering)
├── animation.js          (procedural presets, animation dropdown wiring)
├── animationManager.js   (JSON playback, procedural fallback, intensity/speed)
├── presetLibrary.js      (manifest loading, pose/image dropdown logic)
├── menu_fx.js
├── style.css
│
├── images/
│   ├── manifest.json
│   ├── cave.png
│   └── vogel.jpg
│
├── poses/
│   ├── manifest.json
│   ├── cave.json
│   └── pose_bird.json
│
└── style/
    ├── manifest.json
    ├── walking.json
    └── walking_full.json
```

---

# Interface Design

The UI follows a silent sci-fi philosophy:

- minimal controls
- transparent holographic panel
- subtle green illumination
- low visual distraction

The artwork remains the main focus.

---

# Development Roadmap

## V12 (current)

- ~~smoother interpolation~~ in progress
- keyframe animation
- animation recording
- external animation presets (done via manifest system)
- select-to-load dropdowns for image/pose/animation (done)
- direct pose saving via File System Access API (done)


## V13

Advanced deformation:

- weighted bones
- multiple influence zones
- smoother body bending


## V14

Performance integration:

- OSC control
- TouchDesigner communication
- live tracking input


---

# Development Notes

Important rule:

`engine.js`

handles:

- image
- pose
- mesh
- rendering
- saving (writes poses directly via File System Access API)


`animation.js` / `animationManager.js`

handles:

- movement
- choreography
- procedural behaviour
- JSON animation playback

`presetLibrary.js`

handles:

- manifest loading for image/pose/animation dropdowns
- immediate load-on-select for image and pose

Keep animation separated from the rendering engine.

---

# Git Checkpoint

Current stable milestone:

```
Clean UI
Working image loading (dropdown, manifest-driven)
Working pose loading (dropdown, manifest-driven)
Working pose saving (direct-to-folder in Chrome/Edge)
Working mesh creation
Working skeleton editing
Connected animation system with working None/reset
```

---

Developed for experimental animation and audiovisual performance workflows.

Then commit it:

```
git add README.md
git commit -m "Update README: manifest system, local server setup, direct pose saving"
git push origin main
```
