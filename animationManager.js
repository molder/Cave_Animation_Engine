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

        this.referenceFrame = null;


        this.frame = 0;

        // playback direction for ping-pong looping -
        // see updateJSON()
        this.direction = 1;


        this.playing = false;



        // GLOBAL CONTROLS

        this.intensity = 0.5;


        this.speed = 1.0;


        // smoothing for recorded JSON playback only -
        // eases toward each frame's target instead of
        // snapping to it, so camera-tracking noise
        // doesn't read as jitter. 1.0 = no smoothing
        // (old snap behaviour), lower = smoother/laggier

        this.smoothing = 0.25;



        // DEBUG - set true for the occasional status
        // line + a left_knee diagnostic once a second

        this.debug = false;


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

        this.direction = 1;


        this.jsonData = null;

        this.referenceFrame = null;



        // NONE - stop animation and reload whatever pose
        // is currently selected (falls back to the
        // default pose if nothing is selected). This is
        // your "start position" - whatever character/pose
        // you were actually working with, not a generic
        // hardcoded rig - so no leftover distortion from
        // whatever animation was playing carries over.

        if(!name){


            this.mode = "none";

            this.playing = false;


            if(typeof resetPoseToSelected === "function"){


                resetPoseToSelected();


            }

            else if(typeof createDefaultPose === "function"){


                createDefaultPose();


            }


            console.log(
                "Animation: None (reset to current pose)"
            );


            return;


        }



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
        else{

            this.debugCounter++;

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
    //
    // Ping-pong looping (forward, then backward, then
    // forward again) instead of a hard reset to frame 0.
    // Real recorded clips almost never end where they
    // started, so cutting straight back to frame 0 made
    // the character snap to the reference pose every loop
    // - ping-ponging means every step is still between
    // two ADJACENT recorded frames, so there's never a
    // big jump, just a smooth reversal at the ends.
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


        let lastIndex =
        frames.length - 1;



        let index =
        Math.round(
            this.frame
        );


        if(index < 0) index = 0;

        if(index > lastIndex) index = lastIndex;



        let frame =
        frames[index];



        if(
            this.debug &&
            this.debugCounter % 60 === 0
        ){

            console.log(
                "JSON frame",
                index,
                "/",
                lastIndex,
                "dir",
                this.direction
            );

        }



        this.applyFrame(
            frame
        );



        this.frame +=
        this.speed * this.direction;


        if(this.frame >= lastIndex){

            this.frame = lastIndex;

            this.direction = -1;

        }

        else if(this.frame <= 0){

            this.frame = 0;

            this.direction = 1;

        }



    }





    // ==================================================
    // APPLY FRAME
    //
    // The recording captures a real person who physically
    // moved around the room while performing - so a
    // joint's raw camera-space position mixes two very
    // different things: (1) the small local limb
    // articulation we actually want, and (2) the
    // performer's overall body translation across the
    // floor, which can be huge by comparison (this clip's
    // knee X alone spans over half the camera frame).
    //
    // This character rig doesn't walk across the canvas -
    // it stays put and articulates in place. So every
    // joint is first expressed RELATIVE TO A ROOT (the
    // midpoint of the hips) before comparing it to the
    // clip's first frame. That cancels out the whole-body
    // translation and leaves only the actual local
    // movement (arm swing, knee bend) to drive the rig.
    // ==================================================

    rootOf(f){

        if(f.left_hip && f.right_hip){

            return [
                (f.left_hip[0] + f.right_hip[0]) / 2,
                (f.left_hip[1] + f.right_hip[1]) / 2
            ];

        }

        if(f.center_hip){

            return f.center_hip;

        }

        return [0, 0];

    }


    applyFrame(frame){


        if(!this.referenceFrame){

            this.referenceFrame =
            this.jsonData.frames[0];

        }


        let frameRoot =
        this.rootOf(frame);


        let refRoot =
        this.rootOf(this.referenceFrame);


        for(
            let jointName in frame
        ){



            if(
                joints[jointName]
                &&
                basePose[jointName]
                &&
                this.referenceFrame[jointName]
            ){


                let ref =
                this.referenceFrame[jointName];


                // joint position relative to its OWN
                // frame's root (hip midpoint) - this is
                // what removes whole-body translation

                let jointRelX =
                frame[jointName][0] - frameRoot[0];


                let jointRelY =
                frame[jointName][1] - frameRoot[1];


                let refRelX =
                ref[0] - refRoot[0];


                let refRelY =
                ref[1] - refRoot[1];


                // recorded LOCAL movement relative to the
                // clip's own rest frame, converted from
                // normalized 0..1 to pixels. Y is not
                // inverted: canvas and recording both use
                // top-left origin (Y increases downward).

                let dx =
                (jointRelX - refRelX)
                *
                canvas.width;


                let dy =
                (jointRelY - refRelY)
                *
                canvas.height;


                let targetX =
                basePose[jointName].x + dx * this.intensity;


                let targetY =
                basePose[jointName].y + dy * this.intensity;


                if(
                    this.debug &&
                    jointName === "left_knee" &&
                    this.debugCounter % 60 === 0
                ){

                    console.log(
                        "DIAG left_knee",
                        {
                            frameRaw: frame[jointName],
                            refRaw: ref,
                            frameRoot: frameRoot,
                            refRoot: refRoot,
                            dx: dx,
                            dy: dy,
                            targetX: targetX,
                            targetY: targetY,
                            currentX: joints[jointName].x,
                            currentY: joints[jointName].y
                        }
                    );

                }



                joints[jointName].x +=

                (
                    targetX - joints[jointName].x
                )

                *

                this.smoothing;



                joints[jointName].y +=

                (
                    targetY - joints[jointName].y
                )

                *

                this.smoothing;



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
