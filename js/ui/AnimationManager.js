/**
 * Gestion des animations de combat
 */
export class AnimationManager {
    static playAttackAnimation(targetElement) {
        if (!targetElement) return;
        targetElement.classList.add('animate-attack-flash');
        setTimeout(() => {
            targetElement.classList.remove('animate-attack-flash');
        }, 600);
    }

    static playHealAnimation(targetElement) {
        if (!targetElement) return;
        targetElement.classList.add('animate-heal-flash');
        setTimeout(() => {
            targetElement.classList.remove('animate-heal-flash');
        }, 600);
    }

    static playSpecialAnimation(targetElement) {
        if (!targetElement) return;
        targetElement.classList.add('animate-special-flash');
        setTimeout(() => {
            targetElement.classList.remove('animate-special-flash');
        }, 800);
    }
}
