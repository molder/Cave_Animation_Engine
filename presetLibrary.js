// ==================================================
// Cave Animation Engine
// presetLibrary.js
//
// Populates the Animation and Pose dropdowns from
// style/manifest.json and poses/manifest.json,
// and loads a saved pose by name when selected.
//
// Load this AFTER engine.js in index.html - it uses
// joints / basePose / mesh / meshReady / draw()
// which engine.js declares.
// ==================================================

// ==================================================
// Cave Animation Engine
// presetLibrary.js
// ==================================================

async function updateLibrary(){

    console.log("Updating library...");

    await loadImageManifest();
    await loadPoseManifest();
    await loadAnimationManifest();

    console.log("Library refreshed");

}



// ==================================================
// DROPDOWN CALLBACKS
// (wired further below, once imageSelect / poseSelect
// are actually declared - see "LOAD SELECTED IMAGE"
// and "LOAD SELECTED POSE" sections)
// ==================================================



async function loadAnimationManifest(){


    try{


        let response =
        await fetch("style/manifest.json");


        if(!response.ok){

            console.warn(
                "No style/manifest.json found, using built-in presets only"
            );

            return;

        }


        let data =
        await response.json();


        let select =
        document.getElementById("animationSelect");


        if(!select || !data.animations)
        return;


        for(let name of data.animations){


            let alreadyListed =
            Array.from(select.options).some(
                function(opt){
                    return opt.value === name;
                }
            );


            if(alreadyListed)
            continue;


            let option =
            document.createElement("option");


            option.value = name;

            option.textContent = name;


            select.appendChild(option);


        }


        console.log(
            "Animation manifest loaded:",
            data.animations
        );


    }


    catch(error){


        console.warn(
            "Could not load style/manifest.json:",
            error
        );


    }


}


loadAnimationManifest();




// ==================================================
// IMAGE DROPDOWN
// ==================================================

async function loadImageManifest(){


    try{


        let response =
        await fetch("images/manifest.json");


        if(!response.ok){

            console.warn(
                "No images/manifest.json found"
            );

            return;

        }


        let data =
        await response.json();


        let select =
        document.getElementById("imageSelect");


        if(!select || !data.images)
        return;


        for(let filename of data.images){


            let label =
            filename.replace(/\.[^/.]+$/, "");


            let option =
            document.createElement("option");


            option.value = filename;

            option.textContent = label;


            select.appendChild(option);


        }


        console.log(
            "Image manifest loaded:",
            data.images
        );


    }


    catch(error){


        console.warn(
            "Could not load images/manifest.json:",
            error
        );


    }


}


loadImageManifest();




// ==================================================
// LOAD SELECTED IMAGE
// (fires immediately when a selection is made)
// ==================================================

let imageSelect =
document.getElementById("imageSelect");


if(imageSelect){


    imageSelect.onchange =
    function(){


        if(!imageSelect.value)
        return;


        let img =
        new Image();


        img.onload =
        function(){


            image = img;


            draw();


            console.log(
                "Image loaded:",
                imageSelect.value
            );


        };


        img.onerror =
        function(){


            console.error(
                "Image loading failed:",
                imageSelect.value
            );


        };


        img.src =
        "images/" + imageSelect.value;


    };


}




// ==================================================
// POSE DROPDOWN
// ==================================================

async function loadPoseManifest(){


    try{


        let response =
        await fetch("poses/manifest.json");


        if(!response.ok){

            console.warn(
                "No poses/manifest.json found"
            );

            return;

        }


        let data =
        await response.json();


        let select =
        document.getElementById("poseSelect");


        if(!select || !data.poses)
        return;


        for(let name of data.poses){


            let option =
            document.createElement("option");


            option.value = name;

            option.textContent = name;


            select.appendChild(option);


        }


        console.log(
            "Pose manifest loaded:",
            data.poses
        );


    }


    catch(error){


        console.warn(
            "Could not load poses/manifest.json:",
            error
        );


    }


}


loadPoseManifest();




// ==================================================
// LOAD SELECTED POSE
// (fires immediately when a selection is made)
//
// loadPoseByName() is shared: the dropdown calls it
// directly, and animationManager calls it again
// (via resetPoseToSelected) whenever "None" is chosen -
// so "None" is literally a re-load of the same pose,
// not a hand-rolled reset.
// ==================================================

let poseSelect =
document.getElementById("poseSelect");


async function loadPoseByName(name){


    if(!name)
    return;


    try{


        let response =
        await fetch(
            "poses/" + name + ".json"
        );


        if(!response.ok){

            throw new Error(
                "Pose file not found: " + name
            );

        }


        let data =
        await response.json();


        joints =
        data.joints;


        basePose =
        JSON.parse(
            JSON.stringify(joints)
        );


        mesh = [];

        meshReady = false;


        draw();


        console.log(
            "Pose loaded:",
            name
        );


    }


    catch(error){


        console.error(
            "Pose loading failed:",
            error
        );


    }


}


if(poseSelect){


    poseSelect.onchange =
    function(){


        loadPoseByName(
            poseSelect.value
        );


    };


}




// called by animationManager.load("") when "None"
// is chosen - re-loads whatever pose is currently
// selected (or falls back to the default pose if
// none is selected), same as picking it fresh

function resetPoseToSelected(){


    if(poseSelect && poseSelect.value){


        loadPoseByName(
            poseSelect.value
        );


    }


    else if(typeof createDefaultPose === "function"){


        createDefaultPose();


    }


}
