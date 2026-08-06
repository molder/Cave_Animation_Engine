import { WebSocketServer } from "ws";
import { Logger } from "../Core/Logger.js";


export class CommandServer {


constructor(port, handlers = {}){

    this.port = port;
    this.clients=[];


    // callbacks wired in from BridgeServer
    // onFrame(buffer)    -> binary websocket message (canvas JPEG frame)
    // onControl(message) -> parsed JSON websocket message (status / pose / etc.)

    this.onFrame =
        handlers.onFrame || null;

    this.onControl =
        handlers.onControl || null;

}



start(){

    this.server =
    new WebSocketServer({
        port:this.port
    });


    this.server.on(
        "connection",
        socket=>{


            Logger.info(
                "WebSocket client connected"
            );


            this.clients.push(socket);


            socket.on(
                "message",
                (data, isBinary)=>{

                    this.handleMessage(
                        data,
                        isBinary
                    );

                }
            );


            socket.on(
                "close",
                ()=>{

                    Logger.info(
                        "WebSocket client disconnected"
                    );


                    this.clients =
                    this.clients.filter(
                        c=>c!==socket
                    );

                }
            );


            socket.on(
                "error",
                error=>{

                    Logger.error(
                        "WebSocket client error: "
                        + error.message
                    );

                }
            );


        }
    );


    Logger.info(
        "WebSocket server running on port "
        + this.port
    );


}



// ==================================================
// ROUTE INCOMING MESSAGES
//
// ws delivers `isBinary` explicitly (ws >=8), so we
// don't have to guess based on typeof data.
//
// binary  -> canvas frame (JPEG blob from bridge.js sendFrame)
// text    -> JSON control message (status / pose / future commands)
// ==================================================

handleMessage(data, isBinary){


    if(isBinary){

        if(this.onFrame){

            this.onFrame(data);

        }

        return;

    }


    let message;

    try{

        message =
        JSON.parse(
            data.toString()
        );

    }
    catch(error){

        Logger.error(
            "Invalid control message: "
            + error.message
        );

        return;

    }


    if(this.onControl){

        this.onControl(message);

    }


}



broadcast(data){

    this.clients.forEach(
        client=>{

            if(client.readyState===1)
            {
                client.send(data);
            }

        }
    );

}


}
