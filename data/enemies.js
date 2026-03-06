window.ENEMY_TYPES = {
    goblin: {
        id: 'goblin', name: 'Goblin', hp: 35, damage: 8, speed: 2.0, xp: 15, gold: 3,
        size: 14, behavior: 'chase', attackRange: 20, attackCooldown: 1.0,
        visual: { type: 'circle', color: '#27ae60', secondaryColor: '#1e8449', emoji: '👺' }
    },
    goblinScout: {
        id: 'goblinScout', name: 'Goblin Scout', hp: 28, damage: 6, speed: 3.0, xp: 18, gold: 4,
        size: 12, behavior: 'chase', attackRange: 20, attackCooldown: 0.8,
        visual: { type: 'circle', color: '#58d68d', secondaryColor: '#27ae60', emoji: '🏃' }
    },
    kobold: {
        id: 'kobold', name: 'Kobold', hp: 45, damage: 10, speed: 2.5, xp: 22, gold: 5,
        size: 16, behavior: 'chase', attackRange: 22, attackCooldown: 1.1,
        visual: { type: 'circle', color: '#e67e22', secondaryColor: '#ca6f1e', emoji: '🦎' }
    },
    orc: {
        id: 'orc', name: 'Orc', hp: 70, damage: 15, speed: 1.8, xp: 35, gold: 8,
        size: 20, behavior: 'chase', attackRange: 25, attackCooldown: 1.3,
        visual: { type: 'circle', color: '#1a5276', secondaryColor: '#154360', emoji: '👹' }
    },
    orcBerserker: {
        id: 'orcBerserker', name: 'Orc Berserker', hp: 85, damage: 22, speed: 2.2, xp: 45, gold: 12,
        size: 22, behavior: 'chase', attackRange: 26, attackCooldown: 1.0,
        visual: { type: 'circle', color: '#117a65', secondaryColor: '#0e6655', emoji: '😡' }
    },
    forgan: {
        id: 'forgan', name: 'Forgan', hp: 65, damage: 14, speed: 2.8, xp: 32, gold: 7,
        size: 17, behavior: 'chase', attackRange: 22, attackCooldown: 1.0,
        visual: { type: 'circle', color: '#6c3483', secondaryColor: '#5b2c6f', emoji: '🐺' }
    },
    skeleton: {
        id: 'skeleton', name: 'Skeleton', hp: 50, damage: 12, speed: 2.0, xp: 28, gold: 6,
        size: 15, behavior: 'chase', attackRange: 22, attackCooldown: 1.2,
        visual: { type: 'circle', color: '#ecf0f1', secondaryColor: '#bdc3c7', emoji: '💀' }
    },
    skeletonArcher: {
        id: 'skeletonArcher', name: 'Skeleton Archer', hp: 40, damage: 10, speed: 1.8, xp: 30, gold: 7,
        size: 14, behavior: 'ranged', attackRange: 220, attackCooldown: 2.0,
        visual: { type: 'circle', color: '#d5dbdb', secondaryColor: '#aab7b8', emoji: '🏹' }
    },
    deathSpots: {
        id: 'deathSpots', name: 'Death Spots', hp: 90, damage: 18, speed: 2.3, xp: 50, gold: 10,
        size: 20, behavior: 'chase', attackRange: 24, attackCooldown: 0.9,
        visual: { type: 'circle', color: '#c0392b', secondaryColor: '#922b21', emoji: '🐆' }
    },
    bat: {
        id: 'bat', name: 'Bat', hp: 22, damage: 6, speed: 3.8, xp: 12, gold: 2,
        size: 11, behavior: 'chase', attackRange: 16, attackCooldown: 0.7,
        visual: { type: 'circle', color: '#4a235a', secondaryColor: '#6c3483', emoji: '🦇' }
    },
    ghost: {
        id: 'ghost', name: 'Ghost', hp: 38, damage: 13, speed: 2.5, xp: 24, gold: 5,
        size: 16, behavior: 'ranged', attackRange: 180, attackCooldown: 2.5,
        visual: { type: 'circle', color: '#aed6f1', secondaryColor: '#85c1e9', emoji: '👻' }
    },
    redMoon: {
        id: 'redMoon', name: 'Red Moon', hp: 120, damage: 28, speed: 2.6, xp: 80, gold: 20,
        size: 24, behavior: 'chase', attackRange: 28, attackCooldown: 1.0,
        visual: { type: 'circle', color: '#c0392b', secondaryColor: '#7b241c', emoji: '🌕' }
    },
    goblinKing: {
        id: 'goblinKing', name: 'Goblin King', hp: 200, damage: 25, speed: 2.2, xp: 150, gold: 50,
        size: 30, behavior: 'chase', attackRange: 30, attackCooldown: 0.8, isBoss: true,
        visual: { type: 'circle', color: '#1e8449', secondaryColor: '#196f3d', emoji: '👑' }
    },
    deathSeeker: {
        id: 'deathSeeker', name: 'Death Seeker', hp: 300, damage: 35, speed: 2.5, xp: 250, gold: 80,
        size: 34, behavior: 'chase', attackRange: 32, attackCooldown: 0.7, isBoss: true,
        visual: { type: 'circle', color: '#7b241c', secondaryColor: '#641e16', emoji: '☠️' }
    },
    tamachi: {
        id: 'tamachi', name: 'Tamachi', hp: 500, damage: 50, speed: 1.8, xp: 500, gold: 150,
        size: 40, behavior: 'chase', attackRange: 38, attackCooldown: 1.0, isBoss: true,
        visual: { type: 'circle', color: '#6c3483', secondaryColor: '#5b2c6f', emoji: '🐉' }
    },
    noLifeKing: {
        id: 'noLifeKing', name: 'No-Life King', hp: 800, damage: 60, speed: 2.0, xp: 1000, gold: 300,
        size: 44, behavior: 'ranged', attackRange: 300, attackCooldown: 1.5, isBoss: true,
        visual: { type: 'circle', color: '#1a1a2e', secondaryColor: '#16213e', emoji: '🧟' }
    }
};
