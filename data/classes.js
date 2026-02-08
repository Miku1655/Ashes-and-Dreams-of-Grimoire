// ============================================================
// GRIMGAR CLASSES - Based on Hai to Gensou no Grimgar
// ============================================================

const CLASSES = {
    warrior: {
        name: "Warrior",
        description: "Haruhiro's starting class. Balanced melee fighter with good survivability.",
        icon: "⚔️",
        color: "#8b7355",
        quote: "I'll protect everyone... somehow.",
        
        baseHP: 140,
        baseSpeed: 2.7,
        baseArmor: 4,
        baseItemSlots: 6,
        
        weaponAffinity: ["melee", "projectile"],
        itemAffinity: ["defense", "health", "damage"],
        const weapon = WEAPONS[sword];
    },
    
    thief: {
        name: "Thief",
        description: "Haruhiro's true path. High speed and critical damage. Backstab specialist.",
        icon: "🗡️",
        color: "#4a5568",
        quote: "Strike from the shadows, vanish like smoke.",
        
        baseHP: 100,
        baseSpeed: 3.8,
        baseArmor: 2,
        baseItemSlots: 5,
        
        weaponAffinity: ["melee", "projectile"],
        itemAffinity: ["critical", "speed", "damage"]
    },
    
    paladin: {
        name: "Paladin",
        description: "Moguzo's class. High HP tank that protects allies with heavy armor.",
        icon: "🛡️",
        color: "#c53030",
        quote: "I'll take the hits. You all stay safe behind me.",
        
        baseHP: 180,
        baseSpeed: 2.2,
        baseArmor: 8,
        baseItemSlots: 6,
        
        weaponAffinity: ["melee", "area"],
        itemAffinity: ["defense", "health", "recovery"]
    },
    
    mage: {
        name: "Mage",
        description: "Shihoru's class. Long range magical attacks with devastating area damage.",
        icon: "🔮",
        color: "#5b21b6",
        quote: "I won't hold everyone back... not anymore.",
        
        baseHP: 85,
        baseSpeed: 2.6,
        baseArmor: 1,
        baseItemSlots: 7,
        
        weaponAffinity: ["area", "projectile"],
        itemAffinity: ["cooldown", "area", "damage"],
        const weapon = WEAPONS[magicMissile];
    },
    
    priest: {
        name: "Priest",
        description: "Manato's class. Support and healing with divine light magic.",
        icon: "✨",
        color: "#d97706",
        quote: "I'll keep everyone alive. That's my promise.",
        
        baseHP: 110,
        baseSpeed: 2.5,
        baseArmor: 3,
        baseItemSlots: 6,
        
        weaponAffinity: ["projectile", "area"],
        itemAffinity: ["health", "recovery", "support"]
    },
    
    hunter: {
        name: "Hunter",
        description: "Ranta's rival class. Expert tracker with deadly ranged precision.",
        icon: "🏹",
        color: "#2f855a",
        quote: "Nothing escapes my sight in these lands.",
        
        baseHP: 95,
        baseSpeed: 3.2,
        baseArmor: 2,
        baseItemSlots: 6,
        
        weaponAffinity: ["projectile", "area"],
        itemAffinity: ["critical", "damage", "speed"]
    },
    
    darkKnight: {
        name: "Dark Knight",
        description: "Ranta's class. Channels dark power for devastating melee attacks.",
        icon: "💀",
        color: "#7c3aed",
        quote: "Power at any cost. That's the dark knight way!",
        
        baseHP: 120,
        baseSpeed: 2.9,
        baseArmor: 3,
        baseItemSlots: 5,
        
        weaponAffinity: ["melee", "area"],
        itemAffinity: ["damage", "critical", "recovery"]
    },
    
    samurai: {
        name: "Samurai",
        description: "Kikkawa's class. Master of the blade with lightning-fast strikes.",
        icon: "⚡",
        color: "#dc2626",
        quote: "One strike, one kill. The way of the sword.",
        
        baseHP: 125,
        baseSpeed: 3.0,
        baseArmor: 4,
        baseItemSlots: 5,
        
        weaponAffinity: ["melee", "projectile"],
        itemAffinity: ["critical", "damage", "speed"]
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.CLASSES = CLASSES;
}
