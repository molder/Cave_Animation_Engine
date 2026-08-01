// ==================================================
// Cave Animation Engine V11
// engine.js
// Part 1/4
// ==================================================


// ----------------------------
// CANVAS
// ----------------------------

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");


// ----------------------------
// UI REFERENCES
// ----------------------------

const imageLoader =
document.getElementById("imageLoader");

const poseLoader =
document.getElementById("poseLoader");

const newPoseButton =
document.getElementById("newPose");

const savePoseButton =
document.getElementById("savePose");

const createMeshButton =
document.getElementById("createMesh");

const skeletonSlider =
document.getElementById("skeletonSlider");

const meshSlider =
document.getElementById("meshSlider");

const animationSelect =
document.getElementById("animationSelect");

const playAnimationButton =
document.getElementById("playAnimation");


// ----------------------------
// GLOBAL DATA
// ----------------------------

let image=null;

let joints={};

let basePose={};


let selectedJoint=null;


let mesh=[];

let meshReady=false;


let skeletonOpacity=1;

let meshOpacity=1;



let animation=null;

let animationPlaying=false;

let animationTime=0;



const MESH_SIZE=40;



// ----------------------------
// BONES
// ----------------------------

const BONES=[


["nose","neck"],


["neck","left_shoulder"],
["neck","right_shoulder"],


["left_shoulder","left_elbow"],
["left_elbow","left_wrist"],


["right_shoulder","right_elbow"],
["right_elbow","right_wrist"],


["left_hip","right_hip"],


["left_hip","left_knee"],
["left_knee","left_ankle"],


["right_hip","right_knee"],
["right_knee","right_ankle"]

];





// ==================================================
// IMAGE LOADER
// ==================================================


imageLoader.onchange=function(e){


let file=e.target.files[0];


if(!file)
return;



let img=new Image();



img.onload=function(){


image=img;


draw();


};



img.src=
URL.createObjectURL(file);


};





// ==================================================
// POSE LOADER
// ==================================================


poseLoader.onchange=function(e){


let reader=
new FileReader();



reader.onload=function(){


let data=
JSON.parse(reader.result);



joints=data.joints;



basePose=
JSON.parse(
JSON.stringify(joints)
);



meshReady=false;

mesh=[];


draw();


};



reader.readAsText(
e.target.files[0]
);


};





// ==================================================
// CREATE DEFAULT POSE
// ==================================================


newPoseButton.onclick=function(){


let cx=
canvas.width/2;


let cy=
canvas.height/2;



let p={


nose:[0,-170],

neck:[0,-120],


left_shoulder:[-50,-110],
right_shoulder:[50,-110],


left_elbow:[-90,-40],
right_elbow:[90,-40],


left_wrist:[-120,40],
right_wrist:[120,40],


left_hip:[-40,0],
right_hip:[40,0],


left_knee:[-50,120],
right_knee:[50,120],


left_ankle:[-50,230],
right_ankle:[50,230]


};




joints={};



for(let n in p){


joints[n]={

x:
cx+p[n][0],

y:
cy+p[n][1]

};


}



basePose=
JSON.parse(
JSON.stringify(joints)
);



meshReady=false;

mesh=[];


draw();


};




// ==================================================
// SAVE POSE
// ==================================================


savePoseButton.onclick=function(){


let data={

version:"V11",

joints:joints

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


a.download="pose.json";


a.click();


};

// ==================================================
// JOINT DRAGGING
// ==================================================


canvas.onmousedown=function(e){


let r=
canvas.getBoundingClientRect();



let x=
(e.clientX-r.left)
*
canvas.width/r.width;



let y=
(e.clientY-r.top)
*
canvas.height/r.height;



for(let n in joints){


let j=joints[n];


if(
Math.hypot(
x-j.x,
y-j.y
)<20
){


selectedJoint=n;


return;


}


}


};






canvas.onmousemove=function(e){


if(!selectedJoint)
return;



let r=
canvas.getBoundingClientRect();



joints[selectedJoint].x=
(e.clientX-r.left)
*
canvas.width/r.width;



joints[selectedJoint].y=
(e.clientY-r.top)
*
canvas.height/r.height;



updateMesh();


draw();


};





canvas.onmouseup=function(){


selectedJoint=null;


};







// ==================================================
// OPACITY CONTROL
// ==================================================


skeletonSlider.oninput=function(){


skeletonOpacity=
this.value/100;


draw();


};




meshSlider.oninput=function(){


meshOpacity=
this.value/100;


draw();


};







// ==================================================
// CREATE MESH
// ==================================================


createMeshButton.onclick=function(){


createMesh();


};





function createMesh(){


mesh=[];


let step=MESH_SIZE;



for(
let y=0;
y<=canvas.height;
y+=step
){


for(
let x=0;
x<=canvas.width;
x+=step
){



mesh.push({

x:x,

y:y,


// texture coordinates

u:
(x/canvas.width)
*
image.width,


v:
(y/canvas.height)
*
image.height,



originalX:x,

originalY:y,


bone:null


});


}

}




bindMesh();


meshReady=true;



draw();


console.log(
"Mesh created:",
mesh.length
);


}







// ==================================================
// BIND MESH TO BONES
// ==================================================


function bindMesh(){


for(let p of mesh){



let closest=null;


let shortest=Infinity;




for(let b of BONES){


let a=joints[b[0]];

let c=joints[b[1]];



if(!a || !c)
continue;




let d=
distanceToLine(
p,
a,
c
);



if(d<shortest){


shortest=d;


closest=b;


}



}



p.bone=closest;



}



}








// ==================================================
// DISTANCE TO BONE
// ==================================================


function distanceToLine(p,a,b){


let x=
b.x-a.x;


let y=
b.y-a.y;



let length=
x*x+y*y;



if(length===0)
return Infinity;



let t=
(
(p.x-a.x)*x+
(p.y-a.y)*y
)
/
length;



t=Math.max(
0,
Math.min(
1,
t
)
);



let px=
a.x+t*x;


let py=
a.y+t*y;



return Math.sqrt(

(p.x-px)*(p.x-px)+

(p.y-py)*(p.y-py)

);



}







// ==================================================
// UPDATE MESH FROM JOINTS
// ==================================================


function updateMesh(){


if(!meshReady)
return;



for(let p of mesh){



if(!p.bone)
continue;



let a=
joints[p.bone[0]];


let b=
joints[p.bone[1]];




let ra=
basePose[p.bone[0]];


let rb=
basePose[p.bone[1]];




if(!ra || !rb)
continue;



let dx=
(
(a.x-ra.x)+
(b.x-rb.x)
)/2;



let dy=
(
(a.y-ra.y)+
(b.y-rb.y)
)/2;




p.x=
p.originalX+dx;


p.y=
p.originalY+dy;



}



}

// ==================================================
// IMAGE DRAW THROUGH DEFORMABLE MESH
// ==================================================


function drawImage(){


if(!image)
return;



// before mesh exists

if(!meshReady){


ctx.drawImage(

image,

0,

0,

canvas.width,

canvas.height

);


return;


}




let cols =
Math.floor(canvas.width/MESH_SIZE)+1;


let rows =
Math.floor(canvas.height/MESH_SIZE)+1;




for(
let y=0;
y<rows-1;
y++
){


for(
let x=0;
x<cols-1;
x++
){



let i=
y*cols+x;



let p1=mesh[i];

let p2=mesh[i+1];

let p3=mesh[i+cols];

let p4=mesh[i+cols+1];




// triangle A

drawTriangle(

p1,

p2,

p3

);



// triangle B

drawTriangle(

p2,

p4,

p3

);



}



}



}








// ==================================================
// TRIANGLE TEXTURE MAPPING
// ==================================================


function drawTriangle(p0,p1,p2){



let sx0=p0.u;
let sy0=p0.v;


let sx1=p1.u;
let sy1=p1.v;


let sx2=p2.u;
let sy2=p2.v;



let dx0=p0.x;
let dy0=p0.y;


let dx1=p1.x;
let dy1=p1.y;


let dx2=p2.x;
let dy2=p2.y;



let denom =

sx0*(sy1-sy2)+

sx1*(sy2-sy0)+

sx2*(sy0-sy1);



if(denom===0)
return;





let a =
(
dx0*(sy1-sy2)+
dx1*(sy2-sy0)+
dx2*(sy0-sy1)
)
/denom;



let b =
(
dx0*(sx2-sx1)+
dx1*(sx0-sx2)+
dx2*(sx1-sx0)
)
/denom;



let c =
(
dx0*(sx1*sy2-sx2*sy1)+
dx1*(sx2*sy0-sx0*sy2)+
dx2*(sx0*sy1-sx1*sy0)
)
/denom;




let d =
(
dy0*(sy1-sy2)+
dy1*(sy2-sy0)+
dy2*(sy0-sy1)
)
/denom;



let e =
(
dy0*(sx2-sx1)+
dy1*(sx0-sx2)+
dy2*(sx1-sx0)
)
/denom;



let f =
(
dy0*(sx1*sy2-sx2*sy1)+
dy1*(sx2*sy0-sx0*sy2)+
dy2*(sx0*sy1-sx1*sy0)
)
/denom;





ctx.save();



// clip triangle

ctx.beginPath();

ctx.moveTo(
dx0,
dy0
);

ctx.lineTo(
dx1,
dy1
);

ctx.lineTo(
dx2,
dy2
);

ctx.closePath();


ctx.clip();





ctx.setTransform(

a,
d,
b,
e,
c,
f

);



// draw complete image

ctx.drawImage(

image,

0,

0

);





ctx.restore();



ctx.setTransform(

1,
0,
0,
1,
0,
0

);



}






// ==================================================
// DEBUG MESH VIEW
// ==================================================


function drawMesh(){



if(!meshReady)
return;



if(meshOpacity<=0)
return;



ctx.save();


ctx.globalAlpha=
meshOpacity;



ctx.strokeStyle=
"cyan";


ctx.fillStyle=
"cyan";


ctx.lineWidth=1;




let cols =
Math.floor(canvas.width/MESH_SIZE)+1;




for(
let i=0;
i<mesh.length;
i++
){



let p=
mesh[i];



ctx.beginPath();


ctx.arc(

p.x,

p.y,

2,

0,

Math.PI*2

);


ctx.fill();





// horizontal

if(
i+1<mesh.length &&
(i+1)%cols!==0
){


ctx.beginPath();


ctx.moveTo(
p.x,
p.y
);


ctx.lineTo(

mesh[i+1].x,

mesh[i+1].y

);


ctx.stroke();


}





// vertical


if(
i+cols<mesh.length
){


ctx.beginPath();


ctx.moveTo(
p.x,
p.y
);


ctx.lineTo(

mesh[i+cols].x,

mesh[i+cols].y

);


ctx.stroke();


}



}




ctx.restore();



}

// ==================================================
// ANIMATION SYSTEM
// ==================================================


let animationPlaying=false;

let currentAnimation="";

let animationSpeed=1;



let animations={

};




// ==================================================
// SAVE CURRENT ANIMATION
// ==================================================


function saveAnimation(name){


let data={


version:"V10_ANIMATION",


name:name,


frames:[]


};



for(let n in joints){


data.frames.push({

joint:n,

x:joints[n].x,

y:joints[n].y

});


}



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
name+".json";



a.click();



}







// ==================================================
// LOAD ANIMATION JSON
// ==================================================


animationLoader.onchange=function(e){


let reader=
new FileReader();



reader.onload=function(){


let data=
JSON.parse(reader.result);



animations[data.name]=data;



currentAnimation=data.name;



console.log(
"Animation loaded:",
data.name
);



};



reader.readAsText(
e.target.files[0]
);



};








// ==================================================
// PROCEDURAL MOVEMENT
// ==================================================


function animateBody(){



if(!animationPlaying)
return;



animationTime +=
0.03*
animationSpeed;



let t=
animationTime;



// --------------------
// BREATHING
// --------------------


let breath =
Math.sin(t*2)
*
6;



if(joints.neck){


joints.neck.y =
basePose.neck.y
-
breath;


}





// --------------------
// TECHNO HIP HOP BODY
// --------------------


if(currentAnimation==="hiphop"){



let bounce =
Math.sin(t*4)
*
12;



let arm =
Math.sin(t*3)
*
25;



joints.left_shoulder.y =
basePose.left_shoulder.y
+
bounce;


joints.right_shoulder.y =
basePose.right_shoulder.y
+
bounce;



joints.left_elbow.x =
basePose.left_elbow.x
-
arm;


joints.right_elbow.x =
basePose.right_elbow.x
+
arm;



}





// --------------------
// WALK CYCLE
// --------------------


if(currentAnimation==="walk"){



let step =
Math.sin(t*3)
*
30;



joints.left_knee.x =
basePose.left_knee.x
+
step;


joints.right_knee.x =
basePose.right_knee.x
-
step;



joints.left_ankle.x =
basePose.left_ankle.x
-
step;


joints.right_ankle.x =
basePose.right_ankle.x
+
step;



}





// --------------------
// CEREMONY MOVEMENT
// --------------------


if(currentAnimation==="ceremony"){



let wave =
Math.sin(t)
*
20;



joints.left_wrist.y =
basePose.left_wrist.y
+
wave;



joints.right_wrist.y =
basePose.right_wrist.y
-
wave;



let sway =
Math.sin(t*2)
*
15;



joints.neck.x =
basePose.neck.x
+
sway;



}





// --------------------
// RESET FROM BASE
// --------------------


if(currentAnimation==="breathing"){


joints.neck.y =
basePose.neck.y
-
breath;


}




updateMesh();



}








// ==================================================
// ANIMATION BUTTONS
// ==================================================


document.getElementById("breathButton")
.onclick=function(){


animationPlaying=true;


currentAnimation="breathing";


this.innerHTML=
"Breathing ON";


};






document.getElementById("walkButton")
.onclick=function(){


animationPlaying=true;


currentAnimation="walk";


this.innerHTML=
"Walking ON";


};







// ==================================================
// MAIN LOOP
// ==================================================


function loop(){



animateBody();



draw();



requestAnimationFrame(loop);



}



loop();