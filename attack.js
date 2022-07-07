export default class Attack{
    constructor({position, velocity, color}){
        this.position = position
        this.velocity = velocity
        this.color = color

        this.radius = 4.4
    }

    draw(){
        const canvas = document.querySelector('canvas');
        const c = canvas.getContext('2d');
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

