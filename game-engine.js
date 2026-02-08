// ============================================================
// GAME ENGINE - Core game logic
// ============================================================

let canvas, ctx, minimapCanvas, minimapCtx;
let gameState = 'menu'; // menu, playing, paused, gameover, victory
let selectedClass = null;
let selectedMap = null;

let player = null;
let enemies = [];
let projectiles = [];
let particles = [];
let effects = [];

let camera = { x: 0, y: 0 };
let keys = {};

let gameTime = 0;
let lastFrameTime = 0;
let runStartTime = 0;

let currentWave = 0;
let totalKills = 0;
let goldEarned = 0;

// Initialize on page load
window.addEventListener('load', () => {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    minimapCanvas = document.getElementById('minimap-canvas');
    minimapCtx = minimapCanvas.getContext('2d');
    
    setupEventListeners();
    updateCurrencyDisplays();
    displayAchievements();
    gameLoop();
});

// Event Listeners
function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        if (e.key === 'Escape' && gameState === 'playing') {
            pauseGame();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Prevent arrow key scrolling
    window.addEventListener('keydown', (e) => {
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });
}

// ============================================================
// UI FUNCTIONS
// ============================================================

function showMainMenu() {
    hideAllScreens();
    document.getElementById('main-menu').classList.add('active');
    gameState = 'menu';
}

function showClassSelect() {
    hideAllScreens();
    document.getElementById('class-select').classList.add('active');
    renderClassOptions();
}

function showMapSelect() {
    hideAllScreens();
    document.getElementById('map-select').classList.add('active');
    renderMapOptions();
}

function showShop() {
    hideAllScreens();
    document.getElementById('shop').classList.add('active');
    updateCurrencyDisplays();
    showShopTab('permanent');
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

function renderClassOptions() {
    const container = document.getElementById('class-options');
    container.innerHTML = '';
    
    Object.keys(CLASSES).forEach(classId => {
        const classData = CLASSES[classId];
        const card = document.createElement('div');
        card.className = 'class-card';
        card.style.borderColor = classData.color;
        
        card.innerHTML = `
            <span class="class-icon" style="color: ${classData.color}">${classData.icon}</span>
            <div class="class-name" style="color: ${classData.color}">${classData.name}</div>
            <p class="class-description">${classData.description}</p>
        `;
        
        card.onclick = () => selectClass(classId);
        container.appendChild(card);
    });
}

function selectClass(classId) {
    selectedClass = classId;
    showMapSelect();
}

function renderMapOptions() {
    const container = document.getElementById('map-options');
    container.innerHTML = '';
    
    Object.keys(MAPS).forEach(mapId => {
        const mapData = MAPS[mapId];
        const isUnlocked = currentSave.unlockedMaps[mapId] || mapData.unlocked;
        
        const card = document.createElement('div');
        card.className = 'map-card';
        if (!isUnlocked) card.classList.add('locked');
        
        card.innerHTML = `
            <div class="map-name">${mapData.name}</div>
            <p class="map-description">${mapData.description}</p>
            ${!isUnlocked ? `
                <div class="map-unlock">
                    <span>🔒 Unlock:</span>
                    <span>${mapData.unlockCost} Gold</span>
                </div>
            ` : ''}
        `;
        
        card.onclick = () => {
            if (isUnlocked) {
                selectMap(mapId);
            } else if (mapData.unlockCost) {
                if (unlockMap(mapId, mapData.unlockCost)) {
                    renderMapOptions();
                } else {
                    alert('Not enough gold!');
                }
            }
        };
        
        container.appendChild(card);
    });
}

function selectMap(mapId) {
    selectedMap = mapId;
    startGame();
}

function showShopTab(tab) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const container = document.getElementById('shop-items');
    container.innerHTML = '';
    
    const items = SHOP_ITEMS[tab];
    
    Object.keys(items).forEach(itemId => {
        const item = items[itemId];
        const purchased = currentSave.purchasedItems[itemId] || 0;
        
        const card = document.createElement('div');
        card.className = 'shop-item';
        if (purchased > 0 && !item.stackable) {
            card.classList.add('purchased');
        }
        
        card.innerHTML = `
            <div class="shop-item-header">
                <span class="shop-item-icon">${item.icon}</span>
                <span class="shop-item-name">${item.name}</span>
            </div>
            <p class="shop-item-description">${item.description}</p>
            <div class="shop-item-cost">
                <span>💰</span>
                <span>${item.cost} Gold</span>
            </div>
            ${purchased > 0 && !item.stackable ? '<p style="color: var(--color-success); margin-top: 10px;">✓ Purchased</p>' : ''}
            ${item.stackable && purchased > 0 ? `<p style="color: var(--color-warning); margin-top: 10px;">Owned: ${purchased}</p>` : ''}
        `;
        
        card.onclick = () => {
            if (purchaseItem(itemId, item)) {
                updateCurrencyDisplays();
                showShopTab(tab);
            } else {
                alert('Not enough gold!');
            }
        };
        
        container.appendChild(card);
    });
}

function resetProgress() {
    resetAllProgress();
}

function displayAchievements() {
    const container = document.getElementById('achievements-list');
    const achievements = currentSave.achievements;
    
    const achievementNames = {
        firstKill: 'First Blood',
        first10Kills: 'Slayer',
        first100Kills: 'Legendary',
        reachWave5: 'Survivor',
        reachWave10: 'Wave Master',
        reachLevel10: 'Power',
        earnGold100: 'Getting Rich',
        earnGold1000: 'Wealthy'
    };
    
    const unlocked = Object.keys(achievements).filter(key => achievements[key]);
    
    if (unlocked.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-dim);">No achievements yet</p>';
        return;
    }
    
    container.innerHTML = '';
    unlocked.forEach(key => {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.textContent = achievementNames[key] || key;
        container.appendChild(badge);
    });
}

// ============================================================
// GAME FUNCTIONS
// ============================================================

function startGame() {
    hideAllScreens();
    document.getElementById('game-screen').classList.add('active');
    
    const mapData = MAPS[selectedMap];
    const classData = CLASSES[selectedClass];
    
    // Setup canvas
    canvas.width = Math.min(1200, window.innerWidth - 40);
    canvas.height = Math.min(800, window.innerHeight - 40);
    minimapCanvas.width = 200;
    minimapCanvas.height = 150;
    
    // Initialize game state
    gameState = 'playing';
    gameTime = 0;
    runStartTime = Date.now();
    currentWave = 0;
    totalKills = 0;
    goldEarned = 0;
    
    // Create player
    player = new Player(classData, mapData);
    enemies = [];
    projectiles = [];
    particles = [];
    effects = [];
    
    // Apply upgrades
    applyPermanentUpgrades(player);
    applyConsumables(player);
    
    // Position camera
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
    
    // Start first wave
    nextWave();
    
    // Setup skills bar
    setupSkillsBar();
    
    lastFrameTime = Date.now();
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pause-menu').classList.add('active');
    }
}

function resumeGame() {
    gameState = 'playing';
    document.getElementById('pause-menu').classList.remove('active');
    lastFrameTime = Date.now();
}

function exitToMenu() {
    gameState = 'menu';
    document.getElementById('pause-menu').classList.remove('active');
    document.getElementById('gameover-panel').classList.remove('active');
    document.getElementById('victory-panel').classList.remove('active');
    showMainMenu();
}

function retryGame() {
    document.getElementById('gameover-panel').classList.remove('active');
    startGame();
}

function gameOver() {
    gameState = 'gameover';
    
    // Calculate rewards
    const survivalBonus = Math.floor(currentWave * 10);
    const timeBonus = Math.floor(gameTime / 60);
    const totalReward = goldEarned + survivalBonus + timeBonus;
    
    addGold(totalReward);
    
    // Update stats
    updateStats({
        highestWave: currentWave,
        totalKills: currentSave.stats.totalKills + totalKills,
        highestLevel: player.level,
        totalTimePlayed: currentSave.stats.totalTimePlayed + Math.floor(gameTime)
    });
    
    // Display game over screen
    const panel = document.getElementById('gameover-panel');
    const stats = document.getElementById('gameover-stats');
    const rewards = document.getElementById('rewards-display');
    
    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);
    
    stats.innerHTML = `
        <p>Level: ${player.level}</p>
        <p>Wave: ${currentWave}</p>
        <p>Kills: ${totalKills}</p>
        <p>Time: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
    `;
    
    rewards.innerHTML = `
        <div class="rewards-title">Rewards Earned</div>
        <div class="reward-item">Gold from kills: ${goldEarned}</div>
        <div class="reward-item">Survival bonus: ${survivalBonus}</div>
        <div class="reward-item">Time bonus: ${timeBonus}</div>
        <div class="reward-item" style="color: var(--color-primary); font-weight: bold;">Total: ${totalReward} Gold</div>
    `;
    
    panel.classList.add('active');
}

function victory() {
    gameState = 'victory';
    
    // Calculate rewards (victory gives bonus)
    const waveBonus = Math.floor(currentWave * 20);
    const timeBonus = Math.floor(gameTime / 30);
    const victoryBonus = 500;
    const totalReward = goldEarned + waveBonus + timeBonus + victoryBonus;
    
    addGold(totalReward);
    
    // Update stats
    updateStats({
        highestWave: currentWave,
        totalKills: currentSave.stats.totalKills + totalKills,
        highestLevel: player.level,
        totalTimePlayed: currentSave.stats.totalTimePlayed + Math.floor(gameTime)
    });
    
    // Mark map achievement
    const mapId = selectedMap;
    if (mapId === 'forgottenForest') currentSave.achievements.beatForest = true;
    if (mapId === 'ashenWasteland') currentSave.achievements.beatWasteland = true;
    if (mapId === 'crystalCavern') currentSave.achievements.beatCavern = true;
    saveData(currentSave);
    
    // Display victory screen
    const panel = document.getElementById('victory-panel');
    const stats = document.getElementById('victory-stats');
    const rewards = document.getElementById('victory-rewards');
    
    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);
    
    stats.innerHTML = `
        <h3>Map Completed!</h3>
        <p>Level: ${player.level}</p>
        <p>Kills: ${totalKills}</p>
        <p>Time: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
    `;
    
    rewards.innerHTML = `
        <div class="rewards-title">Victory Rewards</div>
        <div class="reward-item">Gold from kills: ${goldEarned}</div>
        <div class="reward-item">Wave bonus: ${waveBonus}</div>
        <div class="reward-item">Time bonus: ${timeBonus}</div>
        <div class="reward-item">Victory bonus: ${victoryBonus}</div>
        <div class="reward-item" style="color: var(--color-success); font-weight: bold;">Total: ${totalReward} Gold</div>
    `;
    
    panel.classList.add('active');
}

function nextWave() {
    currentWave++;
    const mapData = MAPS[selectedMap];
    const waveIndex = currentWave - 1;
    
    if (waveIndex >= mapData.waves.length) {
        victory();
        return;
    }
    
    const waveData = mapData.waves[waveIndex];
    
    // Show wave announcement
    const announcement = document.getElementById('wave-announcement');
    announcement.textContent = waveData.boss ? 'BOSS WAVE!' : `Wave ${currentWave}`;
    announcement.classList.add('show');
    setTimeout(() => {
        announcement.classList.remove('show');
    }, 2500);
    
    // Spawn enemies
    const enemyPool = waveData.enemies;
    const count = waveData.count;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const enemyType = enemyPool[Math.floor(Math.random() * enemyPool.length)];
            spawnEnemy(enemyType);
        }, i * 500);
    }
    
    updateUI();
}

function spawnEnemy(typeId) {
    const enemyData = ENEMY_TYPES[typeId];
    const mapData = MAPS[selectedMap];
    
    enemies.push(new Enemy(enemyData, mapData));
}

function setupSkillsBar() {
    const container = document.getElementById('skills-bar');
    container.innerHTML = '';
    
    const classData = CLASSES[selectedClass];
    const skillData = SKILLS[classData.startingSkill];
    
    if (skillData) {
        const slot = document.createElement('div');
        slot.className = 'skill-slot';
        slot.innerHTML = skillData.icon;
        slot.dataset.skillId = classData.startingSkill;
        slot.title = skillData.name;
        
        slot.onclick = () => useSkill(classData.startingSkill);
        
        container.appendChild(slot);
    }
}

function useSkill(skillId) {
    const skillData = SKILLS[skillId];
    if (!skillData || !player) return;
    
    const now = Date.now();
    if (!player.skillCooldowns) player.skillCooldowns = {};
    
    const lastUse = player.skillCooldowns[skillId] || 0;
    if (now - lastUse < skillData.cooldown) return;
    
    // Execute skill
    skillData.execute(player, enemies);
    player.skillCooldowns[skillId] = now;
    
    // Update UI
    updateSkillCooldowns();
}

function updateSkillCooldowns() {
    const now = Date.now();
    document.querySelectorAll('.skill-slot').forEach(slot => {
        const skillId = slot.dataset.skillId;
        const skillData = SKILLS[skillId];
        if (!skillData) return;
        
        const lastUse = player.skillCooldowns?.[skillId] || 0;
        const remaining = Math.max(0, skillData.cooldown - (now - lastUse));
        
        if (remaining > 0) {
            slot.classList.add('on-cooldown');
            let cooldownDisplay = slot.querySelector('.skill-cooldown');
            if (!cooldownDisplay) {
                cooldownDisplay = document.createElement('div');
                cooldownDisplay.className = 'skill-cooldown';
                slot.appendChild(cooldownDisplay);
            }
            cooldownDisplay.textContent = Math.ceil(remaining / 1000);
        } else {
            slot.classList.remove('on-cooldown');
            const cooldownDisplay = slot.querySelector('.skill-cooldown');
            if (cooldownDisplay) cooldownDisplay.remove();
        }
    });
}

function showLevelUpPanel() {
    gameState = 'levelup';
    const panel = document.getElementById('levelup-panel');
    const optionsContainer = document.getElementById('upgrade-options');
    optionsContainer.innerHTML = '';
    
    // Select 3 random upgrades
    const shuffled = [...LEVEL_UPGRADES].sort(() => Math.random() - 0.5);
    const selectedUpgrades = shuffled.slice(0, 3);
    
    selectedUpgrades.forEach(upgrade => {
        const option = document.createElement('div');
        option.className = 'upgrade-option';
        option.innerHTML = `
            <span class="upgrade-icon">${upgrade.icon}</span>
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <p class="upgrade-description">${upgrade.description}</p>
            </div>
        `;
        option.onclick = () => {
            upgrade.apply(player);
            panel.classList.remove('active');
            updateUI();
            setTimeout(() => {
                gameState = 'playing';
                lastFrameTime = Date.now();
            }, 100);
        };
        optionsContainer.appendChild(option);
    });
    
    panel.classList.add('active');
}

function updateUI() {
    if (!player) return;
    
    // HP bar
    const hpPercent = Math.max(0, player.hp / player.maxHP);
    document.getElementById('hp-bar').style.width = (hpPercent * 100) + '%';
    document.getElementById('hp-text').textContent = `${Math.max(0, Math.floor(player.hp))}/${Math.floor(player.maxHP)}`;
    
    // XP bar
    const xpPercent = player.xp / player.xpToNextLevel;
    document.getElementById('xp-bar').style.width = (xpPercent * 100) + '%';
    document.getElementById('xp-text').textContent = `${Math.floor(player.xp)}/${Math.floor(player.xpToNextLevel)}`;
    
    // Text displays
    document.getElementById('level-display').textContent = player.level;
    document.getElementById('wave-display').textContent = currentWave;
    document.getElementById('gold-display').textContent = goldEarned;
    
    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);
    document.getElementById('time-display').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    updateSkillCooldowns();
}

// ============================================================
// GAME CLASSES
// ============================================================

class Player {
    constructor(classData, mapData) {
        this.x = mapData.width / 2;
        this.y = mapData.height / 2;
        
        this.hp = classData.baseHP;
        this.maxHP = classData.baseHP;
        this.speed = classData.baseSpeed;
        this.damage = classData.baseDamage;
        this.attackRange = classData.baseAttackRange;
        this.attackSpeed = classData.baseAttackSpeed;
        this.critChance = classData.baseCritChance;
        this.critDamage = classData.baseCritDamage;
        
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        
        this.size = 15;
        this.color = classData.color;
        this.icon = classData.icon;
        
        this.lastAttack = 0;
        this.facingAngle = 0;
        
        this.goldMultiplier = 1;
        this.xpMultiplier = 1;
        this.lifeSteal = 0;
        this.thorns = 0;
        this.regen = 0;
        this.areaDamage = false;
        this.areaRadius = 0;
        
        this.skillCooldowns = {};
        this.lastRegenTick = Date.now();
    }
    
    update(deltaTime) {
        // Movement
        let dx = 0;
        let dy = 0;
        
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;
        
        // Normalize diagonal
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        
        // Calculate facing angle
        if (dx !== 0 || dy !== 0) {
            this.facingAngle = Math.atan2(dy, dx);
        }
        
        // Map boundaries
        const mapData = MAPS[selectedMap];
        this.x = Math.max(this.size, Math.min(mapData.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(mapData.height - this.size, this.y));
        
        // Auto attack
        const attackCooldown = 1000 / this.attackSpeed;
        if (Date.now() - this.lastAttack > attackCooldown) {
            this.attack();
        }
        
        // Regeneration
        if (this.regen > 0) {
            const now = Date.now();
            if (now - this.lastRegenTick > 1000) {
                this.hp = Math.min(this.maxHP, this.hp + this.regen);
                this.lastRegenTick = now;
            }
        }
        
        // Check exploration points
        this.checkExplorationPoints();
    }
    
    attack() {
        const target = this.findNearestEnemy();
        if (!target) return;
        
        const dist = Math.hypot(target.x - this.x, target.y - this.y);
        if (dist > this.attackRange) return;
        
        // Calculate damage
        let damage = this.damage;
        const isCrit = Math.random() < this.critChance;
        if (isCrit) {
            damage *= this.critDamage;
        }
        
        // Create projectile
        createProjectile(this.x, this.y, target, damage, this.color, false, isCrit);
        
        // Area damage
        if (this.areaDamage) {
            enemies.forEach(enemy => {
                const eDist = Math.hypot(enemy.x - target.x, enemy.y - target.y);
                if (eDist <= this.areaRadius && enemy !== target) {
                    setTimeout(() => {
                        createProjectile(this.x, this.y, enemy, damage * 0.5, this.color);
                    }, 100);
                }
            });
        }
        
        this.lastAttack = Date.now();
    }
    
    findNearestEnemy() {
        let nearest = null;
        let minDist = Infinity;
        
        enemies.forEach(enemy => {
            const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        
        // Thorns damage
        if (this.thorns > 0) {
            const thornsDamage = amount * this.thorns;
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                if (dist <= 100) {
                    enemy.takeDamage(thornsDamage);
                }
            });
        }
        
        if (this.hp <= 0) {
            gameOver();
        }
        
        updateUI();
    }
    
    gainXP(amount) {
        amount *= this.xpMultiplier;
        this.xp += amount;
        
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
        
        updateUI();
    }
    
    gainGold(amount) {
        amount *= this.goldMultiplier;
        goldEarned += Math.floor(amount);
        updateUI();
    }
    
    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(100 * Math.pow(1.5, this.level - 1));
        
        showLevelUpPanel();
    }
    
    checkExplorationPoints() {
        const mapData = MAPS[selectedMap];
        if (!mapData.explorationPoints) return;
        
        mapData.explorationPoints.forEach((point, index) => {
            if (point.collected) return;
            
            const dist = Math.hypot(this.x - point.x, this.y - point.y);
            if (dist <= point.radius) {
                point.collected = true;
                
                switch(point.type) {
                    case 'healing':
                        this.hp = Math.min(this.maxHP, this.hp + this.maxHP * 0.5);
                        createEffect('heal', point.x, point.y);
                        break;
                    case 'treasure':
                        const gold = Math.floor(50 + Math.random() * 50);
                        this.gainGold(gold);
                        createEffect('gold', point.x, point.y);
                        break;
                    case 'shrine':
                        this.damage *= 1.1;
                        createEffect('powerup', point.x, point.y);
                        break;
                    case 'crystal':
                        this.gainXP(this.xpToNextLevel * 0.3);
                        createEffect('crystal', point.x, point.y);
                        break;
                }
                
                updateUI();
            }
        });
    }
    
    draw() {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Attack range circle
        ctx.strokeStyle = this.color + '33';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.attackRange, 0, Math.PI * 2);
        ctx.stroke();
        
        // Player circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Icon
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, screenX, screenY);
    }
}

class Enemy {
    constructor(typeData, mapData) {
        this.type = typeData;
        this.hp = typeData.hp;
        this.maxHP = typeData.hp;
        this.damage = typeData.damage;
        this.speed = typeData.speed;
        this.size = typeData.size;
        this.behavior = typeData.behavior;
        this.attackRange = typeData.attackRange;
        
        // Spawn at random edge
        const edge = Math.floor(Math.random() * 4);
        const margin = 100;
        
        switch(edge) {
            case 0: // top
                this.x = margin + Math.random() * (mapData.width - margin * 2);
                this.y = -this.size;
                break;
            case 1: // right
                this.x = mapData.width + this.size;
                this.y = margin + Math.random() * (mapData.height - margin * 2);
                break;
            case 2: // bottom
                this.x = margin + Math.random() * (mapData.width - margin * 2);
                this.y = mapData.height + this.size;
                break;
            case 3: // left
                this.x = -this.size;
                this.y = margin + Math.random() * (mapData.height - margin * 2);
                break;
        }
        
        this.lastAttack = 0;
        this.attackCooldown = 1500;
        this.stunned = false;
        this.frozen = false;
        this.poisoned = false;
        this.poisonTicks = 0;
        this.poisonDamage = 0;
        this.lastPoisonTick = Date.now();
    }
    
    update(deltaTime) {
        if (this.stunned) return;
        
        // Poison damage
        if (this.poisoned && this.poisonTicks > 0) {
            const now = Date.now();
            if (now - this.lastPoisonTick > 1000) {
                this.takeDamage(this.poisonDamage);
                this.poisonTicks--;
                this.lastPoisonTick = now;
                if (this.poisonTicks <= 0) {
                    this.poisoned = false;
                }
            }
        }
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (this.behavior === 'ranged') {
            // Keep distance and shoot
            if (dist > this.attackRange * 0.8) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            } else if (dist < this.attackRange * 0.5) {
                this.x -= (dx / dist) * this.speed;
                this.y -= (dy / dist) * this.speed;
            }
            
            // Shoot at player
            if (Date.now() - this.lastAttack > this.attackCooldown) {
                createProjectile(this.x, this.y, player, this.damage, '#ef4444');
                this.lastAttack = Date.now();
            }
        } else {
            // Chase player
            if (dist > player.size + this.size) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            } else {
                // Melee attack
                if (Date.now() - this.lastAttack > this.attackCooldown) {
                    player.takeDamage(this.damage);
                    this.lastAttack = Date.now();
                    createEffect('hit', player.x, player.y);
                }
            }
        }
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        
        if (this.hp <= 0) {
            this.die();
        }
    }
    
    die() {
        totalKills++;
        player.gainXP(this.type.xpValue);
        player.gainGold(this.type.goldValue);
        
        // Life steal
        if (player.lifeSteal > 0) {
            const healAmount = this.type.hp * player.lifeSteal;
            player.hp = Math.min(player.maxHP, player.hp + healAmount);
        }
        
        // Particles
        for (let i = 0; i < 8; i++) {
            particles.push(new Particle(this.x, this.y, this.type.visual.color));
        }
        
        const index = enemies.indexOf(this);
        if (index > -1) {
            enemies.splice(index, 1);
        }
        
        // Check if wave is complete
        if (enemies.length === 0) {
            setTimeout(() => nextWave(), 2000);
        }
    }
    
    draw() {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Enemy body
        const visual = this.type.visual;
        
        ctx.fillStyle = visual.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        if (visual.secondaryColor) {
            ctx.fillStyle = visual.secondaryColor;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Emoji overlay
        if (visual.emoji) {
            ctx.font = `${this.size * 1.2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(visual.emoji, screenX, screenY);
        }
        
        // HP bar
        const barWidth = this.size * 2.5;
        const barHeight = 4;
        const barX = screenX - barWidth / 2;
        const barY = screenY - this.size - 10;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        const hpPercent = this.hp / this.maxHP;
        ctx.fillStyle = hpPercent > 0.5 ? '#4ade80' : hpPercent > 0.25 ? '#fbbf24' : '#ef4444';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        
        // Status indicators
        if (this.frozen) {
            ctx.fillStyle = '#60a5fa';
            ctx.font = '12px Arial';
            ctx.fillText('❄️', screenX + this.size, screenY - this.size);
        }
        if (this.poisoned) {
            ctx.fillStyle = '#22c55e';
            ctx.font = '12px Arial';
            ctx.fillText('☠️', screenX - this.size, screenY - this.size);
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.color = color;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        return this.life > 0;
    }
    
    draw() {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function createProjectile(x, y, target, damage, color, explosive = false, isCrit = false) {
    projectiles.push({
        x, y,
        targetX: target.x,
        targetY: target.y,
        target,
        damage,
        color,
        explosive,
        isCrit,
        speed: 10,
        size: isCrit ? 8 : 5
    });
}

function createEffect(type, x, y) {
    effects.push({
        type, x, y,
        life: 1,
        decay: 0.02
    });
}

function findNearestEnemy(origin, enemyList) {
    let nearest = null;
    let minDist = Infinity;
    
    enemyList.forEach(enemy => {
        const dist = Math.hypot(enemy.x - origin.x, enemy.y - origin.y);
        if (dist < minDist) {
            minDist = dist;
            nearest = enemy;
        }
    });
    
    return nearest;
}

window.displayAchievement = function(name) {
    console.log('Achievement unlocked:', name);
    // Could add visual notification here
};

// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {
    requestAnimationFrame(gameLoop);
    
    if (gameState !== 'playing') {
        return;
    }
    
    const now = Date.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    gameTime = (now - runStartTime) / 1000;
    
    // Update
    if (player) {
        player.update(deltaTime);
        
        // Update camera
        camera.x = player.x - canvas.width / 2;
        camera.y = player.y - canvas.height / 2;
        
        const mapData = MAPS[selectedMap];
        camera.x = Math.max(0, Math.min(mapData.width - canvas.width, camera.x));
        camera.y = Math.max(0, Math.min(mapData.height - canvas.height, camera.y));
    }
    
    enemies.forEach(enemy => enemy.update(deltaTime));
    
    // Update projectiles
    projectiles = projectiles.filter(proj => {
        const dx = proj.targetX - proj.x;
        const dy = proj.targetY - proj.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < proj.speed) {
    // ──────────────────────────────
    // Check if it hits the PLAYER (enemy projectiles)
    const dxToPlayer = player.x - proj.x;
    const dyToPlayer = player.y - proj.y;
    const distToPlayer = Math.hypot(dxToPlayer, dyToPlayer);

    if (distToPlayer < player.size + 12) {
        player.takeDamage(proj.damage);
        createEffect('hit', proj.x, proj.y);
    }

    // ──────────────────────────────
    // Check if it hits an ENEMY (player projectiles)
    // We look for the closest enemy near the impact point
    let hitEnemy = null;
    let minDistToEnemy = Infinity;

    enemies.forEach(enemy => {
        const dxToEnemy = enemy.x - proj.x;
        const dyToEnemy = enemy.y - proj.y;
        const distToEnemy = Math.hypot(dxToEnemy, dyToEnemy);

        if (distToEnemy < enemy.size + 10 && distToEnemy < minDistToEnemy) {
            minDistToEnemy = distToEnemy;
            hitEnemy = enemy;
        }
    });

    if (hitEnemy) {
        hitEnemy.takeDamage(proj.damage);
        createEffect('hit', proj.x, proj.y);

        // Life steal (if player has any)
        if (player.lifeSteal > 0) {
            const heal = proj.damage * player.lifeSteal;
            player.hp = Math.min(player.maxHP, player.hp + heal);
        }
    }

    // Particles whether we hit anything or not
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(proj.x, proj.y, proj.color));
    }

    return false;  // projectile disappears
}
        
        proj.x += (dx / dist) * proj.speed;
        proj.y += (dy / dist) * proj.speed;
        return true;
    });
    
    particles = particles.filter(p => p.update());
    effects = effects.filter(e => {
        e.life -= e.decay;
        return e.life > 0;
    });
    
    // Draw
    drawGame();
    drawMinimap();
    updateUI();
}

function drawGame() {
    const mapData = MAPS[selectedMap];
    const theme = mapData.theme;
    
    // Background
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid/ground
    ctx.strokeStyle = theme.accentColor + '33';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    const startX = Math.floor(camera.x / gridSize) * gridSize;
    const startY = Math.floor(camera.y / gridSize) * gridSize;
    
    for (let x = startX; x < camera.x + canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x - camera.x, 0);
        ctx.lineTo(x - camera.x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = startY; y < camera.y + canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y - camera.y);
        ctx.lineTo(canvas.width, y - camera.y);
        ctx.stroke();
    }
    
    // Exploration points
    if (mapData.explorationPoints) {
        mapData.explorationPoints.forEach(point => {
            if (point.collected) return;
            
            const screenX = point.x - camera.x;
            const screenY = point.y - camera.y;
            
            ctx.fillStyle = point.color + '22';
            ctx.beginPath();
            ctx.arc(screenX, screenY, point.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = point.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Icon
            let icon = '?';
            if (point.type === 'healing') icon = '❤️';
            if (point.type === 'treasure') icon = '💰';
            if (point.type === 'shrine') icon = '⚡';
            if (point.type === 'crystal') icon = '💎';
            
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, screenX, screenY);
        });
    }
    
    // Obstacles
    if (mapData.obstacles) {
        mapData.obstacles.forEach(obstacle => {
            const screenX = obstacle.x - camera.x;
            const screenY = obstacle.y - camera.y;
            
            ctx.fillStyle = theme.accentColor;
            ctx.fillRect(screenX, screenY, obstacle.width, obstacle.height);
            
            ctx.strokeStyle = theme.backgroundColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX, screenY, obstacle.width, obstacle.height);
        });
    }
    
    // Game objects
    particles.forEach(p => p.draw());
    
    projectiles.forEach(proj => {
        const screenX = proj.x - camera.x;
        const screenY = proj.y - camera.y;
        
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, proj.size, 0, Math.PI * 2);
        ctx.fill();
        
        if (proj.isCrit) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
    
    enemies.forEach(e => e.draw());
    
    if (player) {
        player.draw();
    }
    
    // Effects
    effects.forEach(effect => {
        const screenX = effect.x - camera.x;
        const screenY = effect.y - camera.y;
        
        ctx.globalAlpha = effect.life;
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let icon = '✨';
        if (effect.type === 'heal') icon = '💚';
        if (effect.type === 'gold') icon = '💰';
        if (effect.type === 'powerup') icon = '⚡';
        if (effect.type === 'crystal') icon = '💎';
        if (effect.type === 'hit') icon = '💥';
        
        ctx.fillText(icon, screenX, screenY - 20 * (1 - effect.life));
        ctx.globalAlpha = 1;
    });
}

function drawMinimap() {
    const mapData = MAPS[selectedMap];
    const scaleX = minimapCanvas.width / mapData.width;
    const scaleY = minimapCanvas.height / mapData.height;
    
    minimapCtx.fillStyle = '#1a1a2e';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // Enemies
    enemies.forEach(enemy => {
        minimapCtx.fillStyle = '#ef4444';
        minimapCtx.fillRect(
            enemy.x * scaleX - 2,
            enemy.y * scaleY - 2,
            4, 4
        );
    });
    
    // Player
    if (player) {
        minimapCtx.fillStyle = player.color;
        minimapCtx.fillRect(
            player.x * scaleX - 3,
            player.y * scaleY - 3,
            6, 6
        );
    }
    
    // Viewport
    minimapCtx.strokeStyle = '#ffffff';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(
        camera.x * scaleX,
        camera.y * scaleY,
        canvas.width * scaleX,
        canvas.height * scaleY
    );
}
