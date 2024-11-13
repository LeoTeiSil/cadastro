const express = require('express');
const odbc = require('odbc');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

const connectionString = "Driver={SQL Server};Server=DESKTOP-M7KU2HR;Database=perfis;Trusted_Connection=Yes;";

app.use(cors({ origin: 'http://localhost:5500' }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function connectDB() {
    try {
        return await odbc.connect(connectionString);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const connection = await connectDB();
        await connection.query('INSERT INTO cadastros (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const connection = await connectDB();
        const result = await connection.query('SELECT * FROM cadastros WHERE email=? AND senha=?', [email, senha]);
        if (result.length > 0) {
            res.json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            res.json({ success: false, message: 'Credenciais incorretas' });
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao autenticar usuário' });
    }
});

app.get('/cadastros', async (req, res) => {
    try {
        const connection = await connectDB();
        const result = await connection.query("SELECT * FROM cadastros");
        res.json(result);
    } catch (error) {
        console.error('Erro ao obter registros:', error);
        res.status(500).json({ error: "Erro ao obter registros" });
    }
});

app.put('/cadastros/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    try {
        const connection = await connectDB();
        await connection.query("UPDATE cadastros SET nome = ?, email = ?, senha = ? WHERE id = ?", [nome, email, senha, id]);
        res.json({ success: true, message: "Cadastro atualizado com sucesso!" });
    } catch (error) {
        console.error('Erro ao atualizar cadastro:', error);
        res.status(500).json({ error: "Erro ao atualizar cadastro" });
    }
});

app.delete('/cadastros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectDB();
        await connection.query("DELETE FROM cadastros WHERE id = ?", [id]);
        res.json({ success: true, message: "Cadastro excluído com sucesso!" });
    } catch (error) {
        console.error('Erro ao excluir cadastro:', error);
        res.status(500).json({ error: "Erro ao excluir cadastro" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
