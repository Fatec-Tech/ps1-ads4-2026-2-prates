const pacientes = [];

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contador = document.getElementById('contador-pacientes');
const campoBusca = document.getElementById('busca');
const ordenarNome = document.getElementById('ordenar-nome');

const pacientesSalvos = JSON.parse(localStorage.getItem('pacientes'));

if (pacientesSalvos) {
    pacientes.push(...pacientesSalvos);
}

function adicionarPaciente(nome, email, nascimento, telefone) {
    const novoPaciente = {
        nome,
        email,
        nascimento,
        telefone
    };

    pacientes.push(novoPaciente);

    salvarPacientes();
}

function salvarPacientes() {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function calcIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
        mesAtual < mesNascimento ||
        (mesAtual === mesNascimento &&
            hoje.getDate() < nascimento.getDate())
    ) {
        idade--;
    }

    return idade;
}

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');

    return `${dia}/${mes}/${ano}`;
}

function renderizarTabela(lista = pacientes) {
    tabela.innerHTML = '';

    lista.forEach((paciente) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${paciente.nome}</td>
            <td>${calcIdade(paciente.nascimento)}</td>
            <td>${paciente.email}</td>
            <td>${formatarData(paciente.nascimento)}</td>
            <td>${paciente.telefone}</td>
            <td>
                <button
                    class="btn btn-danger btn-sm"
                    onclick="removerPaciente('${paciente.email}')"
                >
                    Remover
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });

    atualizarContador();
}

function atualizarContador() {
    contador.textContent = `Total de pacientes: ${pacientes.length}`;
}

function removerPaciente(email) {
    const indice = pacientes.findIndex(
        (paciente) => paciente.email === email
    );

    if (indice !== -1) {
        pacientes.splice(indice, 1);

        salvarPacientes();
        renderizarTabela();
    }
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const nascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value;

    const emailExiste = pacientes.some(
        (paciente) =>
            paciente.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExiste) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    adicionarPaciente(nome, email, nascimento, telefone);

    renderizarTabela();

    formulario.reset();
});

campoBusca.addEventListener('input', () => {
    const termo = campoBusca.value.toLowerCase();

    const pacientesFiltrados = pacientes.filter((paciente) =>
        paciente.nome.toLowerCase().includes(termo)
    );

    renderizarTabela(pacientesFiltrados);
});

let ordemCrescente = true;

ordenarNome.addEventListener('click', () => {
    pacientes.sort((a, b) => {
        const nomeA = a.nome.toLowerCase();
        const nomeB = b.nome.toLowerCase();

        if (nomeA < nomeB) {
            return ordemCrescente ? -1 : 1;
        }

        if (nomeA > nomeB) {
            return ordemCrescente ? 1 : -1;
        }

        return 0;
    });

    ordemCrescente = !ordemCrescente;

    salvarPacientes();
    renderizarTabela();
});

renderizarTabela();