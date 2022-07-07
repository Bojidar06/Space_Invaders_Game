export default class Player{
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
               x: innerWidth / 2 - this.width / 2,
               y: innerHeight - this.height / 2 - 60
            }
        } 

        this.game = {
            over: false
        }
    }

    draw(){
        if(this.opacity == 0){
            this.game.over = true
            let over = document.getElementById('over')
            over.style.left = "50%"
            let Bullets = document.getElementById('bullets')
            Bullets.textContent = "0"
        }

        const canvas = document.querySelector('canvas');
        const c = canvas.getContext('2d');
        c.globalAlpha = this.opacity
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

    }

    update(){
        if(this.image){
            this.position.x += this.velocity.x
            if (this.position.x >= 0 && this.position.x + this.width <= innerWidth){
                this.draw()
            }
            else{
                this.position.x -= this.velocity.x
                this.draw()
            }
        }
    }
}
