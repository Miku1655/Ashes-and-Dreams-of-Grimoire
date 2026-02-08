// ============================================================
// SHOP DATA
// ============================================================
// Permanent upgrades and consumables available in the shop

const SHOP_ITEMS = {
    permanent: {
        damageBoost1: {
            name: "Sharpened Blade I",
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
        
        damageBoost2: {
            name: "Sharpened Blade II",
            description: "Permanently increase damage by 15%",
            cost: 250,
            icon: "⚔️",
            requires: "damageBoost1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.damageBoost) {
                    saveData.permanentUpgrades.damageBoost = 0;
                }
                saveData.permanentUpgrades.damageBoost += 0.15;
            }
        },
        
        healthBoost1: {
            name: "Fortified Armor I",
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
        
        healthBoost2: {
            name: "Fortified Armor II",
            description: "Permanently increase max HP by 30",
            cost: 250,
            icon: "🛡️",
            requires: "healthBoost1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.healthBoost) {
                    saveData.permanentUpgrades.healthBoost = 0;
                }
                saveData.permanentUpgrades.healthBoost += 30;
            }
        },
        
        speedBoost1: {
            name: "Swift Boots I",
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
        
        speedBoost2: {
            name: "Swift Boots II",
            description: "Permanently increase movement speed by 20%",
            cost: 350,
            icon: "👟",
            requires: "speedBoost1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.speedBoost) {
                    saveData.permanentUpgrades.speedBoost = 0;
                }
                saveData.permanentUpgrades.speedBoost += 0.20;
            }
        },
        
        itemSlot1: {
            name: "Backpack Expansion I",
            description: "Carry +1 additional item/weapon",
            cost: 300,
            icon: "🎒",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.bonusSlots) {
                    saveData.permanentUpgrades.bonusSlots = 0;
                }
                saveData.permanentUpgrades.bonusSlots += 1;
            }
        },
        
        itemSlot2: {
            name: "Backpack Expansion II",
            description: "Carry +1 additional item/weapon",
            cost: 600,
            icon: "🎒",
            requires: "itemSlot1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.bonusSlots) {
                    saveData.permanentUpgrades.bonusSlots = 0;
                }
                saveData.permanentUpgrades.bonusSlots += 1;
            }
        },
        
        critBoost1: {
            name: "Lucky Charm I",
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
        
        critBoost2: {
            name: "Lucky Charm II",
            description: "Permanently increase critical chance by 8%",
            cost: 450,
            icon: "🍀",
            requires: "critBoost1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.critBoost) {
                    saveData.permanentUpgrades.critBoost = 0;
                }
                saveData.permanentUpgrades.critBoost += 0.08;
            }
        },
        
        goldBoost1: {
            name: "Greedy Ring I",
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
        
        goldBoost2: {
            name: "Greedy Ring II",
            description: "Permanently increase gold drops by 35%",
            cost: 550,
            icon: "💍",
            requires: "goldBoost1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.goldBoost) {
                    saveData.permanentUpgrades.goldBoost = 0;
                }
                saveData.permanentUpgrades.goldBoost += 0.35;
            }
        },
        
        xpBoost1: {
            name: "Sage Tome I",
            description: "Permanently increase XP gain by 20%",
            cost: 300,
            icon: "📚",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.xpBoost) {
                    saveData.permanentUpgrades.xpBoost = 0;
                }
                saveData.permanentUpgrades.xpBoost += 0.20;
            }
        },
        
        xpBoost2: {
            name: "Sage Tome II",
            description: "Permanently increase XP gain by 30%",
            cost: 650,
            icon: "📚",
            requires: "xpBoost1",
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.xpBoost) {
                    saveData.permanentUpgrades.xpBoost = 0;
                }
                saveData.permanentUpgrades.xpBoost += 0.30;
            }
        },
        
        rerollUpgrade: {
            name: "Reroll Token",
            description: "Reroll level-up choices once per run",
            cost: 400,
            icon: "🔄",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.rerolls) {
                    saveData.permanentUpgrades.rerolls = 0;
                }
                saveData.permanentUpgrades.rerolls += 1;
            }
        },
        
        skipUpgrade: {
            name: "Skip Token",
            description: "Skip level-up to reroll next time",
            cost: 500,
            icon: "⏭️",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.skips) {
                    saveData.permanentUpgrades.skips = 0;
                }
                saveData.permanentUpgrades.skips += 1;
            }
        },
        
        banishUpgrade: {
            name: "Banish Token",
            description: "Remove an item from the upgrade pool",
            cost: 600,
            icon: "🚫",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.permanentUpgrades.banishes) {
                    saveData.permanentUpgrades.banishes = 0;
                }
                saveData.permanentUpgrades.banishes += 1;
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
        },
        
        xpPotion: {
            name: "Experience Elixir",
            description: "Start next run with +50% XP gain",
            cost: 100,
            icon: "📖",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.consumables.xpPotion) {
                    saveData.consumables.xpPotion = 0;
                }
                saveData.consumables.xpPotion += 1;
            }
        },
        
        revivePotion: {
            name: "Phoenix Down",
            description: "Revive once if defeated in next run",
            cost: 200,
            icon: "🪶",
            stackable: true,
            
            apply: (saveData) => {
                if (!saveData.consumables.revivePotion) {
                    saveData.consumables.revivePotion = 0;
                }
                saveData.consumables.revivePotion += 1;
            }
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.SHOP_ITEMS = SHOP_ITEMS;
}
