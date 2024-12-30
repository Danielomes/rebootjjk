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
        }, cooldownTime * 1); // Multiplicando por 1000 para converter segundos em milissegundos
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






// BLACK FLASH



// Nova habilidade "Black Flash"
let blackFlashChargeStart = null; // Controla o início do carregamento
let consecutiveBlackFlashHits = 0; // Contador de acertos consecutivos

const blackFlashCooldown = 1000; // Cooldown entre ataques em ms
let blackFlashLastUsed = 0; // Marca o último uso

// Detecta o início do carregamento ao pressionar "r"
document.addEventListener("keydown", (e) => {
    if (e.key === "r" && !blackFlashChargeStart) {
        blackFlashChargeStart = Date.now();
    }
});

// Detecta o fim do carregamento ao soltar "r"
document.addEventListener("keyup", (e) => {
    if (e.key === "r" && blackFlashChargeStart) {
        const chargeTime = (Date.now() - blackFlashChargeStart) / 1000; // Tempo em segundos
        blackFlashChargeStart = null;

        if (Date.now() - blackFlashLastUsed < blackFlashCooldown) {
            return; // Respeita o cooldown
        }

        if (chargeTime >= 0.1 && chargeTime <= 0.9) {
            performBlackFlash(player2, player1, "player1", true);
        } else {
            performDivergentFist(player2, player1, "player1");
        }

        blackFlashLastUsed = Date.now();
    }
});

// Função para realizar o Black Flash
function performBlackFlash(attacker, defender, defenderHealthKey, isBlackFlash) {
    const attackBox = createAttackBox(attacker);

    const defenderElement = defender.element;
    const defenderLeft = parseInt(window.getComputedStyle(defenderElement).left);
    const defenderRight = defenderLeft + defenderElement.clientWidth;

    const attackBoxLeft = parseInt(attackBox.style.left);
    const attackBoxRight = attackBoxLeft + parseInt(attackBox.style.width);

    if (
        attackBoxRight > defenderLeft &&
        attackBoxLeft < defenderRight &&
        parseInt(attackBox.style.bottom) < parseInt(window.getComputedStyle(defenderElement).bottom) + defenderElement.clientHeight
    ) {
        const baseDamage = 30;
        const damage = baseDamage + (consecutiveBlackFlashHits >= 3 ? (20 * (consecutiveBlackFlashHits - 2)) : 0);
        applyDamage(defender, defenderHealthKey, damage);

        consecutiveBlackFlashHits++;
        createBlackFlashEffect(defender);
    } else {
        consecutiveBlackFlashHits = 0; // Reseta se errar
    }
}

// Função para realizar o soco divergente
function performDivergentFist(attacker, defender, defenderHealthKey) {
    const attackBox = createAttackBox(attacker);

    const defenderElement = defender.element;
    const defenderLeft = parseInt(window.getComputedStyle(defenderElement).left);
    const defenderRight = defenderLeft + defenderElement.clientWidth;

    const attackBoxLeft = parseInt(attackBox.style.left);
    const attackBoxRight = attackBoxLeft + parseInt(attackBox.style.width);

    if (
        attackBoxRight > defenderLeft &&
        attackBoxLeft < defenderRight &&
        parseInt(attackBox.style.bottom) < parseInt(window.getComputedStyle(defenderElement).bottom) + defenderElement.clientHeight
    ) {
        applyDamage(defender, defenderHealthKey, 20);
        createDivergentFistEffect(defender);
    }
}

// Aplica dano ao defensor
function applyDamage(defender, defenderHealthKey, damage) {
    if (defenderHealthKey === "player1") {
        player1Health = Math.max(0, player1Health - damage);
        player1HealthElement.textContent = `Vida: ${player1Health}`;
        if (player1Health <= 0) {
            alert("Jogador 1 perdeu! Reiniciando o jogo...");
            location.reload();
        }
    } else if (defenderHealthKey === "player2") {
        player2Health = Math.max(0, player2Health - damage);
        player2HealthElement.textContent = `Vida: ${player2Health}`;
        if (player2Health <= 0) {
            alert("Jogador 2 perdeu! Reiniciando o jogo...");
            location.reload();
        }
    }
}

// Cria o efeito visual do Black Flash
function createBlackFlashEffect(defender) {
    const defenderElement = defender.element;

    const flash = document.createElement("div");
    flash.classList.add("black-flash-effect");
    flash.style.position = "absolute";
    flash.style.left = `${parseInt(window.getComputedStyle(defenderElement).left)}px`;
    flash.style.bottom = `${parseInt(window.getComputedStyle(defenderElement).bottom)}px`;
    flash.style.width = "100px";
    flash.style.height = "100px";
    flash.style.backgroundColor = "black";
    flash.style.borderRadius = "50%";
    flash.style.opacity = 0.7;
    document.querySelector(".arena").appendChild(flash);

    setTimeout(() => {
        flash.remove();
    }, 300); // Remove o efeito após 300ms

    playBlackFlashSound();
}

// Cria o efeito visual do soco divergente
function createDivergentFistEffect(defender) {
    const defenderElement = defender.element;

    const flash = document.createElement("div");
    flash.classList.add("divergent-fist-effect");
    flash.style.position = "absolute";
    flash.style.left = `${parseInt(window.getComputedStyle(defenderElement).left)}px`;
    flash.style.bottom = `${parseInt(window.getComputedStyle(defenderElement).bottom)}px`;
    flash.style.width = "100px";
    flash.style.height = "100px";
    flash.style.backgroundColor = "blue";
    flash.style.borderRadius = "50%";
    flash.style.opacity = 0.7;
    document.querySelector(".arena").appendChild(flash);

    setTimeout(() => {
        flash.remove();
    }, 300); // Remove o efeito após 300ms

    playDivergentFistSound();
}

// Função para tocar o som do Black Flash
function playBlackFlashSound() {
    const audio = new Audio("sons/blackflash.mp3"); // Substitua pelo caminho do som
    audio.play();
}

// Função para tocar o som do soco divergente
function playDivergentFistSound() {
    const audio = new Audio("sons/divergente.mp3"); // Substitua pelo caminho do som
    audio.play();
}
