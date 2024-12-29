let abilityCooldown = false; // Controla o cooldown
const cooldownTime = 5; // 5 segundos de cooldown

// Detecta tecla "e" para a habilidade especial do Player 1
document.addEventListener("keydown", (e) => {
    if (e.key === "e" && !abilityCooldown) {
        performSwap(player1, player2);
        abilityCooldown = true;

        // Reinicia o cooldown após o tempo definido
        setTimeout(() => {
            abilityCooldown = false;
        }, cooldownTime * 900); // Multiplicando por 1000 para converter segundos em milissegundos
    }
});

// Função para trocar os jogadores de lugar
function performSwap(player1, player2) {
    const player1Element = player1.element;
    const player2Element = player2.element;

    // Desabilita transições temporariamente para evitar interferências
    player1Element.style.transition = 'none';
    player2Element.style.transition = 'none';

    // Obtém as posições atuais dos jogadores
    const player1Left = parseInt(window.getComputedStyle(player1Element).left);
    const player1Bottom = parseInt(window.getComputedStyle(player1Element).bottom);

    const player2Left = parseInt(window.getComputedStyle(player2Element).left);
    const player2Bottom = parseInt(window.getComputedStyle(player2Element).bottom);

    // Cria partículas visuais no local dos jogadores
    createParticles(player1Left, player1Bottom);
    createParticles(player2Left, player2Bottom);

    // Troca as posições dos jogadores
    player1Element.style.left = `${player2Left}px`;
    player1Element.style.bottom = `${player2Bottom}px`;

    player2Element.style.left = `${player1Left}px`;
    player2Element.style.bottom = `${player1Bottom}px`;

    // Adiciona um efeito visual rápido para indicar a troca
    flashEffect(player1Element);
    flashEffect(player2Element);

    // Toca o som da habilidade
    playSwapSound();

    // Restaura as transições após a troca
    setTimeout(() => {
        player1Element.style.transition = '';
        player2Element.style.transition = '';
    }, 100); // Aguarda um breve intervalo para garantir que a troca foi concluída

    // Recalcula a velocidade ou movimento dos jogadores (se necessário)
    setTimeout(() => {
        resetPlayerMovement(player1);
        resetPlayerMovement(player2);
    }, 150); // Ajuste o valor conforme necessário
}

// Função para criar partículas no local da troca
function createParticles(x, y) {
    const arena = document.querySelector(".arena");

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.position = "absolute";
        particle.style.left = `${x + Math.random() * 70 - 10}px`; // Aleatório ao redor do ponto
        particle.style.bottom = `${y + Math.random() * 70 - 10}px`;
        particle.style.width = "5px";
        particle.style.height = "5px";
        particle.style.backgroundColor = "cyan";
        particle.style.borderRadius = "50%";
        particle.style.opacity = 1;
        arena.appendChild(particle);

        // Anima e remove as partículas após 500ms
        setTimeout(() => {
            particle.style.opacity = 0;
            particle.remove();
        }, 500);
    }
}

// Adiciona um efeito visual rápido para indicar a troca
function flashEffect(element) {
    element.style.transition = "background-color 0.1s ease";
    element.style.backgroundColor = "cyan";

    setTimeout(() => {
        element.style.backgroundColor = "";
    }, 200);
}

// Função para tocar o som da habilidade
function playSwapSound() {
    const audio = new Audio("sons/clap.mp3"); // Substitua pelo caminho do arquivo de som
    audio.play();
}

// Função para resetar o movimento dos jogadores após a troca
function resetPlayerMovement(player) {
    // Aqui você pode recalcular a velocidade ou o movimento do jogador, se necessário.
    // Por exemplo, se o jogador tem uma variável de velocidade, você pode resetá-la ou recalculá-la.
    // Exemplo:
    // player.speed = player.defaultSpeed;  // Ajuste conforme a sua lógica de movimento
}
