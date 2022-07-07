import Invador from './invador.js'

export default class Grid{
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

        this.rows = Math.floor(Math.random() * 4 + 2)
        this.columns = Math.floor(Math.random() * 9 + 5)
        this.check = false
        this.width = this.columns * 25

        for(let x = 0; x < this.columns; ++x){
            for(let y = 0; y < this.rows; ++y)
                this.invadors.push(new Invador({
                    position: {
                        x: x * 33,
                        y: y * 33
                    }
                }))
            }
        }
}

