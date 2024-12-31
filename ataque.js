// Elementos de vida dos jogadores
const player1HealthElement = document.getElementById("player1-health");
const player2HealthElement = document.getElementById("player2-health");

// Variáveis de estado dos jogadores
let player1Health = 900;
let player2Health = 900;

let player1HitCount = 0; // Golpes recebidos pelo Player 1
let player2HitCount = 0; // Golpes recebidos pelo Player 2

let player1Paralyzed = false; // Paralisação do Player 1
let player2Paralyzed = false; // Paralisação do Player 2

// Teclas de ataque
const attackKeys = {
  player1: "Enter", // Player 1 ataca com Enter
  player2: " "      // Player 2 ataca com Espaço
};

// Função para criar uma caixa de ataque
function createAttackBox(attacker) {
  const attackBox = document.createElement("div");
  attackBox.classList.add("attack-box");

  const attackerElement = attacker.element;
  const attackerLeft = parseInt(window.getComputedStyle(attackerElement).left);
  const attackerBottom = parseInt(window.getComputedStyle(attackerElement).bottom);
  const attackBoxWidth = 50;

  attackBox.style.width = `${attackBoxWidth}px`;
  attackBox.style.height = "50px";
  attackBox.style.position = "absolute";
  attackBox.style.bottom = `${attackerBottom + 20}px`;

  if (attacker.facingRight) {
    attackBox.style.left = `${attackerLeft + attackerElement.clientWidth}px`;
  } else {
    attackBox.style.left = `${attackerLeft - attackBoxWidth}px`;
  }

  document.querySelector(".arena").appendChild(attackBox);

  setTimeout(() => {
    attackBox.remove();
  }, 200); // Caixa de ataque desaparece após 200ms

  return attackBox;
}

// Detecta ataques com as teclas definidas
document.addEventListener("keydown", (e) => {
  if (e.key === attackKeys.player1 && !player1Paralyzed) {
    performAttack(player1, player2, "player2");
  }
  if (e.key === attackKeys.player2 && !player2Paralyzed) {
    performAttack(player2, player1, "player1");
  }
});

// Realiza o ataque
function performAttack(attacker, defender, defenderHealthKey) {
  const attackBox = createAttackBox(attacker);

  const defenderElement = defender.element;
  const defenderLeft = parseInt(window.getComputedStyle(defenderElement).left);
  const defenderRight = defenderLeft + defenderElement.clientWidth;

  const attackBoxLeft = parseInt(attackBox.style.left);
  const attackBoxRight = attackBoxLeft + parseInt(attackBox.style.width);

  // Verifica colisão entre a caixa de ataque e o defensor
  if (
    attackBoxRight > defenderLeft &&
    attackBoxLeft < defenderRight &&
    parseInt(attackBox.style.bottom) < parseInt(window.getComputedStyle(defenderElement).bottom) + defenderElement.clientHeight
  ) {
    applyDamage(defender, defenderHealthKey);
    handleHitEffects(defender, attacker);
  }
}

// Aplica dano ao defensor
function applyDamage(defender, defenderHealthKey) {
  const damage = 10; // Quantidade de dano por ataque

  if (defenderHealthKey === "player1") {
    player1Health = Math.max(0, player1Health - damage); // Reduz a vida do Player 1
    player1HealthElement.textContent = `Vida: ${player1Health}`;
    checkGameOver("Jogador 1"); // Verifica se o Player 1 perdeu
  } else if (defenderHealthKey === "player2") {
    player2Health = Math.max(0, player2Health - damage); // Reduz a vida do Player 2
    player2HealthElement.textContent = `Vida: ${player2Health}`;
    checkGameOver("Jogador 2"); // Verifica se o Player 2 perdeu
  }
}

// Verifica se o jogo acabou
function checkGameOver(player) {
  if (player1Health <= 0) {
    alert(`${player} perdeu! Reiniciando o jogo...`);
    resetGame(); // Reinicia o jogo sem recarregar a página
  } else if (player2Health <= 0) {
    alert(`${player} perdeu! Reiniciando o jogo...`);
    resetGame(); // Reinicia o jogo sem recarregar a página
  }
}

// Gerencia os efeitos de um golpe no jogador
function handleHitEffects(defender, attacker) {
  if (defender === player1) {
    player1Paralyzed = true;
    player1HitCount++;
    setTimeout(() => (player1Paralyzed = false), 500); // Paralisa por 500ms

    if (player1HitCount >= 5) {
      player1HitCount = 0; // Reseta o contador de golpes
      applyPushback(player1, attacker, 30); // Aplica empurrão de 30px
    }
  } else if (defender === player2) {
    player2Paralyzed = true;
    player2HitCount++;
    setTimeout(() => (player2Paralyzed = false), 500); // Paralisa por 500ms

    if (player2HitCount >= 5) {
      player2HitCount = 0; // Reseta o contador de golpes
      applyPushback(player2, attacker, 30); // Aplica empurrão de 30px
    }
  }
}

// Aplica empurrão ao jogador
function applyPushback(defender, attacker, pushDistance) {
  const defenderElement = defender.element;
  const attackerElement = attacker.element;

  const defenderLeft = parseInt(window.getComputedStyle(defenderElement).left);
  const attackerLeft = parseInt(window.getComputedStyle(attackerElement).left);

  // Calcula a direção do empurrão
  const direction = attackerLeft < defenderLeft ? pushDistance : -pushDistance;

  // Calcula nova posição
  const newPosition = Math.max(0, defenderLeft + direction); // Garante que não saia da arena

  defenderElement.style.left = `${newPosition}px`;
}

// Reinicia o jogo
function resetGame() {
  player1Health = 900;
  player2Health = 900;

  player1HealthElement.textContent = "Vida: 900";
  player2HealthElement.textContent = "Vida: 900";

  player1.element.style.left = "50px";
  player1.element.style.bottom = "0px";
  player2.element.style.left = "500px";
  player2.element.style.bottom = "0px";

  player1HitCount = 0;
  player2HitCount = 0;

  player1Paralyzed = false;
  player2Paralyzed = false;
}
