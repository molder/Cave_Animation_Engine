# TD_system

## TouchDesigner + Cave Animation Engine Ecosystem

TD_system is the central repository for real-time audiovisual systems developed for immersive installations, performance environments and interactive media.

The repository combines:

* TouchDesigner real-time tracking systems
* YOLO / COCO17 body tracking
* OSC communication
* Browser-based image animation
* Mesh deformation engines
* WebSocket bridges
* Future video transport systems (NDI)

---

# Architecture Overview

```
TD_system

│
├── TouchDesigner
│   ├── YOLO body tracking
│   ├── COCO17 skeleton extraction
│   ├── OSC communication
│   └── Real-time performance systems
│
│
└── Cave_Animation_Engine_
    │
    ├── Browser Animation Engine
    │
    └── Bridge
        ├── WebSocket Server
        ├── Frame Transport
        └── Future NDI Output
```

---

# Cave Animation Engine

Location:

```
Cave_Animation_Engine_/
```

The Cave Animation Engine is a browser-based image animation system.

Main goal:

Transform static images into living animated surfaces using:

* pose data
* skeleton manipulation
* mesh deformation
* procedural animation
* real-time tracking input

Current features:

✓ Image loading
✓ Pose loading from JSON
✓ COCO17 joint structure
✓ Mouse joint editing
✓ Mesh generation
✓ Texture deformation
✓ Skeleton visualization
✓ Animation presets
✓ JSON animation playback
✓ TouchDesigner bridge connection

Documentation:

See:

```
Cave_Animation_Engine_/README.md
```

---

# Cave Animation Bridge

Location:

```
Cave_Animation_Engine_/Bridge/
```

The Bridge connects the browser engine with external systems.

Current implementation:

* Node.js server
* WebSocket communication
* Frame receiving pipeline
* Animation status messages
* Pose data communication

Start:

```bash
cd Cave_Animation_Engine_/Bridge

npm start
```

Current WebSocket endpoint:

```
ws://localhost:9001
```

Documentation:

See:

```
Cave_Animation_Engine_/Bridge/README.md
```

---

# Current Development Status

## Working

### Browser Engine

* Image presets loading
* Pose presets loading
* Mesh deformation
* Walking animation JSON
* Procedural animation presets
* Render pipeline optimized for Chrome

### Bridge

* Node.js BridgeServer running
* WebSocket connection established
* Browser communication working
* Test video sender module created

### Git structure

The repository is cleaned and dependencies are excluded correctly.

`node_modules` is not stored in Git.

---

# Open Tasks

## Bridge

* Complete frame transport architecture
* Connect TouchDesigner receiver
* Build PC connector
* Implement stable video transport

## NDI

Planned:

* Native NDI sender module
* TouchDesigner NDI input/output testing
* Cross-platform connector

## Animation System

Future:

* More motion libraries
* Techno / hiphop / ceremony presets
* Live YOLO tracking input
* Multi-person animation

---

# Development Rule

Before committing:

1. Test locally
2. Confirm browser engine works
3. Confirm Bridge starts
4. Check:

```bash
git status
```

5. Commit only stable versions

---

# Version History

## Version 0.1.1

Current stable checkpoint.

Added:

* repaired render pipeline
* moved Bridge frame sending to final canvas stage
* fixed pose loading workflow
* stabilized mesh creation workflow
* Bridge WebSocket communication

---

## Version 0.1.0

Initial Bridge architecture:

* Node.js server
* Module system
* WebSocket communication
* Test output modules
