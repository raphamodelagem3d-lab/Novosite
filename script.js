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
// CONFIGURAÇÃO DO FIREBASE
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
// NAVEGAÇÃO ENTRE TELAS
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
      alert("Não foi possível copiar automaticamente.\n\nSua chave Pix é:\n" + chave);
    });
};
// ==========================================
// MONITORAR LOGIN
// ==========================================
onAuthStateChanged(auth, (usuario) => {
  if (usuario) {
    console.log("Usuário logado:", usuario.email);
    // Usuário está logado → mostra Tela 2
    const tela1 = document.getElementById("tela1");
    const tela2 = document.getElementById("tela2");
    if (tela1 && tela2) {
      tela1.classList.add("escondida");
      tela2.classList.remove("escondida");
    }
  } else {
    console.log("Nenhum usuário logado.");
    // Usuário saiu → volta para Tela 1
    const telas = ["tela2", "tela3", "tela4"];
    telas.forEach((id) => {
      const tela = document.getElementById(id);
      if (tela) {
        tela.classList.add("escondida");
      }
    });
    const tela1 = document.getElementById("tela1");
    if (tela1) {
      tela1.classList.remove("escondida");
    }
  }
});
// ==========================================
// BOTÕES
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------
  // LOGIN
  // ----------------------------------------
  const btnComecar = document.getElementById("btnComecar");
  if (btnComecar) {
    btnComecar.addEventListener("click", async () => {
      const email = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value;
      if (!email || !senha) {
        alert("⚠️ Digite seu e-mail e sua senha.");
        return;
      }
      try {
        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        );
        console.log("Login realizado!");
      } catch (error) {
        console.error(error);
        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
          case "auth/user-not-found":
            alert("❌ E-mail ou senha incorretos.");
            break;
          case "auth/invalid-email":
            alert("❌ Digite um e-mail válido.");
            break;
          case "auth/user-disabled":
            alert("❌ Esta conta foi desativada.");
            break;
          case "auth/too-many-requests":
            alert("⚠️ Muitas tentativas. Tente novamente mais tarde.");
            break;
          default:
            alert("❌ Erro ao entrar:\n" + error.message);
        }
      }
    });
  }
  // ----------------------------------------
  // LOGIN COM GOOGLE
  // ----------------------------------------
  const btnGoogle = document.getElementById("btnGoogle");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", async () => {
      try {
        await signInWithPopup(
          auth,
          googleProvider
        );
        console.log("Login com Google realizado!");
      } catch (error) {
        console.error(error);
        if (error.code === "auth/popup-closed-by-user") {
          return;
        }
        alert(
          "❌ Erro no login com Google:\n" +
          error.message
        );
      }
    });
  }
  // ----------------------------------------
  // LOGOUT
  // ----------------------------------------
  const btnVoltar = document.getElementById("btnVoltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("Logout realizado.");
      } catch (error) {
        console.error(error);
        alert("❌ Não foi possível sair da conta.");
      }
    });
  }
  // ----------------------------------------
  // TELA 2 → TELA 3
  // ----------------------------------------
  const btnTela3 = document.getElementById("btnipmlbb");
  if (btnTela3) {
    btnTela3.addEventListener("click", () => {
      window.trocarTela("tela2", "tela3");
    });
  }
  // ----------------------------------------
  // TELA 3 → TELA 2
  // ----------------------------------------
  const btnVoltarTela3 =
    document.getElementById("btnVoltarTela3");
  if (btnVoltarTela3) {
    btnVoltarTela3.addEventListener("click", () => {
      window.trocarTela("tela3", "tela2");
    });
  }
});