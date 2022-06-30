const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let Score = document.getElementById('score');
let score = 0;

canvas.width = innerWidth - 1;
canvas.height = innerHeight - 4;

var play_again = document.getElementsByClassName('button-74')[0];
var music = {
    overworld: new Howl({
        src: [
            "song.mp3"
        ],
        autoplay: false,
        volume: 0.1
    })
}

class Player{
    constructor(){
        this.velocity = {
            x: 0
        }

        this.opacity = 1

        const image = new Image()
        image.src = './spaceship.png'

        image.onload = () =>{
            const scale = 0.14
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
               x: canvas.width / 2 - this.width / 2,
               y: canvas.height - this.height / 2 - 60
            }
        } 
    }

    draw(){

        if(this.opacity == 0){
            let over = document.getElementById('over')
            over.style.left = "50%"
            Score.textContent = "0"
        }

        c.globalAlpha = this.opacity
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

    }

    update(){
        if(this.image){
            this.position.x += this.velocity.x
            if (player.position.x >= 0 && player.position.x + player.width <= canvas.width){
                this.draw()
            }
            else{
                this.position.x -= this.velocity.x
                this.draw()
            }
        }
    }
}

class Attack{
    constructor({position, velocity, color}){
        this.position = position
        this.velocity = velocity
        this.color = color

        this.radius = 4.4
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Invador{
    constructor({position}){
        this.velocity = {
            x: 0, 
            y: 0
        }

        const image = new Image()
        image.src = './invador.png'

        image.onload = () =>{
            const scale = 0.082
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
               x: position.x,
               y: position.y
            }
        } 
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}){
        if(this.image){
                this.position.x += velocity.x
                this.position.y += velocity.y
                this.draw()
        }
    }
}

class Grid{
    constructor(){
        this.position = {
            x: 0, 
            y: 0
        }

        this.velocity = {
            x: 5,
            y: 0
        }

        this.invadors = []

        const rows = Math.floor(Math.random() * 4 + 2)
        const columns = Math.floor(Math.random() * 9 + 5)

        this.width = columns * 25

        for(let x = 0; x < columns; ++x){
            for(let y = 0; y < rows; ++y)
                this.invadors.push(new Invador({
                    position: {
                        x: x * 33,
                        y: y * 33
                    }
                }))
            }
        }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width+10
            || this.position.x <= 1){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 25
        }

        if(this.position.y >= canvas.height - player.height / 2 - 60){
            player.opacity = 0
        }
        
    }
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
    play_again.disabled = false;
    if(!check_animate)
    animate()
    check_animate = true
})

game = {
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
        grid.update()
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
    else if(key == ' '){
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

