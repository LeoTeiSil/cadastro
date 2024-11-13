document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#cadastroTable tbody");
    const searchInput = document.getElementById("searchInput");
    const formContainer = document.getElementById("formContainer");
    const formCadastro = document.getElementById("formCadastro");
    const btnCreate = document.getElementById("btnCreate");
    const btnSubmit = document.getElementById("btnSubmit");
    const btnCancel = document.getElementById("btnCancel");
    let editingUserId = null;

    // Função para adicionar um novo usuário na tabela
    function addRow(user) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.senha}</td>
            <td>
                <button class="btnEdit" data-id="${user.id}">Editar</button>
                <button class="btnDelete" data-id="${user.id}">Deletar</button>
            </td>
        `;
        tableBody.appendChild(row);
    }

    // Função para buscar e filtrar usuários
    function fetchUsers() {
        fetch('http://localhost:3000/cadastros')
            .then(response => response.json())
            .then(users => {
                tableBody.innerHTML = '';
                users.forEach(user => addRow(user));
            })
            .catch(error => console.error('Erro ao buscar cadastros:', error));
    }

    // Função para exibir o formulário de criação ou edição
    function showForm(user = {}) {
        formContainer.style.display = "block";
        document.getElementById("userId").value = user.id || "";
        document.getElementById("name").value = user.nome || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("senha").value = user.senha || "";
        editingUserId = user.id || null;
    }

    // Função para limpar o formulário
    function clearForm() {
        document.getElementById("userId").value = "";
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
        editingUserId = null;
        formContainer.style.display = "none";
    }

    // Evento de click para criar um novo cadastro
    btnCreate.addEventListener("click", () => {
        showForm();
    });

    // Evento de click para cancelar o formulário
    btnCancel.addEventListener("click", () => {
        clearForm();
    });

    // Evento de submit do formulário
    formCadastro.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const user = { nome, email, senha };

    if (editingUserId) {
        // Atualizar usuário
        fetch(`http://localhost:3000/cadastros/${editingUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(() => fetchUsers())
        .catch(error => console.error('Erro ao atualizar cadastro:', error));
    } else {
        // Criar novo usuário
        fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchUsers(); // Atualiza a tabela com o novo usuário
            } else {
                console.error('Erro ao criar cadastro:', data.message);
            }
        })
        .catch(error => console.error('Erro ao criar cadastro:', error));
    }

    clearForm();
});


    // Evento de click nos botões de editar e deletar
    tableBody.addEventListener("click", function (e) {
        const target = e.target;
        const userId = target.dataset.id;

        if (target.classList.contains("btnEdit")) {
            const row = target.closest("tr");
            const nome = row.cells[1].textContent;
            const email = row.cells[2].textContent;
            const senha = row.cells[3].textContent;
            showForm({ id: userId, nome, email, senha });
        }

        if (target.classList.contains("btnDelete")) {
            fetch(`http://localhost:3000/cadastros/${userId}`, {
                method: 'DELETE'
            })
            .then(() => fetchUsers())
            .catch(error => console.error('Erro ao deletar cadastro:', error));
        }
    });

    // Evento de digitação no campo de pesquisa
    searchInput.addEventListener("input", function () {
        const filter = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            const nomeCell = row.cells[1].textContent.toLowerCase();
            row.style.display = nomeCell.includes(filter) ? "" : "none";
        });
    });

    // Inicializar tabela com dados do banco
    fetchUsers();
});
