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

console.log("🔥 SCRIPT.JS CARREGADO!");
console.log("🔥 FIREBASE INICIALIZADO!");


/* =========================
   TROCAR TELAS
========================= */

window.trocarTela = function(atual, proxima) {

  const telaAtual = document.getElementById(atual);
  const telaProxima = document.getElementById(proxima);

  if (telaAtual) {
    telaAtual.classList.add("escondida");
  }

  if (telaProxima) {
    telaProxima.classList.remove("escondida");
  }
};


/* =========================
   PIX
========================= */

window.copiarPix = function(chave) {

  if (!chave || chave === "SUA_CHAVE_PIX_AQUI") {
    alert("Nenhuma chave Pix configurada!");
    return;
  }

  navigator.clipboard.writeText(chave)
    .then(() => {
      alert("✨ Chave Pix copiada!");
    })
    .catch(() => {
      alert("Chave Pix: " + chave);
    });

};


/* =========================
   ESTADO DO LOGIN
========================= */

onAuthStateChanged(auth, (user) => {

  console.log(
    "Estado da autenticação:",
    user ? user.email : "deslogado"
  );

  if (user) {

    document.getElementById("tela1")?.classList.add("escondida");
    document.getElementById("tela2")?.classList.remove("escondida");

  } else {

    document.getElementById("tela1")?.classList.remove("escondida");
    document.getElementById("tela2")?.classList.add("escondida");
    document.getElementById("tela3")?.classList.add("escondida");
    document.getElementById("tela4")?.classList.add("escondida");

  }

});


/* =========================
   BOTÕES
========================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log("🔥 DOM CARREGADO!");

  const emailInput = document.getElementById("usuario");
  const senhaInput = document.getElementById("senha");

  const mensagemEl = document.getElementById("mensagemLogin");

  const btnEntrar = document.getElementById("btnComecar");
  const btnCriar = document.getElementById("btnCriarConta");
  const btnGoogle = document.getElementById("btnGoogle");

  const btnVoltar = document.getElementById("btnVoltar");
  const btnTela3 = document.getElementById("btnipmlbb");
  const btnVoltarTela3 = document.getElementById("btnVoltarTela3");


  console.log("Botão Entrar:", btnEntrar);
  console.log("Botão Criar:", btnCriar);
  console.log("Botão Google:", btnGoogle);


  function mostrarMensagem(texto) {

    if (mensagemEl) {
      mensagemEl.textContent = texto;
    }

  }


  /* =========================
     ENTRAR
  ========================= */

  btnEntrar?.addEventListener("click", async () => {

    console.log("🟢 BOTÃO ENTRAR CLICADO");

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {

      mostrarMensagem("⚠️ Preencha o e-mail e a senha.");

      return;
    }

    try {

      mostrarMensagem("Entrando...");

      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      mostrarMensagem("✅ Login realizado!");

    } catch (error) {

      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {

        mostrarMensagem("❌ E-mail ou senha incorretos.");

      } else {

        mostrarMensagem("❌ " + error.message);

      }

    }

  });


  /* =========================
     CRIAR CONTA
  ========================= */

  btnCriar?.addEventListener("click", async () => {

    console.log("🟢 BOTÃO CRIAR CONTA CLICADO");

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email) {

      mostrarMensagem("⚠️ Digite um e-mail.");

      return;
    }

    if (!senha) {

      mostrarMensagem("⚠️ Digite uma senha.");

      return;
    }

    if (senha.length < 6) {

      mostrarMensagem(
        "❌ A senha precisa ter pelo menos 6 caracteres."
      );

      return;
    }


    try {

      mostrarMensagem("Criando conta...");

      const resultado =
        await createUserWithEmailAndPassword(
          auth,
          email,
          senha
        );

      console.log(
        "🎉 CONTA CRIADA:",
        resultado.user.email
      );

      mostrarMensagem(
        "🎉 Conta criada com sucesso!"
      );

    } catch (error) {

      console.error(error);

      switch (error.code) {

        case "auth/email-already-in-use":

          mostrarMensagem(
            "❌ Esse e-mail já está cadastrado."
          );

          break;


        case "auth/invalid-email":

          mostrarMensagem(
            "❌ E-mail inválido."
          );

          break;


        case "auth/weak-password":

          mostrarMensagem(
            "❌ A senha precisa ter pelo menos 6 caracteres."
          );

          break;


        case "auth/operation-not-allowed":

          mostrarMensagem(
            "❌ Ative E-mail/Senha no Firebase Authentication."
          );

          break;


        default:

          mostrarMensagem(
            "❌ " + error.message
          );

      }

    }

  });


  /* =========================
     GOOGLE
  ========================= */

  btnGoogle?.addEventListener("click", async () => {

    console.log("🟢 BOTÃO GOOGLE CLICADO");

    try {

      mostrarMensagem("Abrindo Google...");

      const resultado =
        await signInWithPopup(
          auth,
          googleProvider
        );

      console.log(
        "🎉 GOOGLE:",
        resultado.user.email
      );

    } catch (error) {

      console.error(error);

      mostrarMensagem(
        "❌ Google: " + error.message
      );

    }

  });


  /* =========================
     VOLTAR / LOGOUT
  ========================= */

  btnVoltar?.addEventListener("click", async () => {

    console.log("🟢 LOGOUT");

    await signOut(auth);

  });


  /* =========================
     TELA 3
  ========================= */

  btnTela3?.addEventListener("click", () => {

    trocarTela("tela2", "tela3");

  });


  /* =========================
     VOLTAR PARA TELA 2
  ========================= */

  btnVoltarTela3?.addEventListener("click", () => {

    trocarTela("tela3", "tela2");

  });

});