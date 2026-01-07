import { Character } from './Character.js';

export class Assassin extends Character {
    constructor(name) {
        super(name, 'Assassin', 6, 20, 6);
    }

    shadowHit(target) {
        if (this.mana < 20) return { success: false, reason: 'Pas assez de mana' };
        if (target.status !== 'playing') return { success: false, reason: 'Cible invalide' };
        
        this.useMana(20);
        const damage = 7;
        target.takeDamage(damage);
        
        // L'Assassin perd 7 HP au tour suivant
        this.shadowHitActive = true;
        this.shadowHitDamage = 7;
        
        return { success: true, damage };
    }
}
