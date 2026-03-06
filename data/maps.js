window.MAPS = [
    {
        id: 'cyreneMine', name: 'CYRENE MINE', description: 'The beginning. Goblins lurk in the dark tunnels, hungering for the flesh of the lost.',
        width: 2200, height: 1600, unlocked: true, unlockCost: 0,
        theme: { backgroundColor: '#1a1205', groundColor: '#2c1f08', accentColor: '#5d4037', tilePattern: 'rock' },
        waves: [
            { name: 'Wave 1 - Goblin Scouts', groups: [{ enemies: ['goblin','goblinScout'], count: 8, spawnDelay: 0.6, announcement: '⚔ Goblins approach!' }], delay: 5 },
            { name: 'Wave 2 - Goblin Horde', groups: [{ enemies: ['goblin','goblinScout'], count: 12, spawnDelay: 0.4, announcement: '⚔ More goblins!' }], delay: 5 },
            { name: 'Wave 3 - Kobolds', groups: [{ enemies: ['kobold'], count: 6, spawnDelay: 0.8, announcement: '🦎 Kobolds emerge!' }, { enemies: ['goblin'], count: 8, spawnDelay: 0.5, delayBefore: 3, announcement: 'With goblin backup!' }], delay: 5 },
            { name: 'Wave 4 - Reinforced', groups: [{ enemies: ['goblin','kobold'], count: 15, spawnDelay: 0.3, announcement: '⚔ Heavy assault!' }], delay: 5 },
            { name: 'Wave 5 - Elite', groups: [{ enemies: ['kobold'], count: 10, spawnDelay: 0.4, announcement: '💀 Elite guards!' }, { enemies: ['goblinScout'], count: 10, spawnDelay: 0.3, delayBefore: 4, announcement: 'Scouts converge!' }], delay: 5 },
            { name: 'GOBLIN KING', groups: [{ enemies: ['goblin'], count: 10, spawnDelay: 0.4, announcement: '👑 Minions first!' }, { enemies: ['goblinKing'], count: 1, spawnDelay: 0, delayBefore: 6, announcement: '👑 GOBLIN KING!', boss: true }], delay: 0 }
        ]
    },
    {
        id: 'damuroFrontier', name: 'DAMURO FRONTIER', description: 'The frontier lands where orcs rule. Only the strong survive here.',
        width: 2600, height: 1900, unlocked: false, unlockCost: 400,
        theme: { backgroundColor: '#0d1b0d', groundColor: '#1a2f1a', accentColor: '#2e7d32', tilePattern: 'grass' },
        waves: [
            { name: 'Wave 1 - Orc Patrol', groups: [{ enemies: ['orc'], count: 6, spawnDelay: 1.0, announcement: '👹 Orcs patrol!' }], delay: 5 },
            { name: 'Wave 2 - Forgan Pack', groups: [{ enemies: ['forgan','kobold'], count: 10, spawnDelay: 0.6, announcement: '🐺 Forgan pack!' }], delay: 5 },
            { name: 'Wave 3 - Orc Warband', groups: [{ enemies: ['orc'], count: 8, spawnDelay: 0.7, announcement: '⚔ Warband incoming!' }, { enemies: ['forgan'], count: 6, spawnDelay: 0.5, delayBefore: 4, announcement: 'Flanking!' }], delay: 5 },
            { name: 'Wave 4 - Berserkers', groups: [{ enemies: ['orcBerserker'], count: 6, spawnDelay: 0.8, announcement: '😡 Berserkers rage!' }, { enemies: ['goblin','kobold'], count: 10, spawnDelay: 0.4, delayBefore: 3 }], delay: 5 },
            { name: 'Wave 5 - Full Assault', groups: [{ enemies: ['orc','orcBerserker','forgan'], count: 18, spawnDelay: 0.35, announcement: '⚔ Full assault!' }], delay: 5 },
            { name: 'BERSERKER TRIO', groups: [{ enemies: ['orc'], count: 8, spawnDelay: 0.5, announcement: '🔥 Escort arrives!' }, { enemies: ['orcBerserker'], count: 3, spawnDelay: 0.5, delayBefore: 8, announcement: '😡 OVERBOSS!', boss: true }], delay: 0 }
        ]
    },
    {
        id: 'deadheadKeep', name: 'DEADHEAD KEEP', description: 'An ancient keep overrun by the undead. The dead do not rest here.',
        width: 2800, height: 2000, unlocked: false, unlockCost: 800,
        theme: { backgroundColor: '#0a0a12', groundColor: '#12121e', accentColor: '#1a1a35', tilePattern: 'stone' },
        waves: [
            { name: 'Wave 1 - Skeleton Patrol', groups: [{ enemies: ['skeleton'], count: 8, spawnDelay: 0.7, announcement: '💀 Skeletons rise!' }], delay: 5 },
            { name: 'Wave 2 - Archers', groups: [{ enemies: ['skeletonArcher'], count: 5, spawnDelay: 1.0, announcement: '🏹 Archer volley!' }, { enemies: ['skeleton'], count: 8, spawnDelay: 0.5, delayBefore: 3 }], delay: 5 },
            { name: 'Wave 3 - Haunted', groups: [{ enemies: ['ghost'], count: 5, spawnDelay: 1.2, announcement: '👻 Ghosts appear!' }, { enemies: ['skeleton','skeletonArcher'], count: 10, spawnDelay: 0.5, delayBefore: 4 }], delay: 5 },
            { name: 'Wave 4 - Death Stalkers', groups: [{ enemies: ['deathSpots'], count: 5, spawnDelay: 0.8, announcement: '🐆 Death Spots hunt!' }, { enemies: ['ghost','skeleton'], count: 12, spawnDelay: 0.4, delayBefore: 3 }], delay: 5 },
            { name: 'Wave 5 - Undead Legion', groups: [{ enemies: ['skeleton','skeletonArcher','ghost','deathSpots'], count: 20, spawnDelay: 0.3, announcement: '💀 UNDEAD LEGION!' }], delay: 5 },
            { name: 'DEATH SEEKER', groups: [{ enemies: ['skeleton','deathSpots'], count: 12, spawnDelay: 0.4, announcement: '💀 The dead rise!' }, { enemies: ['deathSeeker'], count: 1, spawnDelay: 0, delayBefore: 8, announcement: '☠️ DEATH SEEKER!', boss: true }], delay: 0 }
        ]
    },
    {
        id: 'thousandValley', name: 'THOUSAND VALLEY', description: 'A vast valley where powerful monsters roam freely. Danger at every turn.',
        width: 3000, height: 2200, unlocked: false, unlockCost: 1500,
        theme: { backgroundColor: '#080d12', groundColor: '#0f1a24', accentColor: '#154360', tilePattern: 'dirt' },
        waves: [
            { name: 'Wave 1 - Valley Beasts', groups: [{ enemies: ['bat','forgan'], count: 12, spawnDelay: 0.5, announcement: '🦇 Valley beasts!' }], delay: 5 },
            { name: 'Wave 2 - Red Moons', groups: [{ enemies: ['redMoon'], count: 5, spawnDelay: 1.0, announcement: '🌕 Red Moons rise!' }], delay: 5 },
            { name: 'Wave 3 - Orc Invasion', groups: [{ enemies: ['orcBerserker'], count: 6, spawnDelay: 0.7, announcement: '😡 Berserkers!' }, { enemies: ['bat','redMoon'], count: 8, spawnDelay: 0.5, delayBefore: 5 }], delay: 5 },
            { name: 'Wave 4 - Ghost Storm', groups: [{ enemies: ['ghost','bat'], count: 15, spawnDelay: 0.35, announcement: '👻 Ghost storm!' }, { enemies: ['redMoon'], count: 4, spawnDelay: 1.0, delayBefore: 4 }], delay: 5 },
            { name: 'Wave 5 - Valley Overlords', groups: [{ enemies: ['redMoon','orcBerserker','forgan'], count: 18, spawnDelay: 0.3, announcement: '⚔ Overwhelming force!' }], delay: 5 },
            { name: 'TAMACHI', groups: [{ enemies: ['redMoon','bat'], count: 15, spawnDelay: 0.4, announcement: '🌕 The horde gathers!' }, { enemies: ['tamachi'], count: 1, spawnDelay: 0, delayBefore: 10, announcement: '🐉 TAMACHI AWAKENS!', boss: true }], delay: 0 }
        ]
    },
    {
        id: 'parano', name: 'PARANO', description: "The darkest place in Grimgar. Even veterans tremble at Parano's name.",
        width: 3500, height: 2500, unlocked: false, unlockCost: 3000,
        theme: { backgroundColor: '#050508', groundColor: '#08080f', accentColor: '#0d0d1a', tilePattern: 'void' },
        waves: [
            { name: 'Wave 1 - Nightmares', groups: [{ enemies: ['ghost','deathSpots'], count: 12, spawnDelay: 0.5, announcement: '💀 Nightmares!' }], delay: 5 },
            { name: 'Wave 2 - Undead Horde', groups: [{ enemies: ['skeleton','skeletonArcher','ghost'], count: 18, spawnDelay: 0.35, announcement: '☠️ Undead horde!' }], delay: 5 },
            { name: 'Wave 3 - Elite Undead', groups: [{ enemies: ['deathSpots','redMoon'], count: 10, spawnDelay: 0.6, announcement: '🔴 Elite undead!' }, { enemies: ['ghost','skeleton'], count: 12, spawnDelay: 0.4, delayBefore: 4 }], delay: 5 },
            { name: 'Wave 4 - Tamachi Forces', groups: [{ enemies: ['tamachi'], count: 1, spawnDelay: 0, announcement: '🐉 Tamachi returned!', boss: true }, { enemies: ['redMoon','deathSpots'], count: 15, spawnDelay: 0.4, delayBefore: 5 }], delay: 5 },
            { name: 'Wave 5 - Apocalypse', groups: [{ enemies: ['deathSpots','redMoon','ghost','deathSeeker'], count: 25, spawnDelay: 0.25, announcement: '💀 APOCALYPSE!' }], delay: 5 },
            { name: 'NO-LIFE KING', groups: [{ enemies: ['skeleton','ghost','deathSpots'], count: 20, spawnDelay: 0.3, announcement: '💀 His servants come!' }, { enemies: ['noLifeKing'], count: 1, spawnDelay: 0, delayBefore: 12, announcement: '🧟 THE NO-LIFE KING!', boss: true }], delay: 0 }
        ]
    },
    {
        id: 'redMoonRising', name: 'RED MOON RISING', description: 'When the red moon rises, all creatures of darkness gather to destroy the living.',
        width: 2400, height: 1800, unlocked: false, unlockCost: 2000,
        theme: { backgroundColor: '#120508', groundColor: '#1c0810', accentColor: '#7b0d1e', tilePattern: 'blood' },
        waves: [
            { name: 'Wave 1 - Blood Night', groups: [{ enemies: ['bat','goblin','goblinScout'], count: 15, spawnDelay: 0.4, announcement: '🌕 Blood night begins!' }], delay: 5 },
            { name: 'Wave 2 - Mixed Horrors', groups: [{ enemies: ['orc','skeleton','forgan'], count: 12, spawnDelay: 0.5, announcement: '⚔ Horrors converge!' }], delay: 5 },
            { name: 'Wave 3 - Red Moon Pack', groups: [{ enemies: ['redMoon'], count: 6, spawnDelay: 0.8, announcement: '🌕 Red Moon pack!' }, { enemies: ['ghost','bat'], count: 12, spawnDelay: 0.4, delayBefore: 3 }], delay: 5 },
            { name: 'Wave 4 - Elite Chaos', groups: [{ enemies: ['deathSpots','orcBerserker','deathSeeker'], count: 8, spawnDelay: 0.7, announcement: '😡 Elite chaos!' }, { enemies: ['skeleton','ghost'], count: 15, spawnDelay: 0.35, delayBefore: 4 }], delay: 5 },
            { name: 'Wave 5 - All Hell', groups: [{ enemies: ['goblin','orc','skeleton','bat','ghost','redMoon','deathSpots'], count: 25, spawnDelay: 0.25, announcement: '💀 ALL HELL BREAKS LOOSE!' }], delay: 5 },
            { name: 'FINAL BOSSES', groups: [{ enemies: ['goblinKing','deathSeeker'], count: 2, spawnDelay: 2.0, announcement: '👑 THE KINGS ARRIVE!', boss: true }, { enemies: ['tamachi'], count: 1, spawnDelay: 0, delayBefore: 15, announcement: '🐉 AND TAMACHI RETURNS!', boss: true }], delay: 0 }
        ]
    }
];
