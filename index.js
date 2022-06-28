const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth - 1;
canvas.height = innerHeight - 4;

class Player{
    constructor(){
        this.velocity = {
            x: 0
        }

        const image = new Image()
        image.src = './spaceship.png'

        image.onload = () =>{
            const scale = 0.12
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
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
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
            const scale = 0.06
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

        const rows = Math.floor(Math.random() * 5 + 2)
        const columns = Math.floor(Math.random() * 10 + 5)

        this.width = columns * 25

        for(let x = 0; x < columns; ++x){
            for(let y = 0; y < rows; ++y)
                this.invadors.push(new Invador({
                    position: {
                        x: x * 25,
                        y: y * 25
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
    }
}

const player = new Player()
const attacks = []
const grids = []

let frames = 0
let randomInt = Math.floor(Math.random() * 400 + 500)


function animate(){
    requestAnimationFrame(animate)
    canvas.width = innerWidth - 1;
    canvas.height = innerHeight - 4;   
    c.fillStyle = 'black'
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
             if (attack.position.y - attack.radius <= invador.position.y + invador.height
                    && attack.position.x + attack.radius >= invador.position.x
                    && attack.position.x - attack.radius <= invador.position.x + invador.width
                    && attack.position.y + attack.radius >= invador.position.y){
                    setTimeout(() => {
                        const found = grid.invadors.find((invader2) => invader2 === invador)
                        const found2 = attacks.find((attack2) => attack2 === attack)
                        
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
}

animate()

addEventListener('keydown', ({key}) =>{
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
            y: player.position.y + 10
        },
        velocity:{
            x: 0,
            y: -10
        }
        }))
    }

})
