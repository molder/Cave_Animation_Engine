// ==================================================
// Cave Animation Engine V12
// engine.js
// PART 1/4
// Stable reconstruction from V11
// ==================================================


// ==================================================
// CANVAS
// ==================================================

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");


// ==================================================
// UI REFERENCES
// ==================================================

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

const animationLoader =
document.getElementById("animationLoader");


// ==================================================
// ENGINE STATE
// ==================================================

let image = null;

let joints = {};

let basePose = {};

let selectedJoint = null;


let mesh = [];

let meshReady = false;


let skeletonOpacity = 1;

let meshOpacity = 1;



let breathing = false;

let walking = false;


let animationTime = 0;


const MESH_SIZE = 40;



// ==================================================
// BONES
// ==================================================

const BONES = [

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
// IMAGE LOADING
// ==================================================

if(imageLoader){

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


}




// ==================================================
// DEFAULT POSE
// ==================================================

function createDefaultPose(){


let cx =
canvas.width/2;


let cy =
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



basePose =
JSON.parse(
JSON.stringify(joints)
);



mesh=[];

meshReady=false;


draw();


}




// ==================================================
// NEW POSE BUTTON
// ==================================================

if(newPoseButton){

newPoseButton.onclick=function(){

createDefaultPose();

};

}



// ==================================================
// LOAD POSE
// ==================================================

if(poseLoader){

poseLoader.onchange=function(e){


let reader =
new FileReader();



reader.onload=function(){


let data =
JSON.parse(reader.result);



joints=data.joints;



basePose =
JSON.parse(
JSON.stringify(joints)
);



mesh=[];

meshReady=false;


draw();


};



reader.readAsText(
e.target.files[0]
);


};

}



// ==================================================
// SAVE POSE
// ==================================================

if(savePoseButton){

savePoseButton.onclick=function(){


let data={

version:"V12",

joints:joints

};



let blob =
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



let a =
document.createElement("a");


a.href =
URL.createObjectURL(blob);


a.download =
"pose.json";


a.click();



};


}

// ==================================================
// JOINT DRAGGING
// ==================================================

canvas.onmousedown=function(e){


let r =
canvas.getBoundingClientRect();



let x =
(e.clientX-r.left)
*
canvas.width/r.width;



let y =
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



let r =
canvas.getBoundingClientRect();



joints[selectedJoint].x =
(e.clientX-r.left)
*
canvas.width/r.width;



joints[selectedJoint].y =
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
// SLIDERS
// ==================================================

if(skeletonSlider){

skeletonSlider.oninput=function(){


skeletonOpacity =
this.value/100;


draw();


};

}



if(meshSlider){

meshSlider.oninput=function(){


meshOpacity =
this.value/100;


draw();


};

}



// ==================================================
// CREATE IMAGE MESH
// ==================================================

if(createMeshButton){

createMeshButton.onclick=function(){

createMesh();

};

}




function createMesh(){


mesh=[];



for(
let y=0;
y<=canvas.height;
y+=MESH_SIZE
){


for(
let x=0;
x<=canvas.width;
x+=MESH_SIZE
){



mesh.push({

x:x,

y:y,


originalX:x,

originalY:y,


u:
(x/canvas.width)
*
image.width,


v:
(y/canvas.height)
*
image.height,


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



let a =
joints[b[0]];


let c =
joints[b[1]];



if(!a || !c)
continue;



let d =
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



let x =
b.x-a.x;


let y =
b.y-a.y;



let length =
x*x+y*y;



if(length===0)
return Infinity;



let t =
(
(p.x-a.x)*x+
(p.y-a.y)*y
)
/
length;



t =
Math.max(
0,
Math.min(
1,
t
)
);



let px =
a.x+t*x;


let py =
a.y+t*y;



return Math.sqrt(

(p.x-px)*(p.x-px)+

(p.y-py)*(p.y-py)

);



}





// ==================================================
// UPDATE MESH FROM POSE
// ==================================================

function updateMesh(){



if(!meshReady)
return;



for(let p of mesh){



if(!p.bone)
continue;



let a =
joints[p.bone[0]];


let b =
joints[p.bone[1]];



let ra =
basePose[p.bone[0]];


let rb =
basePose[p.bone[1]];



if(!ra || !rb)
continue;



let dx =
(
(a.x-ra.x)+
(b.x-rb.x)
)/2;



let dy =
(
(a.y-ra.y)+
(b.y-rb.y)
)/2;



p.x =
p.originalX+dx;


p.y =
p.originalY+dy;



}



}

// Part 2/4
// ==================================================
// JOINT DRAGGING
// ==================================================

canvas.onmousedown=function(e){


    let r =
    canvas.getBoundingClientRect();
    
    
    
    let x =
    (e.clientX-r.left)
    *
    canvas.width/r.width;
    
    
    
    let y =
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
    
    
    
    let r =
    canvas.getBoundingClientRect();
    
    
    
    joints[selectedJoint].x =
    (e.clientX-r.left)
    *
    canvas.width/r.width;
    
    
    
    joints[selectedJoint].y =
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
    // SLIDERS
    // ==================================================
    
    if(skeletonSlider){
    
    skeletonSlider.oninput=function(){
    
    
    skeletonOpacity =
    this.value/100;
    
    
    draw();
    
    
    };
    
    }
    
    
    
    if(meshSlider){
    
    meshSlider.oninput=function(){
    
    
    meshOpacity =
    this.value/100;
    
    
    draw();
    
    
    };
    
    }
    
    
    
    // ==================================================
    // CREATE IMAGE MESH
    // ==================================================
    
    if(createMeshButton){
    
    createMeshButton.onclick=function(){
    
    createMesh();
    
    };
    
    }
    
    
    
    
    function createMesh(){
    
    
    mesh=[];
    
    
    
    for(
    let y=0;
    y<=canvas.height;
    y+=MESH_SIZE
    ){
    
    
    for(
    let x=0;
    x<=canvas.width;
    x+=MESH_SIZE
    ){
    
    
    
    mesh.push({
    
    x:x,
    
    y:y,
    
    
    originalX:x,
    
    originalY:y,
    
    
    u:
    (x/canvas.width)
    *
    image.width,
    
    
    v:
    (y/canvas.height)
    *
    image.height,
    
    
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
    
    
    
    let a =
    joints[b[0]];
    
    
    let c =
    joints[b[1]];
    
    
    
    if(!a || !c)
    continue;
    
    
    
    let d =
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
    
    
    
    let x =
    b.x-a.x;
    
    
    let y =
    b.y-a.y;
    
    
    
    let length =
    x*x+y*y;
    
    
    
    if(length===0)
    return Infinity;
    
    
    
    let t =
    (
    (p.x-a.x)*x+
    (p.y-a.y)*y
    )
    /
    length;
    
    
    
    t =
    Math.max(
    0,
    Math.min(
    1,
    t
    )
    );
    
    
    
    let px =
    a.x+t*x;
    
    
    let py =
    a.y+t*y;
    
    
    
    return Math.sqrt(
    
    (p.x-px)*(p.x-px)+
    
    (p.y-py)*(p.y-py)
    
    );
    
    
    
    }
    
    
    
    
    
    // ==================================================
    // UPDATE MESH FROM POSE
    // ==================================================
    
    function updateMesh(){
    
    
    
    if(!meshReady)
    return;
    
    
    
    for(let p of mesh){
    
    
    
    if(!p.bone)
    continue;
    
    
    
    let a =
    joints[p.bone[0]];
    
    
    let b =
    joints[p.bone[1]];
    
    
    
    let ra =
    basePose[p.bone[0]];
    
    
    let rb =
    basePose[p.bone[1]];
    
    
    
    if(!ra || !rb)
    continue;
    
    
    
    let dx =
    (
    (a.x-ra.x)+
    (b.x-rb.x)
    )/2;
    
    
    
    let dy =
    (
    (a.y-ra.y)+
    (b.y-rb.y)
    )/2;
    
    
    
    p.x =
    p.originalX+dx;
    
    
    p.y =
    p.originalY+dy;
    
    
    
    }
    
    
    
    }

    //Part 3/4
    // ==================================================
// DRAW IMAGE
// ==================================================

// =======================
// DRAW DEFORMED IMAGE
// =======================

function drawImage(){


    if(!image)
    return;
    
    
    
    // no mesh yet = normal image
    
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
    Math.floor(canvas.width / MESH_SIZE) + 1;
    
    
    let rows =
    Math.floor(canvas.height / MESH_SIZE) + 1;
    
    
    
    for(let y=0; y<rows-1; y++){
    
    
    for(let x=0; x<cols-1; x++){
    
    
    
    let i =
    y*cols+x;
    
    
    
    let p1 = mesh[i];
    
    let p2 = mesh[i+1];
    
    let p3 = mesh[i+cols];
    
    let p4 = mesh[i+cols+1];
    
    
    
    if(!p1 || !p2 || !p3 || !p4)
    continue;
    
    
    
    // triangle 1
    
    drawTriangle(
    p1,
    p2,
    p3
    );
    
    
    
    // triangle 2
    
    drawTriangle(
    p2,
    p4,
    p3
    );
    
    
    
    }
    
    
    
    }
    
    
    
    } 
    
    
    
    
    // ==================================================
    // TEXTURE TRIANGLE
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
    // DRAW MESH DEBUG
    // ==================================================
    
    function drawMesh(){
    
    
    if(!meshReady)
    return;
    
    
    if(meshOpacity<=0)
    return;
    
    
    
    ctx.save();
    
    
    ctx.globalAlpha =
    meshOpacity;
    
    
    
    ctx.strokeStyle =
    "cyan";
    
    
    ctx.fillStyle =
    "cyan";
    
    
    
    let cols =
    Math.floor(canvas.width/MESH_SIZE)+1;
    
    
    
    for(let i=0;i<mesh.length;i++){
    
    
    let p=mesh[i];
    
    
    
    ctx.beginPath();
    
    ctx.arc(
    p.x,
    p.y,
    2,
    0,
    Math.PI*2
    );
    
    ctx.fill();
    
    
    
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
    // DRAW SKELETON
    // ==================================================
    
    function drawSkeleton(){
    
    
    
    if(skeletonOpacity<=0)
    return;
    
    
    
    ctx.save();
    
    
    
    ctx.globalAlpha =
    skeletonOpacity;
    
    
    
    ctx.strokeStyle =
    "#d6a34a";
    
    
    ctx.lineWidth=4;
    
    
    
    for(let b of BONES){
    
    
    
    let a =
    joints[b[0]];
    
    
    let c =
    joints[b[1]];
    
    
    
    if(!a || !c)
    continue;
    
    
    
    ctx.beginPath();
    
    ctx.moveTo(
    a.x,
    a.y
    );
    
    
    ctx.lineTo(
    c.x,
    c.y
    );
    
    
    ctx.stroke();
    
    
    }
    
    
    
    
    
    for(let n in joints){
    
    
    let j=joints[n];
    
    
    ctx.fillStyle="red";
    
    
    ctx.beginPath();
    
    ctx.arc(
    j.x,
    j.y,
    6,
    0,
    Math.PI*2
    );
    
    
    ctx.fill();
    
    
    
    }
    
    
    
    ctx.restore();
    
    
    }
    
    
    
    
    
    
    // ==================================================
    // MAIN DRAW
    // ==================================================
    
   // =======================
// MAIN DRAW
// =======================

function draw(){


    ctx.clearRect(
    
    0,
    
    0,
    
    canvas.width,
    
    canvas.height
    
    );
    
    
    
    
    // REAL OUTPUT
    
    drawImage();
    
    
    
    
    
    // DEBUG MESH ONLY
    
    if(meshOpacity > 0){
    
    ctx.globalAlpha =
    meshOpacity;
    
    drawMesh();
    
    ctx.globalAlpha = 1;
    
    }
    
    
    
    
    
    // DEBUG SKELETON ONLY
    
    if(skeletonOpacity > 0){
    
    ctx.globalAlpha =
    skeletonOpacity;
    
    drawSkeleton();
    
    ctx.globalAlpha = 1;
    
    }
    
    
    
    }
    
    
    
    
    
    
    
    // ==================================================
    // PROCEDURAL ANIMATION
    // ==================================================
    
    function updateAnimation(){
    
    
    
    if(
    !breathing &&
    !walking
    )
    return;
    
    
    
    animationTime +=0.03;
    
    
    
    let breath =
    Math.sin(animationTime*2)
    *
    (
    breathing ? 5 : 0
    );
    
    
    
    let walk =
    Math.sin(animationTime)
    *
    (
    walking ? 20 : 0
    );
    
    
    
    if(joints.neck){
    
    
    joints.neck.y =
    basePose.neck.y -
    breath;
    
    
    }
    
    
    
    
    if(walking){
    
    
    if(joints.left_knee)
    
    joints.left_knee.x =
    basePose.left_knee.x +
    walk;
    
    
    
    if(joints.right_knee)
    
    joints.right_knee.x =
    basePose.right_knee.x -
    walk;
    
    
    
    if(joints.left_ankle)
    
    joints.left_ankle.x =
    basePose.left_ankle.x -
    walk;
    
    
    
    if(joints.right_ankle)
    
    joints.right_ankle.x =
    basePose.right_ankle.x +
    walk;
    
    
    
    }
    
    
    
    updateMesh();
    
    
    }

    //Part 4/4
    // ==================================================
// ANIMATION BUTTONS
// ==================================================

const breathButton =
document.getElementById("breathButton");


const walkButton =
document.getElementById("walkButton");





if(breathButton){


breathButton.onclick=function(){


breathing =
!breathing;



this.innerHTML =
breathing ?
"Breathing ON" :
"Breathing OFF";



};



}





if(walkButton){


walkButton.onclick=function(){


walking =
!walking;



this.innerHTML =
walking ?
"Walking ON" :
"Walking OFF";



};



}





// ==================================================
// STYLE ANIMATION LOADER
// ==================================================

let styles={};



if(animationLoader){


animationLoader.onchange=function(e){



let reader =
new FileReader();



reader.onload=function(){



let data =
JSON.parse(reader.result);



styles[data.name]=data;



console.log(
"Style loaded:",
data.name
);



applyStyle(
data
);



};



reader.readAsText(
e.target.files[0]
);



};



}





function applyStyle(data){



if(!data.frames)
return;



console.log(
"Applying style:",
data.name
);




// simple first frame support
// later upgraded to timeline system


let frame =
data.frames[0];



if(!frame)
return;



for(let n in frame){


if(
joints[n]
&&
frame[n].x!==undefined
){


joints[n].x =
frame[n].x;


joints[n].y =
frame[n].y;


}



}



updateMesh();

draw();



}








// ==================================================
// SAVE ANIMATION STYLE
// ==================================================

function saveStyle(name){



let data={


version:"V12_STYLE",

name:name,


frames:[

joints

]


};



let blob =
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



let a =
document.createElement("a");



a.href =
URL.createObjectURL(blob);



a.download =
name+".json";



a.click();



}







// ==================================================
// MAIN LOOP
// ==================================================

function loop(){


updateAnimations();



draw();



requestAnimationFrame(
loop
);



}





// ==================================================
// INITIAL START
// ==================================================

createDefaultPose();


loop();