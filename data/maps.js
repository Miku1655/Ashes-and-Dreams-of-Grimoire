// ============================================================
// MAPS DATA
// ============================================================
// Add new battleground maps here

const MAPS = {
    forgottenForest: {
        name: "Forgotten Forest",
        description: "A dark woodland filled with goblins and wild beasts",
        width: 2000,
        height: 1500,
        unlocked: true,
        
        theme: {
            backgroundColor: "#1a3a1a",
            groundColor: "#2d5a2d",
            accentColor: "#4a7c4a",
            tilePattern: "grass"
        },
        
        waves: [
            { enemies: ["goblin"], count: 5, duration: 30 },
            { enemies: ["goblin", "slime"], count: 8, duration: 35 },
            { enemies: ["goblin", "bat"], count: 10, duration: 40 },
            { enemies: ["orc", "goblin"], count: 12, duration: 40 },
            { enemies: ["orc", "bat"], count: 15, duration: 45 },
            { enemies: ["darkKnight"], count: 1, boss: true }
        ],
        
        explorationPoints: [
            { x: 300, y: 300, type: "healing", radius: 80, color: "#4ade80" },
            { x: 1700, y: 300, type: "treasure", radius: 60, color: "#fbbf24" },
            { x: 1000, y: 1200, type: "healing", radius: 80, color: "#4ade80" },
            { x: 500, y: 1000, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        obstacles: [
            { x: 500, y: 500, width: 100, height: 100, type: "tree" },
            { x: 1200, y: 600, width: 150, height: 80, type: "rock" },
            { x: 800, y: 1000, width: 120, height: 120, type: "tree" },
            { x: 1500, y: 900, width: 100, height: 100, type: "tree" }
        ]
    },
    
    ashenWasteland: {
        name: "Ashen Wasteland",
        description: "Desolate volcanic plains inhabited by demons",
        width: 2400,
        height: 1800,
        unlocked: false,
        unlockCost: 500,
        
        theme: {
            backgroundColor: "#2d1a1a",
            groundColor: "#4a2d2d",
            accentColor: "#7a3d3d",
            tilePattern: "rock"
        },
        
        waves: [
            { enemies: ["skeleton"], count: 8, duration: 35 },
            { enemies: ["skeleton", "orc"], count: 12, duration: 40 },
            { enemies: ["darkKnight"], count: 2, duration: 40 },
            { enemies: ["skeleton", "ghost"], count: 15, duration: 45 },
            { enemies: ["demon"], count: 3, duration: 50 },
            { enemies: ["demon", "darkKnight"], count: 2, boss: true }
        ],
        
        explorationPoints: [
            { x: 400, y: 400, type: "healing", radius: 80, color: "#4ade80" },
            { x: 2000, y: 400, type: "treasure", radius: 60, color: "#fbbf24" },
            { x: 1200, y: 1400, type: "shrine", radius: 100, color: "#a855f7" },
            { x: 800, y: 800, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        obstacles: [
            { x: 600, y: 600, width: 150, height: 150, type: "lava" },
            { x: 1400, y: 800, width: 200, height: 100, type: "rock" },
            { x: 1000, y: 1200, width: 180, height: 180, type: "lava" },
            { x: 1800, y: 1000, width: 150, height: 150, type: "rock" }
        ]
    },
    
    crystalCavern: {
        name: "Crystal Cavern",
        description: "Mysterious underground caves with magical crystals",
        width: 2200,
        height: 1600,
        unlocked: false,
        unlockCost: 1000,
        
        theme: {
            backgroundColor: "#1a1a2e",
            groundColor: "#2d2d4a",
            accentColor: "#4a4a7a",
            tilePattern: "crystal"
        },
        
        waves: [
            { enemies: ["slime"], count: 10, duration: 30 },
            { enemies: ["slime", "bat"], count: 15, duration: 35 },
            { enemies: ["ghost", "bat"], count: 12, duration: 40 },
            { enemies: ["skeleton", "ghost"], count: 15, duration: 45 },
            { enemies: ["darkKnight", "demon"], count: 5, duration: 50 },
            { enemies: ["dragon"], count: 1, boss: true }
        ],
        
        explorationPoints: [
            { x: 350, y: 350, type: "crystal", radius: 70, color: "#8b5cf6" },
            { x: 1850, y: 350, type: "healing", radius: 80, color: "#4ade80" },
            { x: 1100, y: 1250, type: "crystal", radius: 70, color: "#8b5cf6" },
            { x: 700, y: 1100, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        obstacles: [
            { x: 550, y: 550, width: 120, height: 120, type: "crystal" },
            { x: 1300, y: 700, width: 160, height: 100, type: "stalagmite" },
            { x: 900, y: 1100, width: 140, height: 140, type: "crystal" },
            { x: 1600, y: 950, width: 130, height: 130, type: "stalagmite" }
        ]
    },
    
    hauntedGraveyard: {
        name: "Haunted Graveyard",
        description: "Cursed burial grounds where the undead roam",
        width: 2600,
        height: 1800,
        unlocked: false,
        unlockCost: 1500,
        
        theme: {
            backgroundColor: "#1a1a2a",
            groundColor: "#2a2a3a",
            accentColor: "#3a3a4a",
            tilePattern: "grave"
        },
        
        waves: [
            { enemies: ["skeleton", "ghost"], count: 10, duration: 35 },
            { enemies: ["ghost", "bat"], count: 15, duration: 40 },
            { enemies: ["skeleton", "ghost", "bat"], count: 20, duration: 45 },
            { enemies: ["darkKnight", "ghost"], count: 8, duration: 50 },
            { enemies: ["demon", "darkKnight"], count: 6, duration: 55 },
            { enemies: ["dragon", "demon"], count: 2, boss: true }
        ],
        
        explorationPoints: [
            { x: 400, y: 400, type: "crystal", radius: 70, color: "#8b5cf6" },
            { x: 2200, y: 400, type: "treasure", radius: 60, color: "#fbbf24" },
            { x: 1300, y: 1400, type: "shrine", radius: 100, color: "#a855f7" },
            { x: 900, y: 900, type: "healing", radius: 80, color: "#4ade80" },
            { x: 1700, y: 1200, type: "treasure", radius: 60, color: "#fbbf24" }
        ],
        
        obstacles: [
            { x: 700, y: 600, width: 100, height: 150, type: "tomb" },
            { x: 1500, y: 800, width: 120, height: 180, type: "crypt" },
            { x: 1100, y: 1100, width: 140, height: 140, type: "tomb" },
            { x: 1900, y: 1000, width: 160, height: 120, type: "crypt" },
            { x: 500, y: 1300, width: 100, height: 150, type: "tomb" }
        ]
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.MAPS = MAPS;
}
