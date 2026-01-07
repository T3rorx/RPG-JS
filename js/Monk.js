import { Character } from './Character.js';

export class Monk extends Character {
    constructor(name) {
        super(name, 'Monk', 8, 200, 2);
    }

    healSpecial(target) {
        if (this.mana < 25) return { success: false, reason: 'Pas assez de mana' };
        
        this.useMana(25);
        
        if (target === this || (target && target.status === 'playing')) {
            const healAmount = 8;
            target.heal(healAmount);
            return { success: true, heal: healAmount };
        }
        
        return { success: false, reason: 'Cible invalide' };
    }
}
