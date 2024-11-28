document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();

 
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Login realizado com sucesso!');
            window.location.href = 'tabela.html';
        } else {
            alert('Credenciais incorretas.');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
        console.error(error);
    }
});