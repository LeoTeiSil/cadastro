document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#cadastroTable tbody");
    const searchInput = document.getElementById("searchInput");
    const formContainer = document.getElementById("formContainer");
    const formCadastro = document.getElementById("formCadastro");
    const btnCreate = document.getElementById("btnCreate");
    const btnSubmit = document.getElementById("btnSubmit");
    const btnCancel = document.getElementById("btnCancel");
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

    // As funções do modal para semana
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
        e.preventDefault();
        const nome = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        const user = { nome, email, senha };

        if (editingUserId) {
            fetch(`http://localhost:3000/cadastros/${editingUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchUsers();
                    closeModalFunc();
                } else {
                    alert(`Erro: ${data.message}`);
                }
            })
            .catch(error => console.error('Erro ao atualizar cadastro:', error));
        } else {
            fetch('http://localhost:3000/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchUsers();
                    closeModalFunc();
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
            const row = target.closest("tr");
            const nome = row.cells[1].textContent;
            const email = row.cells[2].textContent;
            showModal({ id: userId, nome, email });
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

