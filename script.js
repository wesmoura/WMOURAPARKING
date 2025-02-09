let entradas = JSON.parse(localStorage.getItem("entradas")) || {}; // Recupera dados

function registrarEntrada() {
    let placa = prompt("Digite a placa do veículo (ex: ABC1234):").toUpperCase();
    if (!placa) {
        alert("Placa inválida!");
        return;
    }

    let codigo = Math.floor(100000 + Math.random() * 900000);
    let horaEntrada = new Date();

    entradas[placa] = { codigo, horaEntrada };
    localStorage.setItem("entradas", JSON.stringify(entradas));

    alert(`Entrada registrada!\nPlaca: ${placa}\nCódigo: ${codigo}\nHora: ${horaEntrada.toLocaleString()}`);
}

function registrarSaida() {
    let placa = prompt("Digite a placa do veículo para saída:").toUpperCase();
    if (!entradas[placa]) {
        alert("Placa não encontrada!");
        return;
    }

    let horaSaida = new Date();
    let horaEntrada = new Date(entradas[placa].horaEntrada);
    let tempoTotal = Math.round((horaSaida - horaEntrada) / (1000 * 60)); // Minutos
    let valorTotal = (tempoTotal * 0.50).toFixed(2); // R$0.50 por minuto

    document.getElementById("info-saida").innerHTML = `
        <p>Placa: ${placa}</p>
        <p>Entrada: ${horaEntrada.toLocaleString()}</p>
        <p>Saída: ${horaSaida.toLocaleString()}</p>
        <p>Tempo Total: ${tempoTotal} min</p>
        <p>Valor a pagar: R$ ${valorTotal}</p>
    `;

    document.getElementById("saida-container").classList.remove("hidden");

    let qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = "";
    new QRCode(qrcodeDiv, `https://pagamento.com/cobranca?placa=${placa}&valor=${valorTotal}`);

    setTimeout(() => {
        delete entradas[placa];
        localStorage.setItem("entradas", JSON.stringify(entradas));
        alert(`Pagamento confirmado para o veículo ${placa}. Dados apagados.`);
        document.getElementById("saida-container").classList.add("hidden");
    }, 10000);
}
