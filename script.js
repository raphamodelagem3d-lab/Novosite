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


// ==========================================
// TESTE
// ==========================================

console.log("🔥 SCRIPT.JS CARREGADO!");
console.log("🔥 Firebase inicializado!");
console.log("🔥 Auth inicializado!");


// ==========================================
// TELAS
// ==========================================

window.trocarTela = function(atual, proxima) {

  document.getElementById(atual)?.classList.add("escondida");
  document.getElementById(proxima)?.classList.remove("escondida");

};


// ==========================================
// PIX
// ==========================================

window.copiarPix = function(chave) {

  if (!chave || chave === "SUA_CHAVE_PIX_AQUI") {
    alert("Nenhuma chave Pix configurada!");
    return;
  }

  navigator.clipboard.writeText(chave)
    .then(() => alert("✨ Chave Pix copiada!"))
    .catch(() => alert("Chave Pix: " + chave));

};


// ==========================================
// SESSÃO
// ==========================================

onAuthStateChanged(auth, (user) => {

  console.log(
    "Estado da autenticação:",
    user ? user.email : "deslogado"
  );

  if (user) {

    document.getElementById("tela1")
      ?.classList.add("escondida");

    document.getElementById("tela2")
      ?.classList.remove("escondida");

  } else {

    document.getElementById("tela1")
      ?.classList.remove("escondida");

    document.getElementById("tela2")
      ?.classList.add("escondida");

    document.getElementById("tela3")
      ?.classList.add("escondida");

    document.getElementById("tela4")
      ?.classList.add("escondida");
  }

});


// ==========================================
// QUANDO HTML CARREGAR
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("🔥 DOM CARREGADO!");

  const email = document.getElementById("usuario");
  const senha = document.getElementById("senha");
  const mensagem = document.getElementById("mensagemLogin");

  const btnEntrar = document.getElementById("btnComecar");
  const btnCriar = document.getElementById("btnCriarConta");
  const btnGoogle = document.getElementById("btnGoogle");
  const btnVoltar = document.getElementById("btnVoltar");
  const btnTela3 = document.getElementById("btnipmlbb");
  const btnVoltarTela3 =
    document.getElementById("btnVoltarTela3");


  console.log("btnEntrar:", btnEntrar);
  console.log("btnCriar:", btnCriar);
  console.log("btnGoogle:", btnGoogle);


  function mensagem(texto) {

    if (mensagem) {
      mensagem.textContent = texto;
    }

  }


  // ========================================
  // ENTRAR
  // ========================================

  btnEntrar?.addEventListener("click", async () => {

    console.log("🟢 BOTÃO ENTRAR CLICADO");

    const emailValue = email.value.trim();
    const senhaValue = senha.value;

    if (!emailValue || !senhaValue) {
      mensagem("⚠️ Preencha e-mail e senha.");
      return;
    }

    try {

      mensagem("Entrando...");

      await signInWithEmailAndPassword(
        auth,
        emailValue,
        senhaValue
      );

      mensagem("✅ Login realizado!");

    } catch (error) {

      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {

        mensagem("❌ E-mail ou senha incorretos.");

      } else {

        mensagem("❌ " + error.message);

      }

    }

  });


  // ========================================
  // CRIAR CONTA
  // ========================================

  btnCriar?.addEventListener("click", async () => {

    console.log("🟢 BOTÃO CRIAR CONTA CLICADO");

    const emailValue = email.value.trim();
    const senhaValue = senha.value;

    if (!emailValue) {
      mensagem("⚠️ Digite um e-mail.");
      return;
    }

    if (!senhaValue) {
      mensagem("⚠️ Digite uma senha.");
      return;
    }

    if (senhaValue.length < 6) {
      mensagem("❌ A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {

      mensagem("Criando conta...");

      const resultado =
        await createUserWithEmailAndPassword(
          auth,
          emailValue,
          senhaValue
        );

      console.log(
        "🎉 CONTA CRIADA:",
        resultado.user.email
      );

      mensagem("🎉 Conta criada com sucesso!");

    } catch (error) {

      console.error(error);

      switch (error.code) {

        case "auth/email-already-in-use":
          mensagem("❌ Esse e-mail já está cadastrado.");
          break;

        case "auth/invalid-email":
          mensagem("❌ E-mail inválido.");
          break;

        case "auth/weak-password":
          mensagem("❌ A senha precisa ter pelo menos 6 caracteres.");
          break;

        case "auth/operation-not-allowed":
          mensagem("❌ Ative E-mail/Senha no Firebase Authentication.");
          break;

        default:
          mensagem("❌ " + error.message);
      }

    }

  });


  // ========================================
  // GOOGLE
  // ========================================

  btnGoogle?.addEventListener("click", async () => {

    console.log("🟢 BOTÃO GOOGLE CLICADO");

    try {

      mensagem("Abrindo Google...");

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

      mensagem(
        "❌ Google: " + error.message
      );

    }

  });


  // ========================================
  // LOGOUT
  // ========================================

  btnVoltar?.addEventListener("click", async () => {

    console.log("🟢 LOGOUT");

    await signOut(auth);

  });


  // ========================================
  // TELA 2 → 3
  // ========================================

  btnTela3?.addEventListener("click", () => {

    trocarTela("tela2", "tela3");

  });


  // ========================================
  // TELA 3 → 2
  // ========================================

  btnVoltarTela3?.addEventListener("click", () => {

    trocarTela("tela3", "tela2");

  });

});