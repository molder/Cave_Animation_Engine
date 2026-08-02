// ==================================================
// Cave Animation Engine
// animation.js
// ==================================================


// ==================================================
// STATE
// ==================================================

let animationState = {

    current:"none",

    playing:false,

    time:0,

    speed:1

};



// ==================================================
// RECORDED WALKING JSON
// ==================================================

let recordedWalking = null;

let walkingFrame = 0;


async function loadWalkingJSON(){


    try{


        let response =
        await fetch(
            "style/walking.json"
        );


        if(!response.ok){

            throw new Error(
                "walking.json not found"
            );

        }


        recordedWalking =
        await response.json();



        console.log(
            "Walking JSON loaded:",
            recordedWalking.frames.length,
            "frames"
        );


    }


    catch(error){


        console.error(
            "Walking JSON loading failed:",
            error
        );


    }


}


loadWalkingJSON();



loadWalkingJSON();





// ==================================================
// SELECT ANIMATION
// ==================================================

function selectAnimation(name){


    animationState.current = name;


    animationState.playing = true;


    animationState.time = 0;


    walkingFrame = 0;



    console.log(
        "Animation:",
        name
    );


}






// ==================================================
// STOP
// ==================================================

function stopAnimation(){


    animationState.playing=false;


}






// ==================================================
// UPDATE ANIMATIONS
// ==================================================

function updateAnimations(){



    if(!animationState.playing)

    return;




    animationState.time +=
    0.03 *
    animationState.speed;



    let t =
    animationState.time;




    switch(animationState.current){



        case "breathing":

            breathingAnimation(t);

        break;



        case "walking":

            walkingAnimation(t);

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



    }




    // IMPORTANT
    // skeleton drives mesh

    updateMesh();



}







// ==================================================
// BREATHING
// ==================================================

function breathingAnimation(t){



    let breath =
    Math.sin(t*1.5)
    *
    8;



    let shoulder =
    Math.sin(t*1.5)
    *
    3;



    if(joints.neck){

        joints.neck.y =
        basePose.neck.y -
        breath;

    }



    if(joints.left_shoulder){

        joints.left_shoulder.y =
        basePose.left_shoulder.y -
        shoulder;

    }



    if(joints.right_shoulder){

        joints.right_shoulder.y =
        basePose.right_shoulder.y -
        shoulder;

    }


}








// ==================================================
// WALKING
// RECORDED JSON MOTION
// ==================================================

function walkingAnimation(t){



    if(recordedWalking){



        let frame =
        recordedWalking.frames[
            Math.floor(walkingFrame)
        ];



        if(frame){

            // create neck from shoulders

            if(
                frame.left_shoulder &&
                frame.right_shoulder
            ){

                frame.neck = [

                    (
                        frame.left_shoulder[0] +
                        frame.right_shoulder[0]
                    ) / 2,


                    (
                        frame.left_shoulder[1] +
                        frame.right_shoulder[1]
                    ) / 2 - 0.08

                ];

            }

            for(
                let jointName in frame
            ){



                if(
                    joints[jointName]
                ){


                    joints[jointName].x =
                    frame[jointName][0]
                    *
                    canvas.width;



                    joints[jointName].y =
                    (1-frame[jointName][1])
                    *
                    canvas.height;


                }


            }


        }




        walkingFrame +=
        animationState.speed;



        if(
            walkingFrame >=
            recordedWalking.frames.length
        ){

            walkingFrame = 0;

        }



        return;


    }





    // fallback procedural walk


    let step =
    Math.sin(t*3)
    *
    35;



    if(joints.left_knee){

        joints.left_knee.x =
        basePose.left_knee.x +
        step;

    }



    if(joints.right_knee){

        joints.right_knee.x =
        basePose.right_knee.x -
        step;

    }


}









// ==================================================
// HIP HOP
// ==================================================

function hipHopAnimation(t){



    let bounce =
    Math.sin(t*6)
    *
    15;



    let arm =
    Math.sin(t*3)
    *
    30;



    if(joints.left_shoulder){

        joints.left_shoulder.y =
        basePose.left_shoulder.y +
        bounce;

    }



    if(joints.right_shoulder){

        joints.right_shoulder.y =
        basePose.right_shoulder.y +
        bounce;

    }



    if(joints.left_elbow){

        joints.left_elbow.x =
        basePose.left_elbow.x -
        arm;

    }



    if(joints.right_elbow){

        joints.right_elbow.x =
        basePose.right_elbow.x +
        arm;

    }



}









// ==================================================
// TECHNO
// ==================================================

function technoAnimation(t){



    let pulse =
    Math.sin(t*8)
    *
    20;



    if(joints.left_wrist){

        joints.left_wrist.y =
        basePose.left_wrist.y +
        pulse;

    }



    if(joints.right_wrist){

        joints.right_wrist.y =
        basePose.right_wrist.y -
        pulse;

    }



}








// ==================================================
// CEREMONY
// ==================================================

function ceremonyAnimation(t){



    let hand =
    Math.sin(t*0.8)
    *
    40;



    if(joints.left_wrist){

        joints.left_wrist.y =
        basePose.left_wrist.y +
        hand;

    }



    if(joints.right_wrist){

        joints.right_wrist.y =
        basePose.right_wrist.y -
        hand;

    }



}








// ==================================================
// DROPDOWN CONTROL
// ==================================================

let animationSelect =
document.getElementById(
"animationSelect"
);



let playAnimationButton =
document.getElementById(
"playAnimation"
);




if(playAnimationButton){


    playAnimationButton.onclick =
    function(){


        if(animationSelect){


            selectAnimation(
                animationSelect.value
            );


        }


    };


}