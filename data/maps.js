// ============================================================
// GRIMGAR MAPS - Based on Hai to Gensou no Grimgar Locations
// ============================================================

const MAPS = {
    // ==================== STARTER MAP ====================
    
    cyreneMine: {
        name: "Cyrene Mine",
        description: "The party's first hunting ground. Dark tunnels where goblins dwell. Where it all began.",
        width: 2200,
        height: 1600,
        unlocked: true,
        
        theme: {
            backgroundColor: "#1a1a1a",
            groundColor: "#2a2520",
            accentColor: "#4a4030",
            tilePattern: "mine"
        },
        
        // Special map mechanics
        mechanics: {
            darkness: true, // Limited visibility
            torchPoints: [ // Light sources that reveal area
                { x: 400, y: 400, radius: 150 },
                { x: 1100, y: 800, radius: 150 },
                { x: 1800, y: 1200, radius: 150 }
            ]
        },
        
        waves: [
            { enemies: ["goblin"], count: 5, duration: 25, announcement: "Goblins ahead..." },
            { enemies: ["goblin", "goblinScout"], count: 8, duration: 30, announcement: "They're getting organized!" },
            { enemies: ["goblin", "kobold"], count: 10, duration: 30, announcement: "Kobolds joining the fight!" },
            { enemies: ["kobold", "goblinScout"], count: 12, duration: 35, announcement: "Watch your back!" },
            { enemies: ["goblin", "kobold", "goblinScout"], count: 15, duration: 35, announcement: "They're everywhere!" },
            { enemies: ["goblinKing"], count: 1, boss: true, announcement: "The Goblin King appears!" }
        ],
        
        explorationPoints: [
            { x: 300, y: 300, type: "healing", radius: 80, color: "#4ade80", name: "Healing Spring" },
            { x: 1900, y: 300, type: "treasure", radius: 60, color: "#fbbf24", name: "Ore Deposit" },
            { x: 1100, y: 1300, type: "shrine", radius: 100, color: "#8b7355", name: "Miner's Shrine" },
            { x: 600, y: 1100, type: "treasure", radius: 60, color: "#fbbf24", name: "Hidden Cache" }
        ],
        
        obstacles: [
            { x: 500, y: 500, width: 120, height: 80, type: "minecart" },
            { x: 1300, y: 700, width: 150, height: 100, type: "rockpile" },
            { x: 900, y: 1100, width: 100, height: 100, type: "support_beam" },
            { x: 1600, y: 900, width: 130, height: 90, type: "minecart" }
        ],
        
        ambiance: "The air is thick with dust. You hear echoes of picks against stone."
    },
    
    // ==================== MID-LEVEL MAP ====================
    
    damuroFrontier: {
        name: "Damuro Frontier",
        description: "Wild frontier where orcs roam. The party hunted here after mastering goblins.",
        width: 2600,
        height: 1900,
        unlocked: false,
        unlockCost: 400,
        
        theme: {
            backgroundColor: "#2a2520",
            groundColor: "#3a3530",
            accentColor: "#5a5540",
            tilePattern: "grass"
        },
        
        mechanics: {
            weatherChange: true, // Weather affects visibility/speed
            campfires: [ // Safe zones that boost regen
                { x: 500, y: 500, radius: 120, healPerSecond: 2 },
                { x: 2100, y: 1400, radius: 120, healPerSecond: 2 }
            ]
        },
        
        waves: [
            { enemies: ["orc"], count: 6, duration: 30, announcement: "Orc patrol spotted!" },
            { enemies: ["orc", "goblin"], count: 10, duration: 35, announcement: "Mixed war party!" },
            { enemies: ["orcBerserker"], count: 4, duration: 30, announcement: "Berserkers incoming!" },
            { enemies: ["orc", "orcBerserker"], count: 8, duration: 35, announcement: "They're enraged!" },
            { enemies: ["orcBerserker", "kobold"], count: 12, duration: 40, announcement: "The horde advances!" },
            { enemies: ["orc", "orcBerserker", "forgan"], count: 15, duration: 40, announcement: "Beasts and warriors!" },
            { enemies: ["orcBerserker"], count: 3, boss: true, announcement: "Orc Champions challenge you!" }
        ],
        
        explorationPoints: [
            { x: 400, y: 400, type: "healing", radius: 90, color: "#4ade80", name: "Frontier Well" },
            { x: 2200, y: 400, type: "treasure", radius: 70, color: "#fbbf24", name: "Abandoned Camp" },
            { x: 1300, y: 1500, type: "crystal", radius: 80, color: "#8b5cf6", name: "Ancient Runestone" },
            { x: 800, y: 1000, type: "shrine", radius: 100, color: "#d97706", name: "Warrior's Memorial" },
            { x: 1800, y: 1200, type: "treasure", radius: 70, color: "#fbbf24", name: "Supply Cache" }
        ],
        
        obstacles: [
            { x: 700, y: 600, width: 140, height: 100, type: "tent" },
            { x: 1500, y: 800, width: 160, height: 120, type: "fence" },
            { x: 1100, y: 1200, width: 150, height: 110, type: "tent" },
            { x: 1900, y: 1000, width: 140, height: 100, type: "barricade" }
        ],
        
        ambiance: "Wind whistles across the plains. You feel watched from the treeline."
    },
    
    // ==================== UNDEAD MAP ====================
    
    deadheadWatchingKeep: {
        name: "Deadhead Watching Keep",
        description: "Cursed fortress of the undead. Where Death Spots and No-Life King rule.",
        width: 2800,
        height: 2000,
        unlocked: false,
        unlockCost: 800,
        
        theme: {
            backgroundColor: "#1a1a2e",
            groundColor: "#252538",
            accentColor: "#353548",
            tilePattern: "stone"
        },
        
        mechanics: {
            cursed: true, // HP slowly drains
            curseDamage: 1, // HP per second
            holyCircles: [ // Zones that protect from curse
                { x: 600, y: 600, radius: 140 },
                { x: 1400, y: 1000, radius: 140 },
                { x: 2200, y: 1400, radius: 140 }
            ],
            undead: true // Undead enemies regenerate unless killed quickly
        },
        
        waves: [
            { enemies: ["skeleton"], count: 8, duration: 35, announcement: "The dead rise..." },
            { enemies: ["skeleton", "skeletonArcher"], count: 12, duration: 40, announcement: "Arrows from the darkness!" },
            { enemies: ["deathSpots"], count: 5, duration: 35, announcement: "Death Spots emerge!" },
            { enemies: ["skeleton", "deathSpots", "ghost"], count: 15, duration: 45, announcement: "Spectral and skeletal!" },
            { enemies: ["deathSpots", "skeletonArcher"], count: 12, duration: 40, announcement: "Elite undead legion!" },
            { enemies: ["ghost", "deathSpots"], count: 10, duration: 45, announcement: "The keep's defenders!" },
            { enemies: ["deathSeeker"], count: 1, boss: true, announcement: "Death Seeker awakens!" }
        ],
        
        explorationPoints: [
            { x: 500, y: 500, type: "healing", radius: 100, color: "#4ade80", name: "Holy Fountain" },
            { x: 2300, y: 500, type: "crystal", radius: 80, color: "#8b5cf6", name: "Cursed Altar" },
            { x: 1400, y: 1600, type: "shrine", radius: 110, color: "#d4af37", name: "Paladin's Tomb" },
            { x: 900, y: 1200, type: "treasure", radius: 70, color: "#fbbf24", name: "Armory" },
            { x: 1900, y: 1400, type: "treasure", radius: 70, color: "#fbbf24", name: "Treasury" }
        ],
        
        obstacles: [
            { x: 800, y: 700, width: 120, height: 160, type: "pillar" },
            { x: 1600, y: 900, width: 180, height: 140, type: "tombstone" },
            { x: 1200, y: 1300, width: 150, height: 150, type: "pillar" },
            { x: 2000, y: 1100, width: 140, height: 170, type: "tombstone" },
            { x: 600, y: 1400, width: 130, height: 150, type: "crypt" }
        ],
        
        ambiance: "The air is cold and still. Every breath feels like it might be your last."
    },
    
    // ==================== ADVANCED MAP ====================
    
    thousandValley: {
        name: "Thousand Valley",
        description: "Treacherous canyon system. Only experienced parties dare enter.",
        width: 3000,
        height: 2200,
        unlocked: false,
        unlockCost: 1500,
        
        theme: {
            backgroundColor: "#2d1a1a",
            groundColor: "#3d2a2a",
            accentColor: "#5d3a3a",
            tilePattern: "canyon"
        },
        
        mechanics: {
            vertigo: true, // Occasionally disorients player
            thermals: [ // Wind currents that push player
                { x: 800, y: 600, width: 300, height: 400, direction: { x: 2, y: 0 } },
                { x: 1800, y: 1200, width: 300, height: 400, direction: { x: -2, y: 1 } }
            ],
            altitude: true // Higher ground gives damage bonus
        },
        
        waves: [
            { enemies: ["forgan"], count: 10, duration: 35, announcement: "Valley predators!" },
            { enemies: ["forgan", "bat"], count: 15, duration: 40, announcement: "Aerial assault!" },
            { enemies: ["redMoon"], count: 5, duration: 40, announcement: "Red Moon rises!" },
            { enemies: ["forgan", "redMoon", "orcBerserker"], count: 18, duration: 45, announcement: "Beast horde!" },
            { enemies: ["redMoon", "deathSpots"], count: 12, duration: 45, announcement: "Chaos reigns!" },
            { enemies: ["forgan", "redMoon", "ghost"], count: 20, duration: 50, announcement: "They come from everywhere!" },
            { enemies: ["tamachi"], count: 1, boss: true, announcement: "TAMACHI - THE WHITE GIANT!" }
        ],
        
        explorationPoints: [
            { x: 600, y: 600, type: "healing", radius: 100, color: "#4ade80", name: "Mountain Spring" },
            { x: 2400, y: 600, type: "crystal", radius: 90, color: "#8b5cf6", name: "Valley Crystals" },
            { x: 1500, y: 1700, type: "shrine", radius: 120, color: "#dc2626", name: "Blood Shrine" },
            { x: 1000, y: 1200, type: "treasure", radius: 80, color: "#fbbf24", name: "Cliff Cache" },
            { x: 2100, y: 1500, type: "treasure", radius: 80, color: "#fbbf24", name: "Hidden Stash" }
        ],
        
        obstacles: [
            { x: 900, y: 700, width: 200, height: 150, type: "boulder" },
            { x: 1700, y: 1000, width: 220, height: 130, type: "cliff" },
            { x: 1300, y: 1400, width: 180, height: 180, type: "boulder" },
            { x: 2200, y: 1200, width: 200, height: 140, type: "cliff" },
            { x: 700, y: 1600, width: 170, height: 160, type: "boulder" }
        ],
        
        ambiance: "Echoes bounce between canyon walls. The wind howls like a living thing."
    },
    
    // ==================== END-GAME MAP ====================
    
    parano: {
        name: "Parano",
        description: "The city of the dead. No-Life King's domain. Where legends are tested.",
        width: 3500,
        height: 2500,
        unlocked: false,
        unlockCost: 3000,
        
        theme: {
            backgroundColor: "#0f0f1e",
            groundColor: "#1a1a2e",
            accentColor: "#2a2a3e",
            tilePattern: "ruins"
        },
        
        mechanics: {
            deathZones: [ // Instant death areas
                { x: 800, y: 800, width: 200, height: 200 },
                { x: 2200, y: 1400, width: 200, height: 200 }
            ],
            resurrectionCircles: [ // Revive with 50% HP if killed
                { x: 500, y: 500, radius: 100 },
                { x: 3000, y: 2000, radius: 100 }
            ],
            darkness: true,
            cursed: true,
            curseDamage: 2
        },
        
        waves: [
            { enemies: ["deathSpots", "skeleton"], count: 15, duration: 40, announcement: "The city awakens..." },
            { enemies: ["deathSpots", "ghost", "skeletonArcher"], count: 20, duration: 45, announcement: "Legion of the damned!" },
            { enemies: ["deathSeeker"], count: 2, duration: 45, announcement: "Twin Seekers!" },
            { enemies: ["redMoon", "deathSpots", "ghost"], count: 25, duration: 50, announcement: "Nightmare incarnate!" },
            { enemies: ["deathSeeker", "ghost", "skeletonArcher"], count: 18, duration: 50, announcement: "Elite guard!" },
            { enemies: ["tamachi"], count: 1, duration: 50, announcement: "Tamachi guards the gate!" },
            { enemies: ["no_life_king"], count: 1, boss: true, announcement: "THE NO-LIFE KING!" }
        ],
        
        explorationPoints: [
            { x: 700, y: 700, type: "healing", radius: 120, color: "#4ade80", name: "Life's Last Refuge" },
            { x: 2800, y: 700, type: "crystal", radius: 100, color: "#8b5cf6", name: "Death Crystal" },
            { x: 1750, y: 2000, type: "shrine", radius: 130, color: "#6b21a8", name: "Throne of Bones" },
            { x: 1200, y: 1400, type: "treasure", radius: 90, color: "#fbbf24", name: "Royal Vault" },
            { x: 2400, y: 1700, type: "treasure", radius: 90, color: "#fbbf24", name: "Ancient Treasury" },
            { x: 1750, y: 800, type: "crystal", radius: 100, color: "#8b5cf6", name: "Soul Conduit" }
        ],
        
        obstacles: [
            { x: 1000, y: 900, width: 200, height: 200, type: "ruins" },
            { x: 2000, y: 1100, width: 250, height: 180, type: "throne" },
            { x: 1500, y: 1500, width: 220, height: 220, type: "ruins" },
            { x: 2600, y: 1400, width: 200, height: 190, type: "obelisk" },
            { x: 900, y: 1800, width: 180, height: 200, type: "ruins" }
        ],
        
        ambiance: "Death itself watches. The No-Life King awaits any who dare challenge him."
    },
    
    // ==================== BONUS MAP ====================
    
    redMoonRising: {
        name: "Red Moon Rising",
        description: "Special event map. When the crimson moon appears, all bets are off.",
        width: 2400,
        height: 1800,
        unlocked: false,
        unlockCost: 2000,
        
        theme: {
            backgroundColor: "#2d0a0a",
            groundColor: "#3d1a1a",
            accentColor: "#5d2a2a",
            tilePattern: "blood"
        },
        
        mechanics: {
            bloodMoon: true, // All enemies stronger but give double rewards
            berserk: true, // Player gains attack speed but takes more damage
            timeLimit: 600, // 10 minute time limit
            endless: false // Survives all waves = victory
        },
        
        waves: [
            { enemies: ["goblin", "orc", "kobold"], count: 20, duration: 30, announcement: "BLOOD MOON RISES!" },
            { enemies: ["orcBerserker", "forgan", "bat"], count: 25, duration: 35, announcement: "Beasts go mad!" },
            { enemies: ["redMoon"], count: 8, duration: 35, announcement: "Moon's children!" },
            { enemies: ["deathSpots", "skeleton", "ghost"], count: 30, duration: 40, announcement: "Dead and living!" },
            { enemies: ["redMoon", "tamachi"], count: 6, duration: 45, announcement: "Giants under the moon!" },
            { enemies: ["deathSeeker", "goblinKing", "orcBerserker"], count: 8, boss: true, announcement: "CHAMPIONS OF CHAOS!" }
        ],
        
        explorationPoints: [
            { x: 400, y: 400, type: "healing", radius: 100, color: "#dc2626", name: "Blood Pool" },
            { x: 2000, y: 400, type: "crystal", radius: 100, color: "#dc2626", name: "Crimson Crystal" },
            { x: 1200, y: 1400, type: "shrine", radius: 120, color: "#dc2626", name: "Moon Altar" },
            { x: 800, y: 1000, type: "treasure", radius: 80, color: "#fbbf24", name: "Chaos Cache" }
        ],
        
        obstacles: [
            { x: 700, y: 700, width: 150, height: 150, type: "bloodstone" },
            { x: 1500, y: 900, width: 180, height: 160, type: "monolith" },
            { x: 1100, y: 1200, width: 160, height: 160, type: "bloodstone" }
        ],
        
        ambiance: "The red moon bathes everything in crimson. Madness fills the air."
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.MAPS = MAPS;
}
