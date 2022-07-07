export default class Invador{
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
        const canvas = document.querySelector('canvas');
        const c = canvas.getContext('2d');
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

