// ============================================================
// ITEMS DATA
// ============================================================
// Items provide passive bonuses and level up to 5
// Add new items here following the examples

const ITEMS = {
    // ==================== DAMAGE ITEMS ====================
    
    powerGlove: {
        name: "Power Glove",
        description: "Increases all damage dealt",
        icon: "🥊",
        category: "damage",
        rarity: "common",
        maxLevel: 5,
        
        // Effect per level
        damageBonus: 0.08, // 8% per level
        
        apply: (player, level) => {
            player.damageMultiplier = (player.damageMultiplier || 1) * (1 + level * 0.08);
        }
    },
    
    criticalGem: {
        name: "Critical Gem",
        description: "Increases critical hit chance and damage",
        icon: "💎",
        category: "critical",
        rarity: "uncommon",
        maxLevel: 5,
        
        critChanceBonus: 0.05,  // 5% per level
        critDamageBonus: 0.15,   // 15% per level
        
        apply: (player, level) => {
            player.critChance += level * 0.05;
            player.critDamageMultiplier = (player.critDamageMultiplier || 2.0) + level * 0.15;
        }
    },
    
    spinachRation: {
        name: "Spinach Ration",
        description: "Raw power. Flat damage increase.",
        icon: "🥬",
        category: "damage",
        rarity: "common",
        maxLevel: 5,
        
        flatDamageBonus: 5,
        
        apply: (player, level) => {
            player.flatDamageBonus = (player.flatDamageBonus || 0) + level * 5;
        }
    },
    
    // ==================== DEFENSE ITEMS ====================
    
    armorVest: {
        name: "Armor Vest",
        description: "Reduces damage taken",
        icon: "🦺",
        category: "defense",
        rarity: "common",
        maxLevel: 5,
        
        damageReduction: 0.05, // 5% per level
        
        apply: (player, level) => {
            player.damageReduction = (player.damageReduction || 0) + level * 0.05;
        }
    },
    
    thornsMail: {
        name: "Thorns Mail",
        description: "Reflects damage back to attackers",
        icon: "🌹",
        category: "defense",
        rarity: "uncommon",
        maxLevel: 5,
        
        thornsPercent: 0.15, // 15% per level
        
        apply: (player, level) => {
            player.thornsReflect = (player.thornsReflect || 0) + level * 0.15;
        }
    },
    
    // ==================== HEALTH ITEMS ====================
    
    heartContainer: {
        name: "Heart Container",
        description: "Increases maximum health",
        icon: "❤️",
        category: "health",
        rarity: "common",
        maxLevel: 5,
        
        hpBonus: 20,
        
        apply: (player, level) => {
            const bonus = level * 20;
            const oldMax = player.maxHP;
            player.maxHP += bonus;
            // Heal proportionally
            player.hp += bonus;
        }
    },
    
    vampireTeeth: {
        name: "Vampire Teeth",
        description: "Steal life from enemies",
        icon: "🧛",
        category: "recovery",
        rarity: "uncommon",
        maxLevel: 5,
        
        lifeStealPercent: 0.04, // 4% per level
        
        apply: (player, level) => {
            player.lifeSteal = (player.lifeSteal || 0) + level * 0.04;
        }
    },
    
    regenerationRing: {
        name: "Regeneration Ring",
        description: "Slowly regenerate health over time",
        icon: "💍",
        category: "recovery",
        rarity: "common",
        maxLevel: 5,
        
        regenPerSecond: 1,
        
        apply: (player, level) => {
            player.healthRegen = (player.healthRegen || 0) + level * 1;
        }
    },
    
    // ==================== SPEED ITEMS ====================
    
    runningShoes: {
        name: "Running Shoes",
        description: "Increases movement speed",
        icon: "👟",
        category: "speed",
        rarity: "common",
        maxLevel: 5,
        
        speedBonus: 0.10, // 10% per level
        
        apply: (player, level) => {
            player.speedMultiplier = (player.speedMultiplier || 1) * (1 + level * 0.10);
        }
    },
    
    // ==================== COOLDOWN ITEMS ====================
    
    clockwork: {
        name: "Clockwork",
        description: "Reduces weapon cooldowns",
        icon: "⏰",
        category: "cooldown",
        rarity: "uncommon",
        maxLevel: 5,
        
        cooldownReduction: 0.08, // 8% per level
        
        apply: (player, level) => {
            player.cooldownReduction = (player.cooldownReduction || 0) + level * 0.08;
        }
    },
    
    // ==================== AREA ITEMS ====================
    
    telescope: {
        name: "Telescope",
        description: "Increases weapon range and area",
        icon: "🔭",
        category: "area",
        rarity: "uncommon",
        maxLevel: 5,
        
        rangeBonus: 0.12, // 12% per level
        areaBonus: 0.12,
        
        apply: (player, level) => {
            player.rangeMultiplier = (player.rangeMultiplier || 1) * (1 + level * 0.12);
            player.areaMultiplier = (player.areaMultiplier || 1) * (1 + level * 0.12);
        }
    },
    
    // ==================== PROJECTILE ITEMS ====================
    
    duplicator: {
        name: "Duplicator",
        description: "Chance to fire additional projectiles",
        icon: "✨",
        category: "projectile",
        rarity: "rare",
        maxLevel: 5,
        
        extraProjectileChance: 0.10, // 10% per level
        
        apply: (player, level) => {
            player.multiProjectileChance = (player.multiProjectileChance || 0) + level * 0.10;
        }
    },
    
    piercer: {
        name: "Piercer",
        description: "Projectiles pierce through more enemies",
        icon: "🎯",
        category: "projectile",
        rarity: "uncommon",
        maxLevel: 5,
        
        pierceBonus: 1,
        
        apply: (player, level) => {
            player.bonusPierce = (player.bonusPierce || 0) + level * 1;
        }
    },
    
    // ==================== SPECIAL ITEMS ====================
    
    luckyClover: {
        name: "Lucky Clover",
        description: "Increases gold and experience gain",
        icon: "🍀",
        category: "support",
        rarity: "uncommon",
        maxLevel: 5,
        
        goldBonus: 0.15,  // 15% per level
        xpBonus: 0.10,     // 10% per level
        
        apply: (player, level) => {
            player.goldMultiplier = (player.goldMultiplier || 1) * (1 + level * 0.15);
            player.xpMultiplier = (player.xpMultiplier || 1) * (1 + level * 0.10);
        }
    },
    
    magnet: {
        name: "Magnet",
        description: "Increases pickup range for items and XP",
        icon: "🧲",
        category: "support",
        rarity: "common",
        maxLevel: 5,
        
        pickupRange: 30, // Pixels per level
        
        apply: (player, level) => {
            player.pickupRange = (player.pickupRange || 100) + level * 30;
        }
    },
    
    wingBoots: {
        name: "Wing Boots",
        description: "Chance to dodge attacks completely",
        icon: "🪽",
        category: "defense",
        rarity: "rare",
        maxLevel: 5,
        
        dodgeChance: 0.05, // 5% per level
        
        apply: (player, level) => {
            player.dodgeChance = (player.dodgeChance || 0) + level * 0.05;
        }
    },
    
    berserkerRage: {
        name: "Berserker Rage",
        description: "Damage increases as health decreases",
        icon: "😡",
        category: "damage",
        rarity: "rare",
        maxLevel: 5,
        
        // Dynamic effect - calculated during damage
        maxDamageBonus: 0.20, // 20% per level at 1 HP
        
        apply: (player, level) => {
            player.berserkerLevel = level;
        },
        
        // This is calculated dynamically when dealing damage
        getDynamicBonus: (player, level) => {
            if (!player.berserkerLevel) return 1;
            const healthPercent = player.hp / player.maxHP;
            const missingHealthPercent = 1 - healthPercent;
            return 1 + (missingHealthPercent * player.berserkerLevel * 0.20);
        }
    },
    
    phoenixFeather: {
        name: "Phoenix Feather",
        description: "Revive once when defeated (per level)",
        icon: "🪶",
        category: "recovery",
        rarity: "legendary",
        maxLevel: 5,
        
        apply: (player, level) => {
            player.revives = (player.revives || 0) + level;
        }
    },
    
    timeStop: {
        name: "Time Stop",
        description: "Occasionally freezes all enemies briefly",
        icon: "⏸️",
        category: "support",
        rarity: "rare",
        maxLevel: 5,
        
        freezeChance: 0.02,     // 2% chance per second per level
        freezeDuration: 2000,    // 2 seconds
        
        apply: (player, level) => {
            player.timeStopLevel = level;
        },
        
        // Triggered in update loop
        passive: true,
        update: (player, level, deltaTime) => {
            if (!player.lastTimeStopCheck) player.lastTimeStopCheck = 0;
            
            const now = Date.now();
            if (now - player.lastTimeStopCheck > 1000) {
                player.lastTimeStopCheck = now;
                
                if (Math.random() < level * 0.02) {
                    // Freeze all enemies
                    enemies.forEach(enemy => {
                        enemy.frozen = true;
                        enemy.frozenUntil = now + 2000;
                    });
                    createEffect('timestop', player.x, player.y);
                }
            }
        }
    },
    
    curseBook: {
        name: "Curse Book",
        description: "Enemies deal less damage but you take more XP",
        icon: "📖",
        category: "support",
        rarity: "uncommon",
        maxLevel: 5,
        
        enemyWeakness: 0.08,  // Enemies deal 8% less per level
        xpBonus: 0.25,        // You gain 25% more XP per level
        
        apply: (player, level) => {
            player.enemyDamageReduction = (player.enemyDamageReduction || 0) + level * 0.08;
            player.xpMultiplier = (player.xpMultiplier || 1) * (1 + level * 0.25);
        }
    },
    
    soulHeart: {
        name: "Soul Heart",
        description: "Converts excess healing to temporary shields",
        icon: "💙",
        category: "recovery",
        rarity: "rare",
        maxLevel: 5,
        
        shieldConversion: 0.50, // 50% of excess healing
        maxShield: 50,          // Max shield per level
        
        apply: (player, level) => {
            player.maxShield = level * 50;
            player.shieldConversionRate = 0.50;
            if (!player.shield) player.shield = 0;
        }
    },
    
    explosiveRounds: {
        name: "Explosive Rounds",
        description: "Projectiles explode on impact",
        icon: "💥",
        category: "projectile",
        rarity: "rare",
        maxLevel: 5,
        
        explosionRadius: 40,  // Radius per level
        explosionDamage: 0.50, // 50% of projectile damage
        
        apply: (player, level) => {
            player.explosiveProjectiles = true;
            player.explosionRadius = level * 40;
            player.explosionDamagePercent = 0.50;
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ITEMS = ITEMS;
}
