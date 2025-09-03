const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Banco de pedidos em memória
let pedidosRecebidos = [];

// Rota para receber pedidos
app.post('/pedido', (req, res) => {
  const pedido = req.body;

  if (!pedido || !pedido.nome || !pedido.itens || !pedido.total) {
    return res.status(400).json({ erro: 'Pedido inválido ou incompleto.' });
  }

  const pedidoComHorario = {
    ...pedido,
    horario: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  };

  pedidosRecebidos.push(pedidoComHorario);
  console.log('📦 Novo pedido recebido:', pedidoComHorario.nome);

  res.status(200).json({ mensagem: 'Pedido recebido com sucesso!' });
});

// Rota para listar pedidos
app.get('/pedidos', (req, res) => {
  res.json(pedidosRecebidos);
});

// Rota para apagar todos os pedidos
app.delete('/apagar', (req, res) => {
  pedidosRecebidos = [];
  console.log('🗑️ Todos os pedidos foram apagados!');
  res.json({ mensagem: 'Todos os pedidos foram apagados.' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
});
