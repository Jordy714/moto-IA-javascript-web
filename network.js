class RedNeuronal {
    constructor(contadorNeuronas) {
        this.niveles = [];
        for (let i = 0; i < contadorNeuronas.length - 1; i++) {
            this.niveles.push(new Nivel(
                contadorNeuronas[i], contadorNeuronas[i + 1]
            ));
        }
    }
    static feedForward(givenInputs, network) {
        let outputs = Nivel.feedForward(
            givenInputs, network.niveles[0]);
        for (let i = 1; i < network.niveles.length; i++) {
            outputs = Nivel.feedForward(
                outputs, network.niveles[i]
            );
        }
        return outputs;
    }

    static mutate(network, amount = 1) {
        network.niveles.forEach(nivel => {
            for (let i = 0; i < nivel.biases; i++) {
                nivel.biases[i] = lerp(
                    nivel.biases[i],
                    Math.random() * 2 - 1,
                    amount
                )
            }
            for (let i = 0; i < nivel.weights.length; i++) {
                for (let j = 0; j < nivel.weights[i].length; j++) {
                    nivel.weights[i][j] = lerp(
                        nivel.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        });
    }
}

class Nivel {
    constructor(inputCount, outputCount) {
        this.imputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];

        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        Nivel.#random(this);

    }

    static #random(nivel) {
        for (let i = 0; i < nivel.imputs.length; i++) {
            for (let j = 0; j < nivel.outputs.length; j++) {
                nivel.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        for (let i = 0; i < nivel.biases.length; i++) {
            nivel.biases[i] = Math.random() * 2 - 1;

        }
    }

    static feedForward(givenInputs, nivel) {
        for (let i = 0; i < nivel.imputs.length; i++) {
            nivel.imputs[i] = givenInputs[i]

        }
        for (let i = 0; i < nivel.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < nivel.imputs.length; j++) {
                sum += nivel.imputs[j] * nivel.weights[j][i];
            }
            if (sum > nivel.biases[i]) {
                nivel.outputs[i] = 1;

            } else {
                nivel.outputs[i] = 0;
            }
        }
        return nivel.outputs;
    }
}