// ============================================================
// GAME DATA - EASY CUSTOMIZATION FILE
// ============================================================
// Add new items, enemies, skills, classes, and maps here!
// Follow the examples below to create your own content.
// ============================================================

// CLASSES - Player character types
const CLASSES = {
    warrior: {
        name: "Warrior",
        description: "High HP and melee damage. Tanky frontline fighter.",
        icon: "⚔️",
        color: "#c53030",
        
        // Starting stats
        baseHP: 150,
        baseSpeed: 2.5,
        baseDamage: 15,
        baseAttackRange: 80,
        baseAttackSpeed: 1.2, // attacks per second
        baseCritChance: 0.05,
        baseCritDamage: 1.5,
        
        // Starting skill
        startingSkill: "slash"
    },
    
    ranger: {
        name: "Ranger",
        description: "Long range attacks with high speed. Glass cannon archer.",
        icon: "🏹",
        color: "#2f855a",
        
        baseHP: 100,
        baseSpeed: 3.5,
        baseDamage: 12,
        baseAttackRange: 250,
        baseAttackSpeed: 1.5,
        baseCritChance: 0.15,
        baseCritDamage: 2.0,
        
        startingSkill: "multishot"
    },
    
    mage: {
        name: "Mage",
        description: "Area damage and magical abilities. High burst damage.",
        icon: "🔮",
        color: "#5b21b6",
        
        baseHP: 80,
        baseSpeed: 2.8,
        baseDamage: 20,
        baseAttackRange: 180,
        baseAttackSpeed: 0.8,
        baseCritChance: 0.10,
        baseCritDamage: 2.5,
        
        startingSkill: "fireball"
    },
    
    priest: {
        name: "Priest",
        description: "Healing and support abilities. Sustain specialist.",
        icon: "✨",
        color: "#d97706",
        
        baseHP: 120,
        baseSpeed: 2.5,
        baseDamage: 10,
        baseAttackRange: 150,
        baseAttackSpeed: 1.0,
        baseCritChance: 0.08,
        baseCritDamage: 1.8,
        
        startingSkill: "heal"
    }
};

// SKILLS - Active and passive abilities
const SKILLS = {
    // Warrior Skills
    slash: {
        name: "Whirlwind Slash",
        description: "Damage all nearby enemies",
        icon: "⚔️",
        type: "active",
        cooldown: 8000, // milliseconds
        
        execute: (player, enemies) => {
            const range = 120;
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                if (dist <= range) {
                    enemy.takeDamage(player.damage * 1.5);
                    createEffect('slash', enemy.x, enemy.y);
                }
            });
        }
    },
    
    charge: {
        name: "Heroic Charge",
        description: "Dash forward, damaging enemies in path",
        icon: "💨",
        type: "active",
        cooldown: 10000,
        
        execute: (player, enemies) => {
            const dashDistance = 150;
            const angle = player.facingAngle || 0;
            
            player.x += Math.cos(angle) * dashDistance;
            player.y += Math.sin(angle) * dashDistance;
            
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                if (dist <= 80) {
                    enemy.takeDamage(player.damage * 2);
                    enemy.stunned = true;
                    setTimeout(() => enemy.stunned = false, 1000);
                }
            });
        }
    },
    
    // Ranger Skills
    multishot: {
        name: "Multi-Shot",
        description: "Fire 5 arrows at nearby enemies",
        icon: "🏹",
        type: "active",
        cooldown: 6000,
        
        execute: (player, enemies) => {
            const targets = enemies.slice(0, 5);
            targets.forEach(target => {
                setTimeout(() => {
                    createProjectile(player.x, player.y, target, player.damage * 0.8, '#4ade80');
                }, Math.random() * 200);
            });
        }
    },
    
    poisonArrow: {
        name: "Poison Arrow",
        description: "Arrow that deals damage over time",
        icon: "🧪",
        type: "active",
        cooldown: 12000,
        
        execute: (player, enemies) => {
            const target = findNearestEnemy(player, enemies);
            if (target) {
                createProjectile(player.x, player.y, target, player.damage, '#22c55e');
                target.poisoned = true;
                target.poisonDamage = player.damage * 0.3;
                target.poisonTicks = 5;
            }
        }
    },
    
    // Mage Skills
    fireball: {
        name: "Fireball",
        description: "Explosive projectile that damages area",
        icon: "🔥",
        type: "active",
        cooldown: 5000,
        
        execute: (player, enemies) => {
            const target = findNearestEnemy(player, enemies);
            if (target) {
                createProjectile(player.x, player.y, target, player.damage * 1.5, '#f97316', true);
            }
        }
    },
    
    iceNova: {
        name: "Ice Nova",
        description: "Freeze and damage all nearby enemies",
        icon: "❄️",
        type: "active",
        cooldown: 15000,
        
        execute: (player, enemies) => {
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                if (dist <= 200) {
                    enemy.takeDamage(player.damage * 1.2);
                    enemy.speed *= 0.5;
                    enemy.frozen = true;
                    setTimeout(() => {
                        if (enemy.frozen) {
                            enemy.speed *= 2;
                            enemy.frozen = false;
                        }
                    }, 3000);
                }
            });
        }
    },
    
    // Priest Skills
    heal: {
        name: "Holy Light",
        description: "Restore health",
        icon: "✨",
        type: "active",
        cooldown: 10000,
        
        execute: (player, enemies) => {
            const healAmount = player.maxHP * 0.25;
            player.hp = Math.min(player.maxHP, player.hp + healAmount);
            createEffect('heal', player.x, player.y);
        }
    },
    
    smite: {
        name: "Divine Smite",
        description: "Strike enemy with holy damage",
        icon: "⚡",
        type: "active",
        cooldown: 7000,
        
        execute: (player, enemies) => {
            const target = findNearestEnemy(player, enemies);
            if (target) {
                target.takeDamage(player.damage * 3);
                createEffect('lightning', target.x, target.y);
                
                // Heal on kill
                if (target.hp <= 0) {
                    player.hp = Math.min(player.maxHP, player.hp + 20);
                }
            }
        }
    }
};

// ENEMIES - Monster types with visual configurations
const ENEMY_TYPES = {
    goblin: {
        name: "Goblin",
        hp: 30,
        damage: 8,
        speed: 2,
        size: 18,
        xpValue: 15,
        goldValue: 2,
        
        // Visual configuration
        visual: {
            type: "sprite", // "sprite" or "shape"
            color: "#5a8f3a",
            secondaryColor: "#3d5c27",
            shape: "circle", // if type is "shape"
            emoji: "👺" // optional emoji overlay
        },
        
        // AI behavior
        behavior: "chase", // "chase", "ranged", "patrol"
        attackRange: 30
    },
    
    orc: {
        name: "Orc Warrior",
        hp: 60,
        damage: 15,
        speed: 1.5,
        size: 24,
        xpValue: 30,
        goldValue: 5,
        
        visual: {
            type: "sprite",
            color: "#8b4513",
            secondaryColor: "#654321",
            emoji: "🗡️"
        },
        
        behavior: "chase",
        attackRange: 35
    },
    
    skeleton: {
        name: "Skeleton Archer",
        hp: 40,
        damage: 12,
        speed: 1.8,
        size: 20,
        xpValue: 25,
        goldValue: 4,
        
        visual: {
            type: "sprite",
            color: "#e8e8e8",
            secondaryColor: "#a0a0a0",
            emoji: "💀"
        },
        
        behavior: "ranged",
        attackRange: 200
    },
    
    darkKnight: {
        name: "Dark Knight",
        hp: 120,
        damage: 25,
        speed: 1.2,
        size: 28,
        xpValue: 75,
        goldValue: 15,
        
        visual: {
            type: "sprite",
            color: "#1a1a2e",
            secondaryColor: "#0f3460",
            emoji: "⚔️"
        },
        
        behavior: "chase",
        attackRange: 40,
        isBoss: true
    },
    
    slime: {
        name: "Slime",
        hp: 25,
        damage: 5,
        speed: 1.0,
        size: 16,
        xpValue: 10,
        goldValue: 1,
        
        visual: {
            type: "sprite",
            color: "#22c55e",
            secondaryColor: "#16a34a",
            shape: "circle"
        },
        
        behavior: "patrol",
        attackRange: 25
    },
    
    demon: {
        name: "Demon",
        hp: 200,
        damage: 35,
        speed: 2.0,
        size: 32,
        xpValue: 150,
        goldValue: 30,
        
        visual: {
            type: "sprite",
            color: "#dc2626",
            secondaryColor: "#991b1b",
            emoji: "👹"
        },
        
        behavior: "chase",
        attackRange: 50,
        isBoss: true
    }
};

// MAPS - Different battlegrounds with unique features
const MAPS = {
    forgottenForest: {
        name: "Forgotten Forest",
        description: "A dark woodland filled with goblins and wild beasts",
        width: 2000,
        height: 1500,
        unlocked: true, // First map is always unlocked
        
        // Visual theme
        theme: {
            backgroundColor: "#1a3a1a",
            groundColor: "#2d5a2d",
            accentColor: "#4a7c4a",
            tilePattern: "grass"
        },
        
        // Enemy waves configuration
        waves: [
            { enemies: ["goblin", "goblin", "goblin"], count: 5 },
            { enemies: ["goblin", "slime"], count: 8 },
            { enemies: ["goblin", "orc"], count: 10 },
            { enemies: ["orc", "orc", "slime"], count: 12 },
            { enemies: ["orc", "skeleton"], count: 15 },
            { enemies: ["darkKnight"], count: 1, boss: true }
        ],
        
        // Exploration points (healing spots, treasure, etc.)
        explorationPoints: [
            { x: 300, y: 300, type: "healing", radius: 80, color: "#4ade80" },
            { x: 1700, y: 300, type: "treasure", radius: 60, color: "#fbbf24" },
            { x: 1000, y: 1200, type: "healing", radius: 80, color: "#4ade80" },
            { x: 500, y: 1000, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        // Obstacles/decorations
        obstacles: [
            { x: 500, y: 500, width: 100, height: 100, type: "tree" },
            { x: 1200, y: 600, width: 150, height: 80, type: "rock" },
            { x: 800, y: 1000, width: 120, height: 120, type: "tree" },
            { x: 1500, y: 900, width: 100, height: 100, type: "tree" }
        ]
    },
    
    ashenWasteland: {
        name: "Ashen Wasteland",
        description: "Desolate volcanic plains inhabited by demons",
        width: 2400,
        height: 1800,
        unlocked: false,
        unlockCost: 500, // Gold cost to unlock
        
        theme: {
            backgroundColor: "#2d1a1a",
            groundColor: "#4a2d2d",
            accentColor: "#7a3d3d",
            tilePattern: "rock"
        },
        
        waves: [
            { enemies: ["skeleton", "skeleton"], count: 8 },
            { enemies: ["skeleton", "orc"], count: 12 },
            { enemies: ["darkKnight"], count: 2 },
            { enemies: ["skeleton", "demon"], count: 15 },
            { enemies: ["demon", "demon"], count: 5 },
            { enemies: ["demon"], count: 1, boss: true }
        ],
        
        explorationPoints: [
            { x: 400, y: 400, type: "healing", radius: 80, color: "#4ade80" },
            { x: 2000, y: 400, type: "treasure", radius: 60, color: "#fbbf24" },
            { x: 1200, y: 1400, type: "shrine", radius: 100, color: "#a855f7" },
            { x: 800, y: 800, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        obstacles: [
            { x: 600, y: 600, width: 150, height: 150, type: "lava" },
            { x: 1400, y: 800, width: 200, height: 100, type: "rock" },
            { x: 1000, y: 1200, width: 180, height: 180, type: "lava" },
            { x: 1800, y: 1000, width: 150, height: 150, type: "rock" }
        ]
    },
    
    crystalCavern: {
        name: "Crystal Cavern",
        description: "Mysterious underground caves with magical crystals",
        width: 2200,
        height: 1600,
        unlocked: false,
        unlockCost: 1000,
        
        theme: {
            backgroundColor: "#1a1a2e",
            groundColor: "#2d2d4a",
            accentColor: "#4a4a7a",
            tilePattern: "crystal"
        },
        
        waves: [
            { enemies: ["slime", "slime"], count: 10 },
            { enemies: ["slime", "skeleton"], count: 15 },
            { enemies: ["skeleton", "darkKnight"], count: 12 },
            { enemies: ["darkKnight", "orc"], count: 10 },
            { enemies: ["demon"], count: 3 },
            { enemies: ["demon", "darkKnight"], count: 5, boss: true }
        ],
        
        explorationPoints: [
            { x: 350, y: 350, type: "crystal", radius: 70, color: "#8b5cf6" },
            { x: 1850, y: 350, type: "healing", radius: 80, color: "#4ade80" },
            { x: 1100, y: 1250, type: "crystal", radius: 70, color: "#8b5cf6" },
            { x: 700, y: 1100, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        obstacles: [
            { x: 550, y: 550, width: 120, height: 120, type: "crystal" },
            { x: 1300, y: 700, width: 160, height: 100, type: "stalagmite" },
            { x: 900, y: 1100, width: 140, height: 140, type: "crystal" },
            { x: 1600, y: 950, width: 130, height: 130, type: "stalagmite" }
        ]
    }
};

// SHOP ITEMS - Permanent upgrades and consumables
const SHOP_ITEMS = {
    permanent: {
        damageBoost1: {
            name: "Sharpened Blade",
            description: "Permanently increase damage by 10%",
            cost: 100,
            icon: "⚔️",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.damageBoost) {
                    saveData.permanentUpgrades.damageBoost = 0;
                }
                saveData.permanentUpgrades.damageBoost += 0.10;
            }
        },
        
        healthBoost1: {
            name: "Fortified Armor",
            description: "Permanently increase max HP by 20",
            cost: 100,
            icon: "🛡️",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.healthBoost) {
                    saveData.permanentUpgrades.healthBoost = 0;
                }
                saveData.permanentUpgrades.healthBoost += 20;
            }
        },
        
        speedBoost1: {
            name: "Swift Boots",
            description: "Permanently increase movement speed by 15%",
            cost: 150,
            icon: "👟",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.speedBoost) {
                    saveData.permanentUpgrades.speedBoost = 0;
                }
                saveData.permanentUpgrades.speedBoost += 0.15;
            }
        },
        
        critBoost1: {
            name: "Lucky Charm",
            description: "Permanently increase critical chance by 5%",
            cost: 200,
            icon: "🍀",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.critBoost) {
                    saveData.permanentUpgrades.critBoost = 0;
                }
                saveData.permanentUpgrades.critBoost += 0.05;
            }
        },
        
        goldBoost1: {
            name: "Greedy Ring",
            description: "Permanently increase gold drops by 25%",
            cost: 250,
            icon: "💍",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.goldBoost) {
                    saveData.permanentUpgrades.goldBoost = 0;
                }
                saveData.permanentUpgrades.goldBoost += 0.25;
            }
        },
        
        xpBoost1: {
            name: "Sage Tome",
            description: "Permanently increase XP gain by 20%",
            cost: 300,
            icon: "📚",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.xpBoost) {
                    saveData.permanentUpgrades.xpBoost = 0;
                }
                saveData.permanentUpgrades.xpBoost += 0.20;
            }
        }
    },
    
    consumables: {
        healthPotion: {
            name: "Health Potion",
            description: "Start next run with +50 max HP",
            cost: 50,
            icon: "🧪",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.consumables.healthPotion) {
                    saveData.consumables.healthPotion = 0;
                }
                saveData.consumables.healthPotion += 1;
            }
        },
        
        damagePotion: {
            name: "Strength Potion",
            description: "Start next run with +20% damage",
            cost: 75,
            icon: "💪",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.consumables.damagePotion) {
                    saveData.consumables.damagePotion = 0;
                }
                saveData.consumables.damagePotion += 1;
            }
        },
        
        luckPotion: {
            name: "Fortune Elixir",
            description: "Start next run with +50% gold find",
            cost: 100,
            icon: "✨",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.consumables.luckPotion) {
                    saveData.consumables.luckPotion = 0;
                }
                saveData.consumables.luckPotion += 1;
            }
        }
    }
};

// UPGRADES - Level-up choices during gameplay
const LEVEL_UPGRADES = [
    {
        name: "Increased Damage",
        description: "Increase attack damage by 15%",
        icon: "⚔️",
        apply: (player) => {
            player.damage *= 1.15;
        }
    },
    
    {
        name: "Health Boost",
        description: "Increase max HP by 30 and heal fully",
        icon: "❤️",
        apply: (player) => {
            player.maxHP += 30;
            player.hp = player.maxHP;
        }
    },
    
    {
        name: "Speed Enhancement",
        description: "Increase movement speed by 25%",
        icon: "💨",
        apply: (player) => {
            player.speed *= 1.25;
        }
    },
    
    {
        name: "Attack Speed",
        description: "Increase attack speed by 20%",
        icon: "⚡",
        apply: (player) => {
            player.attackSpeed *= 1.20;
        }
    },
    
    {
        name: "Extended Range",
        description: "Increase attack range by 40",
        icon: "🎯",
        apply: (player) => {
            player.attackRange += 40;
        }
    },
    
    {
        name: "Life Steal",
        description: "Heal 5% of damage dealt",
        icon: "🩸",
        apply: (player) => {
            if (!player.lifeSteal) player.lifeSteal = 0;
            player.lifeSteal += 0.05;
        }
    },
    
    {
        name: "Critical Strike",
        description: "Increase critical chance by 10%",
        icon: "💥",
        apply: (player) => {
            player.critChance += 0.10;
        }
    },
    
    {
        name: "Area Damage",
        description: "Attacks hit enemies in a small area",
        icon: "💫",
        apply: (player) => {
            player.areaDamage = true;
            player.areaRadius = 50;
        }
    },
    
    {
        name: "Thorns",
        description: "Reflect 20% of damage taken",
        icon: "🌹",
        apply: (player) => {
            if (!player.thorns) player.thorns = 0;
            player.thorns += 0.20;
        }
    },
    
    {
        name: "Regeneration",
        description: "Heal 1 HP per second",
        icon: "✨",
        apply: (player) => {
            if (!player.regen) player.regen = 0;
            player.regen += 1;
        }
    }
];
