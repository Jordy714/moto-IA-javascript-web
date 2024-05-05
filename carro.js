class Carro {
    constructor(x, y, width, height, control, maxVelocidad = 7) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.velocidad = 0;
        this.aceleracion = 0.2;
        this.maxVelocidad = maxVelocidad;
        this.friccion = 0.05;
        this.angulo = 0;
        this.damaged = false;

        this.usarCerebro=control=="IA";

        if (control != "Jordy") {
            this.sensor = new Sensor(this);
            this.cerebro = new RedNeuronal(
                [this.sensor.contadorRayo,6,4]
            );
        }
        this.controls = new Controles(control);
    }

    update(carreteraBordes, trafico) {
        if (!this.damaged) {
            this.#mover();
            this.poligono = this.#crearPoligono();
            this.damaged = this.#isDamaged(carreteraBordes, trafico);
        }
        if (this.sensor) {
            this.sensor.update(carreteraBordes, trafico);
            const offsets = this.sensor.lecturas.map(
                s => s == null ? 0 : 1 - s.offset
            );
            const outputs = RedNeuronal.feedForward(offsets,this.cerebro)
            //console.log(outputs);

            if(this.usarCerebro){
                this.controls.adelante=outputs[0];
                this.controls.izquierda=outputs[1];
                this.controls.derecha=outputs[2];
                this.controls.atras=outputs[4];
            }
        }

    }
    #isDamaged(carreteraBordes, trafico) {
        for (let i = 0; i < carreteraBordes.length; i++) {
            if (polysIntersect(this.poligono, carreteraBordes[i])) {
                return true;
            }

        }
        for (let i = 0; i < trafico.length; i++) {
            if (polysIntersect(this.poligono, trafico[i].poligono)) {
                return true;
            }

        }
        return false;
    }

    #crearPoligono() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angulo - alpha) * rad,
            y: this.y - Math.cos(this.angulo - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angulo + alpha) * rad,
            y: this.y - Math.cos(this.angulo + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angulo - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angulo - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angulo + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angulo + alpha) * rad
        });
        return points;
    }
    #mover() {
        if (this.controls.adelante) {
            this.velocidad += this.aceleracion;
        }
        if (this.controls.atras) {
            this.velocidad -= this.aceleracion;
        }
        if (this.velocidad > this.maxVelocidad) {
            this.velocidad = this.maxVelocidad;
        }
        if (this.velocidad < -this.maxVelocidad / 2) {
            this.velocidad = -this.maxVelocidad / 2;
        }
        if (this.velocidad > 0) {
            this.velocidad -= this.friccion;
        }
        if (this.velocidad < 0) {
            this.velocidad += this.friccion;
        }
        if (this.velocidad != 0) {
            const flip = this.velocidad > 0 ? 1 : -1;
            if (this.controls.izquierda) {
                // this.x -= 2;
                this.angulo += 0.03 * flip;
            }
            if (this.controls.derecha) {
                // this.x += 2;
                this.angulo -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angulo) * this.velocidad;
        this.y -= Math.cos(this.angulo) * this.velocidad;
    }
    draw(ctx, color, drawSensor) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.poligono[0].x, this.poligono[0].y);
        for (let i = 1; i < this.poligono.length; i++) {
            ctx.lineTo(this.poligono[i].x, this.poligono[i].y)

        }
        ctx.fill();
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }
}