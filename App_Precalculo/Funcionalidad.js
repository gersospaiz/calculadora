function graficar() {
    const inputFuncion = document.getElementById("funcion").value;
    const tipoFuncionElem = document.getElementById("tipoFuncion");
    const xValores = [];
    const yValores = [];

    // Evaluar usando reemplazo seguro de la variable 'x'
    for (let x = -10; x <= 10; x += 0.1) {
        try {
            const expr = inputFuncion.replace(/\bx\b/g, `(${x})`);
            let y = eval(expr);
            if (isFinite(y)) {
                xValores.push(x);
                yValores.push(y);
            } else {
                // ignorar valores no finitos
            }
        } catch (error) {
            alert("Error en la función. Asegúrate de escribirla correctamente.");
            return;
        }
    }

    // Calcular intersecciones con ejes
    let interseccionY = null;
    try {
        interseccionY = eval(inputFuncion.replace(/\bx\b/g, "(0)"));
        if (!isFinite(interseccionY)) interseccionY = null;
    } catch (e) {
        interseccionY = null;
    }

    let interseccionX = null;
    for (let i = 1; i < xValores.length; i++) {
        const y0 = yValores[i - 1];
        const y1 = yValores[i];
        if (y0 === 0) {
            interseccionX = xValores[i - 1];
            break;
        }
        if (y0 * y1 < 0) {
            // interpolación lineal para aproximar la raíz
            const x0 = xValores[i - 1];
            const x1 = xValores[i];
            const raiz = x0 - y0 * (x1 - x0) / (y1 - y0);
            interseccionX = Number(raiz.toFixed(2));
            break;
        }
    }

    // Verificar si es par o impar
    const tipoFuncion = verificarParImpar(inputFuncion);
    tipoFuncionElem.textContent = `La función es: ${tipoFuncion}`;

    // Cambiar color de texto según tipo
    tipoFuncionElem.className = "info"; // reset clase base
    if (tipoFuncion === "PAR") tipoFuncionElem.classList.add("par");
    else if (tipoFuncion === "IMPAR") tipoFuncionElem.classList.add("impar");
    else tipoFuncionElem.classList.add("ninguna");

    // Asignar color de la gráfica
    let colorGrafica;
    if (tipoFuncion === "PAR") colorGrafica = "blue";
    else if (tipoFuncion === "IMPAR") colorGrafica = "red";
    else colorGrafica = "green";

    // Gráfica principal
    const grafica = {
        x: xValores,
        y: yValores,
        mode: "lines",
        name: "Función",
        line: { color: colorGrafica, width: 3 }
    };

    // Líneas de los ejes
    const ejeX = {
        x: [-10, 10],
        y: [0, 0],
        mode: "lines",
        name: "Eje X",
        line: { color: "black", width: 1 }
    };

    const ejeY = {
        x: [0, 0],
        y: [-10, 10],
        mode: "lines",
        name: "Eje Y",
        line: { color: "black", width: 1 }
    };

    // Puntos de intersección
    const puntos = [];
    if (interseccionY !== null) {
        puntos.push({
            x: [0],
            y: [interseccionY],
            mode: "markers+text",
            text: [`Y(${Number(interseccionY).toFixed(2)})`],
            textposition: "top right",
            marker: { color: "red", size: 10 },
            name: "Intersección Y"
        });
    }

    if (interseccionX !== null) {
        puntos.push({
            x: [interseccionX],
            y: [0],
            mode: "markers+text",
            text: [`X(${interseccionX})`],
            textposition: "bottom left",
            marker: { color: "green", size: 10 },
            name: "Intersección X"
        });
    }

    const layout = {
        title: "Gráfica de la función",
        xaxis: { title: "Eje X" },
        yaxis: { title: "Eje Y" },
        plot_bgcolor: "#f9fafb",
        paper_bgcolor: "white"
    };

    Plotly.newPlot("grafica", [ejeX, ejeY, grafica, ...puntos], layout);
}

// Función para verificar si es par, impar o ninguna
function verificarParImpar(funcionTexto) {
    const tolerancia = 0.0001;
    let esPar = true;
    let esImpar = true;

    for (let x = -5; x <= 5; x += 0.5) {
        try {
            const fx = eval(funcionTexto.replace(/\bx\b/g, `(${x})`));
            const fnegx = eval(funcionTexto.replace(/\bx\b/g, `(${ -x })`));

            if (!isFinite(fx) || !isFinite(fnegx)) return "No se pudo evaluar la función";
            if (Math.abs(fx - fnegx) > tolerancia) esPar = false;
            if (Math.abs(fx + fnegx) > tolerancia) esImpar = false;
        } catch (e) {
            return "No se pudo evaluar la función";
        }
    }

    if (esPar) return "PAR";
    if (esImpar) return "IMPAR";
    return "NINGUNA (no es par ni impar)";
}