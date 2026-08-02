// ==================================================
// Cave Animation Engine
// Animation Pipeline Test
// ==================================================


console.log(
    "===== ANIMATION PIPELINE TEST ====="
);



// 1. Check manager

if(animationManager){

    console.log(
        "✓ AnimationManager exists"
    );

}
else{

    console.error(
        "✗ AnimationManager missing"
    );

}




// 2. Check skeleton

if(typeof joints !== "undefined"){

    console.log(
        "✓ joints exists",
        Object.keys(joints)
    );

}
else{

    console.error(
        "✗ joints missing"
    );

}



if(typeof basePose !== "undefined"){

    console.log(
        "✓ basePose exists",
        Object.keys(basePose)
    );

}
else{

    console.error(
        "✗ basePose missing"
    );

}





// 3. Test JSON loading

async function testJSON(){


    console.log(
        "Testing JSON load..."
    );



    try{


        let response =
        await fetch(
            "style/walking.json"
        );



        console.log(
            "Response:",
            response.status
        );



        if(!response.ok){

            throw new Error(
                "JSON not found"
            );

        }



        let data =
        await response.json();



        console.log(
            "✓ JSON loaded"
        );



        console.log(
            "Version:",
            data.version
        );


        console.log(
            "Frames:",
            data.frames.length
        );



        console.log(
            "First frame:",
            data.frames[0]
        );



    }


    catch(error){


        console.error(
            "✗ JSON ERROR",
            error
        );


    }


}



testJSON();





// 4. Test manager update loop


setTimeout(
function(){


    console.log(
        "Starting manager test"
    );


    animationManager.load(
        "walking"
    );



},
1000);