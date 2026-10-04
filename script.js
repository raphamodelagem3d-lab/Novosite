import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


// ==========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyA5ON_73pmPWuhxuV8RXqQUtF7-RUiR0DY",
  authDomain: "meu-site-oficial-1e82d.firebaseapp.com",
  databaseURL: "https://meu-site-oficial-1e82d-default-rtdb.firebaseio.com",
  projectId: "meu-site-oficial-1e82d",
  storageBucket: "meu-site-oficial-1e82d.firebasestorage.app",
  messagingSenderId: "999359902580",
  appId: "1:999359902580:web:b2ad304b4ca50d0d6cb221",
  measurementId: "G-PFPPFZR8Y7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Variáveis globais de estado
let pixDoClienteSalvo = null;
let servicoSelecionado = "tarot"; // Guarda se é 'tarot' ou 'video'


// ==========================================
// CARREGAR E SALVAR PIX NO FIREBASE
// ==========================================

async function carregarPixCliente(uid) {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `usuarios/${uid}/pix`));
    
    if (snapshot.exists()) {
      const dados = snapshot.val();
      
      if (typeof dados === 'object' && dados !== null) {
        pixDoClienteSalvo = dados;
        if (document.getElementById("tipoChavePix")) document.getElementById("tipoChavePix").value = dados.tipo || "CPF";
        if (document.getElementById("chavePixCliente")) document.getElementById("chavePixCliente").value = dados.chave || "";
      } else {
        pixDoClienteSalvo = { tipo: "Chave", chave: dados };
        if (document.getElementById("chavePixCliente")) document.getElementById("chavePixCliente").value = dados;
      }
    } else {
      pixDoClienteSalvo = null;
    }
  } catch (error) {
    console.error("Erro ao carregar Pix do usuário:", error);
  }
}

async function salvarPixCliente(tipo, chave) {
  const usuario = auth.currentUser;
  if (!usuario) return alert("Você precisa estar logado!");

  if (!chave || chave.trim() === "") {
    return alert("⚠️ Digite uma chave Pix válida.");
  }

  const objetoPix = {
    tipo: tipo || "CPF",
    chave: chave.trim()
  };

  try {
    await set(ref(db, `usuarios/${usuario.uid}/pix`), objetoPix);
    pixDoClienteSalvo = objetoPix;
    
    alert("✨ Chave Pix vinculada com sucesso! Agora você pode prosseguir com seu pedido.");
    document.getElementById("modalVincularPix")?.classList.add("escondida");
    
  } catch (error) {
    console.error("Erro ao salvar Pix:", error);
    alert("❌ Erro ao salvar chave Pix: " + error.message);
  }
}


// ==========================================
// FUNÇÕES GLOBAIS (EXPOSTAS NO WINDOW PARA HTML)
// ==========================================
// ==========================================
// MODO COMPUTADOR / CELULAR
// ==========================================

function atualizarBotaoModo(ehComputador) {
  const btn = document.getElementById("btnAlternarModo");
  if (!btn) return;

  if (ehComputador) {
    btn.innerHTML = `<i class="fa-solid fa-mobile-screen"></i> <span>Modo Celular</span>`;
  } else {
    btn.innerHTML = `<i class="fa-solid fa-desktop"></i> <span>Modo PC</span>`;
  }
}

window.alternarModoExibicao = function() {
  const body = document.body;
  body.classList.toggle("modo-computador");

  const ehComputador = body.classList.contains("modo-computador");
  localStorage.setItem("modoExibicao", ehComputador ? "computador" : "celular");

  atualizarBotaoModo(ehComputador);
};

// Aplica o modo salvo automaticamente ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const modoSalvo = localStorage.getItem("modoExibicao");
  if (modoSalvo === "computador") {
    document.body.classList.add("modo-computador");
    atualizarBotaoModo(true);
  }
});

window.salvarPixCliente = salvarPixCliente;
window.carregarPixCliente = carregarPixCliente;

window.trocarTela = function(telaAtual, proximaTela) {
  const atual = document.getElementById(telaAtual);
  const proxima = document.getElementById(proximaTela);

  if (!atual || !proxima) {
    console.error("Tela não encontrada.");
    return;
  }

  atual.classList.add("escondida");
  proxima.classList.remove("escondida");
};

window.copiarPix = function(chave) {
  if (!chave || chave === "SUA_CHAVE_PIX_AQUI") {
    alert("Nenhuma chave Pix configurada!");
    return;
  }

  navigator.clipboard.writeText(chave)
    .then(() => alert("✨ Chave Pix copiada com sucesso!"))
    .catch(() => alert("Erro ao copiar.\nSua chave Pix é:\n" + chave));
};

// Bloqueia e valida Pix antes de abrir o modal de pagamento
window.bloquearPorPagamento = function(tipo = "tarot") {
  servicoSelecionado = tipo;

  const chaveValida = typeof pixDoClienteSalvo === 'object' ? pixDoClienteSalvo?.chave : pixDoClienteSalvo;

  if (!chaveValida || chaveValida.trim() === "") {
    alert("⚠️ Para realizar um pedido, você precisa cadastrar sua Chave Pix primeiro!");
    const modalPix = document.getElementById("modalVincularPix");
    if (modalPix) modalPix.classList.remove("escondida");
    return;
  }

  const modalPagamento = document.getElementById("modalPagamento");
  if (modalPagamento) modalPagamento.classList.remove("escondida");
};

// Formata e envia a mensagem para o WhatsApp com base no serviço selecionado
window.confirmarEEnviar = function() {
  const usuarioAtual = auth.currentUser;
  const nomeConta = usuarioAtual ? (usuarioAtual.displayName || usuarioAtual.email) : "Cliente";
  
  let infoPixMsg = "Não cadastrado";
  if (pixDoClienteSalvo) {
    if (typeof pixDoClienteSalvo === 'object' && pixDoClienteSalvo.chave) {
      infoPixMsg = `${pixDoClienteSalvo.tipo || 'Pix'}: ${pixDoClienteSalvo.chave}`;
    } else if (typeof pixDoClienteSalvo === 'string' && pixDoClienteSalvo.trim() !== '') {
      infoPixMsg = pixDoClienteSalvo;
    }
  }

  let mensagem = "";

  if (servicoSelecionado === 'video') {
    const pacote = document.getElementById('tipoEdicaoVideo')?.value || 'Não informado';
    const detalhes = document.getElementById('detalhesVideo')?.value.trim() || 'Não informado';
    
    mensagem = `Olá! Fiz meu Pix e gostaria de confirmar meu pedido de *Edição de Vídeo*. 🎬\n\n` +
               `👤 *Cliente:* ${nomeConta}\n` +
               `📦 *Pacote:* ${pacote}\n` +
               `📝 *Detalhes/Link:* ${detalhes}\n` +
               `🔑 *Pix do Cliente:* ${infoPixMsg}\n\n` +
               `Segue o comprovante do pagamento em anexo!`;
  } else {
    const tipoTiragem = document.getElementById("tipoTiragem")?.value || "Tiragem";
    const pergunta = document.getElementById("perguntaTarot")?.value.trim() || "Não informada";
    
    mensagem = `Olá! Fiz meu Pix e gostaria de confirmar meu pedido de *Tarot*. 🔮\n\n` +
               `👤 *Cliente:* ${nomeConta}\n` +
               `📌 *Serviço:* ${tipoTiragem}\n` +
               `❓ *Pergunta:* ${pergunta}\n` +
               `🔑 *Pix do Cliente:* ${infoPixMsg}\n\n` +
               `Segue o comprovante do pagamento em anexo!`;
  }

  const linkWhatsapp = `https://wa.me/5511969055944?text=${encodeURIComponent(mensagem)}`;
  window.open(linkWhatsapp, "_blank");

  if (typeof window.desbloquearTela === "function") {
    window.desbloquearTela();
  }
};

window.fecharModal = function(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.add("escondida");
  }
};


// ==========================================
// MONITOR DE AUTENTICAÇÃO (SESSÃO)
// ==========================================

onAuthStateChanged(auth, async (usuario) => {
  if (usuario) {
    console.log("Usuário logado:", usuario.email);

    await carregarPixCliente(usuario.uid);

    const nomeExibicao = document.getElementById("nomeExibicao");
    const avatarBolinha = document.getElementById("avatarBolinha");
    const nomeFinal = usuario.displayName || usuario.email.split('@')[0];
    
    if (nomeExibicao) nomeExibicao.innerText = nomeFinal;

    if (avatarBolinha) {
      if (usuario.photoURL) {
        avatarBolinha.style.backgroundImage = `url('${usuario.photoURL}')`;
        avatarBolinha.innerText = "";
      } else {
        avatarBolinha.style.backgroundImage = "none";
        avatarBolinha.innerText = nomeFinal.charAt(0).toUpperCase();
      }
    }

    document.getElementById("tela1")?.classList.add("escondida");
    document.getElementById("tela2")?.classList.remove("escondida");

  } else {
    pixDoClienteSalvo = null;
    document.getElementById("tela1")?.classList.remove("escondida");
    document.getElementById("tela2")?.classList.add("escondida");
    document.getElementById("tela3")?.classList.add("escondida");
    document.getElementById("tela4")?.classList.add("escondida");
  }
});


// ==========================================
// INICIALIZAÇÃO DE EVENTOS DOS BOTÕES
// ==========================================

function inicializarBotoes() {

  // 1. Entrar (Email/Senha)
  document.getElementById("btnEntrar")?.addEventListener("click", async () => {
    const email = document.getElementById("usuario")?.value.trim();
    const senha = document.getElementById("senha")?.value;

    if (!email || !senha) return alert("⚠️ Digite seu e-mail e sua senha para entrar.");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("Login realizado com sucesso!");
    } catch (error) {
      console.error(error);
      if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(error.code)) {
        alert("❌ E-mail ou senha incorretos.");
      } else if (error.code === "auth/invalid-email") {
        alert("❌ Digite um e-mail válido.");
      } else {
        alert("❌ Erro ao entrar:\n" + error.message);
      }
    }
  });

  // 2. Criar Conta (Email/Senha)
  document.getElementById("btnCriarConta")?.addEventListener("click", async () => {
    const email = document.getElementById("usuario")?.value.trim();
    const senha = document.getElementById("senha")?.value;

    if (!email || !senha) return alert("⚠️ Digite um e-mail e uma senha para criar sua conta.");

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("✨ Conta criada e logada com sucesso!");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        alert("❌ Esse e-mail já está cadastrado! Clique em 'Entrar'.");
      } else if (error.code === 'auth/weak-password') {
        alert("❌ A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.");
      } else if (error.code === 'auth/invalid-email') {
        alert("❌ Digite um e-mail válido.");
      } else {
        alert("❌ Erro ao criar conta:\n" + error.message);
      }
    }
  });

  // 3. Sair (Logout)
  document.getElementById("btnSair")?.addEventListener("click", async () => {
    const confirmar = confirm("Tem certeza que deseja sair da sua conta?");
    if (!confirmar) return;

    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso!");
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("❌ Erro ao encerrar sessão: " + error.message);
    }
  });

  // 4. Login com Google
  document.getElementById("btnGoogle")?.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      alert(`✨ Bem-vindo(a), ${result.user.displayName || result.user.email}!`);
    } catch (error) {
      console.error("Erro no Google Login:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        alert("❌ Erro ao entrar com o Google:\n" + error.message);
      }
    }
  });

  // 5. Editar Nome
  document.getElementById("btnEditarNome")?.addEventListener("click", async () => {
    const usuarioAtual = auth.currentUser;
    if (!usuarioAtual) return alert("Você precisa estar logado!");

    const novoNome = prompt("Digite seu nome de exibição:", usuarioAtual.displayName || "");

    if (novoNome && novoNome.trim() !== "") {
      try {
        await updateProfile(usuarioAtual, { displayName: novoNome.trim() });
        const elNome = document.getElementById("nomeExibicao");
        if (elNome) elNome.innerText = novoNome.trim();
        
        const avatar = document.getElementById("avatarBolinha");
        if (avatar && !usuarioAtual.photoURL) {
          avatar.innerText = novoNome.trim().charAt(0).toUpperCase();
        }
        alert("✨ Nome alterado com sucesso!");
      } catch (erro) {
        alert("Erro ao atualizar nome: " + erro.message);
      }
    }
  });

  // 6. Salvar Chave Pix no Modal
  document.getElementById("btnSalvarPixCliente")?.addEventListener("click", () => {
    const tipo = document.getElementById("tipoChavePix")?.value;
    const chave = document.getElementById("chavePixCliente")?.value;
    salvarPixCliente(tipo, chave);
  });

  // 7. Navegação de Telas
  document.getElementById("btnipmlbb")?.addEventListener("click", () => window.trocarTela("tela2", "tela3"));
  document.getElementById("btnVoltarTela3")?.addEventListener("click", () => window.trocarTela("tela3", "tela2"));

}

// Garante a execução mesmo que o HTML já esteja carregado antes do módulo terminar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarBotoes);
} else {
  inicializarBotoes();
}
