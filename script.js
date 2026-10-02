// Garante que o JavaScript só roda DEPOIS do HTML carregar 100%
document.addEventListener('DOMContentLoaded', () => {

  // 1. Pegar as Telas
  const tela1 = document.getElementById('tela1');
  const tela2 = document.getElementById('tela2');
  const tela3 = document.getElementById('tela3');

  // 2. Pegar os Botões
  const btnComecar = document.getElementById('btnComecar');
  const btnVoltar = document.getElementById('btnVoltar');
  const btnipmlbb = document.getElementById('btnipmlbb');
  const btnVoltarTela3 = document.getElementById('btnVoltarTela3');

  // --- NAVEGAÇÃO: TELA 1 -> TELA 2 ---
  if (btnComecar && tela1 && tela2) {
    btnComecar.addEventListener('click', () => {
      tela1.classList.add('escondida');
      tela2.classList.remove('escondida');
    });
  }

  // --- NAVEGAÇÃO: TELA 2 -> TELA 1 ---
  if (btnVoltar && tela1 && tela2) {
    btnVoltar.addEventListener('click', () => {
      tela2.classList.add('escondida');
      tela1.classList.remove('escondida');
    });
  }

  // --- NAVEGAÇÃO: TELA 2 -> TELA 3 ---
  if (btnipmlbb && tela2 && tela3) {
    btnipmlbb.addEventListener('click', () => {
      tela2.classList.add('escondida');
      tela3.classList.remove('escondida');
    });
  }

  // --- NAVEGAÇÃO: TELA 3 -> TELA 2 ---
  if (btnVoltarTela3 && tela2 && tela3) {
    btnVoltarTela3.addEventListener('click', () => {
      tela3.classList.add('escondida');
      tela2.classList.remove('escondida');
    });
  }

});
