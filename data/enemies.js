// ============================================================
// ENEMIES DATA
// ============================================================
// Add new enemy types here

const ENEMY_TYPES = {
    goblin: {
        name: "Goblin",
        hp: 30,
        damage: 8,
        speed: 2,
        size: 18,
        xpValue: 15,
        goldValue: 2,
        
        visual: {
            type: "sprite",
            color: "#5a8f3a",
            secondaryColor: "#3d5c27",
            emoji: "👺"
        },
        
        behavior: "chase",
        attackRange: 30
    },
    
    orc: {
        name: "Orc Warrior",
        hp: 60,
        damage: 12,
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
        damage: 10,
        speed: 1.8,
        size: 20,
        xpValue: 25,
        goldValue: 4,
        projectileSpeed: 4,
        projectileColor: "#e8e8e8",
        
        visual: {
            type: "sprite",
            color: "#e8e8e8",
            secondaryColor: "#a0a0a0",
            emoji: "💀"
        },
        
        behavior: "ranged",
        attackRange: 200,
        attackCooldown: 2000
    },
    
    darkKnight: {
        name: "Dark Knight",
        hp: 120,
        damage: 20,
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
        
        behavior: "chase",
        attackRange: 25
    },
    
    demon: {
        name: "Demon",
        hp: 200,
        damage: 30,
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
    },
    
    bat: {
        name: "Vampire Bat",
        hp: 20,
        damage: 6,
        speed: 3.5,
        size: 14,
        xpValue: 12,
        goldValue: 2,
        
        visual: {
            type: "sprite",
            color: "#6b21a8",
            secondaryColor: "#581c87",
            emoji: "🦇"
        },
        
        behavior: "chase",
        attackRange: 20
    },
    
    ghost: {
        name: "Ghost",
        hp: 35,
        damage: 12,
        speed: 2.2,
        size: 20,
        xpValue: 20,
        goldValue: 3,
        projectileSpeed: 3,
        projectileColor: "#a78bfa",
        
        visual: {
            type: "sprite",
            color: "#a78bfa",
            secondaryColor: "#8b5cf6",
            emoji: "👻"
        },
        
        behavior: "ranged",
        attackRange: 180,
        attackCooldown: 2500,
        phaseThrough: true  // Can pass through obstacles
    },
    
    dragon: {
        name: "Ancient Dragon",
        hp: 500,
        damage: 50,
        speed: 1.5,
        size: 48,
        xpValue: 500,
        goldValue: 100,
        projectileSpeed: 5,
        projectileColor: "#f97316",
        
        visual: {
            type: "sprite",
            color: "#b91c1c",
            secondaryColor: "#7f1d1d",
            emoji: "🐉"
        },
        
        behavior: "ranged",
        attackRange: 300,
        attackCooldown: 1500,
        isBoss: true,
        fireBreath: true  // Special attack
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ENEMY_TYPES = ENEMY_TYPES;
}
