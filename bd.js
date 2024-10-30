const express = require('express');
const odbc = require('odbc');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5500' }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));


//Conecta ao banco de dados
const connectionString = "Driver={SQL Server};Server=DESKTOP-M7KU2HR;Database=perfis;Trusted_Connection=Yes;";


//Enviar os dados para meu banco de dados
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const connection = await odbc.connect(connectionString);
        await connection.query('INSERT INTO cadastros (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário', error: error.message });
    }
});


//Ver se as informações estão presentes no banco de dados
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const connection = await odbc.connect(connectionString);
        const result = await connection.query(`SELECT * FROM cadastros WHERE email=? AND senha=?`, [email, senha]);

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


//Ver em qual servidor está rodando o site
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
