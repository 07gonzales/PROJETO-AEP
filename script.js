function fecharTelaInicial()  {
    const telaInicial = document.getElementById('telaInicial');
    telaInicial.classList.add('hidden');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000); // Tempo igual ao da transição
}


let lucroImpostosChart;
let receitaDespesaChart;
let distribuicaoImpostosChart;

function formatNumber(number) {
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseNumber(value) {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

function gerarRelatorio() {
    // Obtém os valores de entrada do usuário e converte para números
    const entrada = parseNumber(document.getElementById('entrada').value);
    const saida = parseNumber(document.getElementById('saida').value);
    const faturamento = parseNumber(document.getElementById('faturamento').value);

    // Verifica se os valores são válidos
    if (isNaN(entrada) || isNaN(saida) || isNaN(faturamento)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    // Calcula o lucro
    const lucro = faturamento - saida;

    // Calcula os impostos
    const pis = faturamento * 0.0065;
    const cofins = faturamento * 0.03;
    const irpj = lucro * 0.15;
    const iss = faturamento * 0.02; // Valor médio, pode variar
    const icms = faturamento * 0.12;

    // Exibe o relatório formatado
    document.getElementById('lucro').innerText = `Lucro: ${formatNumber(lucro)}`;
    document.getElementById('pis').innerText = `PIS: ${formatNumber(pis)}`;
    document.getElementById('cofins').innerText = `COFINS: ${formatNumber(cofins)}`;
    document.getElementById('irpj').innerText = `IRPJ: ${formatNumber(irpj)}`;
    document.getElementById('iss').innerText = `ISS: ${formatNumber(iss)}`;
    document.getElementById('icms').innerText = `ICMS: ${formatNumber(icms)}`;

    // Gera os gráficos
    gerarGraficoLucroImpostos(lucro, pis, cofins, irpj, iss, icms);
    gerarGraficoReceitaDespesa([faturamento], [saida], ['Atual']);
    gerarGraficoDistribuicaoImpostos(pis, cofins, irpj, iss, icms);
}



//GRÁFICO LUCRO-IMPOSTOS

function gerarGraficoLucroImpostos(lucro, pis, cofins, irpj, iss, icms) {
    if (lucroImpostosChart) {
        lucroImpostosChart.destroy();
    }
    const ctx = document.getElementById('lucroImpostosChart').getContext('2d');
    lucroImpostosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lucro', 'PIS', 'COFINS', 'IRPJ', 'ISS', 'ICMS'],
            datasets: [{
                label: 'Valores (R$)',
                data: [lucro, pis, cofins, irpj, iss, icms],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


//GRÁFICO RECEITA-DESPESAS

function gerarGraficoReceitaDespesa(receitas, despesas, labels) {
    if (receitaDespesaChart) {
        receitaDespesaChart.destroy();
    }
    const ctx = document.getElementById('receitaDespesaChart').getContext('2d');
    receitaDespesaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receitas (R$)',
                data: receitas,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false
            }, {
                label: 'Despesas (R$)',
                data: despesas,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// GRÁFICO PIZZA 

function gerarGraficoDistribuicaoImpostos(pis, cofins, irpj, iss, icms) {
    if (distribuicaoImpostosChart) {
        distribuicaoImpostosChart.destroy();
    }
    const ctx = document.getElementById('distribuicaoImpostosChart').getContext('2d');
    distribuicaoImpostosChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['PIS', 'COFINS', 'IRPJ', 'ISS', 'ICMS'],
            datasets: [{
                label: 'Distribuição dos Impostos',
                data: [pis, cofins, irpj, iss, icms],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, 1)', // Preto para todas as bordas
                ],
                borderWidth: 0.5 // Espessura mais fina da borda
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            return `${context.label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        }
                    }
                }
            }
        }
    });
}
//========================================================================================================================================//

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('estoque')) {
        carregarEstoque();
    }
    atualizarTotais();
    gerarGrafico();
});

let estoque = JSON.parse(localStorage.getItem('estoque')) || [];

function adicionarMercadoria() {
    const nome = document.getElementById('nome').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const valor = parseFloat(document.getElementById('valor').value);

    if (nome && quantidade > 0 && valor > 0) {
        const mercadoria = {
            nome: nome,
            quantidade: quantidade,
            valor: valor,
            total: quantidade * valor
        };
        estoque.push(mercadoria);
        salvarEstoque();
        adicionarLinhaTabela(mercadoria);
        atualizarTotais();
        gerarGrafico();
        limparCampos();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function adicionarLinhaTabela(mercadoria) {
    const tbody = document.querySelector('#estoqueTable tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${mercadoria.nome}</td>
        <td>${mercadoria.quantidade}</td>
        <td>R$ ${mercadoria.valor.toFixed(2)}</td>
        <td>R$ ${mercadoria.total.toFixed(2)}</td>
        <td><button onclick="removerMercadoria('${mercadoria.nome}')">Remover</button></td>
    `;

    tbody.appendChild(tr);
}

function removerMercadoria(nome) {
    estoque = estoque.filter(mercadoria => mercadoria.nome !== nome);
    salvarEstoque();
    carregarEstoque();
    atualizarTotais();
    gerarGrafico();
}

function salvarEstoque() {
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

function carregarEstoque() {
    const tbody = document.querySelector('#estoqueTable tbody');
    tbody.innerHTML = '';
    estoque.forEach(adicionarLinhaTabela);
}

function atualizarTotais() {
    const quantidadeTotal = estoque.reduce((total, mercadoria) => total + mercadoria.quantidade, 0);
    const valorTotal = estoque.reduce((total, mercadoria) => total + mercadoria.total, 0);

    document.getElementById('quantidadeTotal').innerText = quantidadeTotal;
    document.getElementById('valorTotal').innerText = `R$ ${valorTotal.toFixed(2)}`;
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor').value = '';
}

function gerarGrafico() {
    const ctx = document.getElementById('estoqueChart').getContext('2d');

    const labels = estoque.map(mercadoria => mercadoria.nome);
    const dataQuantidades = estoque.map(mercadoria => mercadoria.quantidade);
    const dataValores = estoque.map(mercadoria => mercadoria.total);

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade',
                data: dataQuantidades,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Valor Total (R$)',
                data: dataValores,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
