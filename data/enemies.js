// ============================================================
// GRIMGAR ENEMIES - Based on Hai to Gensou no Grimgar
// ============================================================

const ENEMY_TYPES = {
    // ==================== CYRENE MINE ENEMIES ====================
    
    goblin: {
        name: "Goblin",
        description: "Common green-skinned humanoids. Party's first real enemy.",
        hp: 35,
        damage: 8,
        speed: 2.0,
        size: 18,
        xpValue: 15,
        goldValue: 3,
        
        visual: {
            type: "sprite",
            color: "#5a8f3a",
            secondaryColor: "#3d5c27",
            emoji: "👺"
        },
        
        behavior: "chase",
        attackRange: 30
    },
    
    goblinScout: {
        name: "Goblin Scout",
        description: "Faster, more alert goblins that spot danger quickly.",
        hp: 28,
        damage: 6,
        speed: 3.0,
        size: 16,
        xpValue: 18,
        goldValue: 4,
        
        visual: {
            type: "sprite",
            color: "#6aa84f",
            secondaryColor: "#4a7c35",
            emoji: "👺"
        },
        
        behavior: "chase",
        attackRange: 28
    },
    
    kobold: {
        name: "Kobold",
        description: "Dog-like humanoids, more cunning than goblins.",
        hp: 45,
        damage: 10,
        speed: 2.5,
        size: 20,
        xpValue: 22,
        goldValue: 5,
        
        visual: {
            type: "sprite",
            color: "#8b6f47",
            secondaryColor: "#6b5437",
            emoji: "🐕"
        },
        
        behavior: "chase",
        attackRange: 32
    },
    
    // ==================== DAMURO FRONTIER ENEMIES ====================
    
    orc: {
        name: "Orc",
        description: "Large, brutish warriors. Tougher than goblins.",
        hp: 70,
        damage: 15,
        speed: 1.8,
        size: 26,
        xpValue: 35,
        goldValue: 8,
        
        visual: {
            type: "sprite",
            color: "#8b4513",
            secondaryColor: "#654321",
            emoji: "🗡️"
        },
        
        behavior: "chase",
        attackRange: 38
    },
    
    orcBerserker: {
        name: "Orc Berserker",
        description: "Enraged orcs that hit harder but take more risks.",
        hp: 85,
        damage: 22,
        speed: 2.2,
        size: 28,
        xpValue: 45,
        goldValue: 12,
        
        visual: {
            type: "sprite",
            color: "#a0522d",
            secondaryColor: "#8b4513",
            emoji: "⚔️"
        },
        
        behavior: "chase",
        attackRange: 40
    },
    
    // ==================== DEADHEAD WATCHING KEEP ====================
    
    skeleton: {
        name: "Skeleton",
        description: "Undead warriors from the keep. No pain, no fear.",
        hp: 50,
        damage: 12,
        speed: 2.0,
        size: 22,
        xpValue: 28,
        goldValue: 6,
        
        visual: {
            type: "sprite",
            color: "#e8e8e8",
            secondaryColor: "#c0c0c0",
            emoji: "💀"
        },
        
        behavior: "chase",
        attackRange: 35
    },
    
    skeletonArcher: {
        name: "Skeleton Archer",
        description: "Ranged undead that rain arrows from afar.",
        hp: 40,
        damage: 10,
        speed: 1.8,
        size: 20,
        xpValue: 30,
        goldValue: 7,
        projectileSpeed: 5,
        projectileColor: "#d4d4d4",
        
        visual: {
            type: "sprite",
            color: "#f0f0f0",
            secondaryColor: "#d0d0d0",
            emoji: "💀"
        },
        
        behavior: "ranged",
        attackRange: 220,
        attackCooldown: 2000
    },
    
    deathSpots: {
        name: "Death Spots",
        description: "Corrupted undead soldiers. Dangerous and relentless.",
        hp: 90,
        damage: 18,
        speed: 2.3,
        size: 24,
        xpValue: 50,
        goldValue: 10,
        
        visual: {
            type: "sprite",
            color: "#4a4a5e",
            secondaryColor: "#2a2a3e",
            emoji: "⚔️"
        },
        
        behavior: "chase",
        attackRange: 36,
        isBoss: false
    },
    
    // ==================== THOUSAND VALLEY ====================
    
    forgan: {
        name: "Forgan",
        description: "Aggressive beasts from Thousand Valley.",
        hp: 65,
        damage: 14,
        speed: 2.8,
        size: 23,
        xpValue: 32,
        goldValue: 7,
        
        visual: {
            type: "sprite",
            color: "#8b7355",
            secondaryColor: "#6b5535",
            emoji: "🐺"
        },
        
        behavior: "chase",
        attackRange: 34
    },
    
    // ==================== BOSS ENEMIES ====================
    
    goblinKing: {
        name: "Goblin King",
        description: "Leader of the goblin tribes. Manato's killer.",
        hp: 200,
        damage: 25,
        speed: 2.2,
        size: 32,
        xpValue: 150,
        goldValue: 50,
        
        visual: {
            type: "sprite",
            color: "#4a7c35",
            secondaryColor: "#2a5c15",
            emoji: "👑"
        },
        
        behavior: "chase",
        attackRange: 45,
        isBoss: true
    },
    
    deathSeeker: {
        name: "Death Seeker",
        description: "Elite undead commander from Deadhead Watching Keep.",
        hp: 300,
        damage: 35,
        speed: 2.5,
        size: 36,
        xpValue: 250,
        goldValue: 80,
        
        visual: {
            type: "sprite",
            color: "#2a2a3e",
            secondaryColor: "#1a1a2e",
            emoji: "👻"
        },
        
        behavior: "chase",
        attackRange: 50,
        isBoss: true
    },
    
    tamachi: {
        name: "Tamachi",
        description: "Legendary monster. The white giant that haunts Grimgar.",
        hp: 500,
        damage: 50,
        speed: 1.8,
        size: 48,
        xpValue: 500,
        goldValue: 150,
        
        visual: {
            type: "sprite",
            color: "#f0f0f0",
            secondaryColor: "#e0e0e0",
            emoji: "👹"
        },
        
        behavior: "chase",
        attackRange: 60,
        isBoss: true
    },
    
    // ==================== SPECIAL ENEMIES ====================
    
    no_life_king: {
        name: "No-Life King",
        description: "Ancient undead ruler. Commands legions of the dead.",
        hp: 800,
        damage: 60,
        speed: 2.0,
        size: 52,
        xpValue: 1000,
        goldValue: 300,
        projectileSpeed: 6,
        projectileColor: "#8b5cf6",
        
        visual: {
            type: "sprite",
            color: "#6b21a8",
            secondaryColor: "#4a1a78",
            emoji: "💀"
        },
        
        behavior: "ranged",
        attackRange: 300,
        attackCooldown: 1500,
        isBoss: true,
        phaseThrough: true
    },
    
    // ==================== WANDERING ENEMIES ====================
    
    bat: {
        name: "Blood Bat",
        description: "Fast aerial predators that swarm in caves.",
        hp: 22,
        damage: 6,
        speed: 3.8,
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
        name: "Phantom",
        description: "Spectral entities that phase through walls.",
        hp: 38,
        damage: 13,
        speed: 2.5,
        size: 20,
        xpValue: 24,
        goldValue: 5,
        projectileSpeed: 4,
        projectileColor: "#a78bfa",
        
        visual: {
            type: "sprite",
            color: "#a78bfa",
            secondaryColor: "#8b5cf6",
            emoji: "👻"
        },
        
        behavior: "ranged",
        attackRange: 180,
        attackCooldown: 2200,
        phaseThrough: true
    },
    
    redMoon: {
        name: "Red Moon",
        description: "Mysterious creatures that appear under the crimson moon.",
        hp: 120,
        damage: 28,
        speed: 2.6,
        size: 30,
        xpValue: 80,
        goldValue: 20,
        
        visual: {
            type: "sprite",
            color: "#dc2626",
            secondaryColor: "#991b1b",
            emoji: "🌙"
        },
        
        behavior: "chase",
        attackRange: 42,
        isBoss: false
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ENEMY_TYPES = ENEMY_TYPES;
}
