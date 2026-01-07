# 🎮 RPG Combat Arena

Un jeu de combat tour par tour en JavaScript vanilla avec interface HTML/Tailwind CSS.

## 🎯 Description

Ce projet implémente un système de combat RPG où plusieurs personnages de classes différentes s'affrontent dans une arène de gladiateurs. Le jeu se joue au tour par tour, avec chaque personnage pouvant utiliser des attaques normales ou spéciales.

## 🏗️ Architecture

Le projet utilise la Programmation Orientée Objet (POO) avec JavaScript ES6+ :

- **Classe de base** : `Character` - Classe parente pour tous les personnages
- **Classes spécialisées** :
  - `Fighter` - Combattant équilibré
  - `Paladin` - Chevalier puissant et défensif
  - `Monk` - Prêtre qui peut se guérir
  - `Berzerker` - Bourrin avec attaque élevée
  - `Assassin` - Rusé et fourbe
  - `Wizard` - Puissant sage utilisant des sorts magiques
  - `IceMage` - Mage de Glace (classe custom) ❄️

- **Système de jeu** : `Game` - Gère le déroulement de la partie

## 📁 Structure des fichiers

```
RPG-JS/
├── index.html          # Interface HTML principale
├── js/
│   ├── Character.js   # Classe de base
│   ├── Fighter.js     # Classe Fighter
│   ├── Paladin.js      # Classe Paladin
│   ├── Monk.js         # Classe Monk
│   ├── Berzerker.js    # Classe Berzerker
│   ├── Assassin.js     # Classe Assassin
│   ├── Wizard.js       # Classe Wizard
│   ├── IceMage.js      # Classe IceMage (custom)
│   ├── Game.js         # Classe Game
│   └── main.js         # Point d'entrée principal
├── test.js             # Tests unitaires des classes
├── test-game.js        # Test du jeu complet
└── README.md           # Ce fichier
```

## 🎲 Classes et Capacités

### Fighter (Grace)
- **HP** : 12 | **Mana** : 40 | **Dégâts** : 4
- **Dark Vision** : 5 dégâts, coûte 20 mana, réduit les dégâts reçus de 2 au prochain tour

### Paladin (Ulder)
- **HP** : 16 | **Mana** : 160 | **Dégâts** : 3
- **Healing Lightning** : 4 dégâts, soigne de 5 hp, coûte 40 mana

### Monk (Moana)
- **HP** : 8 | **Mana** : 200 | **Dégâts** : 2
- **Heal** : Soigne de 8 hp, coûte 25 mana

### Berzerker (Draven)
- **HP** : 8 | **Mana** : 0 | **Dégâts** : 4
- **Rage** : +1 dégât permanent, -1 hp, coûte 0 mana (cumulatif)

### Assassin (Carl)
- **HP** : 6 | **Mana** : 20 | **Dégâts** : 6
- **Shadow Hit** : 7 dégâts, coûte 20 mana, immunité ce tour, perd 7 hp au tour suivant si l'adversaire survit

### Wizard (Merlin)
- **HP** : 10 | **Mana** : 200 | **Dégâts** : 2
- **Fireball** : 7 dégâts, coûte 25 mana 🔥

### IceMage (Frost) ❄️ - Custom
- **HP** : 9 | **Mana** : 180 | **Dégâts** : 3
- **Ice Shard** : 5 dégâts, coûte 20 mana, ralentit la cible (-1 dmg pendant 1 tour)
- **Frost Armor** : Soigne de 4 hp, coûte 30 mana, réduit les dégâts reçus de 3 pendant 1 tour 🛡️

## 🚀 Utilisation

### Dans le navigateur

1. Ouvrez `index.html` dans un navigateur moderne
2. Cliquez sur "Démarrer la Partie"
3. Cliquez sur "Tour Suivant" pour faire jouer chaque personnage
4. Utilisez "Voir les Stats" pour afficher les statistiques dans la console

### Dans la console JavaScript

```javascript
// Voir les statistiques
game.watchStats();

// Créer des personnages aléatoires
game.createRandomCharacters(5);

// Démarrer une partie
game.startGame();

// Commencer un tour
game.startTurn();

// Attaquer
game.normalAttack(game.characters[0], game.characters[1]);

// Attaque spéciale
game.specialAttack(game.characters[0], game.characters[1]);
```

### Tests

```bash
# Tester les classes individuelles
node test.js

# Tester le jeu complet
node test-game.js
```

## 🎮 Règles du Jeu

1. **Début de partie** : 5 personnages sont créés (par défaut ou aléatoirement)
2. **Tours** : La partie dure 10 tours maximum
3. **Ordre** : Les personnages jouent dans un ordre aléatoire à chaque tour
4. **Actions** : Chaque personnage peut :
   - Attaquer normalement (inflige ses dégâts de base)
   - Utiliser son attaque spéciale (si assez de mana)
5. **Élimination** : Un personnage avec 0 hp est éliminé
6. **Récompense** : Éliminer un adversaire donne +20 mana
7. **Fin de partie** : La partie se termine si :
   - Il ne reste qu'un survivant → Il gagne
   - Après 10 tours → Le personnage avec le plus de hp gagne

## 🛠️ Technologies

- **JavaScript ES6+** : Classes, modules, arrow functions
- **HTML5** : Structure sémantique
- **Tailwind CSS** : Framework CSS utilitaire (via CDN)
- **Programmation Orientée Objet** : Héritage, encapsulation, polymorphisme

## 📝 Fonctionnalités

- ✅ Système de combat tour par tour
- ✅ 7 classes de personnages avec attaques spéciales
- ✅ Interface utilisateur moderne avec Tailwind CSS
- ✅ Console de jeu pour suivre les actions
- ✅ Système de mana et récupération
- ✅ Génération aléatoire de personnages
- ✅ Affichage en temps réel des statistiques
- ✅ Gestion de la fin de partie

## 🔮 Améliorations futures

- [ ] Intelligence artificielle pour les personnages non-joueurs
- [ ] Interface pour choisir manuellement les actions
- [ ] Système d'ajout/suppression de personnages avant partie
- [ ] Équilibrage des classes
- [ ] Animations CSS
- [ ] Sons et effets visuels
- [ ] Statistiques de partie

## 👨‍💻 Développement

Ce projet a été développé en suivant une méthodologie Agile (Scrum adapté) avec :
- User Stories détaillées
- Tests unitaires pour chaque classe
- Architecture POO propre et maintenable
- Documentation complète

## 📄 Licence

Projet éducatif - The Hacking Project

---

**Bon jeu ! ⚔️**
