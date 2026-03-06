// GRIMGAR CHRONICLES - GAME ENGINE
'use strict';

// ============================================================
// GLOBAL STATE
// ============================================================
let canvas, ctx, minimapCanvas, minimapCtx;
let gameRunning = false, gamePaused = false;
let lastTime = 0, gameTime = 0;
let animFrameId = null;

let player = null;
let currentMap = null;
let currentMapData = null;
let enemies = [];
let projectiles = [];
let particles = [];
let effects = [];
let drops = [];

let camera = { x: 0, y: 0 };
let waveIndex = 0;
let waveState = 'waiting'; // waiting, spawning, clearing, delay
let waveDelay = 0;
let currentGroupIndex = 0;
let groupSpawnTimer = 0;
let groupSpawnCount = 0;
let groupDelayTimer = 0;
let kills = 0;
let goldEarned = 0;
let announcementTimer = 0;

let pendingLevelUps = 0;
let currentChoices = [];
let banishedItems = new Set();

let classData = null;

// ============================================================
// PLAYER CLASS
// ============================================================
class Player {
    constructor(cls, classInfo) {
        this.classId = cls;
        this.classInfo = classInfo;
        this.x = 0;
        this.y = 0;
        this.size = 14;
        this.hp = classInfo.baseHP;
        this.maxHP = classInfo.baseHP;
        this.baseSpeed = classInfo.baseSpeed;
        this.speed = classInfo.baseSpeed;
        this.armor = classInfo.baseArmor;
        this.xp = 0;
        this.level = 1;
        this.xpToNextLevel = 20;

        this.weapons = {};
        this.items = {};
        this.usedItemSlots = 0;
        this.maxItemSlots = classInfo.baseItemSlots;

        this.facingAngle = 0;
        this.moveX = 0;
        this.moveY = 0;

        // Stat multipliers (reset each recalc)
        this.damageMultiplier = 1;
        this.flatDamageBonus = 0;
        this.speedMultiplier = 1;
        this.damageReduction = 0;
        this.critChance = 0.05;
        this.critDamageMultiplier = 2.0;
        this.lifeSteal = 0;
        this.thornsReflect = 0;
        this.healthRegen = 0;
        this.goldMultiplier = 1;
        this.xpMultiplier = 1;
        this.cooldownReduction = 0;
        this.rangeMultiplier = 1;
        this.areaMultiplier = 1;
        this.multiProjectileChance = 0;
        this.bonusPierce = 0;
        this.dodgeChance = 0;
        this.pickupRange = 60;
        this.revives = 0;
        this.explosiveProjectiles = false;
        this.maxShield = 0;
        this.shield = 0;
        this.enemyDamageReduction = 0;
        this.canReroll = false;
        this.canSkip = false;
        this.canBanish = false;

        // Weapon cooldown trackers
        this.weaponTimers = {};

        // Starting weapon
        this.weapons[classInfo.startingWeapon] = 1;
        this.weaponTimers[classInfo.startingWeapon] = 0;

        // Apply shop bonuses
        SaveSystem.applyPermanentUpgrades(this);
        SaveSystem.applyConsumables(this);

        this._baseStats = {
            damageMultiplier: this.damageMultiplier,
            flatDamageBonus: this.flatDamageBonus,
            speedMultiplier: this.speedMultiplier,
            damageReduction: this.damageReduction,
            critChance: this.critChance,
            critDamageMultiplier: this.critDamageMultiplier,
            lifeSteal: this.lifeSteal,
            thornsReflect: this.thornsReflect,
            goldMultiplier: this.goldMultiplier,
            xpMultiplier: this.xpMultiplier,
            cooldownReduction: this.cooldownReduction,
            rangeMultiplier: this.rangeMultiplier,
            areaMultiplier: this.areaMultiplier,
            multiProjectileChance: this.multiProjectileChance,
            bonusPierce: this.bonusPierce,
            dodgeChance: this.dodgeChance,
            pickupRange: this.pickupRange,
            revives: this.revives,
            explosiveProjectiles: this.explosiveProjectiles,
            maxShield: this.maxShield,
            enemyDamageReduction: this.enemyDamageReduction,
            canReroll: this.canReroll,
            canSkip: this.canSkip,
            canBanish: this.canBanish,
            maxItemSlots: this.maxItemSlots
        };
    }

    recalculateStats() {
        // Reset to base
        const b = this._baseStats;
        this.damageMultiplier = b.damageMultiplier;
        this.flatDamageBonus = b.flatDamageBonus;
        this.speedMultiplier = b.speedMultiplier;
        this.damageReduction = b.damageReduction;
        this.critChance = b.critChance;
        this.critDamageMultiplier = b.critDamageMultiplier;
        this.lifeSteal = b.lifeSteal;
        this.thornsReflect = b.thornsReflect;
        this.goldMultiplier = b.goldMultiplier;
        this.xpMultiplier = b.xpMultiplier;
        this.cooldownReduction = b.cooldownReduction;
        this.rangeMultiplier = b.rangeMultiplier;
        this.areaMultiplier = b.areaMultiplier;
        this.multiProjectileChance = b.multiProjectileChance;
        this.bonusPierce = b.bonusPierce;
        this.dodgeChance = b.dodgeChance;
        this.pickupRange = b.pickupRange;
        this.revives = b.revives;
        this.explosiveProjectiles = b.explosiveProjectiles;
        this.maxShield = b.maxShield;
        this.enemyDamageReduction = b.enemyDamageReduction;
        this.canReroll = b.canReroll;
        this.canSkip = b.canSkip;
        this.canBanish = b.canBanish;
        this.maxItemSlots = b.maxItemSlots;

        // Apply all items
        for(const itemId in this.items) {
            const itemDef = ITEMS[itemId];
            if(itemDef && itemDef.apply && !itemDef.passive) {
                itemDef.apply(this, this.items[itemId]);
            }
        }

        this.speed = this.baseSpeed * this.speedMultiplier;
    }

    move(dx, dy) {
        if(dx === 0 && dy === 0) return;
        const len = Math.sqrt(dx*dx+dy*dy);
        const nx = dx/len, ny = dy/len;
        const spd = this.speed;

        const newX = this.x + nx * spd;
        const newY = this.y + ny * spd;

        const mapW = currentMapData ? currentMapData.width : 2000;
        const mapH = currentMapData ? currentMapData.height : 2000;
        this.x = Math.max(this.size, Math.min(mapW - this.size, newX));
        this.y = Math.max(this.size, Math.min(mapH - this.size, newY));

        if(dx !== 0 || dy !== 0) {
            this.facingAngle = Math.atan2(dy, dx);
        }
    }

    takeDamage(amount) {
        // Dodge
        if(Math.random() < this.dodgeChance) {
            spawnEffect('dodge', this.x, this.y);
            return;
        }
        // Enemy damage reduction
        amount *= (1 - this.enemyDamageReduction);
        // Shield
        if(this.shield > 0) {
            const absorbed = Math.min(this.shield, amount);
            this.shield -= absorbed;
            amount -= absorbed;
        }
        // Armor
        amount = amount * (1 - this.armor / (this.armor + 100));
        // Damage reduction
        amount *= (1 - this.damageReduction);
        amount = Math.max(1, Math.round(amount));

        this.hp -= amount;
        spawnEffect('hit', this.x, this.y, '#e74c3c');

        // Thorns
        if(this.thornsReflect > 0) {
            const reflect = amount * this.thornsReflect;
            enemies.forEach(e => {
                if(Math.hypot(e.x-this.x, e.y-this.y) < 60) {
                    e.takeDamage(reflect, this);
                }
            });
        }

        if(this.hp <= 0) {
            if(this.revives > 0) {
                this.revives--;
                this.hp = this.maxHP;
                spawnEffect('revive', this.x, this.y);
            } else {
                handleGameOver();
            }
        }
    }

    heal(amount) {
        if(this.hp >= this.maxHP) {
            if(this.maxShield > 0) {
                this.shield = Math.min(this.shield + amount, this.maxShield);
            }
            return;
        }
        this.hp = Math.min(this.hp + amount, this.maxHP);
        if(amount >= 1) spawnEffect('heal', this.x, this.y);
    }

    gainXP(amount) {
        amount = Math.round(amount * (this.xpMultiplier||1));
        this.xp += amount;
        while(this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = 20 + (this.level - 1) * 15;
            pendingLevelUps++;
            spawnEffect('powerup', this.x, this.y);
        }
        if(pendingLevelUps > 0 && !gamePaused) {
            showLevelUp();
        }
    }

    updateWeapons(dt) {
        for(const weaponId in this.weapons) {
            if(!this.weaponTimers[weaponId]) this.weaponTimers[weaponId] = 0;
            this.weaponTimers[weaponId] -= dt;

            if(this.weaponTimers[weaponId] <= 0) {
                const weapDef = WEAPONS[weaponId];
                if(!weapDef) continue;
                const level = this.weapons[weaponId];
                const cooldown = Math.max(0.15,
                    (weapDef.baseCooldown - (level-1)*weapDef.cooldownReduction) * (1 - this.cooldownReduction)
                );
                this.weaponTimers[weaponId] = cooldown;

                const newProjectiles = weapDef.fire(this, level, enemies, gameTime);
                if(newProjectiles) {
                    newProjectiles.forEach(p => {
                        // Extra projectile chance
                        projectiles.push(p);
                        if(Math.random() < this.multiProjectileChance) {
                            const extra = Object.assign({}, p, {
                                dx: p.dx + (Math.random()-0.5)*2,
                                dy: p.dy + (Math.random()-0.5)*2
                            });
                            projectiles.push(extra);
                        }
                    });
                }
            }
        }
    }

    updatePassiveItems(dt) {
        for(const itemId in this.items) {
            const itemDef = ITEMS[itemId];
            if(itemDef && itemDef.passive && itemDef.update) {
                itemDef.update(this, this.items[itemId], dt, enemies);
            }
        }
    }
}

// ============================================================
// ENEMY CLASS
// ============================================================
class Enemy {
    constructor(typeId, x, y) {
        const type = ENEMY_TYPES[typeId];
        if(!type) return;
        this.typeId = typeId;
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = type.size;
        this.hp = type.hp;
        this.maxHP = type.hp;
        this.damage = type.damage;
        this.speed = type.speed;
        this.behavior = type.behavior;
        this.attackRange = type.attackRange;
        this.attackCooldown = type.attackCooldown;
        this.lastAttack = 0;
        this.frozen = 0;
        this.stunned = 0;
        this.dead = false;
        this.isBoss = type.isBoss || false;
        // Wobble
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.5 + Math.random() * 2;
    }

    move(dt) {
        if(this.frozen > 0) { this.frozen -= dt; return; }
        if(this.stunned > 0) { this.stunned -= dt; return; }
        if(!player) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);

        if(this.behavior === 'ranged') {
            const minDist = this.attackRange * 0.5;
            const maxDist = this.attackRange * 0.8;
            if(dist < minDist) {
                // Back away
                this.x -= (dx/dist) * this.speed * dt * 60;
                this.y -= (dy/dist) * this.speed * dt * 60;
            } else if(dist > maxDist) {
                // Close in
                this.x += (dx/dist) * this.speed * dt * 60;
                this.y += (dy/dist) * this.speed * dt * 60;
            }
        } else {
            // Chase
            if(dist > this.size) {
                this.x += (dx/dist) * this.speed * dt * 60;
                this.y += (dy/dist) * this.speed * dt * 60;
            }
        }

        // Clamp to map
        if(currentMapData) {
            this.x = Math.max(this.size, Math.min(currentMapData.width - this.size, this.x));
            this.y = Math.max(this.size, Math.min(currentMapData.height - this.size, this.y));
        }

        this.wobble += this.wobbleSpeed * dt;
    }

    attack(now) {
        if(!player) return;
        if(now - this.lastAttack < this.attackCooldown * 1000) return;
        const dist = Math.hypot(player.x - this.x, player.y - this.y);

        if(this.behavior === 'ranged') {
            if(dist < this.attackRange) {
                this.lastAttack = now;
                // Fire enemy projectile
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                const spread = (Math.random()-0.5)*0.2;
                projectiles.push({
                    x: this.x, y: this.y,
                    dx: Math.cos(angle+spread)*5, dy: Math.sin(angle+spread)*5,
                    speed: 5, damage: this.damage,
                    range: this.attackRange, lifetime: this.attackRange/5,
                    pierce: 1, color: '#e74c3c', size: 8,
                    isEnemyProjectile: true
                });
                spawnEffect('slash', this.x, this.y, '#e74c3c');
            }
        } else {
            if(dist < this.size + (player.size || 14) + 5) {
                this.lastAttack = now;
                player.takeDamage(this.damage);
            }
        }
    }

    takeDamage(amount, attackingPlayer) {
        if(this.dead) return;
        this.hp -= amount;
        spawnEffect('hit', this.x, this.y, '#e74c3c');
        // Life steal
        if(attackingPlayer && attackingPlayer.lifeSteal > 0) {
            attackingPlayer.heal(amount * attackingPlayer.lifeSteal);
        }
        if(this.hp <= 0) this.die();
    }

    die() {
        if(this.dead) return;
        this.dead = true;
        kills++;

        // Drop gold
        const goldAmt = Math.round((this.type.gold || 1) * (player ? player.goldMultiplier : 1));
        drops.push({
            x: this.x, y: this.y, type: 'gold', value: goldAmt,
            size: 8, lifetime: 15, color: '#f1c40f'
        });

        // Drop XP
        drops.push({
            x: this.x + (Math.random()-0.5)*20, y: this.y + (Math.random()-0.5)*20,
            type: 'xp', value: this.type.xp || 10,
            size: 7, lifetime: 15, color: '#9b59b6'
        });

        // Particles
        for(let i=0;i<8;i++) {
            const angle = (i/8)*Math.PI*2;
            particles.push({
                x: this.x, y: this.y,
                dx: Math.cos(angle)*2, dy: Math.sin(angle)*2,
                life: 0.5, maxLife: 0.5, color: this.type.visual.color, size: 4
            });
        }
    }
}

// ============================================================
// EFFECTS
// ============================================================
function spawnEffect(type, x, y, color) {
    effects.push({ type, x, y, color: color||'#fff', life: 0.3, maxLife: 0.3 });
}

// ============================================================
// GAME INIT
// ============================================================
function initGame(classId, mapId) {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    minimapCanvas = document.getElementById('minimap');
    minimapCtx = minimapCanvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    classData = CLASSES[classId];
    currentMapData = MAPS.find(m => m.id === mapId);
    if(!currentMapData || !classData) { console.error('Missing data'); return; }

    // Reset state
    enemies = []; projectiles = []; particles = []; effects = []; drops = [];
    waveIndex = 0; waveState = 'delay'; waveDelay = 3;
    currentGroupIndex = 0; groupSpawnTimer = 0; groupSpawnCount = 0; groupDelayTimer = 0;
    kills = 0; goldEarned = 0; gameTime = 0; pendingLevelUps = 0;
    banishedItems = new Set();
    announcementTimer = 0;
    gamePaused = false; gameRunning = true;

    // Create player
    player = new Player(classId, classData);
    player.x = currentMapData.width / 2;
    player.y = currentMapData.height / 2;

    // Camera
    camera.x = player.x - canvas.width/2;
    camera.y = player.y - canvas.height/2;

    // Input
    setupInput();
    hideAllOverlays();

    // Start loop
    lastTime = performance.now();
    if(animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);

    // Initial announcement
    showAnnouncement('⚔ SURVIVE AND CONQUER!', 2);

    SaveSystem.data.stats.gamesPlayed++;
    SaveSystem.save();
}

function resizeCanvas() {
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ============================================================
// INPUT
// ============================================================
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if(e.code === 'Escape' && gameRunning) togglePause();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function setupInput() {
    // Nothing extra needed, using global key listener
}

function getInput() {
    let dx = 0, dy = 0;
    if(keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
    if(keys['KeyD'] || keys['ArrowRight']) dx += 1;
    if(keys['KeyW'] || keys['ArrowUp']) dy -= 1;
    if(keys['KeyS'] || keys['ArrowDown']) dy += 1;
    return { dx, dy };
}

// ============================================================
// GAME LOOP
// ============================================================
function gameLoop(timestamp) {
    if(!gameRunning) return;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    if(!gamePaused) {
        gameTime += dt;
        update(dt, timestamp);
    }
    render();
    updateHUD();

    animFrameId = requestAnimationFrame(gameLoop);
}

// ============================================================
// UPDATE
// ============================================================
function update(dt, now) {
    updateWaveSystem(dt);
    updatePlayerMovement(dt);
    if(player) player.updateWeapons(dt);
    if(player) player.updatePassiveItems(dt);
    updateEnemies(dt, now);
    updateProjectiles(dt);
    updateParticles(dt);
    updateEffects(dt);
    updateDrops(dt);
    checkCollisions();

    // Announcement timer
    if(announcementTimer > 0) {
        announcementTimer -= dt;
        if(announcementTimer <= 0) {
            document.getElementById('wave-announcement').classList.add('hidden');
        }
    }
}

// ============================================================
// WAVE SYSTEM
// ============================================================
function updateWaveSystem(dt) {
    if(waveIndex >= currentMapData.waves.length) return;

    const wave = currentMapData.waves[waveIndex];

    if(waveState === 'delay') {
        waveDelay -= dt;
        if(waveDelay <= 0) {
            startWave();
        }
        return;
    }

    if(waveState === 'spawning') {
        const groups = wave.groups;
        if(currentGroupIndex >= groups.length) {
            waveState = 'clearing';
            return;
        }

        const group = groups[currentGroupIndex];

        // Handle group delay
        if(groupDelayTimer > 0) {
            groupDelayTimer -= dt;
            return;
        }

        groupSpawnTimer -= dt;
        if(groupSpawnTimer <= 0 && groupSpawnCount < group.count) {
            groupSpawnTimer = group.spawnDelay || 0.5;
            spawnEnemyFromGroup(group);
            groupSpawnCount++;

            if(groupSpawnCount >= group.count) {
                currentGroupIndex++;
                groupSpawnCount = 0;
                if(currentGroupIndex < groups.length) {
                    const nextGroup = groups[currentGroupIndex];
                    groupDelayTimer = nextGroup.delayBefore || 0;
                    if(nextGroup.announcement) {
                        showAnnouncement(nextGroup.announcement, 2.5);
                    }
                }
            }
        }
    }

    if(waveState === 'clearing' || waveState === 'spawning') {
        // Check if all enemies dead
        if(enemies.length === 0 && currentGroupIndex >= wave.groups.length) {
            if(waveIndex === currentMapData.waves.length - 1) {
                // Boss/final wave cleared
                handleVictory();
            } else {
                waveState = 'delay';
                waveDelay = wave.delay || 5;
                waveIndex++;
                SaveSystem.data.stats.highestWave = Math.max(SaveSystem.data.stats.highestWave, waveIndex);
                SaveSystem.save();
            }
        }
    }
}

function startWave() {
    if(waveIndex >= currentMapData.waves.length) return;
    const wave = currentMapData.waves[waveIndex];
    waveState = 'spawning';
    currentGroupIndex = 0;
    groupSpawnCount = 0;
    groupSpawnTimer = 0;
    groupDelayTimer = 0;

    const firstGroup = wave.groups[0];
    const announcement = wave.name || `Wave ${waveIndex+1}`;
    showAnnouncement(announcement, 3);

    if(firstGroup.delayBefore) groupDelayTimer = firstGroup.delayBefore;
}

function spawnEnemyFromGroup(group) {
    const pool = group.enemies;
    const typeId = pool[Math.floor(Math.random() * pool.length)];
    const mapW = currentMapData.width, mapH = currentMapData.height;
    const cx = currentMapData.width/2, cy = currentMapData.height/2;

    // Spawn off screen
    let x, y;
    const edge = Math.floor(Math.random()*4);
    if(edge===0) { x=Math.random()*mapW; y=0; }
    else if(edge===1) { x=Math.random()*mapW; y=mapH; }
    else if(edge===2) { x=0; y=Math.random()*mapH; }
    else { x=mapW; y=Math.random()*mapH; }

    // Clamp near player but not too close
    if(player) {
        const angle = Math.random()*Math.PI*2;
        const dist = 400 + Math.random()*200;
        x = player.x + Math.cos(angle)*dist;
        y = player.y + Math.sin(angle)*dist;
        x = Math.max(20, Math.min(mapW-20, x));
        y = Math.max(20, Math.min(mapH-20, y));
    }

    enemies.push(new Enemy(typeId, x, y));
}

// ============================================================
// PLAYER MOVEMENT
// ============================================================
function updatePlayerMovement(dt) {
    if(!player) return;
    const { dx, dy } = getInput();

    if(dx !== 0 || dy !== 0) {
        player.moveX = dx;
        player.moveY = dy;
        player.move(dx, dy);
    }
}

// ============================================================
// UPDATE ENEMIES
// ============================================================
function updateEnemies(dt, now) {
    for(let i = enemies.length-1; i>=0; i--) {
        const e = enemies[i];
        if(e.dead) { enemies.splice(i,1); continue; }
        e.move(dt);
        e.attack(now);
    }
}

// ============================================================
// UPDATE PROJECTILES
// ============================================================
function updateProjectiles(dt) {
    for(let i = projectiles.length-1; i>=0; i--) {
        const p = projectiles[i];
        p.lifetime -= dt;
        if(p.lifetime <= 0) { projectiles.splice(i,1); continue; }

        // Homing
        if(p.homing && enemies.length > 0) {
            let nearest = null, nearDist = Infinity;
            enemies.forEach(e => {
                const d = Math.hypot(e.x-p.x, e.y-p.y);
                if(d < nearDist) { nearDist=d; nearest=e; }
            });
            if(nearest) {
                const ax = nearest.x - p.x;
                const ay = nearest.y - p.y;
                const ad = Math.hypot(ax,ay);
                p.dx += (ax/ad)*p.speed*(p.homingStrength||0.1);
                p.dy += (ay/ad)*p.speed*(p.homingStrength||0.1);
                // Normalize
                const spd = Math.hypot(p.dx,p.dy);
                p.dx = (p.dx/spd)*p.speed;
                p.dy = (p.dy/spd)*p.speed;
            }
        }

        p.x += p.dx;
        p.y += p.dy;
    }
}

// ============================================================
// CHECK COLLISIONS
// ============================================================
function checkCollisions() {
    if(!player) return;

    // Player projectiles vs enemies
    for(let pi = projectiles.length-1; pi>=0; pi--) {
        const p = projectiles[pi];
        if(p.isEnemyProjectile) continue;

        const hitEnemies = [];
        for(let ei = enemies.length-1; ei>=0; ei--) {
            const e = enemies[ei];
            if(e.dead) continue;
            const dist = Math.hypot(e.x-p.x, e.y-p.y);
            if(dist < e.size + p.size) {
                hitEnemies.push(e);
            }
        }

        if(hitEnemies.length > 0) {
            hitEnemies.forEach(e => {
                e.takeDamage(p.damage, player);
                // Knockback
                if(p.knockback) {
                    const dx = e.x - player.x, dy = e.y - player.y;
                    const d = Math.hypot(dx,dy);
                    e.x += (dx/d)*p.knockback;
                    e.y += (dy/d)*p.knockback;
                }
                // Shield on hit
                if(p.shieldOnHit) {
                    player.shield = Math.min((player.shield||0) + p.shieldOnHit, player.maxShield||100);
                }
                // Heal on hit (holy)
                if(p.healOnHit) {
                    player.heal(p.healOnHit);
                }
                // Explosion
                if(p.explosive) {
                    const expRadius = 50;
                    enemies.forEach(e2 => {
                        if(e2!==e && !e2.dead && Math.hypot(e2.x-p.x,e2.y-p.y)<expRadius) {
                            e2.takeDamage(p.damage*0.5, player);
                        }
                    });
                    spawnEffect('explosion', p.x, p.y);
                    for(let i=0;i<12;i++){
                        const a=(i/12)*Math.PI*2;
                        particles.push({x:p.x,y:p.y,dx:Math.cos(a)*3,dy:Math.sin(a)*3,life:0.4,maxLife:0.4,color:'#e67e22',size:5});
                    }
                }
            });

            p.pierce = (p.pierce||1) - hitEnemies.length;
            if(p.pierce <= 0) {
                projectiles.splice(pi, 1);
            }
        }
    }

    // Enemy projectiles vs player
    for(let pi = projectiles.length-1; pi>=0; pi--) {
        const p = projectiles[pi];
        if(!p.isEnemyProjectile) continue;
        const dist = Math.hypot(player.x-p.x, player.y-p.y);
        if(dist < player.size + p.size) {
            player.takeDamage(p.damage);
            projectiles.splice(pi, 1);
        }
    }

    // Player pickup drops
    for(let di = drops.length-1; di>=0; di--) {
        const d = drops[di];
        const dist = Math.hypot(player.x-d.x, player.y-d.y);
        if(dist < (player.pickupRange||60)) {
            // Magnet pull
            const pull = 3;
            const angle = Math.atan2(player.y-d.y, player.x-d.x);
            d.x += Math.cos(angle)*pull;
            d.y += Math.sin(angle)*pull;
        }
        if(Math.hypot(player.x-d.x, player.y-d.y) < player.size + d.size) {
            if(d.type === 'gold') {
                goldEarned += d.value;
                SaveSystem.addGold(d.value);
            } else if(d.type === 'xp') {
                player.gainXP(d.value);
            }
            spawnEffect('gold', d.x, d.y, '#f1c40f');
            drops.splice(di, 1);
        }
    }
}

// ============================================================
// UPDATE PARTICLES / EFFECTS / DROPS
// ============================================================
function updateParticles(dt) {
    for(let i=particles.length-1;i>=0;i--) {
        const p=particles[i];
        p.x+=p.dx; p.y+=p.dy;
        p.life-=dt;
        if(p.life<=0) particles.splice(i,1);
    }
}

function updateEffects(dt) {
    for(let i=effects.length-1;i>=0;i--) {
        effects[i].life-=dt;
        if(effects[i].life<=0) effects.splice(i,1);
    }
}

function updateDrops(dt) {
    for(let i=drops.length-1;i>=0;i--) {
        drops[i].lifetime-=dt;
        if(drops[i].lifetime<=0) drops.splice(i,1);
    }
}

// ============================================================
// RENDER
// ============================================================
function render() {
    if(!canvas||!ctx) return;
    const W=canvas.width, H=canvas.height;

    // Update camera
    if(player) {
        const targetX = player.x - W/2;
        const targetY = player.y - H/2;
        camera.x += (targetX - camera.x) * 0.1;
        camera.y += (targetY - camera.y) * 0.1;
        if(currentMapData) {
            camera.x = Math.max(0, Math.min(currentMapData.width - W, camera.x));
            camera.y = Math.max(0, Math.min(currentMapData.height - H, camera.y));
        }
    }

    ctx.save();
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

    // Background
    const mapW = currentMapData ? currentMapData.width : 2000;
    const mapH = currentMapData ? currentMapData.height : 2000;
    ctx.fillStyle = currentMapData ? currentMapData.theme.backgroundColor : '#0a0a0f';
    ctx.fillRect(0,0,mapW,mapH);

    // Ground grid
    drawGrid();

    // Drops
    renderDrops();

    // Particles
    renderParticles();

    // Effects
    renderEffects();

    // Enemy projectiles
    renderProjectiles(true);

    // Player projectiles
    renderProjectiles(false);

    // Enemies
    renderEnemies();

    // Player
    renderPlayer();

    ctx.restore();

    // Minimap
    renderMinimap();
}

function drawGrid() {
    if(!currentMapData) return;
    const mapW=currentMapData.width, mapH=currentMapData.height;
    ctx.strokeStyle = currentMapData.theme.accentColor + '33';
    ctx.lineWidth = 1;
    const gridSize = 100;
    for(let x=0;x<mapW;x+=gridSize) {
        ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,mapH);ctx.stroke();
    }
    for(let y=0;y<mapH;y+=gridSize) {
        ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(mapW,y);ctx.stroke();
    }
    // Border
    ctx.strokeStyle = currentMapData.theme.accentColor + '88';
    ctx.lineWidth = 3;
    ctx.strokeRect(2,2,mapW-4,mapH-4);
}

function renderPlayer() {
    if(!player) return;
    ctx.save();
    ctx.translate(player.x, player.y);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, player.size*0.6, player.size*0.9, player.size*0.4, 0, 0, Math.PI*2);
    ctx.fill();

    // Body
    const gradient = ctx.createRadialGradient(0,0,0,0,0,player.size);
    gradient.addColorStop(0, classData ? classData.color + 'ff' : '#fff');
    gradient.addColorStop(1, classData ? classData.color + '88' : '#888');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0,0,player.size,0,Math.PI*2);
    ctx.fill();

    // Icon
    ctx.font = `${player.size*1.2}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(classData ? classData.icon : '⚔️', 0, 1);

    // Shield indicator
    if(player.shield > 0) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(0,0,player.size+4,0,Math.PI*2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    ctx.restore();
}

function renderEnemies() {
    enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, e.size*0.7, e.size*0.9, e.size*0.35, 0, 0, Math.PI*2);
        ctx.fill();

        // Frozen overlay
        if(e.frozen > 0) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#aed6f1';
            ctx.beginPath();
            ctx.arc(0,0,e.size+2,0,Math.PI*2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Body
        const gradient = ctx.createRadialGradient(0,0,0,0,0,e.size);
        gradient.addColorStop(0, e.type.visual.color);
        gradient.addColorStop(1, e.type.visual.secondaryColor);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0,0,e.size,0,Math.PI*2);
        ctx.fill();

        // Boss glow
        if(e.isBoss) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5 + Math.sin(gameTime*4)*0.3;
            ctx.beginPath();
            ctx.arc(0,0,e.size+6,0,Math.PI*2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Emoji
        ctx.font = `${Math.round(e.size*1.1)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.type.visual.emoji, 0, 1);

        // HP bar (for bosses or damaged enemies)
        if(e.hp < e.maxHP || e.isBoss) {
            const barW = e.size*2.5;
            const barH = e.isBoss ? 6 : 4;
            const by = -(e.size+10);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-barW/2, by, barW, barH);
            const pct = e.hp / e.maxHP;
            ctx.fillStyle = pct > 0.5 ? '#27ae60' : pct > 0.25 ? '#f39c12' : '#c0392b';
            ctx.fillRect(-barW/2, by, barW*pct, barH);
        }

        ctx.restore();
    });
}

function renderProjectiles(isEnemy) {
    projectiles.forEach(p => {
        if(p.isEnemyProjectile !== isEnemy) return;
        ctx.save();
        ctx.translate(p.x, p.y);

        const alpha = Math.min(1, p.lifetime * 3);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color || '#fff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color || '#fff';
        ctx.beginPath();
        ctx.arc(0,0,p.size||6,0,Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    });
}

function renderParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life/p.maxLife;
        ctx.fillStyle = p.color || '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size||3, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    });
}

function renderEffects() {
    effects.forEach(e => {
        ctx.save();
        const alpha = e.life/e.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = e.color;
        const size = (1-alpha) * 20 + 8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, size, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    });
}

function renderDrops() {
    drops.forEach(d => {
        ctx.save();
        ctx.translate(d.x, d.y);
        const bounce = Math.sin(gameTime*4 + d.x)*2;
        ctx.translate(0, bounce);
        ctx.fillStyle = d.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = d.color;
        ctx.beginPath();
        ctx.arc(0,0,d.size,0,Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    });
}

function renderMinimap() {
    if(!minimapCtx || !currentMapData) return;
    const mW=150, mH=110;
    const scaleX = mW/currentMapData.width;
    const scaleY = mH/currentMapData.height;

    minimapCtx.clearRect(0,0,mW,mH);
    minimapCtx.fillStyle = currentMapData.theme.backgroundColor;
    minimapCtx.fillRect(0,0,mW,mH);

    // Enemies
    minimapCtx.fillStyle = '#e74c3c';
    enemies.forEach(e => {
        minimapCtx.fillRect(e.x*scaleX-1, e.y*scaleY-1, 2, 2);
    });

    // Player
    if(player) {
        minimapCtx.fillStyle = '#3498db';
        minimapCtx.beginPath();
        minimapCtx.arc(player.x*scaleX, player.y*scaleY, 3, 0, Math.PI*2);
        minimapCtx.fill();
    }

    // Camera rect
    minimapCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(
        camera.x*scaleX, camera.y*scaleY,
        (canvas?canvas.width:800)*scaleX,
        (canvas?canvas.height:600)*scaleY
    );
}

// ============================================================
// HUD UPDATE
// ============================================================
function updateHUD() {
    if(!player) return;

    // HP bar
    const hpPct = Math.max(0, player.hp/player.maxHP);
    document.getElementById('hp-bar').style.width = (hpPct*100)+'%';
    document.getElementById('hp-text').textContent = `${Math.max(0,Math.round(player.hp))}/${player.maxHP}`;

    // Shield
    const shieldCont = document.getElementById('shield-container');
    if(player.maxShield > 0) {
        shieldCont.style.display = 'flex';
        const sPct = player.shield/Math.max(player.maxShield,1);
        document.getElementById('shield-bar').style.width = (sPct*100)+'%';
        document.getElementById('shield-text').textContent = Math.round(player.shield);
    } else {
        shieldCont.style.display = 'none';
    }

    // XP bar
    const xpPct = player.xp / player.xpToNextLevel;
    document.getElementById('xp-bar').style.width = (xpPct*100)+'%';
    document.getElementById('player-level').textContent = player.level;

    // Wave & timer
    document.getElementById('wave-display').textContent = `Wave ${waveIndex+1}/${currentMapData.waves.length}`;
    const mins = Math.floor(gameTime/60), secs = Math.floor(gameTime%60);
    document.getElementById('timer-display').textContent = `${mins}:${secs.toString().padStart(2,'0')}`;

    // Gold
    document.getElementById('gold-display').textContent = `💰 ${SaveSystem.data.gold}`;

    // Items display
    updateItemsDisplay();
}

function updateItemsDisplay() {
    const container = document.getElementById('items-display');
    container.innerHTML = '';
    // Weapons first
    for(const id in player.weapons) {
        const level = player.weapons[id];
        const def = WEAPONS[id];
        if(!def) continue;
        const div = document.createElement('div');
        div.className = 'item-icon';
        div.title = def.name + (level>=8?' (EVOLVED)':'');
        div.style.borderColor = level >= 8 ? '#f1c40f' : 'rgba(212,166,71,0.4)';
        div.innerHTML = `${def.icon}<span class="item-level">${level>=8?'★':level}</span>`;
        container.appendChild(div);
    }
    // Items
    for(const id in player.items) {
        const level = player.items[id];
        const def = ITEMS[id];
        if(!def) continue;
        const div = document.createElement('div');
        div.className = 'item-icon';
        div.title = def.name;
        div.innerHTML = `${def.icon}<span class="item-level">${level}</span>`;
        container.appendChild(div);
    }
}

// ============================================================
// LEVEL UP SYSTEM
// ============================================================
function showLevelUp() {
    if(pendingLevelUps <= 0) return;
    gamePaused = true;
    currentChoices = generateChoices();
    renderChoices();
    document.getElementById('levelup-panel').classList.remove('hidden');

    // Show reroll/skip buttons if available
    const rerollBtn = document.getElementById('reroll-btn');
    const skipBtn = document.getElementById('skip-btn');
    rerollBtn.style.display = player.canReroll ? 'block' : 'none';
    skipBtn.style.display = player.canSkip ? 'block' : 'none';
}

function generateChoices() {
    const pool = [];

    // Upgradeable weapons (weight 3)
    for(const id in player.weapons) {
        if(player.weapons[id] < (WEAPONS[id]?.maxLevel||8)) {
            for(let i=0;i<3;i++) pool.push({ type:'weapon', id });
        }
    }

    // Upgradeable items (weight 3)
    for(const id in player.items) {
        if(player.items[id] < (ITEMS[id]?.maxLevel||5)) {
            for(let i=0;i<3;i++) pool.push({ type:'item', id });
        }
    }

    // New weapons (affinity = 2, otherwise 1)
    const classWeaponAffinity = classData?.weaponAffinity || [];
    for(const id in WEAPONS) {
        if(player.weapons[id]) continue;
        if(banishedItems.has(id)) continue;
        const w = WEAPONS[id];
        const matches = classWeaponAffinity.includes(w.type);
        const weight = matches ? 2 : 1;
        for(let i=0;i<weight;i++) pool.push({ type:'weapon', id, isNew:true });
    }

    // New items (if space)
    const hasSpace = player.usedItemSlots < player.maxItemSlots;
    if(hasSpace) {
        const classItemAffinity = classData?.itemAffinity || [];
        for(const id in ITEMS) {
            if(player.items[id]) {
                if(player.items[id] >= (ITEMS[id]?.maxLevel||5)) continue;
                // Already have it, already added above
                continue;
            }
            if(banishedItems.has(id)) continue;
            const it = ITEMS[id];
            const matches = classItemAffinity.includes(it.category);
            const weight = matches ? 2 : 1;
            for(let i=0;i<weight;i++) pool.push({ type:'item', id, isNew:true });
        }
    }

    if(pool.length === 0) return [];

    // Pick 3 unique choices
    const chosen = [];
    const usedIds = new Set();
    let attempts = 0;
    while(chosen.length < 3 && attempts < 200) {
        attempts++;
        const pick = pool[Math.floor(Math.random()*pool.length)];
        if(!usedIds.has(pick.id)) {
            usedIds.add(pick.id);
            chosen.push(pick);
        }
    }
    return chosen;
}

function renderChoices() {
    const container = document.getElementById('levelup-choices');
    container.innerHTML = '';
    currentChoices.forEach((choice, i) => {
        const card = document.createElement('div');
        card.className = 'choice-card';

        if(choice.type === 'weapon') {
            const def = WEAPONS[choice.id];
            if(!def) return;
            const curLevel = player.weapons[choice.id] || 0;
            const isNew = !player.weapons[choice.id];
            const willEvolve = curLevel === def.maxLevel - 1;
            if(willEvolve) card.classList.add('choice-evolved');
            const nextLevel = curLevel + 1;
            const desc = willEvolve ? `⭐ ${def.evolution.name}: ${def.evolution.description}` : def.description;
            card.innerHTML = `
                ${isNew ? '<div class="choice-new">NEW</div>' : ''}
                ${curLevel > 0 ? `<div class="choice-level">Lv.${curLevel}→${nextLevel}</div>` : ''}
                <span class="choice-icon">${def.icon}</span>
                <div class="choice-name">${willEvolve ? '⭐ '+def.evolution.name : def.name}</div>
                <div class="choice-desc">${desc}</div>
            `;
        } else {
            const def = ITEMS[choice.id];
            if(!def) return;
            const curLevel = player.items[choice.id] || 0;
            const isNew = !player.items[choice.id];
            const nextLevel = curLevel + 1;
            card.innerHTML = `
                ${isNew ? '<div class="choice-new">NEW</div>' : ''}
                ${curLevel > 0 ? `<div class="choice-level">Lv.${curLevel}→${nextLevel}</div>` : ''}
                <span class="choice-icon">${def.icon}</span>
                <div class="choice-name">${def.name}</div>
                <div class="choice-desc">${def.description}</div>
            `;
        }

        card.onclick = () => selectChoice(i);
        container.appendChild(card);
    });
}

function selectChoice(index) {
    const choice = currentChoices[index];
    if(!choice) return;

    if(choice.type === 'weapon') {
        if(!player.weapons[choice.id]) {
            player.weapons[choice.id] = 1;
            player.weaponTimers[choice.id] = 0;
        } else {
            player.weapons[choice.id]++;
        }
    } else {
        if(!player.items[choice.id]) {
            player.items[choice.id] = 1;
            player.usedItemSlots++;
        } else {
            player.items[choice.id]++;
        }
        player.recalculateStats();
    }

    pendingLevelUps--;
    document.getElementById('levelup-panel').classList.add('hidden');

    if(pendingLevelUps > 0) {
        setTimeout(() => showLevelUp(), 100);
    } else {
        gamePaused = false;
    }

    SaveSystem.save();
}

function rerollChoices() {
    currentChoices = generateChoices();
    renderChoices();
}

function skipLevelUp() {
    pendingLevelUps--;
    document.getElementById('levelup-panel').classList.add('hidden');
    if(pendingLevelUps > 0) {
        setTimeout(() => showLevelUp(), 100);
    } else {
        gamePaused = false;
    }
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================
function showAnnouncement(text, duration) {
    const el = document.getElementById('wave-announcement');
    el.textContent = text;
    el.classList.remove('hidden');
    el.style.opacity = '1';
    announcementTimer = duration;
}

// ============================================================
// GAME END
// ============================================================
function handleGameOver() {
    gameRunning = false;
    SaveSystem.updateStats({ highestLevel: Math.max(SaveSystem.data.stats.highestLevel, player.level) });

    const quote = classData?.quote || '"The journey ends here."';
    document.getElementById('gameover-quote').textContent = quote;
    document.getElementById('gameover-stats').innerHTML = `
        Wave Reached: ${waveIndex+1} / ${currentMapData.waves.length}<br>
        Level: ${player.level}<br>
        Enemies Slain: ${kills}<br>
        Time Survived: ${Math.floor(gameTime/60)}:${Math.floor(gameTime%60).toString().padStart(2,'0')}
    `;
    document.getElementById('gameover-gold').textContent = `💰 ${goldEarned} Gold Earned`;
    document.getElementById('gameover-panel').classList.remove('hidden');
}

function handleVictory() {
    gameRunning = false;
    const bonusGold = 200;
    SaveSystem.addGold(bonusGold);
    SaveSystem.updateStats({ highestLevel: Math.max(SaveSystem.data.stats.highestLevel, player.level) });

    const quote = '"We did it. We actually survived."';
    document.getElementById('victory-quote').textContent = quote;
    document.getElementById('victory-stats').innerHTML = `
        All ${currentMapData.waves.length} Waves Cleared!<br>
        Level: ${player.level}<br>
        Enemies Slain: ${kills}<br>
        Time: ${Math.floor(gameTime/60)}:${Math.floor(gameTime%60).toString().padStart(2,'0')}
    `;
    document.getElementById('victory-gold').textContent = `💰 ${goldEarned} + ${bonusGold} Bonus = ${goldEarned+bonusGold} Gold!`;
    document.getElementById('victory-panel').classList.remove('hidden');
}

// ============================================================
// CONTROLS
// ============================================================
function togglePause() {
    if(!gameRunning) return;
    if(document.getElementById('levelup-panel') && !document.getElementById('levelup-panel').classList.contains('hidden')) return;
    gamePaused = !gamePaused;
    document.getElementById('pause-menu').classList.toggle('hidden', !gamePaused);
}

function restartGame() {
    hideAllOverlays();
    document.getElementById('levelup-panel').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    initGame(selectedClassId || player?.classId, currentMapData?.id || 'cyreneMine');
}

function quitToMenu() {
    gameRunning = false;
    if(animFrameId) cancelAnimationFrame(animFrameId);
    hideAllOverlays();
    showScreen('main-menu');
    initMainMenu();
}

function hideAllOverlays() {
    ['gameover-panel','victory-panel','pause-menu','levelup-panel'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}
