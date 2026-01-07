import { Character } from './Character.js';

export class IceMage extends Character {
    constructor(name) {
        super(name, 'IceMage', 9, 180, 3);
    }

    iceShard(target) {
        if (this.mana < 20) return { success: false, reason: 'Pas assez de mana' };
        if (target.status !== 'playing') return { success: false, reason: 'Cible invalide' };
        
        this.useMana(20);
        const damage = 5;
        target.takeDamage(damage);
        
        // Ralentissement : réduit les dégâts de la cible de 1 pour 1 tour
        if (!target.originalDmg) {
            target.originalDmg = target.dmg;
        }
        target.dmg = Math.max(1, target.dmg - 1);
        target.iceShardSlowActive = true;
        
        return { success: true, damage };
    }

    frostArmor() {
        if (this.mana < 30) return { success: false, reason: 'Pas assez de mana' };
        
        this.useMana(30);
        this.heal(4);
        this.frostArmorActive = true;
        
        return { success: true, heal: 4 };
    }

    applySlowEffects() {
        // Restaurer les dégâts après l'effet de ralentissement
        if (this.iceShardSlowActive && this.originalDmg) {
            this.dmg = this.originalDmg;
            this.iceShardSlowActive = false;
            this.originalDmg = null;
        }
    }
}
