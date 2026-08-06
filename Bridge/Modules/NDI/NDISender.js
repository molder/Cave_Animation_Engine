import { Logger } from "../../Core/Logger.js";


export class NDISender {


constructor(config){

    this.config = config;

    this.sourceName =
        config.sourceName || "Cave_Animation";

    this.width =
        config.width || 1920;

    this.height =
        config.height || 1080;

    this.fps =
        config.fps || 60;


    this.native = null;

    this.frameCount = 0;

}



start(){


    Logger.info(
        "Starting NDI Sender"
    );


    Logger.info(
        "Source: "
        + this.sourceName
    );


    try {


        // Native NDI addon
        // will be loaded here

        this.native =
            require("./native/CaveNDI.node");


        this.native.createSender(
            this.sourceName,
            this.width,
            this.height,
            this.fps
        );


        Logger.info(
            "NDI sender created"
        );


    }
    catch(error){


        Logger.info(
            "NDI native module not found yet"
        );


        Logger.info(
            "Running in simulation mode"
        );


    }


}



send(frame){


    if(!frame)
    return;


    this.frameCount++;


    if(this.native)
    {

        this.native.sendFrame(
            frame
        );

    }



    if(
        this.frameCount % 60 === 0
    ){

        Logger.info(
            "NDI frames sent: "
            + this.frameCount
        );

    }


}



stop(){


    if(this.native)
    {

        this.native.destroySender();

    }


}


}