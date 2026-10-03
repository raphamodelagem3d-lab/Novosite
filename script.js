import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut 
  updateProfile //
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

    // Atualiza a Bolinha de Perfil e o Nome na tela
    const nomeExibicao = document.getElementById("nomeExibicao");
    const avatarBolinha = document.getElementById("avatarBolinha");

    const nomeFinal = usuario.displayName || usuario.email.split('@')[0];
    
    if (nomeExibicao) nomeExibicao.innerText = nomeFinal;

    // Se o usuário tiver foto do Google, usa a foto; senão, coloca a 1ª letra na bolinha
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
  // ========================================
  // 3. BOTÃO DO GOOGLE
  // ========================================
  const btnGoogle = document.getElementById("btnGoogle");

  if (btnGoogle) {
    btnGoogle.addEventListener("click", async () => {
      try {
        // Abre o pop-up do Google para o usuário escolher a conta
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log("Logado com sucesso via Google:", user.displayName || user.email);
        alert(`✨ Bem-vindo(a), ${user.displayName || user.email}!`);

      } catch (error) {
        console.error("Erro no Google Login:", error);

        if (error.code === "auth/popup-closed-by-user") {
          // O usuário apenas fechou a janela do Google, não precisa dar erro grave
          console.log("Janela do Google fechada pelo usuário.");
        } else if (error.code === "auth/operation-not-allowed") {
          alert("❌ O login do Google ainda não foi ativado no Console do Firebase! Ative na aba Authentication -> Sign-in method.");
        } else {
          alert("❌ Erro ao entrar com o Google:\n" + error.message);
        }
      }
    });
  }
// ==========================================
// EDITAR NOME DO USUÁRIO
// ==========================================
document.getElementById("btnEditarNome")?.addEventListener("click", async () => {
  const usuarioAtual = auth.currentUser;
  if (!usuarioAtual) return alert("Você precisa estar logado!");

  const novoNome = prompt("Digite seu nome de exibição:", usuarioAtual.displayName || "");

  if (novoNome && novoNome.trim() !== "") {
    try {
      await updateProfile(usuarioAtual, {
        displayName: novoNome.trim()
      });

      // Atualiza na tela imediatamente
      document.getElementById("nomeExibicao").innerText = novoNome.trim();
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

// ==========================================
// GERAR MENSAGEM DO WHATSAPP COM NOME E CONTA
// ==========================================
window.enviarWhatsapp = function() {
  const usuarioAtual = auth.currentUser;
  
  // Pega o nome do usuário ou e-mail caso não tenha nome
  const nomeConta = usuarioAtual ? (usuarioAtual.displayName || usuarioAtual.email) : "Cliente";
  
  // Pega o tipo de tiragem e a pergunta
  const tipoTiragem = document.getElementById("tipoTiragem")?.value || "Tiragem";
  const pergunta = document.getElementById("perguntaTarot")?.value.trim() || "Não informada";

  // Monta o texto formatado
  const mensagem = `Olá! Fiz meu Pix e gostaria de confirmar meu pedido. 🔮\n\n` +
                   `👤 *Conta/Nome:* ${nomeConta}\n` +
                   `📌 *Serviço:* ${tipoTiragem}\n` +
                   `❓ *Pergunta/Tema:* ${pergunta}`;

  // Codifica a mensagem para URL
  const linkWhatsapp = `https://wa.me/5511969055944?text=${encodeURIComponent(mensagem)}`;

  // Abre o WhatsApp
  window.open(linkWhatsapp, "_blank");
};
