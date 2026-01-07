/**
 * Gestion des badges d'effets (buffs/debuffs)
 */
export class EffectBadges {
    static render(character) {
        const effects = [];
        
        if (character.darkVisionActive) {
            effects.push({ emoji: '👁️', tooltip: 'Dark Vision active' });
        }
        if (character.shadowHitActive) {
            effects.push({ emoji: '💀', tooltip: 'Shadow Hit - Perdra 7 HP' });
        }
        if (character.rageActive) {
            effects.push({ emoji: '🔥', tooltip: 'Rage active' });
        }
        if (character.iceShardSlowActive) {
            effects.push({ emoji: '❄️', tooltip: 'Ralenti (-1 dmg)' });
        }
        if (character.frostArmorActive) {
            effects.push({ emoji: '🛡️', tooltip: 'Frost Armor actif' });
        }
        
        if (effects.length === 0) {
            return '';
        }
        
        return `
            <div class="absolute top-2 right-2 flex flex-wrap gap-1">
                ${effects.map(effect => `
                    <span class="text-xs bg-black/50 rounded-full p-1" title="${effect.tooltip}">
                        ${effect.emoji}
                    </span>
                `).join('')}
            </div>
        `;
    }
}
