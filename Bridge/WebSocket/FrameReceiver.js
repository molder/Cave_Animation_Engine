import { Logger } from "../Core/Logger.js";


export class FrameReceiver {


constructor(){

    this.frames=0;
    this.startTime=Date.now();

}



receive(frame){


    this.frames++;


    let now =
    Date.now();


    if(
        now-this.startTime > 1000
    ){

        Logger.info(
            "FPS: "
            + this.frames
        );


        this.frames=0;
        this.startTime=now;

    }


}


}