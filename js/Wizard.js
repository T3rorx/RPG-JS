import { Character } from './Character.js';

export class Wizard extends Character {
    constructor(name) {
        super(name, 'Wizard', 10, 200, 2);
    }

    fireball(target) {
        if (this.mana < 25) return { success: false, reason: 'Pas assez de mana' };
        if (target.status !== 'playing') return { success: false, reason: 'Cible invalide' };
        
        this.useMana(25);
        const damage = 7;
        target.takeDamage(damage);
        
        return { success: true, damage };
    }
}
