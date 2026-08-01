// ==================================================
// Cave Animation Engine
// animation.js
// ==================================================


let animationState = {

    current:"none",

    playing:false,

    time:0,

    speed:1

};




// ==================================================
// SELECT ANIMATION
// ==================================================

function selectAnimation(name){

    animationState.current = name;

    animationState.playing = true;

    animationState.time = 0;


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



case "none":

default:

break;


}



// KEEP IMAGE MESH CONNECTED

updateMesh();



}









// ==================================================
// BREATHING
// organic body movement
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
// weight shift
// ==================================================

function walkingAnimation(t){



let step =
Math.sin(t*3)
*
35;



let body =
Math.sin(t*3)
*
4;



if(joints.neck){

joints.neck.x =
basePose.neck.x +
body;

}




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



if(joints.left_ankle){

joints.left_ankle.x =
basePose.left_ankle.x -
step;

}



if(joints.right_ankle){

joints.right_ankle.x =
basePose.right_ankle.x +
step;

}



}









// ==================================================
// HIP HOP
// groove movement
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




if(joints.neck){

joints.neck.y =
basePose.neck.y +
bounce*0.3;

}



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
// mechanical pulse
// ==================================================

function technoAnimation(t){



let pulse =
Math.sin(t*8)
*
20;



let twist =
Math.sin(t*4)
*
30;



if(joints.left_wrist){

joints.left_wrist.y =
basePose.left_wrist.y +
twist;

}



if(joints.right_wrist){

joints.right_wrist.y =
basePose.right_wrist.y -
twist;

}



if(joints.left_knee){

joints.left_knee.x =
basePose.left_knee.x +
pulse;

}



if(joints.right_knee){

joints.right_knee.x =
basePose.right_knee.x -
pulse;

}



}









// ==================================================
// CEREMONY
// slow calligraphy movement
// ==================================================

function ceremonyAnimation(t){



let hand =
Math.sin(t*0.8)
*
40;



let body =
Math.sin(t*0.5)
*
15;



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



if(joints.neck){

joints.neck.x =
basePose.neck.x +
body;

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


playAnimationButton.onclick=function(){


if(animationSelect){


selectAnimation(
animationSelect.value
);


}



};


}