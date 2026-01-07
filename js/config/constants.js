/**
 * Constantes de configuration du jeu
 */
export const CLASS_STATS = {
    Fighter: { hp: 12, mana: 40, dmg: 4 },
    Paladin: { hp: 16, mana: 160, dmg: 3 },
    Monk: { hp: 8, mana: 200, dmg: 2 },
    Berzerker: { hp: 8, mana: 0, dmg: 4 },
    Assassin: { hp: 6, mana: 20, dmg: 6 },
    Wizard: { hp: 10, mana: 200, dmg: 2 },
    IceMage: { hp: 9, mana: 180, dmg: 3 },
};

export const GAME_CONFIG = {
    MAX_TURNS: 10,
    MANA_RECOVERY_PER_TURN: 20,
};
