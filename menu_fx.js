// =================================
// SPACE PARTICLES
// =================================


for(let i=0;i<15;i++){


    let star =
    document.createElement("div");
    
    
    star.className="star";
    
    
    star.style.left =
    Math.random()*100+"vw";
    
    
    star.style.top =
    Math.random()*100+"vh";
    
    
    star.style.animationDelay =
    Math.random()*5+"s";
    
    
    document.body.appendChild(star);
    
    
    }