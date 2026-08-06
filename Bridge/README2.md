# Cave Animation Bridge

## Version 0.1.0

The **Cave Animation Bridge** is the communication layer between the browser-based **Cave Animation Engine** and external realtime systems such as TouchDesigner.

The goal is to separate the animation engine from the output pipeline, allowing the browser application to become a realtime visual source that can later be distributed through NDI, OSC, recording systems, and other protocols.

---

# Current Status

## Completed

### Commit 1 — Bridge Foundation

Implemented the first structural version of the bridge.

Features:

* Bridge application structure
* Configuration system
* Logging system
* Module management foundation
* Frame publisher foundation
* Node.js based server architecture

Status:

```
WORKING
```

---

### Commit 2 — WebSocket Communication

Implemented realtime WebSocket communication.

Features:

* WebSocket server
* Client connection handling
* Frame receiver foundation
* FPS monitoring
* Browser-to-Bridge communication layer

Current communication:

```
Browser
   |
   |
WebSocket :9001
   |
   |
Cave Animation Bridge
```

Status:

```
WORKING
```

---

# Architecture

Current:

```
Cave Animation Engine
        |
        |
     bridge.js
        |
        |
 WebSocket Connection
        |
        |
Cave Animation Bridge
        |
        |
 Frame Receiver
```

Future:

```
Cave Animation Engine
        |
        |
Cave Animation Bridge
        |
        +----------------+
        |                |
        |                |
       NDI              OSC
        |                |
        |                |
 TouchDesigner     Control Data
```

---

# Folder Structure

```
Bridge/

├── server.js

├── config.json

├── Core/
│   ├── BridgeServer.js
│   ├── Config.js
│   ├── Logger.js
│   ├── ModuleManager.js
│   └── FramePublisher.js

├── WebSocket/
│   ├── CommandServer.js
│   └── FrameReceiver.js

├── Modules/
│   └── NDI/

├── OSC/

├── Public/

└── Logs/
```

---

# Configuration

Main configuration:

```
Bridge/config.json
```

Current ports:

```
Bridge Server:
9000

WebSocket:
9001
```

---

# Development Roadmap

## Commit 3 — Browser Engine Integration

Connect the existing Cave Animation Engine:

* automatic bridge connection
* canvas streaming
* animation state communication
* browser-side bridge management

## Commit 4 — NDI Module

Implement the NDI output module:

```
Browser Canvas
      |
      |
Cave Animation Bridge
      |
      |
NDI Stream
      |
      |
TouchDesigner
```

Goals:

* realtime video output
* 60 FPS support
* 1920x1080 streaming
* TouchDesigner compatibility

## Commit 5 — OSC Control

Add bidirectional control:

```
TouchDesigner
      |
      |
OSC
      |
      |
Cave Animation Bridge
      |
      |
Browser Engine
```

Possible controls:

* animation selection
* pose changes
* parameters
* synchronization

## Commit 6 — TouchDesigner Integration

Create:

```
Cave_Animation_NDI.tox
```

Features:

* automatic NDI detection
* stream receiver
* status monitoring
* integration into TD_system

---

# Philosophy

The Cave Animation Bridge keeps the browser engine independent from the installation environment.

The browser remains the creative animation laboratory:

* image deformation
* mesh animation
* procedural movement
* interaction

The Bridge becomes the universal transport layer:

* NDI
* OSC
* recording
* network distribution

This allows the Cave Animation Engine to become a modular realtime performance system.

---

# Repository

Project:

```
TD_system
```

Location:

```
Cave_Animation_Engine_/Bridge
```

Current state:

```
Foundation complete
WebSocket transport complete
Ready for browser integration
```
