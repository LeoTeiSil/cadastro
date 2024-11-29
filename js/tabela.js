document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#cadastroTable tbody");
    const searchInput = document.getElementById("searchInput");
    const formCadastro = document.getElementById("formCadastro");
    const btnCreate = document.getElementById("btnCreate");
    const modal = document.getElementById("userModal");
    const modalTitle = document.getElementById("modalTitle");
    const closeModal = document.querySelector(".close");
    let editingUserId = null;

    function addRow(user) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.senha ? "••••••" : ""}</td>
            <td>
                <button class="btnEdit" data-id="${user.id}">Editar</button>
                <button class="btnDelete" data-id="${user.id}">Deletar</button>
            </td>
        `;
        tableBody.appendChild(row);
    }

    function fetchUsers() {
        fetch('http://localhost:3000/cadastros')
            .then(response => response.json())
            .then(users => {
                tableBody.innerHTML = '';
                users.forEach(user => addRow(user));
            })
            .catch(error => console.error('Erro ao buscar cadastros:', error));
    }

    // Função para mostrar o modal de criação ou edição
    function showModal(user = {}) {
        modal.style.display = "block";
        modalTitle.textContent = user.id ? "Editar Usuário" : "Criar Usuário";
        document.getElementById("userId").value = user.id || "";
        document.getElementById("name").value = user.nome || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("senha").value = ""; 
        editingUserId = user.id || null;
    }

    function closeModalFunc() {
        modal.style.display = "none";
        clearForm();
    }

    closeModal.onclick = closeModalFunc;

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModalFunc();
        }
    };

    btnCreate.addEventListener("click", () => {
        showModal();
    });

    function clearForm() {
        formCadastro.reset();
        editingUserId = null;
    }

    formCadastro.addEventListener("submit", function (e) {
        e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    
        // Pegue os valores dos campos do formulário
        const nome = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
    
        const user = { nome, email, senha };
    
        // Verifica se estamos editando um usuário ou criando um novo
        if (editingUserId) {
            // Envia a requisição PUT para atualizar o usuário existente
            fetch(`http://localhost:3000/cadastros/${editingUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchUsers();  // Atualiza a lista de usuários
                    closeModalFunc();  // Fecha o modal
                } else {
                    alert(`Erro: ${data.message}`);
                }
            })
            .catch(error => console.error('Erro ao atualizar cadastro:', error));
        } else {
            // Envia a requisição POST para criar um novo usuário
            fetch('http://localhost:3000/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchUsers();  // Atualiza a lista de usuários
                    closeModalFunc();  // Fecha o modal
                } else {
                    alert(`Erro: ${data.message}`);
                }
            })
            .catch(error => console.error('Erro ao criar cadastro:', error));
        }
    });
    

    tableBody.addEventListener("click", function (e) {
        const target = e.target;
        const userId = target.dataset.id;
    
        if (target.classList.contains("btnEdit")) {
            // Requisição para pegar os dados do usuário
            fetch(`http://localhost:3000/cadastros/${userId}`)
                .then(response => response.json())
                .then(user => {
                    // Preenche o modal com os dados do usuário
                    showModal(user);
                })
                .catch(error => console.error('Erro ao obter usuário para editar:', error));
        }
    
        if (target.classList.contains("btnDelete")) {
            if (confirm("Tem certeza que deseja deletar este usuário?")) {
                fetch(`http://localhost:3000/cadastros/${userId}`, {
                    method: 'DELETE'
                })
                .then(() => fetchUsers())
                .catch(error => console.error('Erro ao deletar cadastro:', error));
            }
        }
    });
    

    searchInput.addEventListener("input", function () {
        const filter = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            const nomeCell = row.cells[1].textContent.toLowerCase();
            row.style.display = nomeCell.includes(filter) ? "" : "none";
        });
    });

    fetchUsers();
});
