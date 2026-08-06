# Cave Animation Bridge

Communication module for Cave Animation Engine.


## Purpose

Connect the browser engine with external systems.

Current direction:

Browser

↓

WebSocket Bridge

↓

TouchDesigner / Video Output


## Current State

✅ Node.js server  
✅ WebSocket communication  
✅ Browser connection  
✅ Test output modules  


## Start


npm start



Server:


ws://localhost:9001



## Modules


Bridge

├── Core
│ BridgeServer

├── WebSocket
│ CommandServer

└── Modules
Output systems



## Open Tasks

- TouchDesigner receiver
- NDI sender
- Native connectors


## Links

[Cave Animation Engine](../README.md)

[TD_system](../../README.md)