// FramePublisher.js
//
// Cave Animation Bridge
//
// Central output dispatcher
//
// Sends received frames to:
// - TestVideoSender
// - NDI Sender (future)
// - other output modules


import { Logger } from "./Logger.js";


export class FramePublisher {


constructor(){


    this.frameCount = 0;


    this.outputs = [];


}



addOutput(output){


    this.outputs.push(
        output
    );


    Logger.info(
        "Output added: "
        + output.constructor.name
    );


}



publish(frame){


    if(!frame)
    {
        return;
    }


    this.frameCount++;



    for(
        const output of this.outputs
    )
    {

        output.send(
            frame
        );

    }



    if(
        this.frameCount % 60 === 0
    )
    {

        Logger.info(
            "Frames published: "
            +
            this.frameCount
        );

    }


}



getStatus(){


    return {

        frames:
        this.frameCount,


        outputs:
        this.outputs.length

    };


}


}