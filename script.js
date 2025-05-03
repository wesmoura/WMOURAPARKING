let entradas = JSON.parse(localStorage.getItem("entradas")) || {};
let historico = JSON.parse(localStorage.getItem("historico")) || [];

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
    let tempoTotal = Math.round((horaSaida - horaEntrada) / (1000 * 60));
    let valorTotal = (tempoTotal * 0.50).toFixed(2);

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

    historico.push({
        placa: placa,
        entrada: horaEntrada.toLocaleString(),
        saida: horaSaida.toLocaleString(),
        tempo: tempoTotal,
        valor: valorTotal,
        data: horaSaida.toISOString().split('T')[0]
    });
    localStorage.setItem("historico", JSON.stringify(historico));
    atualizarHistorico();

    setTimeout(() => {
        delete entradas[placa];
        localStorage.setItem("entradas", JSON.stringify(entradas));
        alert(`Pagamento confirmado para o veículo ${placa}. Dados apagados.`);
        document.getElementById("saida-container").classList.add("hidden");
    }, 10000);
}

function atualizarHistorico() {
    const hoje = new Date().toISOString().split('T')[0];
    const corpoTabela = document.getElementById("historico-corpo");
    corpoTabela.innerHTML = "";

    const registrosDoDia = historico.filter(registro => registro.data === hoje);
    if (registrosDoDia.length === 0) {
        corpoTabela.innerHTML = "<tr><td colspan='5'>Nenhum registro para hoje.</td></tr>";
    } else {
        registrosDoDia.forEach(registro => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${registro.placa}</td>
                <td>${registro.entrada}</td>
                <td>${registro.saida}</td>
                <td>${registro.tempo}</td>
                <td>${registro.valor}</td>
            `;
            corpoTabela.appendChild(row);
        });
    }
}

function limparHistorico() {
    if (confirm("Deseja limpar o histórico do dia?")) {
        const hoje = new Date().toISOString().split('T')[0];
        historico = historico.filter(registro => registro.data !== hoje);
        localStorage.setItem("historico", JSON.stringify(historico));
        atualizarHistorico();
        alert("Histórico do dia limpo!");
    }
}

function toggleHistorico() {
    const historicoContainer = document.getElementById("historico-container");
    const toggleButton = document.getElementById("historico-toggle");
    historicoContainer.classList.toggle("hidden");
    toggleButton.textContent = historicoContainer.classList.contains("hidden")
        ? "Mostrar Histórico do Dia"
        : "Ocultar Histórico do Dia";
}

document.addEventListener("DOMContentLoaded", atualizarHistorico);
