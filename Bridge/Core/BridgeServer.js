import { Config } from "./Config.js";
import { Logger } from "./Logger.js";
import { ModuleManager } from "./ModuleManager.js";

import { CommandServer } from "../WebSocket/CommandServer.js";
import { FrameReceiver } from "../WebSocket/FrameReceiver.js";

import { FramePublisher } from "./FramePublisher.js";
import { TestVideoSender } from "../Modules/Output/TestVideoSender.js";
import { SyphonSender } from "../Modules/Output/SyphonSender.js";


export class BridgeServer {


    constructor(){

        this.config =
        new Config();


        this.modules =
        new ModuleManager(
            this.config
        );


        this.receiver =
        new FrameReceiver();


        this.publisher =
        new FramePublisher();


        // NOTE: publisher/receiver must exist before this,
        // since the handlers below close over them.

        this.websocket =
        new CommandServer(
            this.config.get(
                "websocket.port"
            ),
            {

                onFrame:
                frame=>this.handleFrame(frame),


                onControl:
                message=>this.handleControl(message)

            }
        );


        this.testOutput =
        new TestVideoSender();


        this.publisher.addOutput(
            this.testOutput
        );


        this.syphonEnabled =
        !!this.config.get(
            "modules.Syphon.enabled"
        );


        if(this.syphonEnabled){

            this.syphonOutput =
            new SyphonSender(
                this.config.get("syphon")
            );


            this.publisher.addOutput(
                this.syphonOutput
            );

        }

    }



    // ==================================================
    // BINARY WEBSOCKET MESSAGE -> FRAME
    //
    // This is the wire that was previously missing:
    // FrameReceiver counted nothing and FramePublisher
    // published nothing because CommandServer never
    // called back into either of them.
    // ==================================================

    handleFrame(frame){


        this.receiver.receive(
            frame
        );


        this.publisher.publish(
            frame
        );


    }



    // ==================================================
    // JSON WEBSOCKET MESSAGE -> CONTROL
    // ==================================================

    handleControl(message){


        if(!message || !message.type)
        return;


        if(message.type === "status"){

            Logger.info(
                "Browser status: "
                + message.value
            );

            return;

        }


        if(message.type === "pose"){

            // future: forward to OSC / pose-driven outputs

            return;

        }


        Logger.info(
            "Unknown control message type: "
            + message.type
        );


    }



    start(){


        Logger.info(
            "Starting Bridge..."
        );


        this.modules.loadModules();


        this.websocket.start();


        this.testOutput.start();


        if(this.syphonEnabled && this.syphonOutput){

            this.syphonOutput.start();

        }


        Logger.info(
            "Bridge ready"
        );


    }


}
