// ============================================================
// WEAPONS DATA
// ============================================================
// Weapons level up to 8, each level makes them stronger
// Add new weapons here following the examples

const WEAPONS = {
    // ==================== MELEE WEAPONS ====================
    
    whip: {
        name: "Holy Whip",
        description: "Attacks in an arc, hitting multiple enemies",
        icon: "🔱",
        type: "melee",
        rarity: "common",
        maxLevel: 8,
        
        // Base stats at level 1
        baseDamage: 10,
        baseRange: 120,
        baseCooldown: 800,
        baseProjectileCount: 1,
        
        // How stats scale per level
        damagePerLevel: 3,
        rangePerLevel: 10,
        cooldownReduction: 50, // Reduces by this much per level
        
        // Special evolution at max level
        evolution: {
            name: "Grimgar's Whip",
            description: "Divine weapon of legend",
            bonusDamage: 20,
            hitCount: 3  // Hits each enemy 3 times
        },
        
        // Attack pattern function
        fire: (player, level) => {
            const weaponData = WEAPONS.whip;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            // Create arc attack
            const hitCount = isEvolved ? weaponData.evolution.hitCount : 1;
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            
            for (let i = 0; i < hitCount; i++) {
                setTimeout(() => {
                    enemies.forEach(enemy => {
                        const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                        if (dist <= range) {
                            // Check if in front arc
                            const angle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                            const angleDiff = Math.abs(angle - player.facingAngle);
                            if (angleDiff < Math.PI / 2) {
                                enemy.takeDamage(finalDamage, player);
                                createEffect('slash', enemy.x, enemy.y);
                            }
                        }
                    });
                }, i * 100);
            }
        }
    },
    
    sword: {
        name: "Blade",
        description: "Fast melee strikes around you",
        icon: "⚔️",
        type: "melee",
        rarity: "common",
        maxLevel: 8,
        
        baseDamage: 15,
        baseRange: 100,
        baseCooldown: 600,
        baseProjectileCount: 1,
        
        damagePerLevel: 4,
        rangePerLevel: 8,
        cooldownReduction: 40,
        projectileCountPerLevel: 0.5, // Gets +1 every 2 levels
        
        evolution: {
            name: "Blade Storm",
            description: "Creates a storm of spinning blades",
            bonusDamage: 25,
            blades: 8
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.sword;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const bladeCount = Math.floor(1 + (level - 1) * weaponData.projectileCountPerLevel);
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalBlades = isEvolved ? weaponData.evolution.blades : bladeCount;
            
            // Spin attack
            const angleStep = (Math.PI * 2) / finalBlades;
            for (let i = 0; i < finalBlades; i++) {
                const angle = angleStep * i + player.rotation;
                const x = player.x + Math.cos(angle) * range * 0.7;
                const y = player.y + Math.sin(angle) * range * 0.7;
                
                createProjectile(x, y, {
                    damage: finalDamage,
                    dx: Math.cos(angle),
                    dy: Math.sin(angle),
                    speed: 0,
                    range: range * 0.3,
                    pierce: isEvolved ? 3 : 1,
                    color: '#4a9eff',
                    effect: 'slash',
                    homing: false,
                    lifetime: 200
                });
            }
        }
    },
    
    // ==================== PROJECTILE WEAPONS ====================
    
    magicMissile: {
        name: "Magic Missile",
        description: "Homing projectiles that seek enemies",
        icon: "🔮",
        type: "projectile",
        rarity: "common",
        maxLevel: 8,
        
        baseDamage: 8,
        baseRange: 300,
        baseCooldown: 1200,
        baseProjectileCount: 1,
        
        damagePerLevel: 2,
        rangePerLevel: 20,
        cooldownReduction: 80,
        projectileCountPerLevel: 0.5,
        
        evolution: {
            name: "Arcane Barrage",
            description: "Fires a massive barrage of seeking missiles",
            bonusDamage: 15,
            projectiles: 15
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.magicMissile;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const count = Math.floor(weaponData.baseProjectileCount + (level - 1) * weaponData.projectileCountPerLevel);
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalCount = isEvolved ? weaponData.evolution.projectiles : count;
            
            const targets = findNearestEnemies(player, enemies, finalCount);
            targets.forEach((target, index) => {
                setTimeout(() => {
                    createHomingProjectile(player.x, player.y, target, {
                        damage: finalDamage,
                        color: '#a855f7',
                        speed: 6,
                        effect: 'magic'
                    });
                }, index * 50);
            });
        }
    },
    
    fireball: {
        name: "Fireball",
        description: "Explosive projectiles that damage in an area",
        icon: "🔥",
        type: "area",
        rarity: "common",
        maxLevel: 8,
        
        baseDamage: 12,
        baseRange: 250,
        baseCooldown: 1500,
        baseProjectileCount: 1,
        baseExplosionRadius: 60,
        
        damagePerLevel: 3,
        rangePerLevel: 15,
        cooldownReduction: 100,
        projectileCountPerLevel: 0.33,
        explosionRadiusPerLevel: 5,
        
        evolution: {
            name: "Inferno",
            description: "Massive explosions that leave burning ground",
            bonusDamage: 20,
            explosionRadius: 150,
            burnDuration: 3000
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.fireball;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const count = Math.floor(weaponData.baseProjectileCount + (level - 1) * weaponData.projectileCountPerLevel);
            const explosionRadius = weaponData.baseExplosionRadius + (level - 1) * weaponData.explosionRadiusPerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalRadius = isEvolved ? weaponData.evolution.explosionRadius : explosionRadius;
            
            for (let i = 0; i < count; i++) {
                const target = findNearestEnemy(player, enemies);
                if (target) {
                    setTimeout(() => {
                        createExplosiveProjectile(player.x, player.y, target, {
                            damage: finalDamage,
                            explosionRadius: finalRadius,
                            color: '#f97316',
                            speed: 5,
                            effect: 'explosion'
                        });
                    }, i * 200);
                }
            }
        }
    },
    
    knife: {
        name: "Throwing Knives",
        description: "Fast piercing projectiles in the facing direction",
        icon: "🔪",
        type: "projectile",
        rarity: "common",
        maxLevel: 8,
        
        baseDamage: 6,
        baseRange: 200,
        baseCooldown: 400,
        baseProjectileCount: 1,
        basePierce: 1,
        
        damagePerLevel: 2,
        rangePerLevel: 15,
        cooldownReduction: 30,
        projectileCountPerLevel: 0.5,
        piercePerLevel: 0.25,
        
        evolution: {
            name: "Thousand Blades",
            description: "A deadly rain of piercing knives",
            bonusDamage: 10,
            projectiles: 12,
            pierce: 5
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.knife;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const count = Math.floor(weaponData.baseProjectileCount + (level - 1) * weaponData.projectileCountPerLevel);
            const pierce = Math.floor(weaponData.basePierce + (level - 1) * weaponData.piercePerLevel);
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalCount = isEvolved ? weaponData.evolution.projectiles : count;
            const finalPierce = isEvolved ? weaponData.evolution.pierce : pierce;
            
            const spreadAngle = 0.3;
            for (let i = 0; i < finalCount; i++) {
                const angle = player.facingAngle + (i - finalCount / 2) * spreadAngle / finalCount;
                createProjectile(player.x, player.y, {
                    damage: finalDamage,
                    dx: Math.cos(angle),
                    dy: Math.sin(angle),
                    speed: 8,
                    range: range,
                    pierce: finalPierce,
                    color: '#94a3b8',
                    effect: 'slash'
                });
            }
        }
    },
    
    // ==================== AREA WEAPONS ====================
    
    lightningRing: {
        name: "Lightning Ring",
        description: "Electric ring that expands around you",
        icon: "⚡",
        type: "area",
        rarity: "uncommon",
        maxLevel: 8,
        
        baseDamage: 10,
        baseRange: 150,
        baseCooldown: 2000,
        baseRings: 1,
        
        damagePerLevel: 3,
        rangePerLevel: 15,
        cooldownReduction: 150,
        ringsPerLevel: 0.33,
        
        evolution: {
            name: "Thunder God's Wrath",
            description: "Multiple lightning rings chain between enemies",
            bonusDamage: 25,
            rings: 5,
            chains: 3
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.lightningRing;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const rings = Math.floor(weaponData.baseRings + (level - 1) * weaponData.ringsPerLevel);
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalRings = isEvolved ? weaponData.evolution.rings : rings;
            
            for (let r = 0; r < finalRings; r++) {
                setTimeout(() => {
                    createExpandingRing(player.x, player.y, {
                        damage: finalDamage,
                        maxRadius: range,
                        color: '#60a5fa',
                        expandSpeed: 5,
                        effect: 'lightning'
                    });
                }, r * 300);
            }
        }
    },
    
    holyAura: {
        name: "Holy Aura",
        description: "Damaging aura that constantly surrounds you",
        icon: "✨",
        type: "area",
        rarity: "uncommon",
        maxLevel: 8,
        
        baseDamage: 5,
        baseRange: 120,
        baseCooldown: 500,
        
        damagePerLevel: 2,
        rangePerLevel: 10,
        cooldownReduction: 40,
        
        evolution: {
            name: "Divine Radiance",
            description: "Blindingly powerful holy damage and healing",
            bonusDamage: 15,
            healAmount: 2,
            range: 200
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.holyAura;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalRange = isEvolved ? weaponData.evolution.range : range;
            
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                if (dist <= finalRange) {
                    enemy.takeDamage(finalDamage, player);
                }
            });
            
            // Evolved version heals
            if (isEvolved && weaponData.evolution.healAmount) {
                player.hp = Math.min(player.maxHP, player.hp + weaponData.evolution.healAmount);
            }
            
            createEffect('holy', player.x, player.y);
        }
    },
    
    orbitalAxes: {
        name: "Orbital Axes",
        description: "Axes that orbit around you, damaging enemies",
        icon: "🪓",
        type: "area",
        rarity: "uncommon",
        maxLevel: 8,
        
        baseAxeCount: 2,
        baseDamage: 8,
        baseOrbitRadius: 80,
        baseCooldown: 100, // Constant rotation
        
        damagePerLevel: 2,
        axeCountPerLevel: 0.5,
        orbitRadiusPerLevel: 5,
        
        evolution: {
            name: "Vortex of Destruction",
            description: "Many axes spinning at high speed",
            bonusDamage: 15,
            axes: 8,
            rotationSpeed: 2
        },
        
        // This weapon has continuous behavior, handled in update loop
        passive: true,
        
        update: (player, level, deltaTime) => {
            const weaponData = WEAPONS.orbitalAxes;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const axeCount = Math.floor(weaponData.baseAxeCount + (level - 1) * weaponData.axeCountPerLevel);
            const radius = weaponData.baseOrbitRadius + (level - 1) * weaponData.orbitRadiusPerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const finalAxes = isEvolved ? weaponData.evolution.axes : axeCount;
            const rotSpeed = isEvolved ? weaponData.evolution.rotationSpeed : 1;
            
            if (!player.orbitalAxesRotation) player.orbitalAxesRotation = 0;
            player.orbitalAxesRotation += deltaTime * rotSpeed;
            
            const angleStep = (Math.PI * 2) / finalAxes;
            for (let i = 0; i < finalAxes; i++) {
                const angle = player.orbitalAxesRotation + angleStep * i;
                const x = player.x + Math.cos(angle) * radius;
                const y = player.y + Math.sin(angle) * radius;
                
                // Check collision with enemies
                enemies.forEach(enemy => {
                    const dist = Math.hypot(enemy.x - x, enemy.y - y);
                    if (dist <= 20) {
                        if (!enemy.axeHitCooldown || Date.now() - enemy.axeHitCooldown > 500) {
                            enemy.takeDamage(finalDamage, player);
                            enemy.axeHitCooldown = Date.now();
                        }
                    }
                });
                
                // Visual (drawn in render loop)
                if (!player.orbitalAxesVisuals) player.orbitalAxesVisuals = [];
                player.orbitalAxesVisuals[i] = { x, y, angle };
            }
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.WEAPONS = WEAPONS;
},

    // ==================== GRIMGAR THEMED WEAPONS ====================
    
    thiefsDagger: {
        name: "Thief's Dagger",
        description: "Haruhiro's signature weapon. Fast strikes with backstab bonus.",
        icon: "🗡️",
        type: "melee",
        rarity: "uncommon",
        maxLevel: 8,
        
        baseDamage: 12,
        baseRange: 90,
        baseCooldown: 500,
        baseProjectileCount: 1,
        
        damagePerLevel: 3,
        rangePerLevel: 8,
        cooldownReduction: 35,
        
        evolution: {
            name: "Spider",
            description: "Named blade of a master thief. Strikes like death itself.",
            bonusDamage: 30,
            critBonus: 0.25 // Extra 25% crit chance
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.thiefsDagger;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            
            // Quick stabs in cone
            const stabCount = isEvolved ? 5 : 3;
            const spreadAngle = Math.PI / 6;
            
            for (let i = 0; i < stabCount; i++) {
                const angle = player.facingAngle + (i - stabCount/2) * spreadAngle / stabCount;
                setTimeout(() => {
                    enemies.forEach(enemy => {
                        const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                        if (dist <= range) {
                            const enemyAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                            const angleDiff = Math.abs(enemyAngle - angle);
                            if (angleDiff < Math.PI / 8) {
                                let critBonus = isEvolved ? weaponData.evolution.critBonus : 0;
                                let dmg = finalDamage * (1 + critBonus);
                                enemy.takeDamage(dmg, player);
                                createEffect('slash', enemy.x, enemy.y);
                            }
                        }
                    });
                }, i * 50);
            }
        }
    },
    
    paladinGreatsword: {
        name: "Paladin's Greatsword",
        description: "Moguzo's heavy blade. Thanks and good-bye...",
        icon: "🗡️",
        type: "melee",
        rarity: "rare",
        maxLevel: 8,
        
        baseDamage: 25,
        baseRange: 110,
        baseCooldown: 1500,
        baseProjectileCount: 1,
        
        damagePerLevel: 6,
        rangePerLevel: 12,
        cooldownReduction: 100,
        
        evolution: {
            name: "Moguzo's Legacy",
            description: "The blade of a hero. Those it protects shall never fall.",
            bonusDamage: 40,
            shieldAllies: true
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.paladinGreatsword;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            
            // Heavy cleave
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
                if (dist <= range) {
                    enemy.takeDamage(finalDamage, player);
                    
                    // Knockback
                    const angle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                    enemy.x += Math.cos(angle) * 30;
                    enemy.y += Math.sin(angle) * 30;
                    
                    createEffect('slash', enemy.x, enemy.y);
                }
            });
            
            // Evolution: brief shield
            if (isEvolved) {
                player.shield = Math.min(player.maxShield || 50, (player.shield || 0) + 20);
            }
        }
    },
    
    shadowStrike: {
        name: "Shadow Strike",
        description: "Dark knight technique. Dash through enemies dealing damage.",
        icon: "💀",
        type: "melee",
        rarity: "uncommon",
        maxLevel: 8,
        
        baseDamage: 15,
        baseRange: 200,
        baseCooldown: 2500,
        baseProjectileCount: 1,
        
        damagePerLevel: 4,
        rangePerLevel: 20,
        cooldownReduction: 200,
        
        evolution: {
            name: "Hatred",
            description: "Pure malice given form. Consumes all in its path.",
            bonusDamage: 35,
            chains: 3
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.shadowStrike;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            
            // Dash forward
            const dashDistance = range;
            const startX = player.x;
            const startY = player.y;
            
            player.x += Math.cos(player.facingAngle) * dashDistance;
            player.y += Math.sin(player.facingAngle) * dashDistance;
            
            // Damage everything in path
            enemies.forEach(enemy => {
                // Check if enemy is in dash path
                const distToPath = Math.abs(
                    (player.y - startY) * enemy.x - 
                    (player.x - startX) * enemy.y + 
                    player.x * startY - 
                    player.y * startX
                ) / dashDistance;
                
                if (distToPath < 50) {
                    enemy.takeDamage(finalDamage, player);
                    createEffect('slash', enemy.x, enemy.y);
                }
            });
            
            createEffect('darkness', player.x, player.y);
        }
    },
    
    huntersBow: {
        name: "Hunter's Bow",
        description: "Precision ranged weapon. Never misses your mark.",
        icon: "🏹",
        type: "projectile",
        rarity: "common",
        maxLevel: 8,
        
        baseDamage: 10,
        baseRange: 350,
        baseCooldown: 900,
        baseProjectileCount: 1,
        
        damagePerLevel: 3,
        rangePerLevel: 25,
        cooldownReduction: 70,
        projectileCountPerLevel: 0.33,
        
        evolution: {
            name: "Eagle Eye",
            description: "Shots that never miss. Pierce through all foes.",
            bonusDamage: 20,
            pierce: 10
        },
        
        fire: (player, level) => {
            const weaponData = WEAPONS.huntersBow;
            const damage = weaponData.baseDamage + (level - 1) * weaponData.damagePerLevel;
            const range = weaponData.baseRange + (level - 1) * weaponData.rangePerLevel;
            const count = Math.floor(weaponData.baseProjectileCount + (level - 1) * weaponData.projectileCountPerLevel);
            const isEvolved = level >= weaponData.maxLevel;
            
            const finalDamage = damage + (isEvolved ? weaponData.evolution.bonusDamage : 0);
            const pierce = isEvolved ? weaponData.evolution.pierce : 2;
            
            const targets = findNearestEnemies(player, enemies, count);
            targets.forEach((target, index) => {
                setTimeout(() => {
                    const angle = Math.atan2(target.y - player.y, target.x - player.x);
                    createProjectile(player.x, player.y, {
                        damage: finalDamage,
                        dx: Math.cos(angle),
                        dy: Math.sin(angle),
                        speed: 12,
                        range: range,
                        pierce: pierce,
                        color: '#8b7355',
                        effect: 'hit'
                    });
                }, index * 100);
            });
        }
    }
};
