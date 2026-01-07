import { Character } from './Character.js';

export class Berzerker extends Character {
    constructor(name) {
        super(name, 'Berzerker', 8, 0, 4);
    }

    rage() {
        if (this.mana < 0) return { success: false, reason: 'Pas assez de mana' };
        
        // Le Berzerker n'a pas de mana, donc cette attaque est toujours disponible
        this.rageActive = true;
        this.dmg += 1;
        
        return { success: true };
    }
}
