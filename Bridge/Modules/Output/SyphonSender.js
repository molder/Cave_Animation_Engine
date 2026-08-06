// SyphonSender.js
//
// Cave Animation Bridge
// Syphon Output (macOS)
//
// Purpose:
// Decode incoming JPEG canvas frames and publish them to
// a Syphon server, so TouchDesigner (Syphon In TOP / Syphon
// Spout In TOP) can receive the browser canvas as a live
// texture.
//
// Frame format expected in send(frame):
// Buffer containing JPEG bytes, exactly as sent by
// CaveAnimationBridge.sendFrame() in bridge.js
// (canvas.toBlob("image/jpeg") -> ws.send(blob)).
//
// Requires (macOS only):
//   npm install node-syphon sharp
// node-syphon is a native addon - Xcode Command Line Tools
// must be installed for the build step during npm install.


import { Logger } from "../../Core/Logger.js";


export class SyphonSender {


constructor(config = {}){


    this.config = config;


    this.name =
        config.name || "Cave Animation Engine";


    this.flipped =
        config.flipped ?? false;


    this.textureTarget =
        config.textureTarget || "GL_TEXTURE_2D";


    this.maxFps =
        config.maxFps || 30;


    this.minFrameInterval =
        1000 / this.maxFps;


    this.lastPublishTime = 0;


    // Guards against overlapping async decodes. If a frame
    // is still being decoded/published when the next one
    // arrives, the new one is dropped rather than queued.
    // This keeps latency low and prevents a growing backlog
    // if Syphon / TouchDesigner ever stalls momentarily.

    this.publishing = false;


    this.server = null;

    this.sharp = null;


    this.frameCount = 0;

    this.droppedBusy = 0;

    this.droppedRate = 0;

    this.lastError = null;

    this.width = 0;

    this.height = 0;

    this.connected = false;


}



async start(){


    Logger.info(
        "Starting Syphon Sender"
    );


    Logger.info(
        "Server name: "
        + this.name
    );


    try{

        const { SyphonOpenGLServer } =
            await import("node-syphon");


        this.server =
            new SyphonOpenGLServer(
                this.name
            );


        this.connected = true;


        Logger.info(
            "Syphon server created - visible to "
            + "TouchDesigner as \""
            + this.name
            + "\""
        );

    }
    catch(error){

        this.lastError = error.message;


        Logger.error(
            "Syphon native module not available: "
            + error.message
        );


        Logger.info(
            "Install with: npm install node-syphon sharp"
        );

    }


}



async send(frame){


    if(!frame)
    return;


    if(!this.server)
    return;


    // ---- backpressure guard ----

    if(this.publishing){

        this.droppedBusy++;

        return;

    }


    // ---- rate limit, independent of incoming frame rate ----

    let now = Date.now();


    if(
        now - this.lastPublishTime
        <
        this.minFrameInterval
    ){

        this.droppedRate++;

        return;

    }


    this.publishing = true;


    try{

        if(!this.sharp){

            this.sharp =
                (await import("sharp")).default;

        }


        let { data, info } =
        await this.sharp(frame)
            .ensureAlpha()
            .raw()
            .toBuffer({
                resolveWithObject:true
            });


        this.server.publishImageData(

            data,

            {
                x:0,
                y:0,
                width:info.width,
                height:info.height
            },

            {
                width:info.width,
                height:info.height
            },

            this.flipped,

            this.textureTarget

        );


        this.width = info.width;

        this.height = info.height;

        this.lastPublishTime = now;

        this.frameCount++;


        if(
            this.frameCount % 60 === 0
        ){

            Logger.info(
                "Syphon frames published: "
                + this.frameCount
                + " ("
                + info.width
                + "x"
                + info.height
                + ")"
            );

        }

    }
    catch(error){

        this.lastError = error.message;


        Logger.error(
            "Syphon publish failed: "
            + error.message
        );

    }
    finally{

        this.publishing = false;

    }


}



getStatus(){


    return {

        active:this.connected,

        frames:this.frameCount,

        droppedBusy:this.droppedBusy,

        droppedRate:this.droppedRate,

        size:this.width + "x" + this.height,

        lastError:this.lastError

    };


}



stop(){


    this.connected = false;


    Logger.info(
        "Syphon Sender stopped"
    );


}



}
