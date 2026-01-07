/**
 * Classe de base pour tous les personnages
 */
export class Character {
    constructor(name, className, hp, mana, dmg) {
        this.name = name;
        this.className = className;
        this.maxHp = hp;
        this.hp = hp;
        this.maxMana = mana;
        this.mana = mana;
        this.dmg = dmg;
        this.status = 'playing';
        this.isAI = false;
        this.originalDmg = dmg;
        
        // Effets temporaires
        this.darkVisionActive = false;
        this.shadowHitActive = false;
        this.shadowHitDamage = 0;
        this.rageActive = false;
        this.iceShardSlowActive = false;
        this.frostArmorActive = false;
    }

    takeDamage(damage) {
        let finalDamage = damage;
        
        // Réduction de dégâts avec Frost Armor
        if (this.frostArmorActive) {
            finalDamage = Math.max(0, finalDamage - 3);
        }
        
        // Réduction de dégâts avec Dark Vision
        if (this.darkVisionActive) {
            finalDamage = Math.max(0, finalDamage - 2);
        }
        
        this.hp = Math.max(0, this.hp - finalDamage);
        
        if (this.hp === 0) {
            this.status = 'loser';
        }
        
        return finalDamage;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    recoverMana(amount) {
        this.mana = Math.min(this.maxMana, this.mana + amount);
    }

    useMana(amount) {
        if (this.mana >= amount) {
            this.mana -= amount;
            return true;
        }
        return false;
    }

    normalAttack(target) {
        if (target.status !== 'playing') return false;
        const damage = this.dmg;
        target.takeDamage(damage);
        return { success: true, damage };
    }
}
