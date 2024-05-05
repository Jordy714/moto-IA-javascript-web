class Controles {
    constructor(type) {
        this.adelante = false;
        this.izquierda = false;
        this.derecha = false;
        this.atras = false;

        switch(type){
            case "KEYS":
                this.#teclasPresionadas();
                break;
            case "Jordy":
                this.adelante=true;
                break
        }

    }
    //metodo privado por eso #
    #teclasPresionadas() {
        // document.onkeydown=(event)=>{
        //     console.log(event.key)
        // }
        // Arrow function es lo mismo que poner function(event) pero el this ya no se 
        // va a referir al constructor si no a la funcion como tal.
        document.onkeydown = (event) => {
            switch (event.key) {
                case "a":
                    this.izquierda = true;
                    break;
                case "w":
                    this.adelante = true;
                    break;
                case "s":
                    this.atras = true;
                    break;
                case "d":
                    this.derecha = true;
                    break;
            }
            //console.table(this);
        }
        document.onkeyup = (event) => {
            switch (event.key) {
                case "a":
                    this.izquierda = false;
                    break;
                case "w":
                    this.adelante = false;
                    break;
                case "s":
                    this.atras = false;
                    break;
                case "d":
                    this.derecha = false;
                    break;
            }
            //console.table(this);
        }
    }
}