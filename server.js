const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

  console.log('📦 Novo pedido recebido:', pedidoComHorario.nome);
  res.status(200).json({ mensagem: 'Pedido recebido!' });
});

app.get('/pedidos', (req, res) => {
  res.json(pedidosRecebidos);
});

app.delete('/apagar', (req, res) => {
  pedidosRecebidos = [];
  console.log('🗑️ Todos os pedidos foram apagados!');
  res.json({ mensagem: 'Pedidos apagados com sucesso.' });
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
});
