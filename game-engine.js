// ============================================================
// GAME ENGINE - Core game logic with weapon/item system
// ============================================================

let canvas, ctx, minimapCanvas, minimapCtx;
let gameState = 'menu'; // menu, playing, paused, gameover, victory, levelup
let selectedClass = null;
let selectedMap = null;

let player = null;
let enemies = [];
let projectiles = [];
let particles = [];
let effects = [];
let drops = [];

let camera = { x: 0, y: 0 };
let keys = {};

let gameTime = 0;
let lastFrameTime = 0;
let runStartTime = 0;

let currentWave = 0;
let totalKills = 0;
let goldEarned = 0;
let waveEnemiesRemaining = 0;
let waveInProgress = false;
let nextWaveTime = 0;

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
        
        if (e.key === 'Escape') {
            if (gameState === 'playing') {
                pauseGame();
            } else if (gameState === 'paused') {
                resumeGame();
            }
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
    updateCurrencyDisplays();
    displayAchievements();
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
            <div class="class-stats">
                <div>HP: ${classData.baseHP}</div>
                <div>Speed: ${classData.baseSpeed.toFixed(1)}</div>
                <div>Slots: ${classData.baseItemSlots}</div>
            </div>
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
            <div class="map-info">Waves: ${mapData.waves.length}</div>
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
    // Update active tab
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const container = document.getElementById('shop-items');
    container.innerHTML = '';
    
    const items = SHOP_ITEMS[tab];
    
    Object.keys(items).forEach(itemId => {
        const item = items[itemId];
        const purchased = currentSave.purchasedItems[itemId] || 0;
        
        // Check if item requires another item
        const canPurchase = !item.requires || currentSave.purchasedItems[item.requires];
        
        const card = document.createElement('div');
        card.className = 'shop-item';
        if (purchased > 0 && !item.stackable) {
            card.classList.add('purchased');
        }
        if (!canPurchase) {
            card.classList.add('locked');
        }
        
        card.innerHTML = `
            <div class="shop-item-header">
                <span class="shop-item-icon">${item.icon}</span>
                <span class="shop-item-name">${item.name}</span>
            </div>
            <p class="shop-item-description">${item.description}</p>
            ${item.requires && !canPurchase ? `<p class="shop-requirement">Requires: ${SHOP_ITEMS[tab][item.requires].name}</p>` : ''}
            <div class="shop-item-cost">
                <span>💰</span>
                <span>${item.cost} Gold</span>
            </div>
            ${purchased > 0 && !item.stackable ? '<p style="color: var(--color-success); margin-top: 10px;">✓ Purchased</p>' : ''}
            ${item.stackable && purchased > 0 ? `<p style="color: var(--color-warning); margin-top: 10px;">Owned: ${purchased}</p>` : ''}
        `;
        
        card.onclick = () => {
            if (!canPurchase) {
                alert('You must purchase the required item first!');
                return;
            }
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
    waveInProgress = false;
    nextWaveTime = 0;
    
    // Create player
    player = new Player(classData, mapData);
    enemies = [];
    projectiles = [];
    particles = [];
    effects = [];
    drops = [];
    
    // Apply upgrades
    applyPermanentUpgrades(player);
    applyConsumables(player);

    // Give starting XP to trigger first level-up
    player.gainXP(100);
    
    // Position camera
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
    
    // Start first wave
    nextWave();
    
    // Update UI
    updateItemsDisplay();
    
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
    // Check for revives
    if (player.revives && player.revives > 0) {
        player.revives--;
        player.hp = player.maxHP;
        createEffect('revive', player.x, player.y);
        return; // Don't actually end the game
    }
    
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
    waveInProgress = true;
    waveEnemiesRemaining = waveData.count;
    
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
    
    if (enemyData) {
        enemies.push(new Enemy(enemyData, mapData));
    }
}

function showLevelUpPanel() {
    gameState = 'levelup';
    const panel = document.getElementById('levelup-panel');
    const optionsContainer = document.getElementById('upgrade-options');
    optionsContainer.innerHTML = '';
    
    // Generate upgrade choices
    const choices = generateUpgradeChoices(player, 3);
    
    choices.forEach(choice => {
        const option = document.createElement('div');
        option.className = 'upgrade-option';
        
        let levelInfo = '';
        if (choice.type === 'weapon') {
            const currentLevel = player.weapons[choice.id] || 0;
            levelInfo = currentLevel > 0 ? `Level ${currentLevel} → ${currentLevel + 1}` : 'NEW';
        } else if (choice.type === 'item') {
            const currentLevel = player.items[choice.id] || 0;
            levelInfo = currentLevel > 0 ? `Level ${currentLevel} → ${currentLevel + 1}` : 'NEW';
        }
        
        option.innerHTML = `
            <span class="upgrade-icon">${choice.icon}</span>
            <div class="upgrade-info">
                <div class="upgrade-name">${choice.name} ${levelInfo ? `<span class="level-badge">${levelInfo}</span>` : ''}</div>
                <p class="upgrade-description">${choice.description}</p>
            </div>
        `;
        
        option.onclick = () => {
            applyUpgradeChoice(choice);
            panel.classList.remove('active');
            updateUI();
            updateItemsDisplay();
            setTimeout(() => {
                gameState = 'playing';
                lastFrameTime = Date.now();
            }, 100);
        };
        
        optionsContainer.appendChild(option);
    });
    
    // Reroll button (if player has rerolls)
    const rerollContainer = document.getElementById('reroll-buttons');
    rerollContainer.innerHTML = '';
    
    if (currentSave.permanentUpgrades.rerolls && currentSave.permanentUpgrades.rerolls > 0) {
        const rerollBtn = document.createElement('button');
        rerollBtn.className = 'menu-btn';
        rerollBtn.textContent = `🔄 Reroll (${currentSave.permanentUpgrades.rerolls} left)`;
        rerollBtn.onclick = () => {
            currentSave.permanentUpgrades.rerolls--;
            saveData(currentSave);
            showLevelUpPanel();
        };
        rerollContainer.appendChild(rerollBtn);
    }
    
    panel.classList.add('active');
}

function generateUpgradeChoices(player, count) {
    const choices = [];
    const classData = CLASSES[selectedClass];
    
    // Calculate available slots
    const totalSlots = classData.baseItemSlots + (currentSave.permanentUpgrades.bonusSlots || 0);
    const usedSlots = Object.keys(player.weapons).length + Object.keys(player.items).length;
    const hasSpace = usedSlots < totalSlots;
    
    // Create weighted pool
    const pool = [];
    
    // Add existing weapons for leveling (high priority)
    Object.keys(player.weapons).forEach(weaponId => {
        const weapon = WEAPONS[weaponId];
        if (weapon && player.weapons[weaponId] < weapon.maxLevel) {
            // Add multiple times for higher chance
            for (let i = 0; i < 3; i++) {
                pool.push({ type: 'weapon', id: weaponId, upgrade: true });
            }
        }
    });
    
    // Add existing items for leveling (high priority)
    Object.keys(player.items).forEach(itemId => {
        const item = ITEMS[itemId];
        if (item && player.items[itemId] < item.maxLevel) {
            for (let i = 0; i < 3; i++) {
                pool.push({ type: 'item', id: itemId, upgrade: true });
            }
        }
    });
    
    // Add new weapons (if has space)
    if (hasSpace) {
        Object.keys(WEAPONS).forEach(weaponId => {
            if (!player.weapons[weaponId]) {
                const weapon = WEAPONS[weaponId];
                // Higher weight for matching affinity
                const weight = classData.weaponAffinity.includes(weapon.type) ? 2 : 1;
                for (let i = 0; i < weight; i++) {
                    pool.push({ type: 'weapon', id: weaponId, upgrade: false });
                }
            }
        });
    }
    
    // Add new items (if has space)
    if (hasSpace) {
        Object.keys(ITEMS).forEach(itemId => {
            if (!player.items[itemId]) {
                const item = ITEMS[itemId];
                const weight = classData.itemAffinity.includes(item.category) ? 2 : 1;
                for (let i = 0; i < weight; i++) {
                    pool.push({ type: 'item', id: itemId, upgrade: false });
                }
            }
        });
    }
    
    // Select random choices
    const selectedIds = new Set();
    while (choices.length < count && pool.length > 0) {
        const index = Math.floor(Math.random() * pool.length);
        const selected = pool[index];
        const key = `${selected.type}-${selected.id}`;
        
        if (!selectedIds.has(key)) {
            selectedIds.add(key);
            
            if (selected.type === 'weapon') {
                const weapon = WEAPONS[selected.id];
                const currentLevel = player.weapons[selected.id] || 0;
                choices.push({
                    type: 'weapon',
                    id: selected.id,
                    name: weapon.name,
                    description: weapon.description,
                    icon: weapon.icon,
                    currentLevel: currentLevel
                });
            } else if (selected.type === 'item') {
                const item = ITEMS[selected.id];
                const currentLevel = player.items[selected.id] || 0;
                choices.push({
                    type: 'item',
                    id: selected.id,
                    name: item.name,
                    description: item.description,
                    icon: item.icon,
                    currentLevel: currentLevel
                });
            }
        }
        
        // Remove selected to avoid duplicates
        pool.splice(index, 1);
    }
    
    return choices;
}

function applyUpgradeChoice(choice) {
    if (choice.type === 'weapon') {
        if (!player.weapons[choice.id]) {
            player.weapons[choice.id] = 1;
        } else {
            player.weapons[choice.id]++;
        }
    } else if (choice.type === 'item') {
        if (!player.items[choice.id]) {
            player.items[choice.id] = 1;
        } else {
            player.items[choice.id]++;
        }
        
        // Reapply all item effects
        player.recalculateStats();
    }
}

function updateItemsDisplay() {
    const container = document.getElementById('items-display');
    container.innerHTML = '';
    
    // Display weapons
    Object.keys(player.weapons).forEach(weaponId => {
        const weapon = WEAPONS[weaponId];
        const level = player.weapons[weaponId];
        
        const item = document.createElement('div');
        item.className = 'item-display';
        item.innerHTML = `
            <span class="item-icon">${weapon.icon}</span>
            <span class="item-level">${level}</span>
        `;
        item.title = `${weapon.name} (Level ${level})`;
        container.appendChild(item);
    });
    
    // Display items
    Object.keys(player.items).forEach(itemId => {
        const itemData = ITEMS[itemId];
        const level = player.items[itemId];
        
        const item = document.createElement('div');
        item.className = 'item-display';
        item.innerHTML = `
            <span class="item-icon">${itemData.icon}</span>
            <span class="item-level">${level}</span>
        `;
        item.title = `${itemData.name} (Level ${level})`;
        container.appendChild(item);
    });
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
}

// ============================================================
// GAME CLASSES
// ============================================================

class Player {
    constructor(classData, mapData) {
        this.x = mapData.width / 2;
        this.y = mapData.height / 2;
        
        // Base stats
        this.maxHP = classData.baseHP;
        this.hp = this.maxHP;
        this.baseSpeed = classData.baseSpeed;
        this.speed = this.baseSpeed;
        this.armor = classData.baseArmor;
        
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        
        this.size = 15;
        this.color = classData.color;
        this.icon = classData.icon;
        
        this.facingAngle = 0;
        this.rotation = 0;
        
        // Weapons and items
        this.weapons = {};
        this.items = {};
        
        // Stat modifiers (recalculated from items)
        this.damageMultiplier = 1;
        this.flatDamageBonus = 0;
        this.speedMultiplier = 1;
        this.damageReduction = 0;
        this.critChance = 0.05; // Base 5%
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
        this.pickupRange = 100;
        this.revives = 0;
        this.explosiveProjectiles = false;
        this.explosionRadius = 0;
        this.explosionDamagePercent = 0;
        this.enemyDamageReduction = 0;
        this.maxShield = 0;
        this.shield = 0;
        this.shieldConversionRate = 0;
        
        // Passive effects
        this.lastRegenTick = Date.now();
        this.weaponCooldowns = {};
        
        this.recalculateStats();
    }
    
    recalculateStats() {
        // Reset multipliers
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
        this.pickupRange = 100;
        this.revives = 0;
        this.explosiveProjectiles = false;
        this.explosionRadius = 0;
        this.explosionDamagePercent = 0;
        this.enemyDamageReduction = 0;
        this.maxShield = 0;
        this.shieldConversionRate = 0;
        
        // Apply all item effects
        Object.keys(this.items).forEach(itemId => {
            const item = ITEMS[itemId];
            const level = this.items[itemId];
            if (item && item.apply) {
                item.apply(this, level);
            }
        });
        
        // Apply speed
        this.speed = this.baseSpeed * this.speedMultiplier;
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
        } else if (enemies.length > 0) {
            // Face nearest enemy if not moving
            const nearest = findNearestEnemy(this, enemies);
            if (nearest) {
                this.facingAngle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
            }
        }
        
        // Rotation for orbital effects
        this.rotation += deltaTime * 2;
        
        // Map boundaries
        const mapData = MAPS[selectedMap];
        this.x = Math.max(this.size, Math.min(mapData.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(mapData.height - this.size, this.y));
        
        // Fire weapons
        this.updateWeapons(deltaTime);
        
        // Update passive items
        this.updatePassiveItems(deltaTime);
        
        // Regeneration
        if (this.healthRegen > 0) {
            const now = Date.now();
            if (now - this.lastRegenTick > 1000) {
                this.heal(this.healthRegen);
                this.lastRegenTick = now;
            }
        }
        
        // Check exploration points and drops
        this.checkExplorationPoints();
        this.checkDrops();
    }
    
    updateWeapons(deltaTime) {
        const now = Date.now();
        
        Object.keys(this.weapons).forEach(weaponId => {
            const weapon = WEAPONS[weaponId];
            const level = this.weapons[weaponId];
            
            if (!weapon) return;
            
            // Handle passive weapons (continuous effects)
            if (weapon.passive && weapon.update) {
                weapon.update(this, level, deltaTime);
                return;
            }
            
            // Handle normal weapons (cooldown-based)
            if (weapon.fire) {
                const baseCooldown = weapon.baseCooldown - (level - 1) * (weapon.cooldownReduction || 0);
                const cooldown = baseCooldown * (1 - this.cooldownReduction);
                
                if (!this.weaponCooldowns[weaponId]) {
                    this.weaponCooldowns[weaponId] = 0;
                }
                
                if (now - this.weaponCooldowns[weaponId] >= cooldown) {
                    weapon.fire(this, level);
                    this.weaponCooldowns[weaponId] = now;
                }
            }
        });
    }
    
    updatePassiveItems(deltaTime) {
        Object.keys(this.items).forEach(itemId => {
            const item = ITEMS[itemId];
            const level = this.items[itemId];
            
            if (item && item.passive && item.update) {
                item.update(this, level, deltaTime);
            }
        });
    }
    
    takeDamage(amount) {
        // Dodge check
        if (Math.random() < this.dodgeChance) {
            createEffect('dodge', this.x, this.y);
            return;
        }
        
        // Reduce by enemy damage reduction
        amount *= (1 - this.enemyDamageReduction);
        
        // Shield absorbs first
        if (this.shield > 0) {
            const shieldDamage = Math.min(this.shield, amount);
            this.shield -= shieldDamage;
            amount -= shieldDamage;
            
            if (amount <= 0) return;
        }
        
        // Armor reduction
        const armorReduction = this.armor / (this.armor + 100);
        amount *= (1 - armorReduction);
        
        // Damage reduction
        amount *= (1 - this.damageReduction);
        
        this.hp -= amount;
        
        // Thorns damage
        if (this.thornsReflect > 0) {
            const thornsDamage = amount * this.thornsReflect;
            enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                if (dist <= 150) {
                    enemy.takeDamage(thornsDamage, this);
                    createEffect('thorns', enemy.x, enemy.y);
                }
            });
        }
        
        if (this.hp <= 0) {
            gameOver();
        }
        
        updateUI();
    }
    
    heal(amount) {
        const oldHP = this.hp;
        this.hp = Math.min(this.maxHP, this.hp + amount);
        
        // Convert excess healing to shield
        if (this.maxShield > 0 && oldHP >= this.maxHP) {
            const excessHealing = amount;
            const shieldGain = excessHealing * this.shieldConversionRate;
            this.shield = Math.min(this.maxShield, this.shield + shieldGain);
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
                        this.heal(this.maxHP * 0.5);
                        createEffect('heal', point.x, point.y);
                        break;
                    case 'treasure':
                        const gold = Math.floor(50 + Math.random() * 50);
                        this.gainGold(gold);
                        createEffect('gold', point.x, point.y);
                        break;
                    case 'shrine':
                        this.damageMultiplier *= 1.1;
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
    
    checkDrops() {
        for (let i = drops.length - 1; i >= 0; i--) {
            const drop = drops[i];
            const dist = Math.hypot(this.x - drop.x, this.y - drop.y);
            
            if (dist <= this.pickupRange) {
                if (drop.type === 'gold') {
                    this.gainGold(drop.amount);
                } else if (drop.type === 'xp') {
                    this.gainXP(drop.amount);
                }
                drops.splice(i, 1);
            }
        }
    }
    
    draw() {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Player circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Shield visual
        if (this.shield > 0) {
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Icon
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, screenX, screenY);
        
        // Draw orbital weapons visuals
        if (this.orbitalAxesVisuals) {
            this.orbitalAxesVisuals.forEach(pos => {
                if (pos) {
                    const axeX = pos.x - camera.x;
                    const axeY = pos.y - camera.y;
                    
                    ctx.save();
                    ctx.translate(axeX, axeY);
                    ctx.rotate(pos.angle);
                    
                    ctx.fillStyle = '#94a3b8';
                    ctx.fillRect(-8, -15, 16, 30);
                    ctx.fillStyle = '#8b4513';
                    ctx.fillRect(-3, -5, 6, 20);
                    
                    ctx.restore();
                }
            });
        }
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
        this.attackCooldown = typeData.attackCooldown || 1500;
        
        // Spawn at random edge
        const edge = Math.floor(Math.random() * 4);
        const margin = 100;
        
        switch(edge) {
            case 0: // top
                this.x = margin + Math.random() * (mapData.width - margin * 2);
                this.y = -this.size - 50;
                break;
            case 1: // right
                this.x = mapData.width + this.size + 50;
                this.y = margin + Math.random() * (mapData.height - margin * 2);
                break;
            case 2: // bottom
                this.x = margin + Math.random() * (mapData.width - margin * 2);
                this.y = mapData.height + this.size + 50;
                break;
            case 3: // left
                this.x = -this.size - 50;
                this.y = margin + Math.random() * (mapData.height - margin * 2);
                break;
        }
        
        this.lastAttack = 0;
        this.stunned = false;
        this.frozen = false;
        this.frozenUntil = 0;
    }
    
    update(deltaTime) {
        if (this.stunned) return;
        
        const now = Date.now();
        
        // Check frozen status
        if (this.frozen && now > this.frozenUntil) {
            this.frozen = false;
        }
        
        if (this.frozen) return;
        
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
            
            // Shoot projectile at player (FIXED: projectile deals damage, not shooting)
            if (now - this.lastAttack > this.attackCooldown) {
                createEnemyProjectile(this.x, this.y, player, {
                    damage: this.damage,
                    color: this.type.projectileColor || '#ef4444',
                    speed: this.type.projectileSpeed || 4
                });
                this.lastAttack = now;
            }
        } else {
            // Chase player
            if (dist > player.size + this.size) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            } else {
                // Melee attack
                if (now - this.lastAttack > this.attackCooldown) {
                    player.takeDamage(this.damage);
                    this.lastAttack = now;
                    createEffect('hit', player.x, player.y);
                }
            }
        }
    }
    
    takeDamage(amount, source) {
        this.hp -= amount;
        
        // Life steal for player
        if (source === player && player.lifeSteal > 0) {
            const heal = amount * player.lifeSteal;
            player.heal(heal);
        }
        
        if (this.hp <= 0) {
            this.die();
        }
    }
    
    die() {
        totalKills++;
        player.gainXP(this.type.xpValue);
        
        // Drop gold
        const goldAmount = this.type.goldValue;
        drops.push({
            x: this.x,
            y: this.y,
            type: 'gold',
            amount: goldAmount
        });
        
        // Particles
        for (let i = 0; i < 8; i++) {
            particles.push(new Particle(this.x, this.y, this.type.visual.color));
        }
        
        const index = enemies.indexOf(this);
        if (index > -1) {
            enemies.splice(index, 1);
        }
        
        // Check if wave is complete
        waveEnemiesRemaining--;
        if (waveEnemiesRemaining <= 0 && waveInProgress) {
            waveInProgress = false;
            const mapData = MAPS[selectedMap];
            const waveData = mapData.waves[currentWave - 1];
            
            // Set timer for next wave
            nextWaveTime = Date.now() + (waveData.duration || 30) * 1000;
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
        this.vy += 0.2; // Gravity
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

function findNearestEnemies(origin, enemyList, count) {
    const sorted = enemyList.slice().sort((a, b) => {
        const distA = Math.hypot(a.x - origin.x, a.y - origin.y);
        const distB = Math.hypot(b.x - origin.x, b.y - origin.y);
        return distA - distB;
    });
    
    return sorted.slice(0, count);
}

function createProjectile(x, y, config) {
    projectiles.push({
        x, y,
        damage: config.damage || 10,
        dx: config.dx || 0,
        dy: config.dy || 0,
        speed: config.speed || 5,
        maxRange: config.range || 500,
        distTraveled: 0,
        pierce: config.pierce || 1,
        pierceCount: 0,
        color: config.color || '#ffffff',
        size: config.size || 5,
        effect: config.effect || 'hit',
        homing: config.homing || false,
        target: config.target || null,
        lifetime: config.lifetime || null,
        age: 0,
        explosive: config.explosive || false,
        explosionRadius: config.explosionRadius || 0
    });
}

function createHomingProjectile(x, y, target, config) {
    createProjectile(x, y, {
        ...config,
        homing: true,
        target: target,
        dx: 0,
        dy: 0
    });
}

function createExplosiveProjectile(x, y, target, config) {
    const angle = Math.atan2(target.y - y, target.x - x);
    createProjectile(x, y, {
        ...config,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        explosive: true,
        explosionRadius: config.explosionRadius || 80
    });
}

function createExpandingRing(x, y, config) {
    effects.push({
        type: 'ring',
        x, y,
        radius: 0,
        maxRadius: config.maxRadius || 200,
        expandSpeed: config.expandSpeed || 5,
        damage: config.damage || 10,
        color: config.color || '#ffffff',
        hitEnemies: new Set()
    });
}

function createEnemyProjectile(x, y, target, config) {
    const angle = Math.atan2(target.y - y, target.x - x);
    projectiles.push({
        x, y,
        damage: config.damage || 10,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        speed: config.speed || 4,
        maxRange: 1000,
        distTraveled: 0,
        pierce: 1,
        pierceCount: 0,
        color: config.color || '#ef4444',
        size: 6,
        effect: 'hit',
        isEnemyProjectile: true,
        age: 0
    });
}

function createEffect(type, x, y) {
    effects.push({
        type, x, y,
        life: 1,
        decay: 0.02,
        age: 0
    });
}

window.displayAchievement = function(name) {
    console.log('Achievement unlocked:', name);
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
    
    // Check for next wave
    if (!waveInProgress && nextWaveTime > 0 && now >= nextWaveTime) {
        nextWave();
    }
    
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
        proj.age += deltaTime;
        
        // Lifetime check
        if (proj.lifetime && proj.age * 1000 > proj.lifetime) {
            return false;
        }
        
        // Homing
        if (proj.homing && proj.target && enemies.includes(proj.target)) {
            const angle = Math.atan2(proj.target.y - proj.y, proj.target.x - proj.x);
            proj.dx = Math.cos(angle);
            proj.dy = Math.sin(angle);
        }
        
        // Move
        const moveX = proj.dx * proj.speed;
        const moveY = proj.dy * proj.speed;
        proj.x += moveX;
        proj.y += moveY;
        proj.distTraveled += Math.hypot(moveX, moveY);
        
        // Range check
        if (proj.distTraveled > proj.maxRange) {
            return false;
        }
        
        // Collision detection
        if (proj.isEnemyProjectile) {
            // Enemy projectile hitting player
            const dist = Math.hypot(player.x - proj.x, player.y - proj.y);
            if (dist <= player.size + proj.size) {
                player.takeDamage(proj.damage);
                createEffect('hit', proj.x, proj.y);
                return false; // Remove projectile
            }
        } else {
            // Player projectile hitting enemies
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                const dist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
                
                if (dist <= enemy.size + proj.size) {
                    // Apply damage
                    let damage = proj.damage;
                    
                    // Berserker bonus
                    if (player.berserkerLevel) {
                        const healthPercent = player.hp / player.maxHP;
                        const missingHealthPercent = 1 - healthPercent;
                        damage *= 1 + (missingHealthPercent * player.berserkerLevel * 0.20);
                    }
                    
                    enemy.takeDamage(damage, player);
                    createEffect(proj.effect, enemy.x, enemy.y);
                    
                    // Explosive
                    if (proj.explosive || player.explosiveProjectiles) {
                        const explRadius = proj.explosionRadius || player.explosionRadius || 60;
                        const explDamage = proj.explosive ? damage * 0.5 : damage * (player.explosionDamagePercent || 0.5);
                        
                        enemies.forEach(e => {
                            if (e !== enemy) {
                                const explDist = Math.hypot(e.x - enemy.x, e.y - enemy.y);
                                if (explDist <= explRadius) {
                                    e.takeDamage(explDamage, player);
                                }
                            }
                        });
                        
                        createEffect('explosion', enemy.x, enemy.y);
                    }
                    
                    // Pierce
                    proj.pierceCount++;
                    const totalPierce = proj.pierce + (player.bonusPierce || 0);
                    if (proj.pierceCount >= totalPierce) {
                        return false;
                    }
                    
                    break;
                }
            }
        }
        
        return true;
    });
    
    particles = particles.filter(p => p.update());
    
    // Update effects
    effects = effects.filter(e => {
        e.age += deltaTime;
        
        if (e.type === 'ring') {
            e.radius += e.expandSpeed;
            
            // Damage enemies in ring
            enemies.forEach(enemy => {
                if (e.hitEnemies.has(enemy)) return;
                
                const dist = Math.hypot(enemy.x - e.x, enemy.y - e.y);
                if (Math.abs(dist - e.radius) <= e.expandSpeed + enemy.size) {
                    enemy.takeDamage(e.damage, player);
                    e.hitEnemies.add(enemy);
                }
            });
            
            return e.radius < e.maxRadius;
        } else {
            e.life -= e.decay;
            return e.life > 0;
        }
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
    
    // Grid
    ctx.strokeStyle = theme.accentColor + '22';
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
            
            // Pulsing effect
            const pulse = Math.sin(Date.now() / 500) * 0.2 + 0.8;
            
            ctx.fillStyle = point.color + '22';
            ctx.beginPath();
            ctx.arc(screenX, screenY, point.radius * pulse, 0, Math.PI * 2);
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
            
            ctx.fillStyle = theme.accentColor + '44';
            ctx.fillRect(screenX, screenY, obstacle.width, obstacle.height);
            
            ctx.strokeStyle = theme.backgroundColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX, screenY, obstacle.width, obstacle.height);
        });
    }
    
    // Drops
    drops.forEach(drop => {
        const screenX = drop.x - camera.x;
        const screenY = drop.y - camera.y;
        
        const bounce = Math.sin(Date.now() / 200) * 3;
        
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (drop.type === 'gold') {
            ctx.fillText('💰', screenX, screenY + bounce);
        } else if (drop.type === 'xp') {
            ctx.fillText('✨', screenX, screenY + bounce);
        }
    });
    
    // Game objects
    particles.forEach(p => p.draw());
    
    // Effects (rings, etc.)
    effects.forEach(effect => {
        if (effect.type === 'ring') {
            const screenX = effect.x - camera.x;
            const screenY = effect.y - camera.y;
            
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1 - (effect.radius / effect.maxRadius);
            ctx.beginPath();
            ctx.arc(screenX, screenY, effect.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        } else {
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
            if (effect.type === 'explosion') icon = '💥';
            if (effect.type === 'slash') icon = '⚔️';
            if (effect.type === 'magic') icon = '✨';
            if (effect.type === 'lightning') icon = '⚡';
            if (effect.type === 'holy') icon = '✨';
            if (effect.type === 'dodge') icon = '🌀';
            if (effect.type === 'revive') icon = '🪶';
            if (effect.type === 'thorns') icon = '🌹';
            if (effect.type === 'timestop') icon = '⏸️';
            
            ctx.fillText(icon, screenX, screenY - 20 * (1 - effect.life));
            ctx.globalAlpha = 1;
        }
    });
    
    // Projectiles
    projectiles.forEach(proj => {
        const screenX = proj.x - camera.x;
        const screenY = proj.y - camera.y;
        
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, proj.size, 0, Math.PI * 2);
        ctx.fill();
        
        if (proj.explosive) {
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
    
    enemies.forEach(e => e.draw());
    
    if (player) {
        player.draw();
    }
}

function drawMinimap() {
    const mapData = MAPS[selectedMap];
    const scaleX = minimapCanvas.width / mapData.width;
    const scaleY = minimapCanvas.height / mapData.height;
    
    minimapCtx.fillStyle = '#1a1a2e';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // Enemies
    enemies.forEach(enemy => {
        minimapCtx.fillStyle = enemy.type.isBoss ? '#a855f7' : '#ef4444';
        minimapCtx.fillRect(
            enemy.x * scaleX - 2,
            enemy.y * scaleY - 2,
            4, 4
        );
    });
    
    // Exploration points
    if (mapData.explorationPoints) {
        mapData.explorationPoints.forEach(point => {
            if (point.collected) return;
            minimapCtx.fillStyle = point.color;
            minimapCtx.fillRect(
                point.x * scaleX - 2,
                point.y * scaleY - 2,
                4, 4
            );
        });
    }
    
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
