const API_URL = "http://localhost:8080";

let produtos = [];
let clientes = [];
let acaoConfirmacao = null;

document.addEventListener("DOMContentLoaded", () => {
    configurarLoginCadastro();
    configurarMenu();
    configurarProdutos();
    configurarClientes();
    configurarPopup();
    verificarSessao();
});

function $(id) {
    return document.getElementById(id);
}

function mostrarElemento(id) {
    const elemento = $(id);

    if (elemento) {
        elemento.classList.remove("hidden");
    }
}

function esconderElemento(id) {
    const elemento = $(id);

    if (elemento) {
        elemento.classList.add("hidden");
    }
}

function limparCampos(ids) {
    ids.forEach((id) => {
        const campo = $(id);

        if (campo) {
            campo.value = "";
            campo.classList.remove("input-error");
        }
    });
}

function marcarErro(id) {
    const campo = $(id);

    if (campo) {
        campo.classList.add("input-error");
    }
}

function removerErros(ids) {
    ids.forEach((id) => {
        const campo = $(id);

        if (campo) {
            campo.classList.remove("input-error");
        }
    });
}

function apenasNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function validarFormatoCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
}

function aplicarMascaraCPF(valor) {
    valor = apenasNumeros(valor);
    valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1-$2");
    return valor.substring(0, 14);
}

function aplicarMascaraTelefone(valor) {
    valor = apenasNumeros(valor);

    if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return valor.substring(0, 15);
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarCPF(cpf) {
    const numeros = apenasNumeros(cpf || "");

    if (numeros.length !== 11) {
        return cpf || "-";
    }

    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarTelefone(telefone) {
    const numeros = apenasNumeros(telefone || "");

    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return telefone || "-";
}

function configurarPopup() {
    $("btn-popup-cancelar").addEventListener("click", fecharPopup);

    $("btn-popup-confirmar").addEventListener("click", () => {
        if (typeof acaoConfirmacao === "function") {
            acaoConfirmacao();
        }

        fecharPopup();
    });
}

function abrirPopup(tipo, titulo, mensagem, confirmar = false, callback = null) {
    const box = $("popup-box");

    box.className = "popup-box";
    box.classList.add(tipo);

    $("popup-titulo").textContent = titulo;
    $("popup-mensagem").textContent = mensagem;

    acaoConfirmacao = callback;

    if (confirmar) {
        mostrarElemento("btn-popup-cancelar");
        $("btn-popup-confirmar").textContent = "Confirmar";
    } else {
        esconderElemento("btn-popup-cancelar");
        $("btn-popup-confirmar").textContent = "Entendi";
    }

    mostrarElemento("popup-overlay");
}

function fecharPopup() {
    esconderElemento("popup-overlay");
    acaoConfirmacao = null;
}

function configurarLoginCadastro() {
    $("btn-tab-login").addEventListener("click", () => alterarModoAuth("login"));
    $("btn-tab-cadastro").addEventListener("click", () => alterarModoAuth("cadastro"));

    $("input-cadastro-cpf").addEventListener("input", () => {
        $("input-cadastro-cpf").value = aplicarMascaraCPF($("input-cadastro-cpf").value);
    });

    $("form-login-cadastro").addEventListener("submit", (event) => {
        event.preventDefault();

        const modo = $("modo-formulario").value;

        if (modo === "login") {
            realizarLogin();
        } else {
            realizarCadastro();
        }
    });
}

function alterarModoAuth(modo) {
    $("modo-formulario").value = modo;

    const btnLogin = $("btn-tab-login");
    const btnCadastro = $("btn-tab-cadastro");
    const botaoPrincipal = $("btn-login");

    btnLogin.classList.remove("active");
    btnCadastro.classList.remove("active");

    if (modo === "login") {
        btnLogin.classList.add("active");
    } else {
        btnCadastro.classList.add("active");
    }

    document.querySelectorAll(".campo-cadastro").forEach((campo) => {
        if (modo === "login") {
            campo.classList.add("hidden");
        } else {
            campo.classList.remove("hidden");
        }
    });

    if (modo === "login") {
        $("label-username").textContent = "E-mail";
        $("input-username").placeholder = "Digite seu e-mail";
        botaoPrincipal.textContent = "Entrar";
        botaoPrincipal.setAttribute("data-testid", "btn-login");
    } else {
        $("label-username").textContent = "E-mail";
        $("input-username").placeholder = "Digite seu e-mail";
        botaoPrincipal.textContent = "Cadastrar";
        botaoPrincipal.setAttribute("data-testid", "btn-cadastro");
    }

    limparCampos([
        "input-cadastro-nome",
        "input-username",
        "input-cadastro-cpf",
        "input-password",
        "input-confirmar-password"
    ]);
}

function validarAuth() {
    const modo = $("modo-formulario").value;
    const email = $("input-username").value.trim();
    const password = $("input-password").value.trim();

    removerErros([
        "input-cadastro-nome",
        "input-username",
        "input-cadastro-cpf",
        "input-password",
        "input-confirmar-password"
    ]);

    if (modo === "login") {
        if (email === "") {
            marcarErro("input-username");
            abrirPopup("aviso", "Campo obrigatório", "Informe seu e-mail.");
            return false;
        }

        if (!email.includes("@")) {
            marcarErro("input-username");
            abrirPopup("aviso", "E-mail inválido", "O e-mail precisa conter @.");
            return false;
        }

        if (password === "") {
            marcarErro("input-password");
            abrirPopup("aviso", "Campo obrigatório", "Informe sua senha.");
            return false;
        }

        return true;
    }

    const nome = $("input-cadastro-nome").value.trim();
    const cpf = $("input-cadastro-cpf").value.trim();
    const confirmarSenha = $("input-confirmar-password").value.trim();

    if (nome === "") {
        marcarErro("input-cadastro-nome");
        abrirPopup("aviso", "Nome obrigatório", "Informe seu nome completo.");
        return false;
    }

    if (email === "") {
        marcarErro("input-username");
        abrirPopup("aviso", "E-mail obrigatório", "Informe seu e-mail.");
        return false;
    }

    if (!email.includes("@")) {
        marcarErro("input-username");
        abrirPopup("aviso", "E-mail inválido", "O e-mail precisa conter @.");
        return false;
    }

    if (cpf === "") {
        marcarErro("input-cadastro-cpf");
        abrirPopup("aviso", "CPF obrigatório", "Informe seu CPF.");
        return false;
    }

    if (!validarFormatoCPF(cpf)) {
        marcarErro("input-cadastro-cpf");
        abrirPopup("aviso", "CPF inválido", "Informe o CPF no formato 000.000.000-00.");
        return false;
    }

    if (password === "") {
        marcarErro("input-password");
        abrirPopup("aviso", "Senha obrigatória", "Informe uma senha.");
        return false;
    }

    if (confirmarSenha === "") {
        marcarErro("input-confirmar-password");
        abrirPopup("aviso", "Confirmação obrigatória", "Confirme sua senha.");
        return false;
    }

    if (password !== confirmarSenha) {
        marcarErro("input-password");
        marcarErro("input-confirmar-password");
        abrirPopup("aviso", "Senhas diferentes", "A senha e a confirmação precisam ser iguais.");
        return false;
    }

    return true;
}

async function realizarLogin() {
    if (!validarAuth()) return;

    const dados = {
        username: $("input-username").value.trim(),
        password: $("input-password").value.trim()
    };

    try {
        const resposta = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            let erro = "E-mail ou senha incorretos.";

            try {
                const respostaErro = await resposta.json();

                if (respostaErro.mensagem) {
                    erro = respostaErro.mensagem;
                }
            } catch (e) {}

            throw new Error(erro);
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", dados.username);

        abrirSistema();
    } catch (error) {
        abrirPopup("erro", "Login não realizado", error.message);
    }
}

async function realizarCadastro() {
    if (!validarAuth()) return;

    const dados = {
        nome: $("input-cadastro-nome").value.trim(),
        email: $("input-username").value.trim(),
        cpf: $("input-cadastro-cpf").value.trim(),
        password: $("input-password").value.trim()
    };

    try {
        const resposta = await fetch(`${API_URL}/api/auth/cadastrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            let erro = "Não foi possível cadastrar. Verifique os dados informados.";

            try {
                const respostaErro = await resposta.json();

                if (respostaErro.mensagem) {
                    erro = respostaErro.mensagem;
                }
            } catch (e) {}

            throw new Error(erro);
        }

        abrirPopup("sucesso", "Conta criada", "Cadastro realizado com sucesso. Agora faça login usando seu e-mail.");
        alterarModoAuth("login");

        $("input-username").value = dados.email;
        $("input-password").value = "";
    } catch (error) {
        abrirPopup("erro", "Erro no cadastro", error.message);
    }
}

function verificarSessao() {
    const logado = localStorage.getItem("isLoggedIn") === "true";

    if (logado) {
        abrirSistema();
    }
}

function abrirSistema() {
    esconderElemento("tela-login");
    mostrarElemento("app");

    mostrarTela("dashboard");
    carregarProdutos();
    carregarClientes();
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    mostrarElemento("tela-login");
    esconderElemento("app");

    limparCampos([
        "input-cadastro-nome",
        "input-username",
        "input-cadastro-cpf",
        "input-password",
        "input-confirmar-password"
    ]);

    alterarModoAuth("login");
}

function configurarMenu() {
    $("btn-menu-dashboard").addEventListener("click", () => mostrarTela("dashboard"));
    $("btn-menu-produtos").addEventListener("click", () => mostrarTela("produtos"));
    $("btn-menu-clientes").addEventListener("click", () => mostrarTela("clientes"));
    $("btn-logout").addEventListener("click", logout);
}

function mostrarTela(nomeTela) {
    const telas = ["dashboard", "produtos", "clientes"];

    telas.forEach((tela) => {
        $(`tela-${tela}`).classList.remove("active-screen");
        $(`btn-menu-${tela}`).classList.remove("active");
    });

    $(`tela-${nomeTela}`).classList.add("active-screen");
    $(`btn-menu-${nomeTela}`).classList.add("active");

    if (nomeTela === "produtos") {
        carregarProdutos();
    }

    if (nomeTela === "clientes") {
        carregarClientes();
    }
}

function configurarProdutos() {
    $("btn-novo-produto").addEventListener("click", () => {
        mostrarElemento("form-produto-area");
    });

    $("btn-fechar-form-produto").addEventListener("click", () => {
        esconderElemento("form-produto-area");
        limparCampos([
            "input-produto-nome",
            "input-produto-marca",
            "input-produto-preco",
            "select-produto-categoria"
        ]);
    });

    $("btn-atualizar-produtos").addEventListener("click", carregarProdutos);

    $("form-produto").addEventListener("submit", (event) => {
        event.preventDefault();
        salvarProduto();
    });
}

function validarProduto() {
    const nome = $("input-produto-nome").value.trim();
    const marca = $("input-produto-marca").value.trim();
    const preco = Number($("input-produto-preco").value);
    const categoria = $("select-produto-categoria").value;

    removerErros([
        "input-produto-nome",
        "input-produto-marca",
        "input-produto-preco",
        "select-produto-categoria"
    ]);

    if (nome === "") {
        marcarErro("input-produto-nome");
        abrirPopup("aviso", "Nome obrigatório", "Informe o nome do produto.");
        return false;
    }

    if (marca === "") {
        marcarErro("input-produto-marca");
        abrirPopup("aviso", "Marca obrigatória", "Informe a marca do produto.");
        return false;
    }

    if (!preco || preco <= 0) {
        marcarErro("input-produto-preco");
        abrirPopup("aviso", "Preço inválido", "Informe um preço maior que zero.");
        return false;
    }

    if (!categoria) {
        marcarErro("select-produto-categoria");
        abrirPopup("aviso", "Categoria obrigatória", "Selecione uma categoria para o produto.");
        return false;
    }

    return true;
}

async function salvarProduto() {
    if (!validarProduto()) return;

    const produto = {
        nome: $("input-produto-nome").value.trim(),
        marca: $("input-produto-marca").value.trim(),
        preco: Number($("input-produto-preco").value),
        categoria: $("select-produto-categoria").value
    };

    try {
        const resposta = await fetch(`${API_URL}/api/produtos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível cadastrar o produto.");
        }

        abrirPopup("sucesso", "Produto salvo", "O produto foi cadastrado com sucesso.");

        limparCampos([
            "input-produto-nome",
            "input-produto-marca",
            "input-produto-preco",
            "select-produto-categoria"
        ]);

        esconderElemento("form-produto-area");
        carregarProdutos();
    } catch (error) {
        abrirPopup("erro", "Erro ao salvar", error.message);
    }
}

async function carregarProdutos() {
    try {
        const resposta = await fetch(`${API_URL}/api/produtos`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos");
        }

        produtos = await resposta.json();

        renderizarProdutos();
        atualizarDashboard();
    } catch (error) {
        $("tabela-produtos").innerHTML = `
      <tr>
        <td colspan="6" class="empty">Não foi possível carregar os produtos.</td>
      </tr>
    `;
    }
}

function renderizarProdutos() {
    const tabela = $("tabela-produtos");

    if (!produtos || produtos.length === 0) {
        tabela.innerHTML = `
      <tr>
        <td colspan="6" class="empty">Nenhum produto cadastrado.</td>
      </tr>
    `;
        return;
    }

    tabela.innerHTML = produtos.map((produto) => `
    <tr>
      <td>${produto.id ?? "-"}</td>
      <td>${produto.nome}</td>
      <td>${produto.marca}</td>
      <td><span class="badge">${produto.categoria}</span></td>
      <td>${formatarMoeda(produto.preco)}</td>
      <td>
        <button id="btn-excluir-produto-${produto.id}" data-testid="btn-excluir-produto-${produto.id}" class="btn-danger" type="button" onclick="confirmarExclusaoProduto(${produto.id})">
          Excluir
        </button>
      </td>
    </tr>
  `).join("");
}

function confirmarExclusaoProduto(id) {
    abrirPopup(
        "confirmacao",
        "Excluir produto",
        "Tem certeza que deseja excluir este produto?",
        true,
        () => deletarProduto(id)
    );
}

async function deletarProduto(id) {
    try {
        const resposta = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o produto.");
        }

        abrirPopup("sucesso", "Produto excluído", "O produto foi removido com sucesso.");
        carregarProdutos();
    } catch (error) {
        abrirPopup("erro", "Erro ao excluir", error.message);
    }
}

function configurarClientes() {
    $("btn-novo-cliente").addEventListener("click", () => {
        mostrarElemento("form-cliente-area");
    });

    $("btn-fechar-form-cliente").addEventListener("click", () => {
        esconderElemento("form-cliente-area");
        limparCampos([
            "input-cliente-nome",
            "input-cliente-cpf",
            "input-cliente-email",
            "input-cliente-telefone"
        ]);
    });

    $("btn-atualizar-clientes").addEventListener("click", carregarClientes);

    $("form-cliente").addEventListener("submit", (event) => {
        event.preventDefault();
        salvarCliente();
    });

    $("input-cliente-cpf").addEventListener("input", () => {
        $("input-cliente-cpf").value = aplicarMascaraCPF($("input-cliente-cpf").value);
    });

    $("input-cliente-telefone").addEventListener("input", () => {
        $("input-cliente-telefone").value = aplicarMascaraTelefone($("input-cliente-telefone").value);
    });
}

function validarCliente() {
    const nome = $("input-cliente-nome").value.trim();
    const cpf = $("input-cliente-cpf").value.trim();
    const email = $("input-cliente-email").value.trim();
    const telefone = $("input-cliente-telefone").value.trim();

    removerErros([
        "input-cliente-nome",
        "input-cliente-cpf",
        "input-cliente-email",
        "input-cliente-telefone"
    ]);

    if (nome === "") {
        marcarErro("input-cliente-nome");
        abrirPopup("aviso", "Nome obrigatório", "Informe o nome completo do cliente.");
        return false;
    }

    if (!validarFormatoCPF(cpf)) {
        marcarErro("input-cliente-cpf");
        abrirPopup("aviso", "CPF inválido", "Informe o CPF no formato 000.000.000-00.");
        return false;
    }

    if (email === "" || !email.includes("@")) {
        marcarErro("input-cliente-email");
        abrirPopup("aviso", "E-mail inválido", "O e-mail precisa conter @.");
        return false;
    }

    if (apenasNumeros(telefone).length < 10) {
        marcarErro("input-cliente-telefone");
        abrirPopup("aviso", "Telefone inválido", "Informe um telefone válido.");
        return false;
    }

    return true;
}

async function salvarCliente() {
    if (!validarCliente()) return;

    const cliente = {
        nomeCompleto: $("input-cliente-nome").value.trim(),
        cpf: apenasNumeros($("input-cliente-cpf").value),
        email: $("input-cliente-email").value.trim(),
        telefone: apenasNumeros($("input-cliente-telefone").value)
    };

    try {
        const resposta = await fetch(`${API_URL}/api/clientes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível cadastrar o cliente.");
        }

        abrirPopup("sucesso", "Cliente salvo", "O cliente foi cadastrado com sucesso.");

        limparCampos([
            "input-cliente-nome",
            "input-cliente-cpf",
            "input-cliente-email",
            "input-cliente-telefone"
        ]);

        esconderElemento("form-cliente-area");
        carregarClientes();
    } catch (error) {
        abrirPopup("erro", "Erro ao salvar", error.message);
    }
}

async function carregarClientes() {
    try {
        const resposta = await fetch(`${API_URL}/api/clientes`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar clientes");
        }

        clientes = await resposta.json();

        renderizarClientes();
        atualizarDashboard();
    } catch (error) {
        $("tabela-clientes").innerHTML = `
      <tr>
        <td colspan="6" class="empty">Não foi possível carregar os clientes.</td>
      </tr>
    `;
    }
}

function renderizarClientes() {
    const tabela = $("tabela-clientes");

    if (!clientes || clientes.length === 0) {
        tabela.innerHTML = `
      <tr>
        <td colspan="6" class="empty">Nenhum cliente cadastrado.</td>
      </tr>
    `;
        return;
    }

    tabela.innerHTML = clientes.map((cliente) => `
    <tr>
      <td>${cliente.id ?? "-"}</td>
      <td>${cliente.nomeCompleto}</td>
      <td>${formatarCPF(cliente.cpf)}</td>
      <td>${cliente.email}</td>
      <td>${formatarTelefone(cliente.telefone)}</td>
      <td>
        <button id="btn-excluir-cliente-${cliente.id}" data-testid="btn-excluir-cliente-${cliente.id}" class="btn-danger" type="button" onclick="confirmarExclusaoCliente(${cliente.id})">
          Excluir
        </button>
      </td>
    </tr>
  `).join("");
}

function confirmarExclusaoCliente(id) {
    abrirPopup(
        "confirmacao",
        "Excluir cliente",
        "Tem certeza que deseja excluir este cliente?",
        true,
        () => deletarCliente(id)
    );
}

async function deletarCliente(id) {
    try {
        const resposta = await fetch(`${API_URL}/api/clientes/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o cliente.");
        }

        abrirPopup("sucesso", "Cliente excluído", "O cliente foi removido com sucesso.");
        carregarClientes();
    } catch (error) {
        abrirPopup("erro", "Erro ao excluir", error.message);
    }
}

function atualizarDashboard() {
    $("total-produtos").textContent = produtos.length;
    $("total-clientes").textContent = clientes.length;
}