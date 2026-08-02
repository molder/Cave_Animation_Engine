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


    constructor(){


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

                this.walkingPreset(t);

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



    // ==================================================
    // WALKING PRESET (self-contained procedural gait)
    // Used whenever no recorded JSON is loaded/available.
    // Moves legs, arms, head and hips like a walking person.
    // ==================================================

    walkingPreset(t){


        if(
            !joints ||
            !basePose ||
            !basePose.left_hip
        ){

            return;

        }


        // DEFAULTS

        let stepLength =
        30 * this.intensity;


        let armSwing =
        25 * this.intensity;


        let headBobAmount =
        6 * this.intensity;


        let cadence =
        3.0;


        let phase =
        t * cadence * this.speed;



        // LEGS (contralateral gait: left leg forward = right arm forward)

        let legSwingL =
        Math.sin(phase) * stepLength;


        let kneeLiftL =
        Math.max(0, Math.sin(phase)) * (stepLength * 0.4);


        if(joints.left_knee && basePose.left_knee){

            joints.left_knee.x =
            basePose.left_knee.x + legSwingL;


            joints.left_knee.y =
            basePose.left_knee.y - kneeLiftL;

        }


        if(joints.left_ankle && basePose.left_ankle){

            joints.left_ankle.x =
            basePose.left_ankle.x + legSwingL * 1.3;

        }



        let legSwingR =
        Math.sin(phase + Math.PI) * stepLength;


        let kneeLiftR =
        Math.max(0, Math.sin(phase + Math.PI)) * (stepLength * 0.4);


        if(joints.right_knee && basePose.right_knee){

            joints.right_knee.x =
            basePose.right_knee.x + legSwingR;


            joints.right_knee.y =
            basePose.right_knee.y - kneeLiftR;

        }


        if(joints.right_ankle && basePose.right_ankle){

            joints.right_ankle.x =
            basePose.right_ankle.x + legSwingR * 1.3;

        }



        // ARMS (opposite phase to same-side leg)

        let armSwingL =
        Math.sin(phase + Math.PI) * armSwing;


        let armSwingR =
        Math.sin(phase) * armSwing;


        if(joints.left_elbow && basePose.left_elbow){

            joints.left_elbow.x =
            basePose.left_elbow.x + armSwingL;

        }


        if(joints.left_wrist && basePose.left_wrist){

            joints.left_wrist.x =
            basePose.left_wrist.x + armSwingL * 1.4;

        }


        if(joints.right_elbow && basePose.right_elbow){

            joints.right_elbow.x =
            basePose.right_elbow.x + armSwingR;

        }


        if(joints.right_wrist && basePose.right_wrist){

            joints.right_wrist.x =
            basePose.right_wrist.x + armSwingR * 1.4;

        }



        // HEAD / NECK bob (double frequency, like a real gait)

        let headBob =
        Math.abs(Math.sin(phase * 2)) * headBobAmount;


        if(joints.neck && basePose.neck){

            joints.neck.y =
            basePose.neck.y - headBob;

        }


        if(joints.nose && basePose.nose){

            joints.nose.y =
            basePose.nose.y - headBob;


            joints.nose.x =
            basePose.nose.x + Math.sin(phase) * (headBobAmount * 0.5);

        }



        // SUBTLE HIP SWAY

        if(joints.left_hip && basePose.left_hip){

            joints.left_hip.x =
            basePose.left_hip.x + Math.sin(phase) * (stepLength * 0.2);

        }


        if(joints.right_hip && basePose.right_hip){

            joints.right_hip.x =
            basePose.right_hip.x + Math.sin(phase + Math.PI) * (stepLength * 0.2);

        }


    }



}







// ==================================================
// GLOBAL INSTANCE
// ==================================================


let animationManager =

new AnimationManager();


