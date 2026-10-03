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

document.addEventListener("DOMContentLoaded", () => {


  // ========================================
  // LOGIN COM E-MAIL E SENHA
  // ========================================

  // ========================================
  // 1. BOTÃO DE ENTRAR (LOGIN)
  // ========================================
  const btnEntrar = document.getElementById("btnEntrar");

  if (btnEntrar) {
    btnEntrar.addEventListener("click", async () => {
      const email = document.getElementById("usuario")?.value.trim();
      const senha = document.getElementById("senha")?.value;

      if (!email || !senha) {
        alert("⚠️ Digite seu e-mail e sua senha para entrar.");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, senha);
        console.log("Login realizado com sucesso!");

      } catch (error) {
        console.error(error);
        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          alert("❌ E-mail ou senha incorretos.");
        } else if (error.code === "auth/invalid-email") {
          alert("❌ Digite um e-mail válido.");
        } else {
          alert("❌ Erro ao entrar:\n" + error.message);
        }
      }
    });
  }

  // ========================================
  // 2. BOTÃO DE CRIAR CONTA (REGISTRO)
  // ========================================
  const btnCriarConta = document.getElementById("btnCriarConta");

  if (btnCriarConta) {
    btnCriarConta.addEventListener("click", async () => {
      const email = document.getElementById("usuario")?.value.trim();
      const senha = document.getElementById("senha")?.value;

      if (!email || !senha) {
        alert("⚠️ Digite um e-mail e uma senha para criar sua conta.");
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, senha);
        alert("✨ Conta criada e logada com sucesso!");
        console.log("Conta criada com sucesso!");

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
  }

  // ========================================
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