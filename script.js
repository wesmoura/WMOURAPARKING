let entradas = JSON.parse(localStorage.getItem("entradas")) || {}; // Recupera do localStorage

function registrarEntrada() {
    let placa = prompt("Digite a placa do veículo (ex: ABC1234):").toUpperCase();
    if (!placa) {
        alert("Placa inválida!");
        return;
    }

    let codigo = Math.floor(100000 + Math.random() * 900000); // Código único
    let horaEntrada = new Date();

    entradas[placa] = { codigo, horaEntrada };
    localStorage.setItem("entradas", JSON.stringify(entradas)); // Salva no localStorage

    alert(`Registro confirmado!\nPlaca: ${placa}\nCódigo: ${codigo}\nEntrada: ${horaEntrada.toLocaleString()}`);
}

function gerarQRCode() {
    let placa = prompt("Digite a placa do veículo para saída:").toUpperCase();
    
    if (!entradas[placa]) {
        alert("Placa não encontrada! Digite uma placa válida.");
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

    document.getElementById("qrcode-container").classList.remove("hidden");
    
    let qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = ""; // Limpa QR Code anterior
    new QRCode(qrcodeDiv, `https://pagamento.com/cobranca?placa=${placa}&valor=${valorTotal}`);

    // Apagar do banco de dados após pagamento
    setTimeout(() => {
        delete entradas[placa];
        localStorage.setItem("entradas", JSON.stringify(entradas));
        alert(`Pagamento confirmado para o veículo ${placa}. Dados apagados.`);
    }, 10000); // Simula pagamento após 10 segundos
}

