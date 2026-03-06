window.ITEMS = {
    powerGlove: {
        id: 'powerGlove', name: 'Power Glove', icon: '🥊', category: 'damage', maxLevel: 5,
        description: '+8% weapon damage per level.',
        apply(player, level) { player.damageMultiplier = (player.damageMultiplier||1) * (1 + 0.08*level); }
    },
    spinachRation: {
        id: 'spinachRation', name: 'Spinach Ration', icon: '🥬', category: 'damage', maxLevel: 5,
        description: '+5 flat damage per level.',
        apply(player, level) { player.flatDamageBonus = (player.flatDamageBonus||0) + 5*level; }
    },
    berserkerRage: {
        id: 'berserkerRage', name: 'Berserker Rage', icon: '😤', category: 'damage', maxLevel: 5,
        description: 'Damage scales with missing HP.',
        passive: true,
        apply(player, level) { player._berserkerLevel = level; },
        update(player, level) {
            const missingPct = 1 - (player.hp / player.maxHP);
            player.damageMultiplier = (player.damageMultiplier||1) * (1 + missingPct * 0.5 * level);
        }
    },
    criticalGem: {
        id: 'criticalGem', name: 'Critical Gem', icon: '💎', category: 'critical', maxLevel: 5,
        description: '+5% crit chance, +15% crit damage per level.',
        apply(player, level) {
            player.critChance = (player.critChance||0.05) + 0.05*level;
            player.critDamageMultiplier = (player.critDamageMultiplier||2.0) + 0.15*level;
        }
    },
    armorVest: {
        id: 'armorVest', name: 'Armor Vest', icon: '🦺', category: 'defense', maxLevel: 5,
        description: '-5% damage taken per level.',
        apply(player, level) { player.damageReduction = (player.damageReduction||0) + 0.05*level; }
    },
    thornsMail: {
        id: 'thornsMail', name: 'Thorns Mail', icon: '🌵', category: 'defense', maxLevel: 5,
        description: 'Reflects 15% damage per level.',
        apply(player, level) { player.thornsReflect = (player.thornsReflect||0) + 0.15*level; }
    },
    wingBoots: {
        id: 'wingBoots', name: 'Wing Boots', icon: '👟', category: 'defense', maxLevel: 5,
        description: '+5% dodge chance per level.',
        apply(player, level) { player.dodgeChance = (player.dodgeChance||0) + 0.05*level; }
    },
    heartContainer: {
        id: 'heartContainer', name: 'Heart Container', icon: '❤️', category: 'health', maxLevel: 5,
        description: '+20 max HP per level.',
        apply(player, level) { player.maxHP += 20; player.hp = Math.min(player.hp+20, player.maxHP); }
    },
    vampireTeeth: {
        id: 'vampireTeeth', name: 'Vampire Teeth', icon: '🦷', category: 'recovery', maxLevel: 5,
        description: '4% life steal per level.',
        apply(player, level) { player.lifeSteal = (player.lifeSteal||0) + 0.04*level; }
    },
    regenerationRing: {
        id: 'regenerationRing', name: 'Regen Ring', icon: '💍', category: 'recovery', maxLevel: 5,
        description: '+1 HP per second per level.',
        passive: true,
        apply(player, level) { player._regenLevel = level; },
        update(player, level, dt) { player.heal(1*level*dt); }
    },
    phoenixFeather: {
        id: 'phoenixFeather', name: 'Phoenix Feather', icon: '🪶', category: 'recovery', maxLevel: 1,
        description: 'Revive once with full HP.',
        apply(player, level) { player.revives = (player.revives||0) + 1; }
    },
    soulHeart: {
        id: 'soulHeart', name: 'Soul Heart', icon: '💜', category: 'health', maxLevel: 5,
        description: 'Excess healing becomes shields.',
        apply(player, level) { player.maxShield = (player.maxShield||0) + 30*level; }
    },
    runningShoes: {
        id: 'runningShoes', name: 'Running Shoes', icon: '👠', category: 'speed', maxLevel: 5,
        description: '+10% movement speed per level.',
        apply(player, level) { player.speedMultiplier = (player.speedMultiplier||1) * (1 + 0.1*level); }
    },
    clockwork: {
        id: 'clockwork', name: 'Clockwork', icon: '⏱️', category: 'cooldown', maxLevel: 5,
        description: '-8% weapon cooldowns per level.',
        apply(player, level) { player.cooldownReduction = (player.cooldownReduction||0) + 0.08*level; }
    },
    telescope: {
        id: 'telescope', name: 'Telescope', icon: '🔭', category: 'area', maxLevel: 5,
        description: '+12% range and area per level.',
        apply(player, level) {
            player.rangeMultiplier = (player.rangeMultiplier||1) * (1 + 0.12*level);
            player.areaMultiplier = (player.areaMultiplier||1) * (1 + 0.12*level);
        }
    },
    duplicator: {
        id: 'duplicator', name: 'Duplicator', icon: '✖️', category: 'projectile', maxLevel: 5,
        description: '+10% chance for extra projectile per level.',
        apply(player, level) { player.multiProjectileChance = (player.multiProjectileChance||0) + 0.1*level; }
    },
    piercer: {
        id: 'piercer', name: 'Piercer', icon: '📌', category: 'projectile', maxLevel: 5,
        description: '+1 pierce per level.',
        apply(player, level) { player.bonusPierce = (player.bonusPierce||0) + level; }
    },
    explosiveRounds: {
        id: 'explosiveRounds', name: 'Explosive Rounds', icon: '💥', category: 'projectile', maxLevel: 1,
        description: 'Projectiles explode on impact.',
        apply(player, level) { player.explosiveProjectiles = true; }
    },
    luckyClover: {
        id: 'luckyClover', name: 'Lucky Clover', icon: '🍀', category: 'support', maxLevel: 5,
        description: '+15% gold, +10% XP per level.',
        apply(player, level) {
            player.goldMultiplier = (player.goldMultiplier||1) * (1 + 0.15*level);
            player.xpMultiplier = (player.xpMultiplier||1) * (1 + 0.1*level);
        }
    },
    magnet: {
        id: 'magnet', name: 'Magnet', icon: '🧲', category: 'support', maxLevel: 5,
        description: '+30 pickup range per level.',
        apply(player, level) { player.pickupRange = (player.pickupRange||50) + 30*level; }
    },
    timeStop: {
        id: 'timeStop', name: 'Time Stop', icon: '⏰', category: 'support', maxLevel: 3,
        description: '2% chance/sec to freeze enemies.',
        passive: true,
        apply(player, level) { player._timeStopLevel = level; },
        update(player, level, dt, enemies) {
            if(Math.random() < 0.02*level*dt && enemies) {
                enemies.forEach(e => { e.frozen = 3; });
            }
        }
    },
    curseBook: {
        id: 'curseBook', name: 'Curse Book', icon: '📚', category: 'support', maxLevel: 5,
        description: 'Enemies deal -8% dmg, +25% XP per level.',
        apply(player, level) {
            player.enemyDamageReduction = (player.enemyDamageReduction||0) + 0.08*level;
            player.xpMultiplier = (player.xpMultiplier||1) * (1 + 0.25*level);
        }
    }
};
