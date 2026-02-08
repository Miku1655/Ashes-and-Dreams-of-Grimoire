// ============================================================
// CLASSES DATA
// ============================================================
// Add or modify player classes here

const CLASSES = {
    warrior: {
        name: "Warrior",
        description: "High HP and melee combat. Tanky frontline fighter.",
        icon: "⚔️",
        color: "#c53030",
        
        // Starting stats
        baseHP: 150,
        baseSpeed: 2.5,
        baseArmor: 5,
        baseItemSlots: 6,  // How many items/weapons can carry
        
        // Determines what appears in level-ups
        weaponAffinity: ["melee", "projectile"],
        itemAffinity: ["defense", "health", "damage"]
    },
    
    ranger: {
        name: "Ranger",
        description: "Long range attacks with high speed. Glass cannon archer.",
        icon: "🏹",
        color: "#2f855a",
        
        baseHP: 100,
        baseSpeed: 3.5,
        baseArmor: 2,
        baseItemSlots: 6,
        
        weaponAffinity: ["projectile", "area"],
        itemAffinity: ["speed", "critical", "damage"]
    },
    
    mage: {
        name: "Mage",
        description: "Area damage and magical abilities. High burst damage.",
        icon: "🔮",
        color: "#5b21b6",
        
        baseHP: 80,
        baseSpeed: 2.8,
        baseArmor: 1,
        baseItemSlots: 7,  // Mages can hold more items
        
        weaponAffinity: ["area", "projectile"],
        itemAffinity: ["cooldown", "area", "damage"]
    },
    
    priest: {
        name: "Priest",
        description: "Healing and support abilities. Sustain specialist.",
        icon: "✨",
        color: "#d97706",
        
        baseHP: 120,
        baseSpeed: 2.5,
        baseArmor: 3,
        baseItemSlots: 6,
        
        weaponAffinity: ["projectile", "melee"],
        itemAffinity: ["health", "recovery", "support"]
    },
    
    assassin: {
        name: "Assassin",
        description: "High critical damage and speed. Deadly precision.",
        icon: "🗡️",
        color: "#7c3aed",
        
        baseHP: 90,
        baseSpeed: 4.0,
        baseArmor: 2,
        baseItemSlots: 5,
        
        weaponAffinity: ["melee", "projectile"],
        itemAffinity: ["critical", "speed", "damage"]
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.CLASSES = CLASSES;
}
