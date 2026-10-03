// ==========================================
// FUNÇÃO DE BLOQUEIO DE PEDIDO (PIX OBRIGATÓRIO)
// ==========================================

window.bloquearPorPagamento = function() {
  // 1. Verifica se o cliente já tem a chave Pix cadastrada
  if (!pixDoClienteSalvo || pixDoClienteSalvo.trim() === "") {
    alert("⚠️ Para realizar um pedido, você precisa cadastrar sua Chave Pix primeiro!");
    
    // Abre automaticamente o modal para cadastrar o Pix
    const modalPix = document.getElementById("modalVincularPix");
    if (modalPix) modalPix.classList.remove("escondida");
    
    return; // Para a execução e NÃO abre a tela de pagamento
  }

  // 2. Se a chave Pix já estiver vinculada, abre a tela de pagamento
  const modalPagamento = document.getElementById("modalPagamento");
  if (modalPagamento) modalPagamento.classList.remove("escondida");
};


// ==========================================
// SALVAR PIX DO CLIENTE NO FIREBASE
// ==========================================

async function salvarPixCliente(chave) {
  const usuario = auth.currentUser;
  if (!usuario) return alert("Você precisa estar logado!");

  if (!chave || chave.trim() === "") {
    return alert("⚠️ Digite uma chave Pix válida.");
  }

  try {
    // Salva a chave Pix dentro de usuarios/UID/pix
    await set(ref(db, `usuarios/${usuario.uid}/pix`), chave.trim());
    pixDoClienteSalvo = chave.trim();
    
    alert("✨ Chave Pix vinculada com sucesso! Agora você pode prosseguir com seu pedido.");
    
    // Fecha o modal de vincular Pix
    document.getElementById("modalVincularPix")?.classList.add("escondida");
    
  } catch (error) {
    console.error("Erro ao salvar Pix:", error);
    alert("❌ Erro ao salvar chave Pix: " + error.message);
  }
}
