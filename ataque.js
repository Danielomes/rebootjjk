// ataque.js
const attackSpeed = 10; // Velocidade do ataque

// Função para lançar um ataque
function launchAttack(player) {
    const attackElement = document.createElement("div");
    attackElement.classList.add("attack");
    document.querySelector(".arena").appendChild(attackElement);

    // Obter as dimensões da arena
    const arena = document.querySelector(".arena");
    const arenaRect = arena.getBoundingClientRect();

    // Posiciona o ataque na posição inicial do jogador
    const playerRect = player.element.getBoundingClientRect();
    attackElement.style.left = `${playerRect.left - arenaRect.left + (player.facingRight ? playerRect.width : -20)}px`;
    attackElement.style.bottom = `${playerRect.bottom - arenaRect.top}px`;

    // Aplica direção ao ataque
    const attackVelocityX = player.facingRight ? attackSpeed : -attackSpeed;

    // Anima o movimento do ataque
    const attackInterval = setInterval(() => {
        const currentLeft = parseFloat(attackElement.style.left);
        attackElement.style.left = `${currentLeft + attackVelocityX}px`;

        // Verifica se o ataque saiu da arena
        if (currentLeft < 0 || currentLeft > arena.clientWidth) {
            clearInterval(attackInterval);
            attackElement.remove(); // Remove o ataque após sair da tela
        }
    }, 20);
}

// Escuta a tecla de ataque para cada jogador
document.addEventListener("keydown", (e) => {
    if (e.key === "e") { // Tecla E para o jogador 1
        launchAttack(player1);
    }
    if (e.key === "q") { // Tecla Q para o jogador 2
        launchAttack(player2);
    }
});
