// ============================================================
// SAVE SYSTEM - Manages persistent player data
// ============================================================

const SAVE_KEY = 'grimgar_save_data';

// Initialize default save data structure
function getDefaultSaveData() {
    return {
        gold: 0,
        totalGold: 0,
        
        // Permanent upgrades from shop
        permanentUpgrades: {
            damageBoost: 0,
            healthBoost: 0,
            speedBoost: 0,
            critBoost: 0,
            goldBoost: 0,
            xpBoost: 0
        },
        
        // Consumable items
        consumables: {
            healthPotion: 0,
            damagePotion: 0,
            luckPotion: 0
        },
        
        // Unlocked content
        unlockedMaps: {
            forgottenForest: true
        },
        
        // Statistics
        stats: {
            gamesPlayed: 0,
            totalKills: 0,
            highestWave: 0,
            totalTimePlayed: 0,
            highestLevel: 0
        },
        
        // Achievements
        achievements: {
            firstKill: false,
            first10Kills: false,
            first100Kills: false,
            reachWave5: false,
            reachWave10: false,
            reachLevel10: false,
            earnGold100: false,
            earnGold1000: false,
            beatForest: false,
            beatWasteland: false,
            beatCavern: false
        },
        
        // Purchased shop items (to track what's been bought)
        purchasedItems: {}
    };
}

// Load save data from localStorage
function loadSaveData() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Merge with defaults to handle new properties
            return { ...getDefaultSaveData(), ...parsed };
        }
    } catch (e) {
        console.error('Error loading save data:', e);
    }
    return getDefaultSaveData();
}

// Save data to localStorage
function saveData(data) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

// Get current save data
let currentSave = loadSaveData();

// Add gold to player account
function addGold(amount) {
    currentSave.gold += Math.floor(amount);
    currentSave.totalGold += Math.floor(amount);
    saveData(currentSave);
    checkAchievements();
    updateCurrencyDisplays();
}

// Spend gold (returns true if successful)
function spendGold(amount) {
    if (currentSave.gold >= amount) {
        currentSave.gold -= amount;
        saveData(currentSave);
        updateCurrencyDisplays();
        return true;
    }
    return false;
}

// Purchase shop item
function purchaseItem(itemId, item) {
    if (spendGold(item.cost)) {
        // Apply the item effect
        item.apply(currentSave);
        
        // Track purchase for non-stackable items
        if (!item.stackable) {
            if (!currentSave.purchasedItems[itemId]) {
                currentSave.purchasedItems[itemId] = 0;
            }
            currentSave.purchasedItems[itemId]++;
        }
        
        saveData(currentSave);
        return true;
    }
    return false;
}

// Unlock a map
function unlockMap(mapId, cost) {
    if (currentSave.gold >= cost) {
        currentSave.gold -= cost;
        currentSave.unlockedMaps[mapId] = true;
        saveData(currentSave);
        updateCurrencyDisplays();
        return true;
    }
    return false;
}

// Update game statistics
function updateStats(statUpdates) {
    Object.keys(statUpdates).forEach(key => {
        if (key in currentSave.stats) {
            currentSave.stats[key] = Math.max(
                currentSave.stats[key],
                statUpdates[key]
            );
        }
    });
    currentSave.stats.gamesPlayed++;
    saveData(currentSave);
    checkAchievements();
}

// Check and unlock achievements
function checkAchievements() {
    const achievements = currentSave.achievements;
    const stats = currentSave.stats;
    let newAchievements = [];
    
    // Kill achievements
    if (stats.totalKills >= 1 && !achievements.firstKill) {
        achievements.firstKill = true;
        newAchievements.push('First Blood');
    }
    if (stats.totalKills >= 10 && !achievements.first10Kills) {
        achievements.first10Kills = true;
        newAchievements.push('Slayer');
    }
    if (stats.totalKills >= 100 && !achievements.first100Kills) {
        achievements.first100Kills = true;
        newAchievements.push('Legendary Warrior');
    }
    
    // Wave achievements
    if (stats.highestWave >= 5 && !achievements.reachWave5) {
        achievements.reachWave5 = true;
        newAchievements.push('Survivor');
    }
    if (stats.highestWave >= 10 && !achievements.reachWave10) {
        achievements.reachWave10 = true;
        newAchievements.push('Wave Master');
    }
    
    // Level achievement
    if (stats.highestLevel >= 10 && !achievements.reachLevel10) {
        achievements.reachLevel10 = true;
        newAchievements.push('Power Overwhelming');
    }
    
    // Gold achievements
    if (currentSave.totalGold >= 100 && !achievements.earnGold100) {
        achievements.earnGold100 = true;
        newAchievements.push('Getting Rich');
    }
    if (currentSave.totalGold >= 1000 && !achievements.earnGold1000) {
        achievements.earnGold1000 = true;
        newAchievements.push('Wealthy Adventurer');
    }
    
    if (newAchievements.length > 0) {
        saveData(currentSave);
        showAchievementNotification(newAchievements);
    }
}

// Show achievement notification
function showAchievementNotification(achievements) {
    // This will be implemented in the game engine
    if (window.displayAchievement) {
        achievements.forEach(achievement => {
            window.displayAchievement(achievement);
        });
    }
}

// Reset all progress
function resetAllProgress() {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
        currentSave = getDefaultSaveData();
        saveData(currentSave);
        updateCurrencyDisplays();
        alert('Progress reset successfully!');
        location.reload();
    }
}

// Update all currency displays in UI
function updateCurrencyDisplays() {
    const displays = ['menu-currency', 'shop-currency', 'gold-display'];
    displays.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = currentSave.gold;
        }
    });
}

// Apply permanent upgrades to player
function applyPermanentUpgrades(player) {
    const upgrades = currentSave.permanentUpgrades;
    
    // Apply damage boost
    if (upgrades.damageBoost) {
        player.damage *= (1 + upgrades.damageBoost);
    }
    
    // Apply health boost
    if (upgrades.healthBoost) {
        player.maxHP += upgrades.healthBoost;
        player.hp = player.maxHP;
    }
    
    // Apply speed boost
    if (upgrades.speedBoost) {
        player.speed *= (1 + upgrades.speedBoost);
    }
    
    // Apply crit boost
    if (upgrades.critBoost) {
        player.critChance += upgrades.critBoost;
    }
    
    // Store boost multipliers for later use
    player.goldMultiplier = 1 + (upgrades.goldBoost || 0);
    player.xpMultiplier = 1 + (upgrades.xpBoost || 0);
}

// Apply consumables to player (one-time use)
function applyConsumables(player) {
    const consumables = currentSave.consumables;
    
    // Health potion
    if (consumables.healthPotion > 0) {
        player.maxHP += 50 * consumables.healthPotion;
        player.hp = player.maxHP;
        consumables.healthPotion = 0; // Consume all
    }
    
    // Damage potion
    if (consumables.damagePotion > 0) {
        player.damage *= (1 + 0.20 * consumables.damagePotion);
        consumables.damagePotion = 0;
    }
    
    // Luck potion
    if (consumables.luckPotion > 0) {
        player.goldMultiplier *= (1 + 0.50 * consumables.luckPotion);
        consumables.luckPotion = 0;
    }
    
    saveData(currentSave);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadSaveData,
        saveData,
        addGold,
        spendGold,
        purchaseItem,
        unlockMap,
        updateStats,
        checkAchievements,
        applyPermanentUpgrades,
        applyConsumables,
        resetAllProgress,
        currentSave
    };
}
