# 🎮 RPG Combat Arena

A turn-based RPG combat game built with vanilla JavaScript and Tailwind CSS. Battle Royale mode where you choose your character and fight against AI-controlled opponents.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **7 Unique Character Classes**: Fighter, Paladin, Monk, Berzerker, Assassin, Wizard, and IceMage
- **Battle Royale Mode**: Free-for-all combat where only the last survivor wins
- **Turn-Based Combat**: Strategic gameplay with normal and special attacks
- **AI Opponents**: Computer-controlled characters with intelligent decision-making
- **Beautiful UI**: Modern, responsive interface built entirely with Tailwind CSS
- **Visual Feedback**: Animated health/mana bars, floating damage numbers, combat animations
- **Real-time Statistics**: Live dashboard showing game state and character status

## 🎯 Gameplay

1. **Choose Your Character**: Select from 7 unique classes at the start
2. **Battle Royale**: Fight against 5 AI-controlled opponents
3. **Turn-Based Actions**: 
   - Normal attacks (no mana cost)
   - Special attacks (mana cost varies by class)
   - Healing abilities (for certain classes)
4. **Win Conditions**: 
   - Last character standing, OR
   - Highest HP after 10 turns

## 🏗️ Architecture

### Core Classes

- **`Character`**: Base class for all characters
- **`Fighter`**: Balanced warrior with Dark Vision ability
- **`Paladin`**: Tank with Healing Lightning
- **`Monk`**: Support class with healing abilities
- **`Berzerker`**: High damage, no mana, Rage ability
- **`Assassin`**: Glass cannon with Shadow Hit
- **`Wizard`**: Magic user with Fireball
- **`IceMage`**: Custom ice mage with Ice Shard and Frost Armor

### Game Logic

- **`Game`**: Main game controller managing turns, combat, and game state
- **`AI`**: Basic AI for computer-controlled characters
- **UI Modules**: DamageFloater, AnimationManager, TurnTimeline, EffectBadges

## 📁 Project Structure

```
RPG-JS/
├── index.html              # Main HTML file
├── README.md               # This file
└── js/
    ├── main.js             # Entry point and UI logic
    ├── Game.js             # Game logic and combat system
    ├── AI.js               # AI for computer players
    ├── Character.js        # Base character class
    ├── Fighter.js          # Fighter class
    ├── Paladin.js          # Paladin class
    ├── Monk.js             # Monk class
    ├── Berzerker.js        # Berzerker class
    ├── Assassin.js         # Assassin class
    ├── Wizard.js           # Wizard class
    ├── IceMage.js          # IceMage class
    ├── config/
    │   ├── constants.js    # Game constants
    │   └── classEmojis.js   # Class emojis and colors
    ├── ui/
    │   ├── DamageFloater.js    # Floating damage numbers
    │   ├── AnimationManager.js # Combat animations
    │   └── TurnTimeline.js     # Turn order display
    └── utils/
        └── effectBadges.js      # Buff/debuff badges
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RPG-JS.git
cd RPG-JS
```

2. Open `index.html` in your web browser:
```bash
# On Linux/Mac
open index.html

# On Windows
start index.html
```

Or simply double-click `index.html` in your file explorer.

### Running Locally

You can also use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎮 How to Play

1. **Start**: The game begins with character selection
2. **Choose**: Click on your preferred character class
3. **Combat**: 
   - When it's your turn, select an action from the tabs
   - Choose a target (for attacks) or yourself (for healing)
   - Watch the AI play their turns automatically
4. **Win**: Be the last survivor or have the most HP after 10 turns!

## 🎨 Character Classes

| Class | HP | Mana | Damage | Special Ability |
|-------|----|----|--------|----------------|
| **Fighter** | 12 | 40 | 4 | Dark Vision (5 dmg, -2 dmg taken) |
| **Paladin** | 16 | 160 | 3 | Healing Lightning (heal 5 HP) |
| **Monk** | 8 | 200 | 2 | Heal (heal 8 HP) |
| **Berzerker** | 8 | 0 | 4 | Rage (+1 damage) |
| **Assassin** | 6 | 20 | 6 | Shadow Hit (7 dmg, lose 7 HP next turn) |
| **Wizard** | 10 | 200 | 2 | Fireball (7 dmg) |
| **IceMage** | 9 | 180 | 3 | Ice Shard (5 dmg, slow) / Frost Armor (heal + protection) |

## 🛠️ Technologies

- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **HTML5**: Semantic HTML structure
- **No Frameworks**: Pure vanilla JavaScript for maximum performance

## 📝 Code Style

- **ES6 Modules**: All code uses ES6 import/export
- **Object-Oriented**: Classes and inheritance for character system
- **Modular**: Separated concerns (UI, game logic, AI)
- **Tailwind Only**: No custom CSS, all styling via Tailwind utilities

## 🐛 Known Issues

- Console may need manual scrolling on very long games
- Some animations may lag on slower devices

## 🔮 Future Improvements

- [ ] Advanced AI with strategic decision-making
- [ ] More character classes
- [ ] Equipment system
- [ ] Multiplayer support
- [ ] Sound effects and music
- [ ] Mobile app version

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ using vanilla JavaScript and Tailwind CSS.

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first framework
- All the RPG games that inspired this project

---

**Enjoy the game! May the best warrior win! ⚔️**
