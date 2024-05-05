class Carretera {
    constructor(x, width, contadorLinea = 6) {
        this.x = x;
        this.width = width;
        this.contadorLinea = contadorLinea;

        this.izquierda = x - width / 2;
        this.derecha = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topIzquierda = { x: this.izquierda, y: this.top };
        const topDerecha = { x: this.derecha, y: this.top };
        const bottomIzquierda = { x: this.izquierda, y: this.bottom };
        const bottomDerecha = { x: this.derecha, y: this.bottom };
        this.bordes = [
            [topIzquierda, bottomIzquierda],
            [topDerecha, bottomDerecha]
        ];
    }

    lineaCentral(laneIndex) {
        const laneWidth = this.width / this.contadorLinea;
        return this.izquierda + laneWidth / 2 + laneIndex * laneWidth
        Math.min(laneIndex, this.contadorLinea - 1) * laneWidth;
    }
    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1; i <= this.contadorLinea - 1; i++) {
            const x = lerp(
                this.izquierda,
                this.derecha,
                i / this.contadorLinea
            );
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.bordes.forEach(borde=>{
            ctx.beginPath();
            ctx.moveTo(borde[0].x, borde[0].y);
            ctx.lineTo(borde[1].x, borde[1].y);
            ctx.stroke();
        });
    }
}

