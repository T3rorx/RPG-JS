/**
 * Gestion des nombres de dégâts flottants
 */
export class DamageFloater {
    static show(targetElement, value, type = 'damage') {
        if (!targetElement) return;
        
        const floater = document.createElement('div');
        floater.className = 'fixed pointer-events-none font-bold text-lg md:text-xl font-mono z-50';
        
        // Couleur selon le type
        if (type === 'damage') {
            floater.className += ' text-red-500';
            floater.textContent = `-${value}`;
        } else if (type === 'heal') {
            floater.className += ' text-green-500';
            floater.textContent = `+${value}`;
        } else if (type === 'mana') {
            floater.className += ' text-blue-500';
            floater.textContent = `-${value} MP`;
        }
        
        const rect = targetElement.getBoundingClientRect();
        floater.style.left = `${rect.left + rect.width / 2}px`;
        floater.style.top = `${rect.top}px`;
        floater.style.transform = 'translate(-50%, 0)';
        
        document.body.appendChild(floater);
        
        // Animation
        let y = 0;
        let opacity = 1;
        const interval = setInterval(() => {
            y -= 2;
            opacity -= 0.02;
            floater.style.transform = `translate(-50%, ${y}px)`;
            floater.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(interval);
                floater.remove();
            }
        }, 16);
    }
}
