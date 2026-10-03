import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
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
const googleProvider = new GoogleAuthProvider();

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
    console.log("Usuário conectado:", usuario.email);
    const tela1 = document.getElementById('tela1');
    if (tela1 && !tela1.classList.contains('escondida')) {
      window.trocarTela('tela1', 'tela2');
    }
  } else {
    console.log("Nenhum usuário logado.");
    const tela2 = document.getElementById('tela2');
    const tela3 = document.getElementById('tela3');
    const tela4 = document.getElementById('tela4');
    
    if (tela2 && !tela2.classList.contains('escondida')) window.trocarTela('tela2', 'tela1');
    if (tela3 && !tela3.classList.contains('escondida')) window.trocarTela('tela3', 'tela1');
    if (tela4 && !tela4.classList.contains('escondida')) window.trocarTela('tela4', 'tela1');
  }
});

// ==========================================
// FUNÇÃO INTELIGENTE DE AUTENTICAÇÃO (ENTRAR / CRIAR)
// ==========================================
async function autenticarInteligente(email, senha) {
  try {
    // 1. Primeiro tenta fazer o login normalmente
    await signInWithEmailAndPassword(auth, email, senha);
    console.log("Login efetuado com sucesso!");
  } catch (erroLogin) {
    // 2. Se falhar o login, tenta criar a conta automaticamente
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("✨ Conta criada e conectada com sucesso!");
    } catch (erroCadastro) {
      // 3. Se falhar na criação porque a conta JÁ existe, significa que a senha digitada estava errada
      if (erroCadastro.code === 'auth/email-already-in-use') {
        alert("❌ Senha incorreta para este e-mail!");
      } else if (erroCadastro.code === 'auth/weak-password') {
        alert("⚠️ A senha deve ter no mínimo 6 caracteres.");
      } else if (erroCadastro.code === 'auth/invalid-email') {
        alert("⚠️ Digite um endereço de e-mail válido.");
      } else {
        alert("Erro na autenticação: " + erroCadastro.message);
      }
    }
  }
}

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
      userEmail: usuario.email || "Sem e-mail registrado",
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
  const btnGoogle = document.getElementById('btnGoogle');
  const btnEnviarPedido = document.getElementById('btnEnviarPedido');

  // Clique no botão de Login / Cadastro Inteligente
  if (btnAcao) {
    btnAcao.addEventListener('click', () => {
      const email = document.getElementById('usuario')?.value.trim();
      const senha = document.getElementById('senha')?.value.trim();

      if (!email || !senha) {
        alert('Por favor, preencha o e-mail e a senha!');
        return;
      }

      autenticarInteligente(email, senha);
    });
  }

  // Login com Google
  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          console.log("Login com Google bem-sucedido:", result.user);
        })
        .catch((error) => {
          console.error("Erro ao entrar com Google:", error);
          alert("Erro no login com Google: " + error.message);
        });
    });
  }

  // Enviar pedido do Tarot no Firestore (Tela 4)
  if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', salvarPedidoTarot);
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
