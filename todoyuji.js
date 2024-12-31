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





// sangue perfurante





// Nova habilidade "Sangue Perfurante"
let piercingBloodCooldown = false; // Controla o cooldown do Sangue Perfurante
const piercingBloodCooldownTime = 5000; // Cooldown de 5 segundos

// Detecta tecla "t" para a habilidade Sangue Perfurante
document.addEventListener("keydown", (e) => {
    if (e.key === "t" && !piercingBloodCooldown) {
        performPiercingBlood(player2, player1, "player1");
        piercingBloodCooldown = true;

        // Reinicia o cooldown após o tempo definido
        setTimeout(() => {
            piercingBloodCooldown = false;
        }, piercingBloodCooldownTime);
    }
});

// Função para realizar o Sangue Perfurante
function performPiercingBlood(attacker, defender, defenderHealthKey) {
    const projectile = createPiercingBloodProjectile(attacker);
    const direction = attacker.facingRight ? 1 : -1; // Define a direção no momento do lançamento

    const interval = setInterval(() => {
        const projectileLeft = parseInt(projectile.style.left);
        const projectileRight = projectileLeft + parseInt(projectile.style.width);
        const projectileBottom = parseInt(projectile.style.bottom);

        const defenderElement = defender.element;
        const defenderLeft = parseInt(window.getComputedStyle(defenderElement).left);
        const defenderRight = defenderLeft + defenderElement.clientWidth;
        const defenderBottom = parseInt(window.getComputedStyle(defenderElement).bottom);
        const defenderTop = defenderBottom + defenderElement.clientHeight;

        // Verifica colisão
        if (
            projectileRight > defenderLeft &&
            projectileLeft < defenderRight &&
            projectileBottom > defenderBottom &&
            projectileBottom < defenderTop
        ) {
            applyDamage(defender, defenderHealthKey, 40);
            createPiercingBloodEffect(defender);
            projectile.remove();
            clearInterval(interval);
        }

        // Remove o projétil se sair da arena sem causar dano
        if (projectileLeft > window.innerWidth || projectileLeft < 0) {
            projectile.remove();
            clearInterval(interval);
        }

        // Move o projétil na direção correta
        const speed = 10; // Velocidade do projétil
        projectile.style.left = `${projectileLeft + speed * direction}px`;
    }, 20); // Atualiza a posição a cada 20ms
}

// Cria o projétil para o Sangue Perfurante
function createPiercingBloodProjectile(attacker) {
    const projectile = document.createElement("div");
    projectile.classList.add("piercing-blood-projectile");

    const attackerElement = attacker.element;
    const attackerLeft = parseInt(window.getComputedStyle(attackerElement).left);
    const attackerBottom = parseInt(window.getComputedStyle(attackerElement).bottom);

    projectile.style.width = "100px"; // Dimensões do projétil
    projectile.style.height = "20px";
    projectile.style.position = "absolute";
    projectile.style.bottom = `${attackerBottom + 30}px`;
    projectile.style.left = attacker.facingRight
        ? `${attackerLeft + attackerElement.clientWidth}px`
        : `${attackerLeft - 100}px`;
    projectile.style.backgroundColor = "red";
    projectile.style.opacity = 0.9;

    document.querySelector(".arena").appendChild(projectile);

    return projectile;
}

// Cria o efeito visual do Sangue Perfurante
function createPiercingBloodEffect(defender) {
    const defenderElement = defender.element;

    const effect = document.createElement("div");
    effect.classList.add("piercing-blood-effect");
    effect.style.position = "absolute";
    effect.style.left = `${parseInt(window.getComputedStyle(defenderElement).left)}px`;
    effect.style.bottom = `${parseInt(window.getComputedStyle(defenderElement).bottom)}px`;
    effect.style.width = "100px";
    effect.style.height = "100px";
    effect.style.backgroundColor = "darkred";
    effect.style.borderRadius = "50%";
    effect.style.opacity = 0.6;
    document.querySelector(".arena").appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 300); // Remove o efeito após 300ms

    playPiercingBloodSound();
}

// Função para tocar o som do Sangue Perfurante
function playPiercingBloodSound() {
    const audio = new Audio("sons/piercing_blood.mp3"); // Substitua pelo caminho do som
    audio.play();
}





// dash





// Nova habilidade "Dash Teleport" (Versão Atualizada)
let dashTeleportCooldown = false; // Controla o cooldown do Dash Teleport
const dashTeleportCooldownTime = 5000; // Cooldown de 5 segundos
let dashTeleportStage = 0; // Controla os estágios do Dash Teleport
let dashTeleportProjectile = null; // Referência ao projétil

// Detecta tecla "y" para a habilidade Dash Teleport
document.addEventListener("keydown", (e) => {
    if (e.key === "y" && !dashTeleportCooldown) {
        dashTeleportStage++;

        if (dashTeleportStage === 1) {
            // Primeiro estágio: Lança o projétil
            dashTeleportProjectile = createDashTeleportProjectile(player2);
        } else if (dashTeleportStage === 2) {
            // Segundo estágio: Para o projétil no lugar
            if (dashTeleportProjectile) {
                stopDashTeleportProjectile(dashTeleportProjectile);
            }
        } else if (dashTeleportStage === 3) {
            // Terceiro estágio: Teleporta o jogador
            if (dashTeleportProjectile) {
                teleportPlayerToProjectile(player2, dashTeleportProjectile);
                dashTeleportProjectile.remove();
                dashTeleportProjectile = null;
            }
            dashTeleportStage = 0; // Reinicia os estágios
            dashTeleportCooldown = true;

            // Reinicia o cooldown após o tempo definido
            setTimeout(() => {
                dashTeleportCooldown = false;
            }, dashTeleportCooldownTime);
        }
    }
});

// Cria o projétil para o Dash Teleport
function createDashTeleportProjectile(attacker) {
    const projectile = document.createElement("div");
    projectile.classList.add("dash-teleport-projectile");

    const attackerElement = attacker.element;
    const attackerLeft = parseInt(window.getComputedStyle(attackerElement).left);
    const attackerBottom = parseInt(window.getComputedStyle(attackerElement).bottom);

    projectile.style.width = "50px"; // Dimensões do projétil
    projectile.style.height = "20px";
    projectile.style.position = "absolute";
    projectile.style.bottom = `${attackerBottom + 30}px`;
    projectile.style.left = attacker.facingRight
        ? `${attackerLeft + attackerElement.clientWidth}px`
        : `${attackerLeft - 50}px`;
    projectile.style.backgroundColor = "purple";
    projectile.style.opacity = 0.9;

    document.querySelector(".arena").appendChild(projectile);

    moveDashTeleportProjectile(projectile, attacker.facingRight ? 1 : -1);

    return projectile;
}

// Move o projétil na direção correta
function moveDashTeleportProjectile(projectile, direction) {
    const speed = 15; // Velocidade do projétil

    projectile.interval = setInterval(() => {
        const projectileLeft = parseInt(projectile.style.left);

        // Verifica se o projétil saiu da arena
        if (projectileLeft > window.innerWidth || projectileLeft < 0) {
            clearInterval(projectile.interval);
            projectile.remove();
            dashTeleportStage = 0; // Reinicia os estágios
            dashTeleportProjectile = null;
        } else {
            projectile.style.left = `${projectileLeft + speed * direction}px`;
        }
    }, 20); // Atualiza a posição a cada 20ms
}

// Para o projétil no local atual
function stopDashTeleportProjectile(projectile) {
    clearInterval(projectile.interval);
    projectile.interval = null;
}

// Teletransporta o jogador para a posição do projétil
function teleportPlayerToProjectile(player, projectile) {
    const projectileLeft = parseInt(projectile.style.left);
    const projectileBottom = parseInt(projectile.style.bottom);

    const playerElement = player.element;
    playerElement.style.transition = "none"; // Remove transições para evitar interferências
    playerElement.style.left = `${projectileLeft}px`;
    playerElement.style.bottom = `${projectileBottom}px`;

    createTeleportEffect(playerElement);

    // Restaura as transições após o teleporte
    setTimeout(() => {
        playerElement.style.transition = "";
    }, 100);
}

// Cria o efeito visual de teletransporte
function createTeleportEffect(playerElement) {
    const effect = document.createElement("div");
    effect.classList.add("teleport-effect");
    effect.style.position = "absolute";
    effect.style.left = `${parseInt(window.getComputedStyle(playerElement).left)}px`;
    effect.style.bottom = `${parseInt(window.getComputedStyle(playerElement).bottom)}px`;
    effect.style.width = "100px";
    effect.style.height = "100px";
    effect.style.backgroundColor = "white";
    effect.style.borderRadius = "50%";
    effect.style.opacity = 0.6;
    document.querySelector(".arena").appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 300); // Remove o efeito após 300ms

    playDashTeleportSound();
}

// Função para tocar o som do Dash Teleport
function playDashTeleportSound() {
    const audio = new Audio("sons/clap.mp3"); // Substitua pelo caminho do som
    audio.play();
}






//     --------------  120% ------------------



// Adiciona a barra de ultimate no HTML
const ultimateBar = document.createElement("div");
ultimateBar.classList.add("ultimate-bar");
ultimateBar.style.position = "absolute";
ultimateBar.style.bottom = "10px";
ultimateBar.style.left = "50%";
ultimateBar.style.transform = "translateX(-50%)";
ultimateBar.style.width = "300px";
ultimateBar.style.height = "20px";
ultimateBar.style.backgroundColor = "#333";
ultimateBar.style.border = "2px solid #fff";

const ultimateProgress = document.createElement("div");
ultimateProgress.classList.add("ultimate-progress");
ultimateProgress.style.width = "0%";
ultimateProgress.style.height = "100%";
ultimateProgress.style.backgroundColor = "gold";

ultimateBar.appendChild(ultimateProgress);
document.body.appendChild(ultimateBar);

// Variáveis de controle da barra
let ultimateCharge = 0;
const ultimateMaxCharge = 100;
let ultimateCharging = true;

// Incrementa a barra com o tempo
setInterval(() => {
    if (ultimateCharging && ultimateCharge < ultimateMaxCharge) {
        ultimateCharge += 1; // Ajuste o valor para controlar a velocidade de carregamento
        updateUltimateBar();
    }
}, 100); // Incremento a cada 100ms

// Incrementa a barra com ataques
function incrementUltimateCharge(amount) {
    if (ultimateCharge < ultimateMaxCharge) {
        ultimateCharge += amount;
        updateUltimateBar();
    }
}

// Atualiza a barra visualmente
function updateUltimateBar() {
    ultimateProgress.style.width = `${Math.min(ultimateCharge, ultimateMaxCharge)}%`;
}

// Detecta a tecla "G" para ativar a ultimate
document.addEventListener("keydown", (e) => {
    if (e.key === "g" && ultimateCharge >= ultimateMaxCharge) {
        activateUltimate();
    }
});

// Função para ativar a ultimate
function activateUltimate() {
    ultimateCharging = false; // Pausa o carregamento
    ultimateCharge = 0; // Reseta a barra
    updateUltimateBar();

    // Exibe a transformação
    showUltimateAnimation();

    // Restaura o carregamento após a transformação
    setTimeout(() => {
        ultimateCharging = true;
    }, 60000); // Tempo de espera antes de recarregar a barra (60 segundos)
}

// Exibe a animação e o vídeo da transformação
function showUltimateAnimation() {
    const videoContainer = document.createElement("div");
    videoContainer.style.position = "fixed";
    videoContainer.style.top = "0";
    videoContainer.style.left = "0";
    videoContainer.style.width = "100vw";
    videoContainer.style.height = "100vh";
    videoContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    videoContainer.style.display = "flex";
    videoContainer.style.justifyContent = "center";
    videoContainer.style.alignItems = "center";
    videoContainer.style.zIndex = "1000";

    const video = document.createElement("video");
    video.src = "video/120%.mp4"; // Substitua pelo caminho do vídeo
    video.autoplay = true;
    video.controls = false;
    video.style.width = "80%";
    video.style.height = "auto";

    const audio = new Audio("audio/awk-yuji.mp3"); // Substitua pelo caminho da música
    audio.loop = true;
    audio.play();

    videoContainer.appendChild(video);
    document.body.appendChild(videoContainer);

    video.addEventListener("ended", () => {
        setTimeout(() => {
            videoContainer.remove();
        }, 9000); // Remove o vídeo após 1s
    });

    // Finaliza a música após 60 segundos
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, 60000);
}
