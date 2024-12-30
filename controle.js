// Estado de teclas
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    a: false,
    d: false,
    w: false,
    Enter: false, // Ataque Player 1
    " ": false    // Ataque Player 2
  };
  
  // Detecta teclas pressionadas
  document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
  });
  
  document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  });
  
  // Atualiza continuamente as ações de cada jogador
  function update() {
    // Atualiza o movimento e ações do Player 1
    updatePlayer(player1, "ArrowLeft", "ArrowRight", "ArrowUp");
    if (keys.Enter && !player1Paralyzed) {
      performAttack(player1, player2, "player2");
    }
  
    // Atualiza o movimento e ações do Player 2
    updatePlayer(player2, "a", "d", "w");
    if (keys[" "] && !player2Paralyzed) {
      performAttack(player2, player1, "player1");
    }
  
    // Verifica se os jogadores precisam trocar de direção
    checkDirection(player1, player2);
  
    // Solicita o próximo frame de animação
    requestAnimationFrame(update);
  }
  
  // Atualiza o movimento e a física de cada jogador
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
  
  // Inicia o loop de atualização
  update();
  