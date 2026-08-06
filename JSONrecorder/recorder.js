// ==================================================
// Cave Motion JSON Recorder
// slot1 OSC recorder
// ==================================================


let socket;


let recording=false;


let frames=[];


let currentPose={};


let startTime=0;



const canvas=
document.getElementById("canvas");


const ctx=
canvas.getContext("2d");



const status=
document.getElementById("status");


const counter=
document.getElementById("counter");





// --------------------------------
// OSC CONNECT
// --------------------------------


document
.getElementById("connect")
.onclick=function(){


let port=
document.getElementById("port").value;



// WebSocket bridge expected

socket=
new WebSocket(
"ws://localhost:"+port
);



socket.onopen=function(){

status.innerHTML=
"OSC CONNECTED";

};



socket.onmessage=function(e){


let data=
JSON.parse(e.data);



receiveOSC(data);



};


};







// --------------------------------
// RECEIVE OSC
// --------------------------------


function receiveOSC(data){



/*

Expected:

{
address:
"slot1_left_wrist",

value:
123
}


*/


if(
!data.address.startsWith("slot1")
)
return;



let parts=
data.address.split("_");



let joint=
parts.slice(1,-1).join("_");


let axis=
parts[parts.length-1];



if(!currentPose[joint])
currentPose[joint]={};



currentPose[joint][axis]=
data.value;



draw();



if(recording)
recordFrame();


}









// --------------------------------
// RECORD
// --------------------------------


function recordFrame(){


let frame={


time:
(
performance.now()
-startTime
)/1000,


joints:
JSON.parse(
JSON.stringify(currentPose)
)


};



frames.push(frame);



counter.innerHTML=
"Frames: "
+
frames.length;



}










// --------------------------------
// BUTTONS
// --------------------------------



document
.getElementById("record")
.onclick=function(){


frames=[];


recording=true;


startTime=
performance.now();


status.innerHTML=
"RECORDING";



};





document
.getElementById("stop")
.onclick=function(){


recording=false;


status.innerHTML=
"STOPPED";


};






document
.getElementById("save")
.onclick=function(){



let data={


version:
"CAVE_MOTION_1.0",


name:
document.getElementById("name").value,


fps:
60,


frames:
frames


};



let blob=
new Blob(

[
JSON.stringify(
data,
null,
2
)
],

{
type:"application/json"
}

);



let a=
document.createElement("a");


a.href=
URL.createObjectURL(blob);


a.download=
data.name+".json";


a.click();



};









// --------------------------------
// DEBUG VIEW
// --------------------------------


function draw(){


ctx.clearRect(
0,
0,
500,
500
);



for(let j in currentPose){



let p=
currentPose[j];



if(
p.x===undefined ||
p.y===undefined
)
continue;



ctx.fillStyle=
"#00ff88";



ctx.beginPath();


ctx.arc(

p.x,
p.y,
5,
0,
Math.PI*2

);



ctx.fill();



}



}