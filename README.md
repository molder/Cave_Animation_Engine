# TD_system

Real-time audiovisual systems for TouchDesigner.

## Cave Animation Engine

Cave Animation Engine is a project inside TD_system.

It combines:

- TouchDesigner realtime tracking
- YOLO / COCO17 body data
- Pose and animation JSON data
- Browser-based image animation
- Mesh deformation
- WebSocket communication
- Syphon video output (macOS)
- Future NDI video transport (Windows)


## Project Structure

```
Cave_Animation_Engine_/
├── index.html            entry point, loads all scripts
├── engine.js              canvas render loop, mesh warp/draw
├── animation.js            animation update loop
├── animationManager.js     central animation controller
├── presetLibrary.js        image / pose / animation dropdowns + manifests
├── bridge.js               WebSocket client -> Bridge (canvas frame sender)
├── menu_fx.js               UI menu effects
├── settings.json
├── style.css
├── images/                 source images + manifest.json
├── poses/                  pose JSON presets + manifest.json
├── style/                  animation JSON presets + manifest.json
├── rig_engine/              skeleton / mesh rigging logic
├── tools/
├── dev/
├── JSONrecorder/
└── Bridge/                 Node.js server - see Bridge/README.md
```


## Current Features

✅ Image presets (manifest-driven dropdown)
✅ Pose presets (manifest-driven dropdown)
✅ Animation presets (manifest-driven dropdown)
✅ Mouse joint editing
✅ COCO17 skeleton
✅ Mesh generation
✅ Texture warping
✅ Walking animation JSON
✅ Procedural animations
✅ Browser optimized rendering (Chrome)
✅ Bridge WebSocket connection + frame streaming
✅ Syphon output module (macOS, not yet live-tested end-to-end)


## Animation Flow

```
Image
  │
  ▼
Pose JSON
  │
  ▼
Skeleton
  │
  ▼
Mesh
  │
  ▼
Animation
  │
  ▼
Deformed Image
```


## Bridge

Communication with external systems (TouchDesigner):

[Bridge Documentation](./Bridge/README.md)


## Status (2026-08-04)

### Milestone 1 — Asset Library ✅ done

- Image / Pose / Animation dropdowns are populated from
  `images/manifest.json`, `poses/manifest.json`, `style/manifest.json`.
- `updateLibrary()` re-fetches all three manifests and refreshes the
  dropdowns without a page reload.
- Fixed 2026-08-04: a leftover dead code block in `presetLibrary.js`
  (`imageSelect.onchange` / `poseSelect.onchange` referenced before
  their `let` declarations) was throwing a `ReferenceError` on load
  and silently killing the rest of the script, which is why the
  Image and Pose dropdowns stopped responding after the manifest
  work was added. Removed; dropdowns work again.

### Milestone 2 — TouchDesigner Bridge 🔧 in progress

Data flow:

```
Browser Canvas → WebSocket → Bridge (Node) → Syphon → TouchDesigner
```

- ✅ Browser streams canvas frames (JPEG, ~30fps) over WebSocket.
- ✅ Fixed 2026-08-04: `CommandServer` never had a `message` listener,
  so incoming frames were silently dropped before reaching
  `FrameReceiver` / `FramePublisher`. Wired `CommandServer` →
  `BridgeServer.handleFrame()` → `FrameReceiver.receive()` +
  `FramePublisher.publish()`.
- ✅ Added `Bridge/Modules/Output/SyphonSender.js`: decodes incoming
  JPEG frames (`sharp`) and publishes them to a Syphon server
  (`node-syphon`) named `"Cave Animation Engine"`, so TouchDesigner
  can pick it up with a Syphon In TOP / Syphon Spout In TOP.
- ⏳ Not yet run: `npm install` in `Bridge/` (needs Xcode Command
  Line Tools for the native `node-syphon` build) and a first live
  test against TouchDesigner.
- ⏳ NDI sender (Windows) deferred until the Syphon path is confirmed
  working — see `Bridge/Modules/NDI/` for the existing scaffold.


## Roadmap

- Confirm Syphon output live in TouchDesigner (Milestone 2).
- Native NDI sender for Windows deployment.
- Live YOLO input.
- More animation libraries.
- Performance optimization.


## Parent Project

[TD_system](../README.md)
