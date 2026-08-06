import { Logger } from "../../Core/Logger.js";
import { NDISender } from "./NDISender.js";


export class NDIManager {


constructor(config){

    this.config=config;

    this.sender =
    new NDISender(config);

}



start(){

    Logger.info(
        "NDI Module initialized"
    );


    this.sender.start();

}



sendFrame(frame){

    this.sender.send(frame);

}


}