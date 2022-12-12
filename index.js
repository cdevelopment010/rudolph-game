
let rudolph = document.getElementById('rudolph'); 


setInterval( () => {
    generateBox('box-1', Math.random()*document.querySelector('.container').clientWidth, '3s' )
}, 2000)

setInterval( ()=> {
    checkCollision();
}, 100) 

window.addEventListener('keydown', function(e) {
    if(e.code === 'ArrowRight') {
        moveRudolph('right'); 
    } else if (e.code === 'ArrowLeft') {
        moveRudolph('left'); 

    }
})


function moveRudolph(direction) {
    let rLeft = window.getComputedStyle(rudolph)['left'].split('px')[0]*1;
    let rWidth = window.getComputedStyle(rudolph)['width'].split('px')[0]*1;
    let clientWidth = document.querySelector('.container').clientWidth; 
    let movePx = 25; //change to increase/decrease speed across screen
    if (direction === 'right') {
        rLeft += movePx
    } else if (direction === 'left') {
        rLeft -= movePx; 
    }

    // console.log(rudolph.getBoundingClientRect())

    // make sure it doesn't go off the screen!
    if (rLeft - rWidth/2 <= 0 || rLeft + rWidth/2 >= clientWidth) return;


    //update position
    rudolph.style.left = rLeft + 'px'; 
}



function generateBox(box, position, speed) {
    const span = document.createElement('span');
    span.classList.add('box')
    span.classList.add(box); 
    span.style.left = position + 'px'; 
    span.style.animationDuration = speed; 

    document.querySelector('.container').appendChild(span);

    // remove from dom
    setTimeout(() => {
        span.remove();
    }, speed.split('s')[0] * 1000)
}



function checkCollision() {
    let presents = document.querySelectorAll('.box'); 
    let rudoplhRect = rudolph.getBoundingClientRect(); 
    presents.forEach( p => {
        let pRect = p.getBoundingClientRect(); 
        // console.log (pRect.bottom <= rudoplhRect.top) //works
        if (pRect.bottom <= rudoplhRect.top ) { return}; 
        if (pRect.bottom <= rudoplhRect.bottom && 
            pRect.bottom >= rudoplhRect.top && 
            pRect.left <= rudoplhRect.right &&
            pRect.right >= rudoplhRect.left
            ) {
                // add score
                    console.log("Add to score!");
                    addToScore();
                    // console.log(p);
                    // return;
                // remove present
                p.remove();
            }
    })
}


function addToScore() {
    let score = document.getElementById('score').innerText.split(":")[1]*1; 
    score++;
    document.getElementById('score').innerText = `Score: ${score}`; 

}