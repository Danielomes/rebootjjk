// Habilidade especial do Player 1: Troca de posição com Player 2
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
        }, cooldownTime);
    }
});

// Função para trocar os jogadores de lugar
function performSwap(player1, player2) {
    const player1Element = player1.element;
    const player2Element = player2.element;

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
}

// Função para criar partículas no local da troca
function createParticles(x, y) {
    const arena = document.querySelector(".arena");

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.position = "absolute";
        particle.style.left = `${x + Math.random() * 20 - 10}px`; // Aleatório ao redor do ponto
        particle.style.bottom = `${y + Math.random() * 20 - 10}px`;
        particle.style.width = "5px";
        particle.style.height = "5px";
        particle.style.backgroundColor = "blue";
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
    element.style.transition = "background-color 0.2s ease";
    element.style.backgroundColor = "yellow";

    setTimeout(() => {
        element.style.backgroundColor = "";
    }, 200);
}

// Função para tocar o som da habilidade
function playSwapSound() {
    const audio = new Audio("swap-sound.mp3"); // Substitua pelo caminho do arquivo de som
    audio.play();
}