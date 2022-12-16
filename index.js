let startBtn = document.getElementById('start-btn'); 
let restartBtn = document.getElementById('restart-btn'); 
let rudolph = document.getElementById('rudolph'); 
let gameState = 'paused'; 


startBtn.addEventListener('click', function() {
    document.querySelector('.modal').classList.add('d-none');
    document.querySelector('.modal .start').classList.add('d-none');
    startGame();
})

restartBtn.addEventListener('click', function() { 
    resetScore(); 
    updateState();
    document.querySelector('.modal').classList.add('d-none');
    document.querySelector('.modal .gameOver').classList.add('d-none');
    startGame();
})
    


function updateState() {
    let states = ['paused', 'play', 'finished']; 
    let currState = states.indexOf(gameState); 
    gameState = states[(currState+1) % states.length]; 
}


function startGame() {
    let initialTime = new Date();
    let lastKeyCode; 
    updateState();

    setTimeout(() => {
        updateState();
        finalScore(); 
        clearInterval(createBoxInterval);
        clearInterval(collisionInterval);

        // show game over screen
    }, 30000)

    // Create a box every 2 seconds -- might be worth randomising the time slightly;
    let createBoxInterval = setInterval( () => {
        generateCarrot(Math.random()*document.querySelector('.container').clientWidth, '3s' )
    }, 2000)


    // check for overlap every 100ms;
    let collisionInterval = setInterval( ()=> {
        checkCollision();
    }, 100)


    window.addEventListener('keydown', function(e) {
        resetTime(true, e.code);
        if(e.code === 'ArrowRight') {
            moveRudolph('right'); 
        } else if (e.code === 'ArrowLeft') {
            moveRudolph('left'); 
        }
        lastKeyCode = e.code; 
    })

    window.addEventListener('keyup', function( e ){
        if(e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
            resetTime();
        }
    })

    function resetTime( check = false, pKeyCode) {
        let currentTime = new Date(); 
        if (check) {
            if (currentTime - initialTime >= 1000 && lastKeyCode !== pKeyCode) {
                initialTime = new Date();
            }
        } else {
            initialTime = new Date();
        }
    }


    function moveRudolph(direction) {
        let keyDown = new Date(); 
        let velocity = keyDown - initialTime; 
        

        let rLeft = window.getComputedStyle(rudolph)['left'].split('px')[0]*1;
        let rWidth = window.getComputedStyle(rudolph)['width'].split('px')[0]*1;
        let clientWidth = document.querySelector('.container').clientWidth; 
        let movePx = 25; //change to increase/decrease speed across screen
        if (direction === 'right') {
            rLeft += movePx + (velocity /250)
        } else if (direction === 'left') {
            rLeft -= movePx + (velocity / 250); 
        }

        // console.log(rudolph.getBoundingClientRect())

        // make sure it doesn't go off the screen!
        //if (rLeft - rWidth/2 <= 0 || rLeft + rWidth/2 >= clientWidth) return;

        // console.log((rLeft +clientWidth) % clientWidth);

        //update position
        rudolph.style.left = (rLeft +clientWidth) % clientWidth + 'px'; 
    }



    function generateCarrot(position, speed) {
        const span = document.createElement('span');
        span.classList.add('carrot')
        span.style.left = position + 'px'; 
        span.style.animationDuration = speed; 

        document.querySelector('.container').appendChild(span);

        // remove from dom
        setTimeout(() => {
            span.remove();
        }, speed.split('s')[0] * 1000)
    }



    function checkCollision() {
        let presents = document.querySelectorAll('.carrot'); 
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

    function finalScore() {
        let score = document.getElementById('score').innerText.split(":")[1]*1; 
        document.querySelector('#final-score').innerText = score;
        

        const leaderboard = document.getElementById('leaderboard'); 
        const players = [];
        const names = ['You!', 'Santa', 'Mrs Clause', 'Frostie', 'Buddy the Elf']
        players[0] = {name: 'You!', score: score}
        for(let i = 1; i < 5; i++){
            let randScore = Math.random() < 0.5 ? 
                    Math.max(0,Math.ceil(score - i*Math.random())) :
                    Math.max(0,Math.ceil(score + i*Math.random())); 
            players[i] = {name: names[i], score: randScore}
            
        }
        players.sort((a,b) => b.score - a.score)
        for(let player of players) {
            const pPlayer = document.createElement("li"); 
            const playerName = document.createElement('div'); 
            const playerScore = document.createElement('div'); 
            if (player.name == 'You!') {
                pPlayer.classList.add('player'); 
            }
            playerName.innerText = player.name; 
            playerScore.innerText = player.score; 
            pPlayer.appendChild(playerName);
            pPlayer.appendChild(playerScore);
            leaderboard.appendChild(pPlayer)
        }

        
        document.querySelector('.modal').classList.remove('d-none');
        document.querySelector('.modal .gameOver').classList.remove('d-none');
        document.querySelector('.modal .start').classList.add('d-none');
    }

}



function resetScore() {
    document.getElementById('score').innerText = `Score: ${0}`; 
}

 

let snowfall = setInterval(() => {
    generateSnow();
  }, 60)

const generateSnow = () => {
    let snow = document.createElement("span");
    snow.classList.add('snow');
    snow.style.animationDuration = '5s';
    snow.style.left =  window.innerWidth * Math.random() + 'px';
    snow.style.top = '30px'; 

    document.body.appendChild(snow)
    setTimeout(() => {
      snow.remove();
    }, 5000);
  }
