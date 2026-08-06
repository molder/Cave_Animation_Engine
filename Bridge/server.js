import { BridgeServer } from "./Core/BridgeServer.js";

console.log("");
console.log("=================================");
console.log(" Cave Animation Bridge");
console.log(" Version 0.1.0");
console.log("=================================");
console.log("");

const bridge = new BridgeServer();

bridge.start();