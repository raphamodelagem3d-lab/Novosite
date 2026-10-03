import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializações
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let modoCadastro = false;

// ==========================================
// FUNÇÃO PARA SALVAR O PEDIDO NO FIRESTORE
// ==========================================
async function salvarPedidoTarot() {
  const usuario = auth.currentUser;

  if (!usuario) {
    alert("Você precisa estar logado para fazer um pedido!");
    return;
  }

  const tipo = document.getElementById('tipoTiragem').value;
  const pergunta = document.getElementById('perguntaTarot').value.trim();

  if (!pergunta) {
    alert("Por favor, escreva a sua pergunta ou tema da tiragem!");
    return;
  }

  try {
    // Cria um documento na coleção 'pedidos_tarot'
    const docRef = await addDoc(collection(db, "pedidos_tarot"), {
      userId: usuario.uid,
      userEmail: usuario.email,
      tipoTiragem: tipo,
      pergunta: pergunta,
      status: "pendente",
      criadoEm: serverTimestamp()
    });

    alert("✨ Pedido gravado no banco de dados! Agora faça o Pix e confirme pelo WhatsApp.");
    document.getElementById('perguntaTarot').value = ''; // Limpa o campo
  } catch (erro) {
    console.error("Erro ao salvar no Firestore:", erro);
    alert("Erro ao registrar pedido: " + erro.message);
  }
}

// Funções globais de navegação
window.trocarTela = function(telaAtual, proximaTela) {
  const atual = document.getElementById(telaAtual);
  const proxima = document.getElementById(proximaTela);

  if (atual && proxima) {
    atual.classList.add('escondida');
    proxima.classList.remove('escondida');
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
// EVENTOS DOS BOTÕES
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const btnAcao = document.getElementById('btnAcao');
  const linkAlternar = document.getElementById('linkAlternar');
  const tituloLogin = document.getElementById('tituloLogin');
  const subtituloLogin = document.getElementById('subtituloLogin');
  const textoAlternar = document.getElementById('textoAlternar');
  const btnEnviarPedido = document.getElementById('btnEnviarPedido');

  // Evento do botão de enviar pedido do Tarot
  if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', salvarPedidoTarot);
  }

  // Alternar entre Login e Cadastro
  if (linkAlternar) {
    linkAlternar.addEventListener('click', (e) => {
      e.preventDefault();
      modoCadastro = !modoCadastro;

      if (modoCadastro) {
        tituloLogin.textContent = "Criar Conta";
        subtituloLogin.textContent = "Crie uma conta para acessar a loja";
        btnAcao.textContent = "Cadastrar";
        textoAlternar.textContent = "Já tem uma conta?";
        linkAlternar.textContent = "Entrar";
      } else {
        tituloLogin.textContent = "Acessar Conta";
        subtituloLogin.textContent = "Digite seus dados para começar";
        btnAcao.textContent = "Entrar";
        textoAlternar.textContent = "Não tem uma conta?";
        linkAlternar.textContent = "Cadastrar-se";
      }
    });
  }

  // Autenticação (Login / Cadastro)
  if (btnAcao) {
    btnAcao.addEventListener('click', () => {
      const email = document.getElementById('usuario').value.trim();
      const senha = document.getElementById('senha').value.trim();

      if (!email || !senha) {
        alert('Por favor, preencha o e-mail e a senha!');
        return;
      }

      if (modoCadastro) {
        createUserWithEmailAndPassword(auth, email, senha)
          .then(() => {
            alert('✨ Conta criada na nuvem com sucesso!');
            window.trocarTela('tela1', 'tela2');
          })
          .catch((error) => alert('Erro: ' + error.message));
      } else {
        signInWithEmailAndPassword(auth, email, senha)
          .then(() => {
            alert('Bem-vindo(a)!');
            window.trocarTela('tela1', 'tela2');
          })
          .catch((error) => alert('Erro no login: ' + error.message));
      }
    });
  }

  document.getElementById('btnVoltar')?.addEventListener('click', () => window.trocarTela('tela2', 'tela1'));
  document.getElementById('btnipmlbb')?.addEventListener('click', () => window.trocarTela('tela2', 'tela3'));
  document.getElementById('btnVoltarTela3')?.addEventListener('click', () => window.trocarTela('tela3', 'tela2'));
});
