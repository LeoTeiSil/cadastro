document.getElementById('formcadastro').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const nome = document.getElementById('name').value;
    const email = document.getElementById('emailcadastro').value;
    const senha = document.getElementById('senhacadastro').value;

    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html'; 
        } else {
            alert('Erro ao cadastrar: ' + data.message); 
        }

    } catch (error) {
        alert('Erro ao conectar com o servidor.');
        console.error(error);
    }
});
