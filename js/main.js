
import { Game } from './Game.js';
import { Fighter } from './Fighter.js';
import { Paladin } from './Paladin.js';
import { Monk } from './Monk.js';
import { Berzerker } from './Berzerker.js';
import { Assassin } from './Assassin.js';
import { Wizard } from './Wizard.js';
import { IceMage } from './IceMage.js';
import { AI } from './AI.js';
import { CLASS_EMOJIS } from './config/classEmojis.js';
import { TurnTimeline } from './ui/TurnTimeline.js';
import { EffectBadges } from './utils/effectBadges.js';

// Instance du jeu
const game = new Game();

// Éléments DOM
const characterSelection = document.getElementById('characterSelection');
const characterSelectionButtons = document.getElementById('characterSelectionButtons');
const combatZone = document.getElementById('combatZone');
const charactersArea = document.getElementById('charactersArea');
const gameConsole = document.getElementById('gameConsole');
const consoleZone = document.getElementById('consoleZone');
const toggleConsole = document.getElementById('toggleConsole');
const actionArea = document.getElementById('actionArea');
const actionContent = document.getElementById('actionContent');
const footerZone = document.getElementById('footerZone');
const statusText = document.getElementById('statusText');
const statusIndicator = document.getElementById('statusIndicator');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const aliveCount = document.getElementById('aliveCount');
const turnsRemaining = document.getElementById('turnsRemaining');
const tabNormal = document.getElementById('tabNormal');
const tabSpecial = document.getElementById('tabSpecial');
const tabHeal = document.getElementById('tabHeal');

// Limite de logs dans la console
const MAX_CONSOLE_LOGS = 50;

// Personnage actuel dont c'est le tour
let currentTurnCharacter = null;

// Écouter les logs du jeu
window.addEventListener('gameLog', (e) => {
    if (!gameConsole) return;
    
    const logEntry = document.createElement('p');
    logEntry.textContent = e.detail.message;
    logEntry.className = 'mb-1';
    gameConsole.appendChild(logEntry);
    
    // Limiter le nombre de logs
    const logs = gameConsole.querySelectorAll('p');
    if (logs.length > MAX_CONSOLE_LOGS) {
        for (let i = 0; i < logs.length - MAX_CONSOLE_LOGS; i++) {
            logs[i].remove();
        }
    }
    
    gameConsole.scrollTop = gameConsole.scrollHeight;
});

// Fonction pour obtenir l'emoji d'une classe
function getClassEmoji(className) {
    return CLASS_EMOJIS[className]?.avatar || '⚔️';
}

// Afficher la sélection de personnage
function showCharacterSelection() {
    characterSelection.classList.remove('hidden');
    combatZone.classList.add('hidden');
    consoleZone.classList.add('hidden');
    footerZone.classList.add('hidden');
    characterSelectionButtons.innerHTML = '';
    
    game.createDefaultCharacters();
    
    game.characters.forEach(char => {
        const btn = document.createElement('button');
        const classInfo = CLASS_EMOJIS[char.className] || CLASS_EMOJIS.Fighter;
        btn.className = 'bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900';
        btn.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-xl font-bold">${char.name}</h3>
                <span class="text-2xl">${classInfo.avatar}</span>
            </div>
            <p class="text-sm text-gray-300">${char.className}</p>
            <div class="mt-2 text-xs text-gray-400">
                HP: ${char.maxHp} | Mana: ${char.maxMana} | Dmg: ${char.dmg}
            </div>
        `;
        btn.onclick = () => selectCharacter(char);
        characterSelectionButtons.appendChild(btn);
    });
}

// Sélectionner un personnage
function selectCharacter(character) {
    game.playerCharacter = character;
    character.isAI = false;
    
    // Marquer les autres comme IA
    game.characters.forEach(char => {
        if (char !== character) {
            char.isAI = true;
        }
    });
    
    game.log(`🎮 Vous avez choisi ${character.name} (${character.className})!`);
    game.log(`🤖 Les autres personnages seront contrôlés par l'ordinateur.`);
    
    startGameAutomatically();
}

// Démarrer le jeu automatiquement
function startGameAutomatically() {
    // Masquer la sélection, afficher le combat
    characterSelection.classList.add('hidden');
    combatZone.classList.remove('hidden');
    
    // Afficher footer et console
    footerZone.classList.remove('hidden');
    consoleZone.classList.remove('hidden');
    
    game.log('🎮 La partie commence!');
    game.log(`Il y a ${game.characters.length} personnages en jeu.`);
    
    updateCharactersDisplay();
    updateStatistics();
    updateStatusVisual('🎮 Partie en cours...', game.currentTurn, '🎮');
    
    game.startTurn();
    nextCharacterTurn();
}

// Mettre à jour l'affichage des personnages
function updateCharactersDisplay() {
    if (!charactersArea) return;
    
    charactersArea.innerHTML = '';
    const aliveChars = game.getAliveCharacters();
    // Le personnage actuel est le premier de turnOrder (s'il existe et est vivant)
    const currentCharacter = game.turnOrder.length > 0 && game.turnOrder[0].status === 'playing' 
        ? game.turnOrder[0] 
        : null;
    
    game.characters.forEach(char => {
        const isCurrent = char === currentCharacter;
        const isPlayer = char === game.playerCharacter;
        const isInDanger = char.hp / char.maxHp < 0.3 && char.status === 'playing';
        const classInfo = CLASS_EMOJIS[char.className] || CLASS_EMOJIS.Fighter;
        
        const hpPercentage = (char.hp / char.maxHp) * 100;
        const manaPercentage = (char.mana / char.maxMana) * 100;
        
        let hpBarColor = 'bg-gradient-to-r from-red-500 to-red-700';
        if (hpPercentage > 60) {
            hpBarColor = 'bg-gradient-to-r from-green-500 to-green-700';
        } else if (hpPercentage > 30) {
            hpBarColor = 'bg-gradient-to-r from-yellow-500 to-orange-600';
        }
        
        const statusEmoji = char.status === 'playing' ? (isPlayer ? '👤' : '🤖') : '💀';
        const effectBadgesHtml = EffectBadges.render(char);
        
        // Déterminer les classes de ring (éviter les conflits)
        let ringClasses = '';
        if (isCurrent && isPlayer) {
            // Si c'est le joueur ET son tour, priorité au ring jaune
            ringClasses = 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900';
        } else if (isCurrent) {
            ringClasses = 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900';
        } else if (isPlayer) {
            ringClasses = 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900';
        }
        
        const card = document.createElement('div');
        card.className = `group ${classInfo.bgColor} rounded-lg p-3 relative transition-all cursor-pointer ${
            char.status === 'loser' ? 'opacity-50' : ''
        } ${ringClasses} ${
            isInDanger && !isCurrent && !isPlayer ? 'border-2 border-red-500/50 animate-danger-pulse' : ''
        }`;
        card.setAttribute('data-character', char.name);
        
        const tooltipContent = `
            <div class="text-xs">
                <div>Mana: ${char.mana}/${char.maxMana}</div>
                <div>Dégâts: ${char.dmg}</div>
                <div>Classe: ${char.className}</div>
            </div>
        `;
        
        // Contenu de la carte (avec overflow-hidden pour éviter que le contenu dépasse)
        const cardContent = document.createElement('div');
        cardContent.className = 'overflow-hidden';
        cardContent.innerHTML = `
            ${effectBadgesHtml}
            
            <div class="flex items-center gap-2 mb-2">
                <div class="${classInfo.avatarBg} rounded-full w-8 h-8 flex items-center justify-center border flex-shrink-0">
                    <span class="text-lg">${classInfo.avatar}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <h4 class="text-sm font-bold text-white truncate">${char.name}</h4>
                        <span class="text-sm ml-1">${statusEmoji}</span>
                    </div>
                    <div class="text-xs text-gray-300">${char.className}</div>
                </div>
            </div>
            
            <div class="mb-1">
                <div class="flex justify-between text-xs mb-0.5">
                    <span class="text-gray-300">HP</span>
                    <span class="font-bold text-white">${char.hp}/${char.maxHp}</span>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div class="h-full ${hpBarColor} transition-all duration-500 rounded-full" style="width: ${hpPercentage}%"></div>
                </div>
            </div>
            
            <div>
                <div class="flex justify-between text-xs mb-0.5">
                    <span class="text-gray-300">Mana</span>
                    <span class="font-bold text-white">${char.mana}/${char.maxMana}</span>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-500 to-purple-700 transition-all duration-500 rounded-full" style="width: ${manaPercentage}%"></div>
                </div>
            </div>
        `;
        
        // Tooltip en dehors du conteneur avec overflow-hidden (pour qu'il ne soit pas coupé)
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bottom-full left-1/2 -translate-x-1/2 bg-black/95 px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 z-50 mb-2 group-hover:opacity-100';
        tooltip.innerHTML = tooltipContent;
        
        card.appendChild(cardContent);
        card.appendChild(tooltip);
        charactersArea.appendChild(card);
    });
    
    // Mettre à jour la timeline - seulement avec les personnages vivants
    const aliveTurnOrder = game.turnOrder.filter(char => char.status === 'playing');
    if (aliveTurnOrder.length > 0 && currentCharacter) {
        TurnTimeline.render(aliveTurnOrder, currentCharacter);
    } else if (aliveTurnOrder.length > 0) {
        // Afficher la timeline même sans currentCharacter (au cas où)
        TurnTimeline.render(aliveTurnOrder, null);
    }
}

// Mettre à jour les statistiques
function updateStatistics() {
    const alive = game.getAliveCharacters().length;
    const turns = game.turnLeft || 0;
    
    if (aliveCount) aliveCount.textContent = alive;
    if (turnsRemaining) turnsRemaining.textContent = turns;
}

// Mettre à jour le statut visuel
function updateStatusVisual(status, turn, icon = '⏳') {
    if (statusText) statusText.textContent = status;
    
    if (statusIndicator) {
        if (status.includes('tour')) {
            statusIndicator.className = 'w-2 h-2 rounded-full bg-yellow-500 animate-pulse';
        } else if (status.includes('gagné') || status.includes('terminée')) {
            statusIndicator.className = 'w-2 h-2 rounded-full bg-green-500';
        } else {
            statusIndicator.className = 'w-2 h-2 rounded-full bg-gray-500';
        }
    }
}

// Créer une carte d'action
function createActionCard(icon, actionName, target, details, colorClass, onClick) {
    const card = document.createElement('button');
    card.className = `${colorClass} rounded-lg p-2 md:p-3 text-center transition-all flex flex-col justify-center border-2 border-transparent hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-lg active:translate-y-0 text-white flex-shrink-0 min-w-[120px] md:min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`;
    card.onclick = onClick;
    
    card.innerHTML = `
        <div class="text-center">
            <div class="text-xl md:text-2xl mb-1">${icon}</div>
            <div class="font-bold text-white text-xs md:text-sm mb-0.5">${actionName}</div>
            ${target ? `<div class="text-[10px] md:text-xs text-gray-200 mb-1 truncate">${target}</div>` : ''}
            <div class="text-[10px] md:text-xs font-semibold text-white">${details}</div>
        </div>
    `;
    
    return card;
}

// Afficher les boutons d'action
function showActionButtons(character) {
    if (!actionArea || !actionContent) return;
    
    // Vérifier que le personnage est toujours en vie
    if (character.status !== 'playing') {
        actionArea.classList.add('hidden');
        return;
    }
    
    actionArea.classList.remove('hidden');
    
    const enemies = game.getEnemies(character);
    
    // Créer les conteneurs d'actions
    const normalActions = document.createElement('div');
    normalActions.id = 'normalActions';
    normalActions.className = 'flex gap-2 overflow-x-auto pb-2';
    
    const specialActions = document.createElement('div');
    specialActions.id = 'specialActions';
    specialActions.className = 'flex gap-2 overflow-x-auto pb-2';
    specialActions.style.display = 'none';
    
    const healActions = document.createElement('div');
    healActions.id = 'healActions';
    healActions.className = 'flex gap-2 overflow-x-auto pb-2';
    healActions.style.display = 'none';
    
    actionContent.innerHTML = '';
    actionContent.className = 'flex gap-2 overflow-x-auto pb-2 scrollbar-hide';
    actionContent.appendChild(normalActions);
    actionContent.appendChild(specialActions);
    actionContent.appendChild(healActions);
    
    normalActions.style.display = 'flex';
    
    // Attaques normales
    if (enemies.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-gray-400 text-center py-4 text-sm w-full flex-shrink-0';
        emptyMsg.textContent = 'Aucun ennemi disponible';
        normalActions.appendChild(emptyMsg);
    } else {
        enemies.forEach(enemy => {
            const card = createActionCard(
                '⚔️',
                'Attaque Normale',
                enemy.name,
                `${character.dmg} dégâts`,
                'bg-red-600 hover:bg-red-700',
                () => performNormalAttack(character, enemy)
            );
            normalActions.appendChild(card);
        });
    }
    
    // Attaques spéciales
    const className = character.constructor.name;
    let hasSpecialActions = false;
    
    if (enemies.length > 0) {
        switch (className) {
            case 'Fighter':
                if (character.mana >= 20) {
                    enemies.forEach(enemy => {
                        const card = createActionCard(
                            '👁️',
                            'Dark Vision',
                            enemy.name,
                            '5 dégâts - 20 mana',
                            'bg-purple-600 hover:bg-purple-700',
                            () => performSpecialAttack(character, enemy, null)
                        );
                        specialActions.appendChild(card);
                        hasSpecialActions = true;
                    });
                }
                break;
            case 'Paladin':
                if (character.mana >= 40) {
                    enemies.forEach(enemy => {
                        const card = createActionCard(
                            '⚡',
                            'Healing Lightning',
                            enemy.name,
                            'Soigne 5 hp - 40 mana',
                            'bg-yellow-600 hover:bg-yellow-700',
                            () => performSpecialAttack(character, enemy, null)
                        );
                        specialActions.appendChild(card);
                        hasSpecialActions = true;
                    });
                }
                break;
            case 'Monk':
                if (character.mana >= 25) {
                    const card = createActionCard(
                        '🙏',
                        'Heal',
                        'Soi-même',
                        'Soigne 8 hp - 25 mana',
                        'bg-green-600 hover:bg-green-700',
                        () => performSpecialAttack(character, character, null)
                    );
                    healActions.appendChild(card);
                    hasSpecialActions = true;
                }
                break;
            case 'Berzerker':
                const cardRage = createActionCard(
                    '💪',
                    'Rage',
                    '',
                    '+1 dégâts',
                    'bg-orange-600 hover:bg-orange-700',
                    () => performSpecialAttack(character, null, null)
                );
                specialActions.appendChild(cardRage);
                hasSpecialActions = true;
                break;
            case 'Assassin':
                if (character.mana >= 20) {
                    enemies.forEach(enemy => {
                        const card = createActionCard(
                            '🗡️',
                            'Shadow Hit',
                            enemy.name,
                            '7 dégâts - 20 mana',
                            'bg-gray-700 hover:bg-gray-800',
                            () => performSpecialAttack(character, enemy, null)
                        );
                        specialActions.appendChild(card);
                        hasSpecialActions = true;
                    });
                }
                break;
            case 'Wizard':
                if (character.mana >= 25) {
                    enemies.forEach(enemy => {
                        const card = createActionCard(
                            '🔥',
                            'Fireball',
                            enemy.name,
                            '7 dégâts - 25 mana',
                            'bg-red-700 hover:bg-red-800',
                            () => performSpecialAttack(character, enemy, null)
                        );
                        specialActions.appendChild(card);
                        hasSpecialActions = true;
                    });
                }
                break;
            case 'IceMage':
                if (character.mana >= 20) {
                    enemies.forEach(enemy => {
                        const card = createActionCard(
                            '❄️',
                            'Ice Shard',
                            enemy.name,
                            '5 dégâts, ralentit - 20 mana',
                            'bg-cyan-600 hover:bg-cyan-700',
                            () => performSpecialAttack(character, enemy, 'iceShard')
                        );
                        specialActions.appendChild(card);
                        hasSpecialActions = true;
                    });
                }
                if (character.mana >= 30) {
                    const cardArmor = createActionCard(
                        '🛡️',
                        'Frost Armor',
                        'Soi-même',
                        '+4 hp, protection - 30 mana',
                        'bg-blue-600 hover:bg-blue-700',
                        () => performSpecialAttack(character, null, 'frostArmor')
                    );
                    healActions.appendChild(cardArmor);
                    hasSpecialActions = true;
                }
                break;
        }
    }
    
    // Gérer l'état des onglets
    if (!hasSpecialActions) {
        tabSpecial.disabled = true;
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-gray-400 text-center py-4 text-sm w-full flex-shrink-0';
        emptyMsg.textContent = 'Pas assez de mana';
        specialActions.appendChild(emptyMsg);
    } else {
        tabSpecial.disabled = false;
    }
    
    if (healActions.children.length === 0) {
        tabHeal.disabled = true;
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-gray-400 text-center py-4 text-sm w-full flex-shrink-0';
        emptyMsg.textContent = 'Aucune action de soin';
        healActions.appendChild(emptyMsg);
    } else {
        tabHeal.disabled = false;
    }
    
    // Gestion des onglets
    function switchTab(tabName) {
        // Réinitialiser tous les onglets
        [tabNormal, tabSpecial, tabHeal].forEach(tab => {
            tab.classList.remove('text-white', 'border-blue-500');
            tab.classList.add('text-gray-400', 'border-transparent');
        });
        
        // Masquer tous les conteneurs
        [normalActions, specialActions, healActions].forEach(container => {
            container.style.display = 'none';
        });
        
        // Afficher le bon conteneur
        if (tabName === 'normal') {
            normalActions.style.display = 'flex';
            tabNormal.classList.remove('text-gray-400', 'border-transparent');
            tabNormal.classList.add('text-white', 'border-blue-500');
        } else if (tabName === 'special' && !tabSpecial.disabled) {
            specialActions.style.display = 'flex';
            tabSpecial.classList.remove('text-gray-400', 'border-transparent');
            tabSpecial.classList.add('text-white', 'border-blue-500');
        } else if (tabName === 'heal' && !tabHeal.disabled) {
            healActions.style.display = 'flex';
            tabHeal.classList.remove('text-gray-400', 'border-transparent');
            tabHeal.classList.add('text-white', 'border-blue-500');
        }
    }
    
    // Ajouter les listeners aux onglets
    tabNormal.onclick = () => switchTab('normal');
    tabSpecial.onclick = () => switchTab('special');
    tabHeal.onclick = () => switchTab('heal');
}

// Effectuer une attaque normale
function performNormalAttack(character, target) {
    // Vérifier que c'est bien le tour de ce personnage
    if (character !== currentTurnCharacter) {
        game.log(`❌ Ce n'est pas le tour de ${character.name} !`);
        return;
    }
    
    if (game.normalAttack(character, target)) {
        updateCharactersDisplay();
        updateStatistics();
        nextCharacterTurn();
    }
}

// Effectuer une attaque spéciale
function performSpecialAttack(character, target, attackType) {
    // Vérifier que c'est bien le tour de ce personnage
    if (character !== currentTurnCharacter) {
        game.log(`❌ Ce n'est pas le tour de ${character.name} !`);
        return;
    }
    
    if (game.specialAttack(character, target, attackType)) {
        updateCharactersDisplay();
        updateStatistics();
        nextCharacterTurn();
    }
}

// Passer au personnage suivant
function nextCharacterTurn() {
    if (game.gameEnded) {
        updateStatusVisual('💀 Partie terminée', game.currentTurn, '💀');
        actionArea.classList.add('hidden');
        return;
    }
    
    // Nettoyer turnOrder des personnages morts
    game.turnOrder = game.turnOrder.filter(char => char.status === 'playing');
    
    if (game.turnOrder.length === 0) {
        // Tous les personnages ont joué ou sont morts, commencer un nouveau tour
        game.startTurn();
        nextCharacterTurn();
        return;
    }
    
    // Prendre le premier personnage vivant de la liste
    const currentCharacter = game.turnOrder.shift();
    currentTurnCharacter = currentCharacter; // Stocker le personnage actuel
    
    updateCharactersDisplay();
    updateStatistics();
    
    if (currentCharacter.isAI) {
        // Masquer les boutons d'action quand c'est le tour d'un personnage IA
        if (actionArea) actionArea.classList.add('hidden');
        
        game.log(`🤖 ${currentCharacter.name} (IA) joue...`);
        updateStatusVisual(`🤖 ${currentCharacter.name} (IA) joue...`, game.currentTurn, '🤖');
        
        setTimeout(() => {
            const aiResult = AI.playTurn(currentCharacter, game);
            updateCharactersDisplay();
            updateStatistics();
            setTimeout(() => {
                currentTurnCharacter = null; // Réinitialiser après le tour
                nextCharacterTurn();
            }, 800);
        }, 500);
    } else {
        updateStatusVisual(`🎯 C'est votre tour, ${currentCharacter.name}!`, game.currentTurn, '🎯');
        showActionButtons(currentCharacter);
    }
}

// Toggle console - Utilise max-h pour collapsible
if (toggleConsole && consoleZone) {
    const toggleConsoleIcon = document.getElementById('toggleConsoleIcon');
    const gameConsoleContent = document.getElementById('gameConsole');
    let consoleCollapsed = false;
    
    toggleConsole.addEventListener('click', () => {
        consoleCollapsed = !consoleCollapsed;
        
        if (consoleCollapsed) {
            // Réduire la console (masquer le contenu)
            if (gameConsoleContent) {
                gameConsoleContent.classList.remove('max-h-40', 'md:max-h-52');
                gameConsoleContent.classList.add('max-h-0', 'overflow-hidden');
            }
            if (toggleConsoleIcon) toggleConsoleIcon.textContent = '▲';
        } else {
            // Agrandir la console (afficher le contenu)
            if (gameConsoleContent) {
                gameConsoleContent.classList.remove('max-h-0', 'overflow-hidden');
                gameConsoleContent.classList.add('max-h-40', 'md:max-h-52', 'overflow-y-auto');
            }
            if (toggleConsoleIcon) toggleConsoleIcon.textContent = '▼';
        }
    });
}

// Toggle thème avec persistence améliorée
if (themeToggle) {
    const html = document.documentElement;
    
    // Charger le thème sauvegardé au démarrage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.classList.remove('dark');
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        html.classList.add('dark');
        document.body.classList.remove('light-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        document.body.classList.toggle('light-mode');
        const isLight = !isDark;
        
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        if (themeIcon) {
            themeIcon.textContent = isLight ? '☀️' : '🌙';
        }
    });
}

// Écouter les événements du jeu
window.addEventListener('turnStarted', () => {
    updateStatistics();
});

window.addEventListener('gameEnded', () => {
    updateStatusVisual('💀 Partie terminée', game.currentTurn, '💀');
    actionArea.classList.add('hidden');
});

// Initialisation
showCharacterSelection();
updateCharactersDisplay();

// Exposer game globalement pour la console
window.game = game;
