// ==================================================
// Cave Animation Engine
// bridge.js
//
// Browser -> Cave Animation Bridge
//
// Sends:
// - animation status
// - pose data
// - canvas frames
//
// Connection:
// Chrome
//    |
//    | WebSocket :9001
//    |
// BridgeServer.js
// ==================================================


class CaveAnimationBridge {


    constructor(){
    
        this.ws = null;
    
        this.connected = false;
    
        this.frameCount = 0;
    
        this.lastSend = 0;
    
    }
    
    
    
    connect(){
    
    
        if(this.ws)
            return;
    
    
        this.ws = new WebSocket(
            "ws://localhost:9001"
        );
    
    
        this.ws.binaryType = "arraybuffer";
    
    
        this.ws.onopen = () => {
    
    
            this.connected = true;
    
    
            console.log(
                "Cave Animation Bridge connected"
            );
    
    
            this.sendStatus(
                "connected"
            );
    
    
        };
    
    
    
        this.ws.onerror = (error)=>{
    
    
            console.error(
                "Bridge connection error",
                error
            );
    
    
        };
    
    
    
        this.ws.onclose = ()=>{
    
    
            this.connected = false;
    
            this.ws = null;
    
    
            console.log(
                "Cave Animation Bridge disconnected"
            );
    
    
        };
    
    
    }
    
    
    
    send(message){
    
    
        if(
            !this.connected ||
            !this.ws
        )
            return;
    
    
        this.ws.send(
            JSON.stringify(message)
        );
    
    
    }
    
    
    
    sendStatus(status){
    
    
        this.send({
    
            type:"status",
    
            value:status,
    
            time:Date.now()
    
        });
    
    
    }
    
    
    
    
    sendPose(pose){
    
    
        this.send({
    
            type:"pose",
    
            data:pose,
    
            time:Date.now()
    
        });
    
    
    }
    
    
    
    
    sendFrame(canvas){
    
    
        if(
            !this.connected
        )
            return;
    
    
    
        let now = performance.now();
    
    
    
        // limit bridge stream
        // avoid flooding websocket
    
        if(
            now - this.lastSend < 33
        )
            return;
    
    
        this.lastSend = now;
    
    
    
        canvas.toBlob(
    
            blob=>{
    
    
                if(!blob)
                    return;
    
    
    
                this.ws.send(blob);
    
    
                this.frameCount++;
    
    
    
            },
    
            "image/jpeg",
    
            0.8
    
        );
    
    
    }
    
    
    
    
    getStatus(){
    
    
        return {
    
            connected:
            this.connected,
    
            frames:
            this.frameCount
    
        };
    
    
    }
    
    
    }
    
    
    
    // global browser object
    
    window.CaveAnimationBridge =
    new CaveAnimationBridge();
    
    console.log(
        "Bridge loaded:",
        typeof window.CaveAnimationBridge.sendFrame
    );
    
    // auto connect
    
    window.addEventListener(
    "load",
    ()=>{
    
        window.CaveAnimationBridge.connect();
    
    });