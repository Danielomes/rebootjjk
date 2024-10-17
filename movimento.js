const player1 = {
  element: document.getElementById("player1"),
  velocityX: 0,
  velocityY: 0,
  isJumping: false,
  onGround: true,
  facingRight: true // Indica a direção que o jogador está virado
};

const player2 = {
  element: document.getElementById("player2"),
  velocityX: 0,
  velocityY: 0,
  isJumping: false,
  onGround: true,
  facingRight: true // Indica a direção que o jogador está virado
};

const gravity = -0.5;  // Inverte a força da gravidade
const jumpStrength = 12;  // Aumenta a força do salto (agora positivo)
const speed = 9;  // Velocidade de movimento
const maxSpeed = 7;  // Velocidade máxima

let keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  a: false,
  d: false,
  w: false
};

// Detecta teclas pressionadas
document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Atualiza a física dos jogadores
function update() {
  updatePlayer(player1, "ArrowLeft", "ArrowRight", "ArrowUp");
  updatePlayer(player2, "a", "d", "w");
  
  // Verifica se os jogadores precisam trocar de direção
  checkDirection(player1, player2);

  requestAnimationFrame(update);
}

// Atualiza a posição e a física de cada jogador
function updatePlayer(player, leftKey, rightKey, jumpKey) {
  const playerElement = player.element;

  // Obter as dimensões da arena e dos jogadores
  const arena = document.querySelector(".arena");
  const arenaWidth = arena.clientWidth;
  const arenaHeight = arena.clientHeight;
  const playerWidth = playerElement.clientWidth;
  const playerHeight = playerElement.clientHeight;

  // Movimentação horizontal
  if (keys[leftKey]) {
    player.velocityX = Math.max(player.velocityX - 1, -maxSpeed);
  } else if (keys[rightKey]) {
    player.velocityX = Math.min(player.velocityX + 1, maxSpeed);
  } else {
    // Se não estiver pressionando nada, desacelera
    player.velocityX *= 0.9; // Lento deslizamento
  }

  let currentLeft = parseInt(window.getComputedStyle(playerElement).left);

  // Limitar movimento horizontal dentro da arena
  currentLeft = Math.max(0, Math.min(currentLeft + player.velocityX, arenaWidth - playerWidth));
  playerElement.style.left = `${currentLeft}px`;

  // Pulo
  if (keys[jumpKey] && player.onGround) {
    player.velocityY = jumpStrength; // Aplica a força de salto
    player.onGround = false; // O jogador não está mais no chão
  }

  // Gravidade (inverte a direção)
  player.velocityY += gravity; // Aplica a gravidade (agora para cima)
  let currentBottom = parseInt(window.getComputedStyle(playerElement).bottom);

  // Atualiza a posição vertical do jogador
  currentBottom = Math.min(arenaHeight - playerHeight, currentBottom + player.velocityY); // O jogador deve parar no teto

  // Verifica se o jogador atingiu o teto
  if (currentBottom <= 0) {
    currentBottom = 0; // Limita ao topo da arena
    player.onGround = true; // O jogador está "no chão" (teto)
    player.velocityY = 0; // Reseta a velocidade vertical
  } else {
    player.onGround = false; // O jogador não está "no chão"
  }

  playerElement.style.bottom = `${currentBottom}px`; // Atualiza a posição vertical do jogador
}

// Função para verificar se os jogadores devem trocar de direção
function checkDirection(player1, player2) {
  const player1Left = parseInt(window.getComputedStyle(player1.element).left);
  const player2Left = parseInt(window.getComputedStyle(player2.element).left);

  // Se Player 1 ultrapassou Player 2
  if (player1Left + player1.element.clientWidth > player2Left && player1.facingRight) {
    player1.facingRight = false;
    player1.element.style.transform = 'scaleX(-1)'; // Inverte a direção do Player 1
  }
  // Se Player 2 ultrapassou Player 1
  else if (player2Left + player2.element.clientWidth > player1Left && player2.facingRight) {
    player2.facingRight = false;
    player2.element.style.transform = 'scaleX(-1)'; // Inverte a direção do Player 2
  }

  // Reseta a direção se os jogadores não estiverem mais se sobrepondo
  if (player1Left < player2Left || player1Left + player1.element.clientWidth < player2Left) {
    player1.facingRight = true;
    player1.element.style.transform = 'scaleX(1)'; // Restaura a direção do Player 1
  }
  
  if (player2Left < player1Left || player2Left + player2.element.clientWidth < player1Left) {
    player2.facingRight = true;
    player2.element.style.transform = 'scaleX(1)'; // Restaura a direção do Player 2
  }
}

// Inicia o loop de atualização
update();
