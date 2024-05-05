class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const izquierda = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.niveles.length;

        for (let i = network.niveles.length - 1; i >= 0; i--) {
            const nivelTop = top +
                lerp(
                    height - levelHeight,
                    0,
                    network.niveles.length == 1
                        ? 0.5
                        : i / (network.niveles.length - 1)
                );

            ctx.setLineDash([7, 3]);
            
            Visualizer.drawLevel(
                ctx, network.niveles[i],
                izquierda, nivelTop,
                width, levelHeight,
                i == network.niveles.length - 1
                    ? ['🠉', '🠈', '🠊', '🠋']
                    : []
            );
        }
    }

    static drawLevel(ctx, nivel, izquierda, top, width, height, outputLabels) {
        const derecha = izquierda + width;
        const bottom = top + height;
        const { imputs, outputs, weights, biases } = nivel;

        for (let i = 0; i < imputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(imputs, i, izquierda, derecha),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, izquierda, derecha),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }

        }

        const nodeRadio = 20;

        for (let i = 0; i < imputs.length; i++) {
            const x = Visualizer.#getNodeX(imputs, i, izquierda, derecha)
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadio, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadio * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(imputs[i]);
            ctx.fill();
        }
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, izquierda, derecha)
            ctx.beginPath();
            ctx.arc(x, top, nodeRadio, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadio * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadio, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                ctx.beginPath;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadio * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadio * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top);
            }
        }

    }
    static #getNodeX(nodes, index, izquierda, derecha) {
        return lerp(
            izquierda,
            derecha,
            nodes.length == 1
                ? 0.5
                : index / (nodes.length - 1)
        );
    }
}