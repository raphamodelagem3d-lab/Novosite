import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração oficial do seu Firebase (meu-site-oficial-1e82d)
const firebaseConfig = {
  apiKey: "AIzaSyA5ON_73pmPWuhxuV8RXqQUtF7-RUiR0DY",
  authDomain: "meu-site-oficial-1e82d.firebaseapp.com",
  databaseURL: "https://meu-site-oficial-1e82d-default-rtdb.firebaseio.com",
  projectId: "meu-site-oficial-1e82d",
  storageBucket: "meu-site-oficial-1e82d.firebasestorage.app",
  messagingSenderId: "999359902580",
  appId: "1:999359902580:web:ab2950db66fa76146cb221",
  measurementId: "G-1MDQVL5TH3"
};

// Inicializações do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let modoCadastro = false;

// ==========================================
// FUNÇÕES GLOBAIS DE NAVEGAÇÃO E UTILITÁRIOS
// ==========================================
window.trocarTela = function(telaAtual, proximaTela) {
  const atual = document.getElementById(telaAtual);
  const proxima = document.getElementById(proximaTela);

  if (atual && proxima) {
    atual.classList.add('escondida');
    proxima.classList.remove('escondida');
  } else {
    console.warn(`Navegação falhou: verifique se id="${telaAtual}" e id="${proximaTela}" existem no seu HTML.`);
  }
};

window.copiarPix = function(chave) {
  if (!chave || chave === 'SUA_CHAVE_PIX_AQUI') {
    alert('Configure sua chave Pix no código HTML!');
    return;
  }

  navigator.clipboard.writeText(chave).then(() => {
    alert('✨ Chave Pix copiada com sucesso!');
  }).catch(() => {
    alert('Chave Pix: ' + chave);
  });
};

// ==========================================
// OUVINTE DE SESSÃO (MANTÉM LOGADO AO RECARREGAR)
// ==========================================
onAuthStateChanged(auth, (usuario) => {
  if (usuario) {
    console.log("Usuário logado:", usuario.email);
    const tela1 = document.getElementById('tela1');
    if (tela1 && !tela1.classList.contains('escondida')) {
      window.trocarTela('tela1', 'tela2');
    }
  } else {
    console.log("Nenhum usuário logado.");
    window.trocarTela('tela2', 'tela1');
    window.trocarTela('tela3', 'tela1');
    window.trocarTela('tela4', 'tela1');
  }
});

// ==========================================
// FUNÇÃO PARA SALVAR O PEDIDO NO FIRESTORE
// ==========================================
async function salvarPedidoTarot() {
  const usuario = auth.currentUser;

  if (!usuario) {
    alert("Você precisa estar logado para fazer um pedido!");
    return;
  }

  const tipo = document.getElementById('tipoTiragem')?.value;
  const pergunta = document.getElementById('perguntaTarot')?.value.trim();

  if (!pergunta) {
    alert("Por favor, escreva a sua pergunta ou tema da tiragem!");
    return;
  }

  try {
    await addDoc(collection(db, "pedidos_tarot"), {
      userId: usuario.uid,
      userEmail: usuario.email,
      tipoTiragem: tipo,
      pergunta: pergunta,
      status: "pendente",
      criadoEm: serverTimestamp()
    });

    alert("✨ Pedido gravado no banco de dados! Agora faça o Pix e confirme pelo WhatsApp.");
    document.getElementById('perguntaTarot').value = '';
  } catch (erro) {
    console.error("Erro ao salvar no Firestore:", erro);
    alert("Erro ao registrar pedido: " + erro.message);
  }
}

// ==========================================
// EVENTOS DOS BOTÕES E NAVEGAÇÃO COMPLETA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const btnAcao = document.getElementById('btnAcao');
  const linkAlternar = document.getElementById('linkAlternar');
  const tituloLogin = document.getElementById('tituloLogin');
  const subtituloLogin = document.getElementById('subtituloLogin');
  const textoAlternar = document.getElementById('textoAlternar');
  const btnEnviarPedido = document.getElementById('btnEnviarPedido');

  // Enviar pedido do Tarot no Firestore (Tela 4)
  if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', salvarPedidoTarot);
  }

  // Alternar entre Login e Cadastro
  if (linkAlternar) {
    linkAlternar.addEventListener('click', (e) => {
      e.preventDefault();
      modoCadastro = !modoCadastro;

      if (modoCadastro) {
        if (tituloLogin) tituloLogin.textContent = "Criar Conta";
        if (subtituloLogin) subtituloLogin.textContent = "Crie uma conta para acessar a loja";
        if (btnAcao) btnAcao.textContent = "Cadastrar";
        if (textoAlternar) textoAlternar.textContent = "Já tem uma conta?";
        linkAlternar.textContent = "Entrar";
      } else {
        if (tituloLogin) tituloLogin.textContent = "Acessar Conta";
        if (subtituloLogin) subtituloLogin.textContent = "Digite seus dados para começar";
        if (btnAcao) btnAcao.textContent = "Entrar";
        if (textoAlternar) textoAlternar.textContent = "Não tem uma conta?";
        linkAlternar.textContent = "Cadastrar-se";
      }
    });
  }

  // Autenticação (Login / Cadastro)
  if (btnAcao) {
    btnAcao.addEventListener('click', () => {
      const email = document.getElementById('usuario')?.value.trim();
      const senha = document.getElementById('senha')?.value.trim();

      if (!email || !senha) {
        alert('Por favor, preencha o e-mail e a senha!');
        return;
      }

      if (modoCadastro) {
        createUserWithEmailAndPassword(auth, email, senha)
          .catch((error) => alert('Erro no cadastro: ' + error.message));
      } else {
        signInWithEmailAndPassword(auth, email, senha)
          .catch((error) => alert('Erro no login: ' + error.message));
      }
    });
  }

  // ==========================================
  // NAVEGAÇÃO COMPLETA E LOGOUT (TELAS 1 A 4)
  // ==========================================

  // Tela 2 -> Sair da conta (Logout)
  document.getElementById('btnVoltar')?.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert("Sessão encerrada com sucesso.");
    }).catch((error) => alert("Erro ao sair: " + error.message));
  });

  // Tela 2 -> Tela 3
  document.getElementById('btnipmlbb')?.addEventListener('click', () => {
    window.trocarTela('tela2', 'tela3');
  });

  // Tela 3 -> Tela 2 (Voltar)
  document.getElementById('btnVoltarTela3')?.addEventListener('click', () => {
    window.trocarTela('tela3', 'tela2');
  });

  // Tela 3 -> Tela 4 (Ir para a Loja de Tarot)
  document.getElementById('btnIrTela4')?.addEventListener('click', () => {
    window.trocarTela('tela3', 'tela4');
  });

  // Tela 4 -> Tela 3 (Voltar)
  document.getElementById('btnVoltarTela4')?.addEventListener('click', () => {
    window.trocarTela('tela4', 'tela3');
  });
});
