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
    console.error("Tela não encontrada:", telaAtual, proximaTela);
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
// SESSÃO DO FIREBASE
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

document.addEventListener("DOMContentLoaded", () => {

  const emailInput = document.getElementById("usuario");
  const senhaInput = document.getElementById("senha");
  const mensagem = document.getElementById("mensagemLogin");

  const btnEntrar = document.getElementById("btnComecar");
  const btnCriarConta = document.getElementById("btnCriarConta");
  const btnGoogle = document.getElementById("btnGoogle");

  const btnVoltar = document.getElementById("btnVoltar");
  const btnTela3 = document.getElementById("btnipmlbb");
  const btnVoltarTela3 = document.getElementById("btnVoltarTela3");


  // ========================================
  // FUNÇÃO DE MENSAGEM
  // ========================================

  function mostrarMensagem(texto, tipo = "erro") {

    if (!mensagem) return;

    mensagem.textContent = texto;
    mensagem.className = tipo;
  }


  // ========================================
  // ENTRAR COM E-MAIL E SENHA
  // ========================================

  if (btnEntrar) {

    btnEntrar.addEventListener("click", async () => {

      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      if (!email || !senha) {

        mostrarMensagem(
          "⚠️ Preencha o e-mail e a senha."
        );

        return;
      }

      try {

        mostrarMensagem(
          "Entrando...",
          "carregando"
        );

        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        );

        mostrarMensagem(
          "✅ Login realizado!",
          "sucesso"
        );

      } catch (error) {

        console.error("Erro no login:", error);

        switch (error.code) {

          case "auth/invalid-credential":
          case "auth/wrong-password":
          case "auth/user-not-found":

            mostrarMensagem(
              "❌ E-mail ou senha incorretos."
            );

            break;

          case "auth/invalid-email":

            mostrarMensagem(
              "❌ Digite um e-mail válido."
            );

            break;

          case "auth/too-many-requests":

            mostrarMensagem(
              "⚠️ Muitas tentativas. Tente novamente mais tarde."
            );

            break;

          default:

            mostrarMensagem(
              "❌ Erro ao entrar: " + error.message
            );
        }
      }

    });
  }


  // ========================================
  // CRIAR CONTA
  // ========================================

  if (btnCriarConta) {

    btnCriarConta.addEventListener("click", async () => {

      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      if (!email) {

        mostrarMensagem(
          "⚠️ Digite seu e-mail."
        );

        return;
      }

      if (!email.includes("@")) {

        mostrarMensagem(
          "❌ Digite um e-mail válido."
        );

        return;
      }

      if (!senha) {

        mostrarMensagem(
          "⚠️ Digite uma senha."
        );

        return;
      }

      if (senha.length < 6) {

        mostrarMensagem(
          "❌ A senha precisa ter pelo menos 6 caracteres."
        );

        return;
      }


      try {

        mostrarMensagem(
          "Criando sua conta...",
          "carregando"
        );

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

        mostrarMensagem(
          "🎉 Conta criada com sucesso!",
          "sucesso"
        );

        // O Firebase já deixa o usuário logado.
        // onAuthStateChanged vai levar para a Tela 2.

      } catch (error) {

        console.error(
          "Erro ao criar conta:",
          error
        );

        switch (error.code) {

          case "auth/email-already-in-use":

            mostrarMensagem(
              "❌ Esse e-mail já possui uma conta."
            );

            break;

          case "auth/invalid-email":

            mostrarMensagem(
              "❌ Esse e-mail não é válido."
            );

            break;

          case "auth/weak-password":

            mostrarMensagem(
              "❌ A senha precisa ter pelo menos 6 caracteres."
            );

            break;

          case "auth/operation-not-allowed":

            mostrarMensagem(
              "❌ Ative E-mail/senha no Firebase Authentication."
            );

            break;

          default:

            mostrarMensagem(
              "❌ Erro ao criar conta: " +
              error.message
            );
        }
      }

    });
  }


  // ========================================
  // ENTRAR COM GOOGLE
  // ========================================

  if (btnGoogle) {

    btnGoogle.addEventListener("click", async () => {

      try {

        mostrarMensagem(
          "Abrindo o Google...",
          "carregando"
        );

        const resultado =
          await signInWithPopup(
            auth,
            googleProvider
          );

        console.log(
          "Google conectado:",
          resultado.user.email
        );

        mostrarMensagem(
          "✅ Login com Google realizado!",
          "sucesso"
        );

      } catch (error) {

        console.error(
          "Erro no Google:",
          error
        );

        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {

          mostrarMensagem(
            "Login cancelado."
          );

          return;
        }

        if (
          error.code ===
          "auth/popup-blocked"
        ) {

          mostrarMensagem(
            "⚠️ O navegador bloqueou a janela do Google."
          );

          return;
        }

        if (
          error.code ===
          "auth/unauthorized-domain"
        ) {

          mostrarMensagem(
            "❌ Este domínio não está autorizado no Firebase."
          );

          return;
        }

        mostrarMensagem(
          "❌ Erro no Google: " +
          error.message
        );
      }

    });
  }


  // ========================================
  // SAIR DA CONTA
  // ========================================

  if (btnVoltar) {

    btnVoltar.addEventListener("click", async () => {

      try {

        await signOut(auth);

        console.log("Logout realizado.");

      } catch (error) {

        console.error(
          "Erro ao sair:",
          error
        );

        alert(
          "❌ Não foi possível sair da conta."
        );
      }

    });
  }


  // ========================================
  // TELA 2 → TELA 3
  // ========================================

  if (btnTela3) {

    btnTela3.addEventListener("click", () => {

      trocarTela(
        "tela2",
        "tela3"
      );

    });
  }


  // ========================================
  // TELA 3 → TELA 2
  // ========================================

  if (btnVoltarTela3) {

    btnVoltarTela3.addEventListener("click", () => {

      trocarTela(
        "tela3",
        "tela2"
      );

    });
  }

});