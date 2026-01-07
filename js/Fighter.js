import { Character } from './Character.js';

export class Fighter extends Character {
    constructor(name) {
        super(name, 'Fighter', 12, 40, 4);
    }

    darkVision(target) {
        if (this.mana < 20) return { success: false, reason: 'Pas assez de mana' };
        if (target.status !== 'playing') return { success: false, reason: 'Cible invalide' };
        
        this.useMana(20);
        const damage = 5;
        target.takeDamage(damage);
        target.darkVisionActive = true;
        
        return { success: true, damage };
    }
}
