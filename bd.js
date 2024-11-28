const express = require('express');
const odbc = require('odbc');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); 
const app = express();
const PORT = 3000;

const connectionString = "Driver={SQL Server};Server=DESKTOP-M7KU2HR;Database=perfis;Trusted_Connection=Yes;";

app.use(cors({ origin: 'http://localhost:5500' }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function connectDB() {
    try {
        const connection = await odbc.connect(connectionString);
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw new Error('Erro ao conectar ao banco de dados');
    }
}

app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const connection = await connectDB();

        const checkQuery = 'SELECT * FROM cadastros WHERE nome = ? OR email = ?';
        const existingUser = await connection.query(checkQuery, [nome, email]);

        if (existingUser.length > 0) {

            if (existingUser.some(user => user.nome === nome)) {
                return res.status(400).json({
                    success: false,
                    message: 'O nome já está sendo utilizado.'
                });
            }
            if (existingUser.some(user => user.email === email)) {
                return res.status(400).json({
                    success: false,
                    message: 'O e-mail já está sendo utilizado.'
                });
            }
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        await connection.query('INSERT INTO cadastros (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);

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

        const query = 'SELECT * FROM cadastros WHERE email = ?';
        const users = await connection.query(query, [email]);

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Senha incorreta.' });
        }

        res.json({ success: true, message: 'Login realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro ao fazer login', error: error.message });
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


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
