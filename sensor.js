class Sensor {
    constructor(carro) {
        this.carro = carro;
        this.contadorRayo = 5;
        this.longitudRayo = 150;
        this.anguloRayo = Math.PI / 2;

        this.rayos = [];
        this.lecturas = [];

    }

    update(carreteraBordes, trafico) {
        this.#crearRayos();
        this.lecturas = [];
        for (let i = 0; i < this.contadorRayo; i++) {
            this.lecturas.push(
                this.#getLectura(
                    this.rayos[i],
                    carreteraBordes,
                    trafico
                )
            );

        }
    }
    #getLectura(rayo, carreteraBordes, trafico) {
        let toques = [];

        for (let i = 0; i < carreteraBordes.length; i++) {
            const toque = getIntersection(
                rayo[0],
                rayo[1],
                carreteraBordes[i][0],
                carreteraBordes[i][1]
            );

            if (toque) {
                toques.push(toque);
            }

        }
        for (let i = 0; i < trafico.length; i++) {
            const poly = trafico[i].poligono;
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    rayo[0],
                    rayo[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                );

                if (value) {
                    toques.push(value);
                }
            }
        }
        if (toques.length == 0) {
            return null;
        } else {
            const offsets = toques.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return toques.find(e => e.offset == minOffset)
        }
    }
    #crearRayos() {
        this.rayos = [];
        for (let i = 0; i < this.contadorRayo; i++) {
            const angulo = lerp(
                this.anguloRayo / 2,
                -this.anguloRayo / 2,
                this.contadorRayo == 1 ? 0.5 : i / (this.contadorRayo)
            ) + this.carro.angulo;
            const inicio = { x: this.carro.x, y: this.carro.y };
            const final = {
                x: this.carro.x -
                    Math.sin(angulo) * this.longitudRayo,
                y: this.carro.y -
                    Math.cos(angulo) * this.longitudRayo,
            };
            this.rayos.push([inicio, final]);
        }
    }
    draw(ctx) {
        for (let i = 0; i < this.contadorRayo; i++) {
            let final = this.rayos[i][1];
            if (this.lecturas[i]) {
                final = this.lecturas[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";

            ctx.moveTo(
                this.rayos[i][0].x,
                this.rayos[i][0].y
            );
            ctx.lineTo(
                final.x,
                final.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";

            ctx.moveTo(
                this.rayos[i][1].x,
                this.rayos[i][1].y
            );
            ctx.lineTo(
                final.x,
                final.y
            );
            ctx.stroke();
        }
    }
}
