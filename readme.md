# Cave Animation Engine

## Version
Current development version: V11

A browser-based 2D character deformation and animation system developed for audiovisual and artistic applications.

The engine combines:

- image-based characters
- editable skeleton poses
- mesh deformation
- procedural animation
- sci-fi inspired interface design

---

# Core Features

## Image System

- Load external PNG/JPG images
- Display images on canvas
- Prepare images for deformation

## Pose System

- Load skeleton pose JSON files
- Create default poses
- Drag and edit joints
- Save custom poses

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

Animations are separated into:
animation.js


The engine supports external animation modules.

Current animations:

## Breathing

Subtle body expansion.

## Walking

Leg movement with connected mesh deformation.

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

# Project Structure


Cave_Animation_Engine

│
├── index.html
│
├── engine.js
│
├── animation.js
│
├── style.css
│
├── menu_fx.js
│
├── poses
│ └── pose.json
│
└── animations
├── breathing.json
├── walking.json
├── hiphop.json
├── techno.json
└── ceremony.json


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

## V12

Animation improvements:

- smoother interpolation
- keyframe animation
- animation recording
- external animation presets


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


`animation.js`

handles:

- movement
- choreography
- procedural behaviour


Keep animation separated from the rendering engine.

---

# Git Checkpoint

Current stable milestone:


Clean UI
Working image loading
Working pose loading
Working mesh creation
Working skeleton editing
Connected animation system


---

Developed for experimental animation and audiovisual performance workflows.

Then commit it:

git add README.md
git commit -m "Add project documentation and development roadmap"
git push origin main