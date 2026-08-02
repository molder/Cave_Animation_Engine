// ==================================================
// Cave Animation Engine
// animationManager.js
//
// Controls:
// - JSON animations
// - procedural fallback animations
// - intensity
// - speed
// ==================================================


class AnimationManager {


    updateJSONtructor(){


        this.currentName = "none";


        this.mode = "none";


        this.jsonData = null;


        this.frame = 0;


        this.playing = false;

        this.frameStep = 3;
        this.updateCounter = 0;



        // GLOBAL CONTROLS

        this.intensity = 0.5;


        this.speed = 1.0;



        // DEBUG

        this.debug = true;


        this.debugCounter = 0;



        console.log(
            "AnimationManager ready"
        );


    }







    // ==================================================
    // LOAD ANIMATION
    // ==================================================

    async load(name){


        this.currentName = name;


        this.frame = 0;


        this.jsonData = null;


        this.playing = true;



        console.log(
            "Loading animation:",
            name
        );



        try{


            let response =
            await fetch(
                "style/" + name + ".json"
            );



            if(response.ok){


                this.jsonData =
                await response.json();



                this.mode =
                "json";



                console.log(
                    "JSON animation loaded:",
                    name
                );


                console.log(
                    "Frames:",
                    this.jsonData.frames.length
                );


                return;


            }


        }


        catch(error){


            console.log(
                "JSON loading error:",
                error
            );


        }




        // FALLBACK

        this.mode =
        "preset";



        console.log(
            "Using procedural preset:",
            name
        );


    }









    // ==================================================
    // UPDATE
    // ==================================================

    update(t){



        if(this.debug){


            this.debugCounter++;


            if(this.debugCounter % 120 === 0){


                console.log(

                    "AnimationManager UPDATE",

                    {
                        mode:this.mode,
                        playing:this.playing,
                        frame:this.frame,
                        intensity:this.intensity,
                        speed:this.speed
                    }

                );


            }


        }





        if(!this.playing)

        return;





        if(this.mode === "json"){


            this.updateJSON();


        }



        else if(this.mode === "preset"){


            this.updatePreset(
                t
            );


        }



    }









   // ==================================================
// JSON PLAYBACK
// ==================================================

updateJSON(){


    if(
        !this.jsonData ||
        !this.jsonData.frames
    ){

        console.warn(
            "No JSON data"
        );

        return;

    }



    let frames =
    this.jsonData.frames;



    let index =
    Math.floor(
        this.frame
    );



    if(index >= frames.length){

        this.frame = 0;

        index = 0;

    }



    let frame =
    frames[index];



    console.log(
        "PLAYING JSON FRAME",
        index
    );



    this.applyFrame(
        frame
    );



    this.frame +=
    this.speed;



}





    // ==================================================
    // APPLY FRAME
    // ==================================================

    applyFrame(frame){



        for(
            let jointName in frame
        ){



            if(
                joints[jointName]
                &&
                basePose[jointName]
            ){



                let targetX =

                frame[jointName][0]

                *

                canvas.width;





                let targetY =

                (1-frame[jointName][1])

                *

                canvas.height;





                joints[jointName].x =


                basePose[jointName].x

                +

                (

                    targetX -

                    basePose[jointName].x

                )

                *

                this.intensity;







                joints[jointName].y =


                basePose[jointName].y

                +

                (

                    targetY -

                    basePose[jointName].y

                )

                *

                this.intensity;



            }



        }



    }









    // ==================================================
    // PROCEDURAL FALLBACK
    // ==================================================

    updatePreset(t){



        switch(
            this.currentName
        ){


            case "walking":

                walkingAnimation(t);

            break;



            case "breathing":

                breathingAnimation(t);

            break;



            case "hiphop":

                hipHopAnimation(t);

            break;



            case "techno":

                technoAnimation(t);

            break;



            case "ceremony":

                ceremonyAnimation(t);

            break;



            default:


                console.warn(

                    "No procedural preset:",

                    this.currentName

                );


            break;


        }


    }



}







// ==================================================
// GLOBAL INSTANCE
// ==================================================


let animationManager =

new AnimationManager();


