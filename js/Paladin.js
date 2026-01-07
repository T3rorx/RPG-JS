import { Character } from './Character.js';

export class Paladin extends Character {
    constructor(name) {
        super(name, 'Paladin', 16, 160, 3);
    }

    healingLightning(target) {
        if (this.mana < 40) return { success: false, reason: 'Pas assez de mana' };
        
        this.useMana(40);
        
        if (target === this) {
            // Auto-soin
            this.heal(5);
            return { success: true, heal: 5 };
        } else if (target.status === 'playing') {
            // Soin d'un allié
            target.heal(5);
            this.heal(5);
            return { success: true, heal: 5 };
        }
        
        return { success: false, reason: 'Cible invalide' };
    }
}
