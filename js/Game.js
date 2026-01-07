import { Fighter } from './Fighter.js';
import { Paladin } from './Paladin.js';
import { Monk } from './Monk.js';
import { Berzerker } from './Berzerker.js';
import { Assassin } from './Assassin.js';
import { Wizard } from './Wizard.js';
import { IceMage } from './IceMage.js';
import { GAME_CONFIG } from './config/constants.js';
import { DamageFloater } from './ui/DamageFloater.js';
import { AnimationManager } from './ui/AnimationManager.js';

/**
 * Classe principale gérant la logique du jeu
 */
export class Game {
    constructor() {
        this.characters = [];
        this.turnOrder = [];
        this.currentTurn = 0;
        this.turnLeft = GAME_CONFIG.MAX_TURNS;
        this.playerCharacter = null;
        this.gameEnded = false;
    }

    createDefaultCharacters() {
        const names = ['Grace', 'Ulder', 'Moana', 'Draven', 'Carl', 'Frost'];
        const classes = [Fighter, Paladin, Monk, Berzerker, Assassin, IceMage];
        
        // Mélanger les classes pour avoir un ordre aléatoire
        const shuffledClasses = [...classes].sort(() => Math.random() - 0.5);
        
        this.characters = names.map((name, index) => {
            const CharacterClass = shuffledClasses[index];
            return new CharacterClass(name);
        });
        
        this.shuffleTurnOrder();
    }

    shuffleTurnOrder() {
        // Ne mélanger que les personnages vivants
        this.turnOrder = this.getAliveCharacters().sort(() => Math.random() - 0.5);
    }

    getAliveCharacters() {
        return this.characters.filter(c => c.status === 'playing');
    }

    getEnemies(character) {
        // En Battle Royale, tous les autres personnages vivants sont des ennemis
        return this.getAliveCharacters().filter(c => c !== character);
    }

    validateAttack(attacker, target, isSpecial, attackType) {
        if (!attacker || !target) {
            return { valid: false, reason: 'Cible invalide' };
        }
        
        if (attacker.status !== 'playing') {
            return { valid: false, reason: 'Le personnage ne peut pas agir' };
        }
        
        if (isSpecial && attackType !== 'heal' && target.status !== 'playing') {
            return { valid: false, reason: 'La cible est déjà éliminée' };
        }
        
        return { valid: true };
    }

    normalAttack(attacker, target) {
        const validation = this.validateAttack(attacker, target, false);
        if (!validation.valid) {
            this.log(validation.reason);
            return false;
        }
        
        const result = attacker.normalAttack(target);
        if (result && result.success) {
            this.log(`${attacker.name} attaque ${target.name} et inflige ${result.damage} dégâts. ${target.name} a ${target.hp} hp restants.`);
            
            // Animation et dégâts flottants
            const targetCard = document.querySelector(`[data-character="${target.name}"]`);
            if (targetCard) {
                AnimationManager.playAttackAnimation(targetCard);
                DamageFloater.show(targetCard, result.damage, 'damage');
            }
            
            this.checkGameEnd();
            return true;
        }
        return false;
    }

    specialAttack(attacker, target, attackType) {
        const validation = this.validateAttack(attacker, target, true, attackType);
        if (!validation.valid) {
            this.log(validation.reason);
            return false;
        }
        
        let result = null;
        const className = attacker.constructor.name;
        
        switch (className) {
            case 'Fighter':
                result = attacker.darkVision(target);
                if (result && result.success) {
                    this.log(`${attacker.name} utilise Dark Vision sur ${target.name} et inflige ${result.damage} dégâts!`);
                }
                break;
            case 'Paladin':
                result = attacker.healingLightning(target || attacker);
                if (result && result.success) {
                    const targetName = target === attacker ? 'lui-même' : target.name;
                    this.log(`${attacker.name} utilise Healing Lightning sur ${targetName} et récupère ${result.heal} hp! 💚`);
                }
                break;
            case 'Monk':
                result = attacker.healSpecial(target || attacker);
                if (result && result.success) {
                    this.log(`${attacker.name} utilise Heal sur ${target === attacker ? 'lui-même' : target.name} et récupère ${result.heal} hp! 💚`);
                }
                break;
            case 'Berzerker':
                result = attacker.rage();
                if (result && result.success) {
                    this.log(`${attacker.name} entre en Rage! +1 dégâts!`);
                }
                break;
            case 'Assassin':
                result = attacker.shadowHit(target);
                if (result && result.success) {
                    this.log(`${attacker.name} utilise Shadow Hit sur ${target.name} et inflige ${result.damage} dégâts!`);
                }
                break;
            case 'Wizard':
                result = attacker.fireball(target);
                if (result && result.success) {
                    this.log(`${attacker.name} lance Fireball sur ${target.name} et inflige ${result.damage} dégâts! 🔥`);
                }
                break;
            case 'IceMage':
                if (attackType === 'iceShard') {
                    result = attacker.iceShard(target);
                    if (result && result.success) {
                        this.log(`${attacker.name} lance Ice Shard sur ${target.name} (5 dégâts) et le ralentit! ❄️`);
                    }
                } else if (attackType === 'frostArmor') {
                    result = attacker.frostArmor();
                    if (result && result.success) {
                        this.log(`${attacker.name} active Frost Armor! +4 hp et protection contre les dégâts! ❄️`);
                    }
                }
                break;
        }
        
        if (result && result.success) {
            // Animations
            const targetCard = document.querySelector(`[data-character="${target ? target.name : attacker.name}"]`);
            if (targetCard) {
                if (attackType === 'heal' || attackType === 'frostArmor' || className === 'Paladin' || className === 'Monk') {
                    AnimationManager.playHealAnimation(targetCard);
                    if (result.heal) {
                        DamageFloater.show(targetCard, result.heal, 'heal');
                    }
                } else {
                    AnimationManager.playSpecialAnimation(targetCard);
                    if (result.damage) {
                        DamageFloater.show(targetCard, result.damage, 'damage');
                    }
                }
            }
            
            this.checkGameEnd();
            return true;
        } else if (result && result.reason) {
            this.log(result.reason);
        }
        
        return false;
    }

    checkGameEnd() {
        const alive = this.getAliveCharacters();
        if (alive.length <= 1) {
            this.endGame();
        }
    }

    endGame() {
        this.gameEnded = true;
        const alive = this.getAliveCharacters();
        
        if (alive.length === 1) {
            this.log(`🏆 ${alive[0].name} (${alive[0].className}) a gagné avec ${alive[0].hp} hp!`);
        } else if (alive.length === 0) {
            this.log('💀 Tous les personnages sont éliminés! Match nul!');
        } else {
            // Plusieurs survivants après 10 tours - celui avec le plus de HP gagne
            const winner = alive.reduce((prev, current) => (prev.hp > current.hp) ? prev : current);
            this.log(`🏆 ${winner.name} (${winner.className}) a gagné avec ${winner.hp} hp!`);
        }
        
        this.dispatchEvent('gameEnded');
    }

    startTurn() {
        if (this.gameEnded) return;
        
        const alive = this.getAliveCharacters();
        if (alive.length <= 1) {
            this.endGame();
            return;
        }
        
        if (this.turnLeft <= 0) {
            this.endGame();
            return;
        }
        
        // Appliquer les effets de fin du tour précédent AVANT de commencer le nouveau tour
        this.applyEndTurnEffects();
        
        this.currentTurn++;
        this.turnLeft--;
        this.log(`⚔️ === TOUR ${this.currentTurn} === ⚔️ (${this.turnLeft} tours restants)`);
        
        // Récupération de mana pour tous les personnages vivants
        alive.forEach(char => {
            char.recoverMana(GAME_CONFIG.MANA_RECOVERY_PER_TURN);
        });
        
        // Mélanger l'ordre des tours (seulement les vivants)
        this.shuffleTurnOrder();
        
        this.dispatchEvent('turnStarted');
    }

    applyEndTurnEffects() {
        this.characters.forEach(char => {
            // Assassin : perdre HP du Shadow Hit
            if (char.shadowHitActive) {
                char.takeDamage(char.shadowHitDamage);
                char.shadowHitActive = false;
                char.shadowHitDamage = 0;
                this.log(`💀 ${char.name} subit les dégâts du Shadow Hit!`);
            }
            
            // IceMage : restaurer les effets de ralentissement
            if (char.iceShardSlowActive) {
                char.applySlowEffects();
            }
            
            // Réinitialiser les effets temporaires
            char.darkVisionActive = false;
            char.frostArmorActive = false;
            
            // Restaurer les dégâts du Berzerker si Rage était active
            if (char.rageActive && char.dmg > char.originalDmg) {
                char.dmg = char.originalDmg;
            }
            char.rageActive = false;
        });
    }

    log(message) {
        const event = new CustomEvent('gameLog', { detail: { message } });
        window.dispatchEvent(event);
    }

    dispatchEvent(eventName) {
        const event = new CustomEvent(eventName);
        window.dispatchEvent(event);
    }
}
