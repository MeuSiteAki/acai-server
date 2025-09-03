const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let pedidosRecebidos = [];

app.post('/pedido', (req, res) => {
  const pedido = req.body;
  const pedidoComHorario = { ...pedido, horario: new Date().toLocaleString() };
  pedidosRecebidos.push(pedidoComHorario);

  const notinha = gerarNotinha(pedidoComHorario);
  imprimir(notinha);

  res.status(200).json({ mensagem: 'Pedido recebido e impresso!' });
});

app.get('/pedidos', (req, res) => {
  res.json(pedidosRecebidos);
});

app.delete('/apagar', (req, res) => {
  pedidosRecebidos = [];
  console.log('🗑️ Todos os pedidos foram apagados!');
  res.json({ mensagem: 'Pedidos apagados com sucesso.' });
});

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

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
});
