import Player from './player.js'
import Attack from './attack.js'
import Invador from './invador.js'
import Grid from './grid.js'


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let Score = document.getElementById('score');
let Bullets = document.getElementById('bullets')
let score = 0;
let bullets = 0

canvas.width = innerWidth - 1;
canvas.height = innerHeight - 4;

var play_again = document.getElementsByClassName('button-74')[0];
var music = {
    overworld: new Howl({
        src: [
            "song.mp3"
        ],
        autoplay: false,
        volume: 0.08
    })
}
const player = new Player()
const attacks = []
const grids = []

let frames = 0
let randomInt = Math.floor(Math.random() * 400 + 500)
let randomInt2 = Math.floor(Math.random() * 150 + 50)
let check_animate = false

play_again.addEventListener('click', () => {
    if(!music.overworld.playing())
    music.overworld.play();
    player.opacity = 1
    game.over = false
    play_again.style.left = "-500%"
    play_again.disabled = true
    if(!check_animate)
    animate()
    check_animate = true
})

let game = {
    over: true
}

function animate(){
    if(game.over) return
    requestAnimationFrame(animate)
    canvas.width = innerWidth - 1;
    canvas.height = innerHeight - 4;   
    c.fillStyle = '#232323'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    attacks.forEach((attack, index) =>{
        if(attack.position.y + attack.position.radius <= 0){
            setTimeout(() => {
                attacks.splice(index, 1)
            }, 0)
        }
        else attack.update()
    })

    grids.forEach((grid) => {
        grid.position.x += grid.velocity.x
        grid.position.y += grid.velocity.y

        grid.velocity.y = 0

        if (grid.position.x + grid.width >= innerWidth+10
            || grid.position.x <= 1){
            grid.velocity.x = -grid.velocity.x
            grid.velocity.y = 25
        }

        if(grid.position.y >= innerHeight - player.height / 2 - 60){
            player.opacity = 0
            setTimeout(() =>{
                game.over = true
                music.overworld.stop()
            }, 3000)
        }

 
        grid.invadors.forEach((invador, i) => {
            invador.update({velocity: grid.velocity})
            attacks.forEach((attack, j) => {
             if (attack.velocity.y != 5 && attack.position.y - attack.radius <= invador.position.y + invador.height
                    && attack.position.x + attack.radius >= invador.position.x
                    && attack.position.x - attack.radius <= invador.position.x + invador.width
                    && attack.position.y + attack.radius >= invador.position.y){
                    setTimeout(() => {
                        const found = grid.invadors.find((invader2) => invader2 === invador)
                        const found2 = attacks.find((attack2) => attack2 === attack)
                        score += 10
                        Score.textContent = score

                        if(found && found2){
                        grid.invadors.splice(i, 1)
                        attacks.splice(j, 1)
                        }
                    })
                }
            })
        })
    }) 

    if (frames % randomInt === 0){
        grids.push(new Grid())
        randomInt = Math.floor(Math.random() * 400 + 500)
        frames = 0
        bullets += 3 * (grids[grids.length-1].rows * grids[grids.length-1].columns)
    }
    frames++;

    if(frames % randomInt2 === 0){
        randomInt2 = Math.floor(Math.random() * 250 + 100)
        grids.forEach(grid => {
            grid.invadors.forEach(inv => {
                let rand = Math.random()
                if (rand < 0.20){
                attacks.push(new Attack({
                    position:{
                        x: inv.position.x + 12.5,
                        y: inv.position.y
                    },
                    velocity:{
                        x: 0,
                        y: 5
                    },
                    color: 'red'
                }))
                }
            })
        })
    }

    attacks.forEach(attack1 => {
        if(attack1.position.x >= player.position.x && attack1.position.x <= player.position.x + player.width &&
            attack1.position.y >= player.position.y && attack1.position.y <= player.position.y + player.height){
            player.opacity = 0

            setTimeout(() =>{
                game.over = true
                music.overworld.stop()
            }, 3000)
            
        }
    })
    
    Bullets.textContent = bullets.toString()
}


animate()

addEventListener('keydown', ({key}) =>{
    if (game.over) return

    if (key == 'ArrowRight'){
        player.velocity.x = 8
    }
    else if (key == 'ArrowLeft'){
        player.velocity.x = -8
    }
    else if (key == 'ArrowUp' || key == 'ArrowDown'){
        player.velocity.x = 0
    }
    else if(key == ' ' && bullets > 0){
        bullets -= 1

        attacks.push(new Attack({
            position:{
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity:{
            x: 0,
            y: -10
        },
        color: 'white'
        }))
    }

})

