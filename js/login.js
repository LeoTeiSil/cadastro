document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();

    //Armazena a respostas na variavel
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //Converte os dados em uma string JSON para enviar ao servidor
            body: JSON.stringify({ email, senha }),
        });

        //verifica se os dados estão do banco de dados
        const data = await response.json();
        if (data.success) {
            alert('Login realizado com sucesso!');
            window.location.href = 'tabela.html';
            //Se o login falhar, aparece um alerta informando que as credenciais estão incorretas
        } else {
            alert('Credenciais incorretas.');
        }
        //Informa ao usuário que houve um problema ao conectar ao servidor
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
        console.error(error);
    }
});
