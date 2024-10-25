const attackSpeed = 10; // Velocidade do ataque
const attackDamage = 10; // Dano causado pelo ataque

// Função para lançar um ataque
function launchAttack(player, targetPlayer) {
    const attackElement = document.createElement("div");
    attackElement.classList.add("attack");
    document.querySelector(".arena").appendChild(attackElement);

    // Obter as dimensões da arena
    const arena = document.querySelector(".arena");
    const arenaRect = arena.getBoundingClientRect();

    // Posiciona o ataque na posição inicial do jogador
    const playerRect = player.element.getBoundingClientRect();
    attackElement.style.left = `${playerRect.left - arenaRect.left + (player.facingRight ? playerRect.width : -20)}px`;

    // Define a posição vertical com base na altura do jogador
    const playerBottom = parseFloat(window.getComputedStyle(player.element).bottom);
    attackElement.style.bottom = `${playerBottom + playerRect.height / 2}px`; // Alinha o ataque no meio do jogador

    // Aplica direção ao ataque
    const attackVelocityX = player.facingRight ? attackSpeed : -attackSpeed;

    // Anima o movimento do ataque e verifica a colisão
    const attackInterval = setInterval(() => {
        const currentLeft = parseFloat(attackElement.style.left);
        attackElement.style.left = `${currentLeft + attackVelocityX}px`;

        // Verifica se o ataque saiu da arena
        if (currentLeft < 0 || currentLeft > arena.clientWidth) {
            clearInterval(attackInterval);
            attackElement.remove(); // Remove o ataque após sair da tela
        }

        // Verifica colisão com o outro jogador
        if (checkCollision(attackElement, targetPlayer.element)) {
            clearInterval(attackInterval);
            attackElement.remove(); // Remove o ataque ao colidir
            applyDamage(targetPlayer, attackDamage); // Aplica dano ao jogador atingido
        }
    }, 20);
}

// Função para verificar colisão entre o ataque e o jogador
function checkCollision(attack, target) {
    const attackRect = attack.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return (
        attackRect.left < targetRect.right &&
        attackRect.right > targetRect.left &&
        attackRect.top < targetRect.bottom &&
        attackRect.bottom > targetRect.top
    );
}

// Função para aplicar dano ao jogador atingido e reiniciar o jogo ao derrotar o oponente
function applyDamage(targetPlayer, damage) {
    console.log(`${targetPlayer.element.id} foi atingido! Dano: ${damage}`);
    targetPlayer.health -= damage;

    if (targetPlayer.health <= 0) {
        alert(`${targetPlayer.element.id} foi derrotado! Reiniciando o jogo.`);
        
        // Reinicia a partida
        resetGame();
    } else {
        // Aplica efeito visual ao jogador atingido
        targetPlayer.element.style.width = `${parseInt(targetPlayer.element.style.width) - 10}px`;
        targetPlayer.element.style.height = `${parseInt(targetPlayer.element.style.height) - 10}px`;
    }
}

// Função para reiniciar o jogo
function resetGame() {
    // Resetar a vida dos jogadores
    player1.health = 100;
    player2.health = 100;

    // Resetar a posição e tamanho dos elementos dos jogadores
    player1.element.style.display = 'block';
    player1.element.style.width = "50px";
    player1.element.style.height = "50px";

    player2.element.style.display = 'block';
    player2.element.style.width = "50px";
    player2.element.style.height = "50px";

    // Adicione outras redefinições, como posições dos jogadores na arena, se necessário
}

// Escuta a tecla de ataque para cada jogador
document.addEventListener("keydown", (e) => {
    if (e.key === "e") { // Tecla E para o jogador 1
        launchAttack(player1, player2); // Lançar ataque do jogador 1 em direção ao jogador 2
    }
    if (e.key === "q") { // Tecla Q para o jogador 2
        launchAttack(player2, player1); // Lançar ataque do jogador 2 em direção ao jogador 1
    }
});
