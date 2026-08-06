import fs from "fs";

export class Config {

    constructor(){

        const file =
        new URL("../config.json", import.meta.url);

        this.data =
        JSON.parse(
            fs.readFileSync(file,"utf8")
        );

    }


    get(path){

        return path
        .split(".")
        .reduce(
            (obj,key)=>obj?.[key],
            this.data
        );

    }

}