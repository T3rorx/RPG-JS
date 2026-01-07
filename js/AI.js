/**
 * IA basique pour les personnages contrôlés par l'ordinateur
 */
export class AI {
    static playTurn(character, game) {
        if (character.status !== 'playing') {
            return { success: false, reason: `${character.name} ne peut pas jouer (status: ${character.status})` };
        }
        
        const enemies = game.getEnemies(character);
        if (enemies.length === 0) {
            return { success: false, reason: 'Aucun ennemi disponible' };
        }
        
        // Choisir un ennemi aléatoire
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        
        // 30% de chance d'utiliser une attaque spéciale si assez de mana
        const useSpecial = Math.random() < 0.3;
        const className = character.constructor.name;
        
        if (useSpecial) {
            // Essayer une attaque spéciale selon la classe
            switch (className) {
                case 'Fighter':
                    if (character.mana >= 20) {
                        return game.specialAttack(character, target);
                    }
                    break;
                case 'Paladin':
                    if (character.mana >= 40) {
                        // Soigner soi-même ou un allié aléatoire
                        const healTarget = Math.random() < 0.5 ? character : target;
                        return game.specialAttack(character, healTarget);
                    }
                    break;
                case 'Monk':
                    if (character.mana >= 25) {
                        // Se soigner
                        return game.specialAttack(character, character);
                    }
                    break;
                case 'Berzerker':
                    // Rage ne coûte pas de mana
                    return game.specialAttack(character, null, null);
                case 'Assassin':
                    if (character.mana >= 20) {
                        return game.specialAttack(character, target);
                    }
                    break;
                case 'Wizard':
                    if (character.mana >= 25) {
                        return game.specialAttack(character, target);
                    }
                    break;
                case 'IceMage':
                    if (character.mana >= 20) {
                        // 50% chance d'utiliser Ice Shard, 50% Frost Armor
                        if (Math.random() < 0.5) {
                            return game.specialAttack(character, target, 'iceShard');
                        } else if (character.mana >= 30) {
                            return game.specialAttack(character, null, 'frostArmor');
                        }
                    }
                    break;
            }
        }
        
        // Attaque normale par défaut
        return game.normalAttack(character, target);
    }
}
