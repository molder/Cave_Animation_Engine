// TestVideoSender.js
//
// Cave Animation Bridge
// Development Frame Output
//
// Purpose:
// Receive frames from Bridge
// Validate image pipeline
//
// Future:
// Replace with NDI / Syphon / Spout output


import { Logger } from "../../Core/Logger.js";


export class TestVideoSender {


constructor(config = {}){


    this.config = config;


    this.frameCount = 0;

    this.lastFrameTime = 0;

    this.connected = false;


}



start(){


    Logger.info(
        "TestVideoSender started"
    );


    this.connected = true;


}



send(frame){


    if(!frame)
    {
        return;
    }


    this.frameCount++;


    this.lastFrameTime =
        Date.now();



    if(
        this.frameCount % 60 === 0
    )
    {

        Logger.info(
            "Test frames received: "
            +
            this.frameCount
        );


    }


}



getStatus(){


    return {

        active:this.connected,

        frames:this.frameCount,

        lastFrame:this.lastFrameTime

    };


}



stop(){


    this.connected = false;


    Logger.info(
        "TestVideoSender stopped"
    );


}



}