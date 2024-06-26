const carroCanvas = document.getElementById("carroCanvas");
carroCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

let idAnimacion;

const carroCtx = carroCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const carretera = new Carretera(carroCanvas.width / 2, carroCanvas.width * 0.9);


let N = 1;
let carros = generarCarros(N)
let mejorCarro = carros[0];

if (localStorage.getItem("mejorCerebro")) {
    for (let i = 0; i < carros.length; i++) {
        carros[i].cerebro = JSON.parse(
            localStorage.getItem("mejorCerebro"));
        if (i != 0) {
            RedNeuronal.mutate(carros[i].cerebro, 0.1)
        }
    }

}

let trafico = [
    new Moto(carretera.lineaCentral(3), -200, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(1), -400, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(2), -200, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(0), -400, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(5), -300, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(3), -900, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(4), -800, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(1), -1000, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(5), -400, 30, 50, "Jordy", 2),
    new Moto(carretera.lineaCentral(5), -1100, 30, 50, "Jordy", 2)
]
animar();

function iniciar() {
    var nCarros = document.getElementById("nCarros").value;
    carros = generarCarros(nCarros);
    trafico = [
        new Moto(carretera.lineaCentral(3), -200, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(1), -400, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(2), -200, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(0), -400, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(5), -300, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(3), -900, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(4), -800, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(1), -1000, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(5), -400, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(5), -1100, 30, 50, "Jordy", 2),
        new Moto(carretera.lineaCentral(4), -1100, 30, 50, "Jordy", 2)
    ]
    mejorCarro = carros[0];

    if (localStorage.getItem("mejorCerebro")) {
        for (let i = 0; i < carros.length; i++) {
            carros[i].cerebro = JSON.parse(
                localStorage.getItem("mejorCerebro"));
            if (i != 0) {
                RedNeuronal.mutate(carros[i].cerebro, 0.1)
            }
        }

    }
}
function save() {
    localStorage.setItem("mejorCerebro",
        JSON.stringify(mejorCarro.cerebro));
}
function discard() {
    localStorage.removeItem("mejorCerebro")
}

function generarCarros(N) {
    const carros = [];
    for (let i = 1; i <= N; i++) {
        carros.push(new Moto(carretera.lineaCentral(3), 100, 30, 50, "IA"));

    }
    return carros;
}

function animar(time) {

    for (let i = 0; i < trafico.length; i++) {
        trafico[i].update(carretera.bordes, []);
    }

    for (let i = 0; i < carros.length; i++) {
        carros[i].update(carretera.bordes, trafico);
    }

    mejorCarro = carros.find(
        c => c.y == Math.min(
            ...carros.map(c => c.y)
        )
    );

    carroCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carroCtx.save();

    carroCtx.translate(0, -mejorCarro.y + carroCanvas.height * 0.7)

    carretera.draw(carroCtx);
    for (let i = 0; i < trafico.length; i++) {
        trafico[i].draw(carroCtx, "red");
    }

    carroCtx.globalAlpha = 0.2;
    for (let i = 0; i < carros.length; i++) {
        carros[i].draw(carroCtx, "blue");
    }

    carroCtx.globalAlpha = 1;
    mejorCarro.draw(carroCtx, "blue", true)
    carroCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, mejorCarro.cerebro);

    //da la ilucion de moverse
    requestAnimationFrame(animar);
}
    
