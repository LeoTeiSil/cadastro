document.getElementById('formcadastro').addEventListener('submit', async (event) => {
    event.preventDefault();

    //Armazenar os dados do cadastro
    const nome = document.getElementById('name').value;
    const email = document.getElementById('emailcadastro').value;
    const senha = document.getElementById('senhacadastro').value;

    try {
        //armazena os dados dentro do response
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //Converte os dados em uma string JSON para enviar ao servidor
            body: JSON.stringify({ nome, email, senha }),
        });

        //v erifica se tudo foi feito corretamente
        const data = await response.json();
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao cadastrar: ' + data.message);
        }

    //avisa se teve alguma falha na conectividade do servidor
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
        console.error(error);
    }
});
