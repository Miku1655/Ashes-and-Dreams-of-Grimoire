window.CLASSES = {
    warrior: {
        id: 'warrior',
        name: 'WARRIOR',
        icon: '⚔️',
        color: '#c0392b',
        quote: '"I\'ll protect everyone... somehow."',
        baseHP: 140, baseSpeed: 2.7, baseArmor: 4, baseItemSlots: 6,
        startingWeapon: 'sword',
        weaponAffinity: ['melee', 'projectile'],
        itemAffinity: ['defense', 'health', 'damage']
    },
    thief: {
        id: 'thief',
        name: 'THIEF',
        icon: '🗡️',
        color: '#2c3e50',
        quote: '"Strike from the shadows, vanish like smoke."',
        baseHP: 100, baseSpeed: 3.8, baseArmor: 2, baseItemSlots: 5,
        startingWeapon: 'thiefsDagger',
        weaponAffinity: ['melee', 'projectile'],
        itemAffinity: ['critical', 'speed', 'damage']
    },
    paladin: {
        id: 'paladin',
        name: 'PALADIN',
        icon: '🛡️',
        color: '#f39c12',
        quote: '"I\'ll take the hits. You all stay safe behind me."',
        baseHP: 180, baseSpeed: 2.2, baseArmor: 8, baseItemSlots: 6,
        startingWeapon: 'paladinGreatsword',
        weaponAffinity: ['melee', 'area'],
        itemAffinity: ['defense', 'health', 'recovery']
    },
    mage: {
        id: 'mage',
        name: 'MAGE',
        icon: '🔮',
        color: '#8e44ad',
        quote: '"I won\'t hold everyone back... not anymore."',
        baseHP: 85, baseSpeed: 2.6, baseArmor: 1, baseItemSlots: 7,
        startingWeapon: 'fireball',
        weaponAffinity: ['area', 'projectile'],
        itemAffinity: ['cooldown', 'area', 'damage']
    },
    priest: {
        id: 'priest',
        name: 'PRIEST',
        icon: '✨',
        color: '#f1c40f',
        quote: '"I\'ll keep everyone alive. That\'s my promise."',
        baseHP: 110, baseSpeed: 2.5, baseArmor: 3, baseItemSlots: 6,
        startingWeapon: 'holyAura',
        weaponAffinity: ['projectile', 'area'],
        itemAffinity: ['health', 'recovery', 'support']
    },
    hunter: {
        id: 'hunter',
        name: 'HUNTER',
        icon: '🏹',
        color: '#27ae60',
        quote: '"Nothing escapes my sight in these lands."',
        baseHP: 95, baseSpeed: 3.2, baseArmor: 2, baseItemSlots: 6,
        startingWeapon: 'huntersBow',
        weaponAffinity: ['projectile', 'area'],
        itemAffinity: ['critical', 'damage', 'speed']
    },
    darkKnight: {
        id: 'darkKnight',
        name: 'DARK KNIGHT',
        icon: '💀',
        color: '#6c3483',
        quote: '"Power at any cost. That\'s the dark knight way!"',
        baseHP: 120, baseSpeed: 2.9, baseArmor: 3, baseItemSlots: 5,
        startingWeapon: 'shadowStrike',
        weaponAffinity: ['melee', 'area'],
        itemAffinity: ['damage', 'critical', 'recovery']
    },
    samurai: {
        id: 'samurai',
        name: 'SAMURAI',
        icon: '⚡',
        color: '#e74c3c',
        quote: '"One strike, one kill. The way of the sword."',
        baseHP: 125, baseSpeed: 3.0, baseArmor: 4, baseItemSlots: 5,
        startingWeapon: 'thiefsDagger',
        weaponAffinity: ['melee', 'projectile'],
        itemAffinity: ['critical', 'damage', 'speed']
    }
};
