import {Logger} from "./Logger.js";


export class ModuleManager {


    constructor(config){

        this.config=config;

        this.modules={};

    }


    loadModules(){

        Logger.info(
            "Module system initialized"
        );


        if(
            this.config.get("modules.NDI.enabled")
        ){

            Logger.info(
                "NDI module enabled"
            );

        }


    }


}