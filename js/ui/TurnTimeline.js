import { CLASS_EMOJIS } from '../config/classEmojis.js';

/**
 * Gestion de la timeline des tours
 */
export class TurnTimeline {
    static render(characters, currentCharacter) {
        const timeline = document.getElementById('turnTimeline');
        if (!timeline) return;
        
        timeline.innerHTML = '';
        
        characters.forEach((char, index) => {
            const isCurrent = char === currentCharacter;
            const isDead = char.status !== 'playing';
            const classInfo = CLASS_EMOJIS[char.className] || CLASS_EMOJIS.Fighter;
            
            const item = document.createElement('div');
            item.className = `flex-shrink-0 p-2 md:p-3 rounded-lg text-center min-w-fit transition-all ${
                isCurrent ? 'ring-2 ring-yellow-400 bg-yellow-400/20' : 'bg-gray-700'
            } ${isDead ? 'opacity-50 line-through' : ''}`;
            
            item.innerHTML = `
                <div class="text-xl md:text-2xl mb-1">${classInfo.avatar}</div>
                <div class="text-xs md:text-sm font-bold truncate max-w-[60px] md:max-w-[80px]">${char.name}</div>
                <div class="text-[10px] md:text-xs text-gray-400">#${index + 1}</div>
            `;
            
            timeline.appendChild(item);
        });
    }
}
