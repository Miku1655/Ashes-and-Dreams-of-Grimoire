// SAVE SYSTEM
const SaveSystem = {
    data: null,

    defaultData() {
        return {
            gold: 0,
            totalGold: 0,
            permanentUpgrades: {},
            consumables: {},
            unlockedMaps: { cyreneMine: true },
            stats: { gamesPlayed: 0, totalKills: 0, highestWave: 0, totalTimePlayed: 0, highestLevel: 0 },
            achievements: {}
        };
    },

    load() {
        try {
            const raw = localStorage.getItem('grimgar_save');
            this.data = raw ? JSON.parse(raw) : this.defaultData();
        } catch(e) {
            this.data = this.defaultData();
        }
        return this.data;
    },

    save() {
        try { localStorage.setItem('grimgar_save', JSON.stringify(this.data)); } catch(e) {}
    },

    addGold(amount) {
        this.data.gold += amount;
        this.data.totalGold += amount;
        this.save();
    },

    spendGold(amount) {
        if(this.data.gold < amount) return false;
        this.data.gold -= amount;
        this.save();
        return true;
    },

    purchaseUpgrade(id) {
        const item = SHOP_ITEMS.permanent[id];
        if(!item) return false;
        if(this.data.permanentUpgrades[id]) return false;
        if(item.requires && !this.data.permanentUpgrades[item.requires]) return false;
        if(!this.spendGold(item.cost)) return false;
        this.data.permanentUpgrades[id] = 1;
        this.save();
        return true;
    },

    purchaseConsumable(id) {
        const item = SHOP_ITEMS.consumables[id];
        if(!item) return false;
        if(!this.spendGold(item.cost)) return false;
        this.data.consumables[id] = (this.data.consumables[id] || 0) + 1;
        this.save();
        return true;
    },

    unlockMap(mapId, cost) {
        if(this.data.unlockedMaps[mapId]) return true;
        if(!this.spendGold(cost)) return false;
        this.data.unlockedMaps[mapId] = true;
        this.save();
        return true;
    },

    updateStats(stats) {
        Object.assign(this.data.stats, stats);
        this.save();
    },

    applyPermanentUpgrades(player) {
        const upgrades = this.data.permanentUpgrades;
        for(const id in upgrades) {
            const item = SHOP_ITEMS.permanent[id];
            if(!item || !item.effect) continue;
            const e = item.effect;
            if(e.damageMultiplier) player.damageMultiplier = (player.damageMultiplier||1) * (1+e.damageMultiplier);
            if(e.maxHP) { player.maxHP += e.maxHP; player.hp += e.maxHP; }
            if(e.speed) player.speedMultiplier = (player.speedMultiplier||1) * (1+e.speed);
            if(e.itemSlots) player.maxItemSlots += e.itemSlots;
            if(e.critChance) player.critChance = (player.critChance||0.05) + e.critChance;
            if(e.goldMultiplier) player.goldMultiplier = (player.goldMultiplier||1) * (1+e.goldMultiplier);
            if(e.xpMultiplier) player.xpMultiplier = (player.xpMultiplier||1) * (1+e.xpMultiplier);
            if(e.canReroll) player.canReroll = true;
            if(e.canSkip) player.canSkip = true;
            if(e.canBanish) player.canBanish = true;
        }
    },

    applyConsumables(player) {
        const cons = this.data.consumables;
        for(const id in cons) {
            if(cons[id] <= 0) continue;
            const item = SHOP_ITEMS.consumables[id];
            if(!item || !item.effect) continue;
            const e = item.effect;
            if(e.maxHP) { player.maxHP += e.maxHP; player.hp += e.maxHP; }
            if(e.damageMultiplier) player.damageMultiplier = (player.damageMultiplier||1) * (1+e.damageMultiplier);
            if(e.goldMultiplier) player.goldMultiplier = (player.goldMultiplier||1) * (1+e.goldMultiplier);
            if(e.xpMultiplier) player.xpMultiplier = (player.xpMultiplier||1) * (1+e.xpMultiplier);
            if(e.revive) player.revives = (player.revives||0) + 1;
            cons[id]--;
        }
        this.save();
    },

    hasAnySave() {
        return this.data && (this.data.stats.gamesPlayed > 0 || this.data.gold > 0);
    }
};

SaveSystem.load();

// SCREEN MANAGEMENT
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// MAIN MENU SETUP
function initMainMenu() {
    const gold = SaveSystem.data.gold;
    document.getElementById('menu-gold-amount').textContent = gold;
    const contBtn = document.getElementById('continue-btn');
    contBtn.style.display = SaveSystem.hasAnySave() ? 'block' : 'none';
}

function startNewGame() {
    showScreen('class-select');
    renderClassSelect();
}

function continueGame() {
    showScreen('class-select');
    renderClassSelect();
}

function openShop() {
    showScreen('shop-screen');
    renderShop('permanent');
}

// CLASS SELECT
function renderClassSelect() {
    const grid = document.getElementById('class-grid');
    grid.innerHTML = '';
    for(const id in CLASSES) {
        const cls = CLASSES[id];
        const startWeapon = WEAPONS[cls.startingWeapon];
        const card = document.createElement('div');
        card.className = 'class-card';
        card.style.borderColor = cls.color + '44';
        card.innerHTML = `
            <span class="class-icon">${cls.icon}</span>
            <div class="class-name">${cls.name}</div>
            <div class="class-quote">${cls.quote}</div>
            <div class="class-stats">
                <div class="class-stat" style="border-color:${cls.color}">HP <strong>${cls.baseHP}</strong></div>
                <div class="class-stat" style="border-color:${cls.color}">SPD <strong>${cls.baseSpeed}</strong></div>
                <div class="class-stat" style="border-color:${cls.color}">ARM <strong>${cls.baseArmor}</strong></div>
                <div class="class-stat" style="border-color:${cls.color}">SLT <strong>${cls.baseItemSlots}</strong></div>
            </div>
            <div class="class-weapon">⚔ Starts with: ${startWeapon ? startWeapon.name : 'Unknown'}</div>
        `;
        card.onclick = () => selectClass(id);
        grid.appendChild(card);
    }
}

let selectedClassId = null;

function selectClass(id) {
    selectedClassId = id;
    showScreen('map-select');
    renderMapSelect();
}

// MAP SELECT
function renderMapSelect() {
    const gold = SaveSystem.data.gold;
    document.getElementById('map-gold-amount').textContent = gold;
    const grid = document.getElementById('map-grid');
    grid.innerHTML = '';
    MAPS.forEach(map => {
        const unlocked = SaveSystem.data.unlockedMaps[map.id];
        const card = document.createElement('div');
        card.className = 'map-card' + (unlocked ? '' : ' locked');
        card.innerHTML = `
            <div class="map-name">${map.name}</div>
            <div class="map-desc">${map.description}</div>
            <div class="map-info">
                <span>📍 ${Math.round(map.width/100)}×${Math.round(map.height/100)} area</span>
                <span>🌊 ${map.waves.length} waves</span>
            </div>
            ${!unlocked ? `<div class="map-unlock ${gold >= map.unlockCost ? 'can-afford' : ''}">
                💰 ${map.unlockCost} Gold to Unlock
            </div>` : ''}
        `;
        if(unlocked) {
            card.onclick = () => startGame(map.id);
        } else if(gold >= map.unlockCost) {
            card.onclick = () => tryUnlockMap(map);
        }
        grid.appendChild(card);
    });
}

function tryUnlockMap(map) {
    if(SaveSystem.unlockMap(map.id, map.unlockCost)) {
        renderMapSelect();
    }
}

// SHOP
let currentShopTab = 'permanent';

function switchShopTab(tab) {
    currentShopTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderShop(tab);
}

function renderShop(tab) {
    document.getElementById('shop-gold-amount').textContent = SaveSystem.data.gold;
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';
    const items = SHOP_ITEMS[tab];
    for(const id in items) {
        const item = items[id];
        const owned = tab === 'permanent' ? SaveSystem.data.permanentUpgrades[id] : (SaveSystem.data.consumables[id]||0);
        const isMaxed = tab === 'permanent' && owned;
        const cantAfford = SaveSystem.data.gold < item.cost;
        const reqMissing = item.requires && !SaveSystem.data.permanentUpgrades[item.requires];
        const card = document.createElement('div');
        card.className = 'shop-item' + (isMaxed?' maxed':'') + ((!isMaxed && (cantAfford||reqMissing))?' cant-afford':'');
        card.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-desc">${item.desc}</div>
            <div class="shop-item-cost">
                ${isMaxed ? '<span class="maxed-text">✓ OWNED</span>' : `<span class="cost-gold">💰 ${item.cost}</span>`}
                ${tab === 'consumables' && owned > 0 ? `<span class="level-indicator">×${owned}</span>` : ''}
                ${reqMissing ? '<span style="color:#c0392b;font-size:11px">Req. upgrade first</span>' : ''}
            </div>
        `;
        if(!isMaxed && !cantAfford && !reqMissing) {
            card.onclick = () => {
                if(tab === 'permanent') SaveSystem.purchaseUpgrade(id);
                else SaveSystem.purchaseConsumable(id);
                renderShop(tab);
            };
        }
        grid.appendChild(card);
    }
}

// Start game
function startGame(mapId) {
    showScreen('game-screen');
    if(typeof initGame === 'function') {
        initGame(selectedClassId, mapId);
    }
}

// Init
initMainMenu();
