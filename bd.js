const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json());
app.use(cors());  // Habilitar CORS para permitir requisições do frontend

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'perfis'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar no banco de dados: ' + err);
    } else {
        console.log('Conectado ao banco de dados!');
    }
});

// Rota para obter todos os cadastros
app.get('/cadastros', (req, res) => {
    db.query('SELECT * FROM cadastros', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar cadastros' });
        } else {
            res.json(results);
        }
    });
});

// Rota para criar um novo cadastro
app.post('/cadastros', (req, res) => {
    const { nome, email, senha } = req.body;
    const query = 'INSERT INTO cadastros (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao criar cadastro' });
        } else {
            res.status(201).json({ id: results.insertId, nome, email, senha });
        }
    });
});

// Rota para editar um cadastro
app.put('/cadastros/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const query = 'UPDATE cadastros SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(query, [nome, email, senha, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao atualizar cadastro' });
        } else {
            res.status(200).json({ id, nome, email, senha });
        }
    });
});

// Rota para deletar um cadastro
app.delete('/cadastros/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM cadastros WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao deletar cadastro' });
        } else {
            res.status(200).json({ message: 'Cadastro deletado com sucesso' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
