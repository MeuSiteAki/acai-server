const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');



let pedidosAntigos = [];

function gerarNotinha(pedido) {
  return `
🍹 NOTINHA DO PEDIDO 🍹
Cliente: ${pedido.nome}
Endereço: ${pedido.endereco} - ${pedido.bairro}
Forma de Pagamento: ${pedido.formaPagamento}
Observação: ${pedido.observacao}

Itens:
${pedido.itens}

Total: R$${pedido.total}
Data: ${pedido.horario}
  `;
}

function imprimir(texto) {
  const caminhoArquivo = path.join(__dirname, 'pedido.txt');
  fs.writeFileSync(caminhoArquivo, texto, 'utf8');

  const comando = `powershell -Command "Start-Process -FilePath '${caminhoArquivo}' -Verb Print"`;

  exec(comando, (err) => {
    if (err) {
      console.error('❌ Erro ao imprimir:', err.message);
    } else {
      console.log('🖨️ Pedido impresso com sucesso!');
    }
  });
}

async function verificarPedidos() {
  try {
    const res = await axios.get('https://acai-server-0sc0.onrender.com/pedidos');
    const pedidos = res.data;

    const novosPedidos = pedidos.filter(p => {
      return !pedidosAntigos.some(a =>
        a.nome === p.nome &&
        a.total === p.total &&
        a.horario === p.horario
      );
    });

    if (novosPedidos.length > 0) {
      console.log(`📦 ${novosPedidos.length} novo(s) pedido(s) recebido(s).`);
    }

    novosPedidos.forEach(pedido => {
      const texto = gerarNotinha(pedido);
      imprimir(texto);
    });

    pedidosAntigos = pedidos;
  } catch (err) {
    console.error('❌ Erro ao buscar pedidos:', err.message);
  }
}

setInterval(verificarPedidos, 5000);
console.log('🔍 Monitorando pedidos do servidor...');
