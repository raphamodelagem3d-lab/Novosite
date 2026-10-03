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


// ==========================================
// FIREBASE
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
const googleProvider = new GoogleAuthProvider();


// ==========================================
// TROCAR TELAS
// ==========================================

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


// ==========================================
// COPIAR PIX
// ==========================================

window.copiarPix = function(chave) {

  if (!chave || chave === "SUA_CHAVE_PIX_AQUI") {
    alert("Nenhuma chave Pix configurada!");
    return;
  }

  navigator.clipboard.writeText(chave)
    .then(() => {
      alert("✨ Chave Pix copiada com sucesso!");
    })
    .catch(() => {
      alert("Erro ao copiar.\nSua chave Pix é:\n" + chave);
    });
};


// ==========================================
// VERIFICAR SESSÃO
// ==========================================

onAuthStateChanged(auth, (usuario) => {

  if (usuario) {

    console.log("Usuário logado:", usuario.email);

    document.getElementById("tela1")?.classList.add("escondida");
    document.getElementById("tela2")?.classList.remove("escondida");

  } else {

    console.log("Usuário deslogado.");

    document.getElementById("tela1")?.classList.remove("escondida");
    document.getElementById("tela2")?.classList.add("escondida");
    document.getElementById("tela3")?.classList.add("escondida");
    document.getElementById("tela4")?.classList.add("escondida");
  }

});


// ==========================================
// BOTÕES
// ==========================================
const btnCriarConta = document.getElementById("btnCriarConta");

if (btnCriarConta) {

  btnCriarConta.addEventListener("click", async () => {

    const email = document
      .getElementById("usuario")
      .value
      .trim();

    const senha = document
      .getElementById("senha")
      .value;

    const mensagem = document.getElementById("mensagemLogin");


    // ================================
    // VERIFICAR E-MAIL
    // ================================

    if (!email) {
      mensagem.textContent = "⚠️ Digite seu e-mail.";
      mensagem.className = "erro";
      return;
    }

    if (!email.includes("@")) {
      mensagem.textContent = "❌ Digite um e-mail válido.";
      mensagem.className = "erro";
      return;
    }


    // ================================
    // VERIFICAR SENHA
    // ================================

    if (!senha) {
      mensagem.textContent = "⚠️ Digite uma senha.";
      mensagem.className = "erro";
      return;
    }

    if (senha.length < 6) {
      mensagem.textContent =
        "❌ A senha precisa ter pelo menos 6 caracteres.";

      mensagem.className = "erro";
      return;
    }


    // ================================
    // CRIAR CONTA NO FIREBASE
    // ================================

    try {

      mensagem.textContent = "Criando sua conta...";
      mensagem.className = "carregando";

      const resultado =
        await createUserWithEmailAndPassword(
          auth,
          email,
          senha
        );

      console.log(
        "Nova conta criada:",
        resultado.user.email
      );


      mensagem.textContent =
        "🎉 Conta criada com sucesso!";

      mensagem.className = "sucesso";


      // O Firebase já deixa o usuário
      // automaticamente conectado.
      //
      // Portanto o onAuthStateChanged()
      // vai detectar o login e mandar
      // para a Tela 2.


    } catch (error) {

      console.error(
        "Erro ao criar conta:",
        error
      );


      // ================================
      // TRATAMENTO DOS ERROS
      // ================================

      switch (error.code) {

        case "auth/email-already-in-use":

          mensagem.textContent =
            "❌ Esse e-mail já possui uma conta.";

          break;


        case "auth/invalid-email":

          mensagem.textContent =
            "❌ Esse e-mail não é válido.";

          break;


        case "auth/weak-password":

          mensagem.textContent =
            "❌ A senha precisa ter pelo menos 6 caracteres.";

          break;


        case "auth/operation-not-allowed":

          mensagem.textContent =
            "❌ O login por e-mail e senha não está ativado no Firebase.";

          break;


        default:

          mensagem.textContent =
            "❌ Erro ao criar conta: " +
            error.message;

      }

      mensagem.className = "erro";

    }

  });

}  // ========================================
  // TELA 2 → TELA 3
  // ========================================

  document.getElementById("btnipmlbb")?.addEventListener(
    "click",
    () => {
      trocarTela("tela2", "tela3");
    }
  );


  // ========================================
  // TELA 3 → TELA 2
  // ========================================

  document.getElementById("btnVoltarTela3")?.addEventListener(
    "click",
    () => {
      trocarTela("tela3", "tela2");
    }
  );

});