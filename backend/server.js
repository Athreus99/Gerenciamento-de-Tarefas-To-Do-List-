const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configuração CORS para produção
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  }));
  
  app.use(express.json());
  
// Middleware
app.use(cors());
app.use(express.json());

// Array para armazenar as tarefas
let tasks = [];

// GET - Listar todas as tarefas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST - Criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
  }

  const newTask = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT - Atualizar tarefa
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed
  };

  res.json(tasks[taskIndex]);
});

// DELETE - Deletar tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});