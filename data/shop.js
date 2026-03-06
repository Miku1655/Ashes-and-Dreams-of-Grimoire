window.SHOP_ITEMS = {
    permanent: {
        damageBoost1: { name: 'Warrior\'s Grit I', icon: '⚔️', desc: '+10% damage all runs', cost: 500, maxLevel: 1, effect: { damageMultiplier: 0.10 } },
        damageBoost2: { name: 'Warrior\'s Grit II', icon: '⚔️', desc: '+15% more damage', cost: 1000, maxLevel: 1, requires: 'damageBoost1', effect: { damageMultiplier: 0.15 } },
        healthBoost1: { name: 'Vitality I', icon: '❤️', desc: '+20 max HP', cost: 400, maxLevel: 1, effect: { maxHP: 20 } },
        healthBoost2: { name: 'Vitality II', icon: '❤️', desc: '+30 more max HP', cost: 800, maxLevel: 1, requires: 'healthBoost1', effect: { maxHP: 30 } },
        speedBoost1: { name: 'Fleet Foot I', icon: '👟', desc: '+15% movement speed', cost: 600, maxLevel: 1, effect: { speed: 0.15 } },
        speedBoost2: { name: 'Fleet Foot II', icon: '👟', desc: '+20% more speed', cost: 1200, maxLevel: 1, requires: 'speedBoost1', effect: { speed: 0.20 } },
        itemSlot1: { name: 'Extra Pouch I', icon: '👝', desc: '+1 item slot', cost: 800, maxLevel: 1, effect: { itemSlots: 1 } },
        itemSlot2: { name: 'Extra Pouch II', icon: '👝', desc: '+1 more item slot', cost: 1500, maxLevel: 1, requires: 'itemSlot1', effect: { itemSlots: 1 } },
        critBoost1: { name: 'Sharpened Edge I', icon: '💎', desc: '+5% crit chance', cost: 700, maxLevel: 1, effect: { critChance: 0.05 } },
        critBoost2: { name: 'Sharpened Edge II', icon: '💎', desc: '+8% more crit chance', cost: 1400, maxLevel: 1, requires: 'critBoost1', effect: { critChance: 0.08 } },
        goldBoost1: { name: 'Gold Sense I', icon: '💰', desc: '+25% gold drops', cost: 500, maxLevel: 1, effect: { goldMultiplier: 0.25 } },
        goldBoost2: { name: 'Gold Sense II', icon: '💰', desc: '+35% more gold', cost: 1000, maxLevel: 1, requires: 'goldBoost1', effect: { goldMultiplier: 0.35 } },
        xpBoost1: { name: 'Scholar I', icon: '📖', desc: '+20% XP gain', cost: 600, maxLevel: 1, effect: { xpMultiplier: 0.20 } },
        xpBoost2: { name: 'Scholar II', icon: '📖', desc: '+30% more XP', cost: 1200, maxLevel: 1, requires: 'xpBoost1', effect: { xpMultiplier: 0.30 } },
        rerollUpgrade: { name: 'Fate\'s Hand', icon: '🎲', desc: 'Can reroll level-up choices', cost: 2000, maxLevel: 1, effect: { canReroll: true } },
        skipUpgrade: { name: 'Swift Path', icon: '⏭️', desc: 'Can skip level-up choice', cost: 1000, maxLevel: 1, effect: { canSkip: true } },
        banishUpgrade: { name: 'Banishment', icon: '🚫', desc: 'Remove item from pool', cost: 1500, maxLevel: 1, effect: { canBanish: true } }
    },
    consumables: {
        healthPotion: { name: 'Health Tonic', icon: '🧪', desc: '+50 max HP next run', cost: 200, effect: { maxHP: 50 } },
        damagePotion: { name: 'Rage Brew', icon: '⚗️', desc: '+20% damage next run', cost: 300, effect: { damageMultiplier: 0.20 } },
        luckPotion: { name: 'Lucky Charm', icon: '🍀', desc: '+50% gold find next run', cost: 250, effect: { goldMultiplier: 0.50 } },
        xpPotion: { name: 'Study Scroll', icon: '📜', desc: '+50% XP gain next run', cost: 250, effect: { xpMultiplier: 0.50 } },
        revivePotion: { name: 'Phoenix Vial', icon: '🔥', desc: 'Revive once next run', cost: 500, effect: { revive: true } }
    }
};
