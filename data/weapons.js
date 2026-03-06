window.WEAPONS = {
    whip: {
        id: 'whip', name: 'Whip', icon: '〰️', type: 'melee', rarity: 'common',
        maxLevel: 8, baseDamage: 12, baseRange: 80, baseCooldown: 1.4, baseProjectileCount: 1,
        damagePerLevel: 4, rangePerLevel: 6, cooldownReduction: 0.07, projectileCountPerLevel: 0,
        description: 'Arc attack in front. Long reach.',
        evolution: { name: "Grimgar's Whip", description: 'Hits each enemy 3 times', bonusDamage: 20 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const hits = evo ? 3 : 1;
            const projectiles = [];
            for(let h=0;h<hits;h++){
                for(let a=-40;a<=40;a+=20){
                    const angle = player.facingAngle + (a * Math.PI/180) + h*0.1;
                    projectiles.push({
                        x:player.x, y:player.y, dx:Math.cos(angle)*6, dy:Math.sin(angle)*6,
                        speed:6, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                        range:range, lifetime:range/6, pierce:10, color:'#d4a647',
                        size:8, isEnemyProjectile:false, explosive:!!(player.explosiveProjectiles)
                    });
                }
            }
            return projectiles;
        }
    },
    sword: {
        id: 'sword', name: 'Sword', icon: '⚔️', type: 'melee', rarity: 'common',
        maxLevel: 8, baseDamage: 18, baseRange: 60, baseCooldown: 1.0, baseProjectileCount: 1,
        damagePerLevel: 5, rangePerLevel: 4, cooldownReduction: 0.05, projectileCountPerLevel: 0,
        description: 'Spinning blade arc around player.',
        evolution: { name: 'Blade Storm', description: '8 spinning blades orbit you', bonusDamage: 30 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = evo ? 8 : Math.min(2+Math.floor(level/2), 6);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const projectiles = [];
            for(let i=0;i<count;i++){
                const angle = (i/count)*Math.PI*2 + player.facingAngle;
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*7, dy:Math.sin(angle)*7,
                    speed:7, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/7, pierce:3, color:'#85c1e9',
                    size:10, isEnemyProjectile:false, explosive:!!(player.explosiveProjectiles)
                });
            }
            return projectiles;
        }
    },
    magicMissile: {
        id: 'magicMissile', name: 'Magic Missile', icon: '✨', type: 'projectile', rarity: 'common',
        maxLevel: 8, baseDamage: 14, baseRange: 200, baseCooldown: 1.0, baseProjectileCount: 1,
        damagePerLevel: 5, rangePerLevel: 12, cooldownReduction: 0.06, projectileCountPerLevel: 0,
        description: 'Homing missiles seek enemies.',
        evolution: { name: 'Arcane Barrage', description: '15 homing missiles', bonusDamage: 15 },
        fire(player, level, enemies) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = evo ? 15 : Math.min(1+Math.floor(level/2), 6);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const projectiles = [];
            for(let i=0;i<count;i++){
                const angle = (i/count)*Math.PI*2;
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*5, dy:Math.sin(angle)*5,
                    speed:5, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/5, pierce:1, color:'#9b59b6',
                    size:7, isEnemyProjectile:false, homing:true, homingStrength:0.12,
                    explosive:!!(player.explosiveProjectiles)
                });
            }
            return projectiles;
        }
    },
    fireball: {
        id: 'fireball', name: 'Fireball', icon: '🔥', type: 'area', rarity: 'common',
        maxLevel: 8, baseDamage: 22, baseRange: 150, baseCooldown: 1.6, baseProjectileCount: 1,
        damagePerLevel: 8, rangePerLevel: 8, cooldownReduction: 0.07, projectileCountPerLevel: 0,
        description: 'Explosive projectile toward enemies.',
        evolution: { name: 'Inferno', description: 'Leaves burning ground', bonusDamage: 35 },
        fire(player, level, enemies) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = Math.min(1+Math.floor(level/3), 4);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1) * (player.areaMultiplier||1);
            const projectiles = [];
            const targets = enemies ? [...enemies].sort((a,b)=>{
                const da=Math.hypot(a.x-player.x,a.y-player.y);
                const db=Math.hypot(b.x-player.x,b.y-player.y);
                return da-db;
            }).slice(0,count) : [];
            for(let i=0;i<Math.max(count,1);i++){
                let angle = player.facingAngle + i*0.4;
                if(targets[i]) angle = Math.atan2(targets[i].y-player.y, targets[i].x-player.x);
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*4, dy:Math.sin(angle)*4,
                    speed:4, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/4, pierce:evo?3:1, color:'#e67e22',
                    size:14, isEnemyProjectile:false, explosive:true, burn:evo
                });
            }
            return projectiles;
        }
    },
    knife: {
        id: 'knife', name: 'Knife', icon: '🔪', type: 'projectile', rarity: 'common',
        maxLevel: 8, baseDamage: 10, baseRange: 180, baseCooldown: 0.6, baseProjectileCount: 1,
        damagePerLevel: 3, rangePerLevel: 10, cooldownReduction: 0.04, projectileCountPerLevel: 0,
        description: 'Fast throwing knives in aimed direction.',
        evolution: { name: 'Thousand Blades', description: '12 knives, 5 pierce each', bonusDamage: 12 },
        fire(player, level, enemies) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = evo ? 12 : Math.min(1+Math.floor(level/2), 5);
            const pierce = evo ? 5 : (1+(player.bonusPierce||0));
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const projectiles = [];
            for(let i=0;i<count;i++){
                const spread = (count > 1) ? (i/(count-1)-0.5)*0.5 : 0;
                const angle = player.facingAngle + spread;
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*9, dy:Math.sin(angle)*9,
                    speed:9, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/9, pierce:pierce, color:'#bdc3c7',
                    size:6, isEnemyProjectile:false, explosive:!!(player.explosiveProjectiles)
                });
            }
            return projectiles;
        }
    },
    lightningRing: {
        id: 'lightningRing', name: 'Lightning Ring', icon: '⚡', type: 'area', rarity: 'uncommon',
        maxLevel: 8, baseDamage: 16, baseRange: 100, baseCooldown: 1.8, baseProjectileCount: 1,
        damagePerLevel: 6, rangePerLevel: 15, cooldownReduction: 0.08, projectileCountPerLevel: 0,
        description: 'Expanding electric ring from player.',
        evolution: { name: "Thunder God's Wrath", description: '5 rings, chains to enemies', bonusDamage: 25 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const rings = evo ? 5 : 1;
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1) * (player.areaMultiplier||1);
            const projectiles = [];
            for(let r=0;r<rings;r++){
                for(let a=0;a<12;a++){
                    const angle = (a/12)*Math.PI*2 + r*0.3;
                    projectiles.push({
                        x:player.x, y:player.y, dx:Math.cos(angle)*5, dy:Math.sin(angle)*5,
                        speed:5, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                        range:range, lifetime:range/5, pierce:evo?5:2, color:'#f1c40f',
                        size:8, isEnemyProjectile:false
                    });
                }
            }
            return projectiles;
        }
    },
    holyAura: {
        id: 'holyAura', name: 'Holy Aura', icon: '✦', type: 'area', rarity: 'uncommon',
        maxLevel: 8, baseDamage: 8, baseRange: 80, baseCooldown: 0.5, baseProjectileCount: 1,
        damagePerLevel: 3, rangePerLevel: 8, cooldownReduction: 0.03, projectileCountPerLevel: 0,
        description: 'Constant damage aura around you.',
        evolution: { name: 'Divine Radiance', description: 'Also heals player on hit', bonusDamage: 15 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1) * (player.areaMultiplier||1);
            const projectiles = [];
            for(let a=0;a<8;a++){
                const angle = (a/8)*Math.PI*2;
                projectiles.push({
                    x:player.x+Math.cos(angle)*20, y:player.y+Math.sin(angle)*20,
                    dx:Math.cos(angle)*2, dy:Math.sin(angle)*2,
                    speed:2, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/2, pierce:20, color:'#f9e79f',
                    size:10, isEnemyProjectile:false, holy:evo, healOnHit:evo?2:0
                });
            }
            return projectiles;
        }
    },
    orbitalAxes: {
        id: 'orbitalAxes', name: 'Orbital Axes', icon: '🪓', type: 'passive', rarity: 'rare',
        maxLevel: 8, baseDamage: 20, baseRange: 70, baseCooldown: 0.4, baseProjectileCount: 1,
        damagePerLevel: 8, rangePerLevel: 4, cooldownReduction: 0.02, projectileCountPerLevel: 0,
        description: 'Axes orbit you continuously.',
        evolution: { name: 'Vortex of Destruction', description: '8 axes orbit faster', bonusDamage: 30 },
        fire(player, level, enemies, time) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = evo ? 8 : Math.min(2+Math.floor(level/2), 6);
            const orbitRadius = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const speed = evo ? 4 : 2;
            const projectiles = [];
            for(let i=0;i<count;i++){
                const angle = (i/count)*Math.PI*2 + (time||0)*speed;
                projectiles.push({
                    x:player.x+Math.cos(angle)*orbitRadius, y:player.y+Math.sin(angle)*orbitRadius,
                    dx:0, dy:0, speed:0,
                    damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:20, lifetime:0.05, pierce:5, color:'#cd6155',
                    size:12, isEnemyProjectile:false
                });
            }
            return projectiles;
        }
    },
    thiefsDagger: {
        id: 'thiefsDagger', name: "Thief's Dagger", icon: '🗡️', type: 'melee', rarity: 'common',
        maxLevel: 8, baseDamage: 8, baseRange: 50, baseCooldown: 0.4, baseProjectileCount: 1,
        damagePerLevel: 3, rangePerLevel: 3, cooldownReduction: 0.03, projectileCountPerLevel: 0,
        description: 'Quick cone stabs, high crit.',
        evolution: { name: 'Spider', description: '+25% crit chance, rapid stabs', bonusDamage: 10 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = evo ? 6 : 3;
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const isCrit = Math.random() < ((player.critChance||0.05) + (evo?0.25:0));
            const critMult = isCrit ? (player.critDamageMultiplier||2.0) : 1.0;
            const projectiles = [];
            for(let i=0;i<count;i++){
                const spread = (i-(count-1)/2)*0.25;
                const angle = player.facingAngle + spread;
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*12, dy:Math.sin(angle)*12,
                    speed:12, damage:(dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0))*critMult,
                    range:range, lifetime:range/12, pierce:1, color: isCrit?'#e74c3c':'#95a5a6',
                    size:5, isEnemyProjectile:false
                });
            }
            return projectiles;
        }
    },
    paladinGreatsword: {
        id: 'paladinGreatsword', name: "Paladin's Greatsword", icon: '⚔️', type: 'melee', rarity: 'rare',
        maxLevel: 8, baseDamage: 30, baseRange: 70, baseCooldown: 1.8, baseProjectileCount: 1,
        damagePerLevel: 10, rangePerLevel: 5, cooldownReduction: 0.08, projectileCountPerLevel: 0,
        description: 'Heavy cleave with knockback.',
        evolution: { name: "Moguzo's Legacy", description: 'Grants shield on hit', bonusDamage: 50 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const projectiles = [];
            for(let a=-60;a<=60;a+=20){
                const angle = player.facingAngle + a*Math.PI/180;
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*6, dy:Math.sin(angle)*6,
                    speed:6, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/6, pierce:5, color:'#f39c12',
                    size:16, isEnemyProjectile:false, knockback:80, shieldOnHit:evo?10:0
                });
            }
            return projectiles;
        }
    },
    shadowStrike: {
        id: 'shadowStrike', name: 'Shadow Strike', icon: '💀', type: 'melee', rarity: 'rare',
        maxLevel: 8, baseDamage: 25, baseRange: 120, baseCooldown: 1.2, baseProjectileCount: 1,
        damagePerLevel: 8, rangePerLevel: 8, cooldownReduction: 0.06, projectileCountPerLevel: 0,
        description: 'Dash forward damaging all in path.',
        evolution: { name: 'Hatred', description: 'Chains to 3 nearby enemies', bonusDamage: 40 },
        fire(player, level) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const chains = evo ? 3 : 1;
            const projectiles = [];
            for(let c=0;c<chains;c++){
                const angle = player.facingAngle + c*0.4;
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*10, dy:Math.sin(angle)*10,
                    speed:10, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/10, pierce:10, color:'#6c3483',
                    size:12, isEnemyProjectile:false
                });
            }
            return projectiles;
        }
    },
    huntersBow: {
        id: 'huntersBow', name: "Hunter's Bow", icon: '🏹', type: 'projectile', rarity: 'common',
        maxLevel: 8, baseDamage: 16, baseRange: 280, baseCooldown: 1.0, baseProjectileCount: 1,
        damagePerLevel: 6, rangePerLevel: 15, cooldownReduction: 0.05, projectileCountPerLevel: 0,
        description: 'Arrows to nearest enemies.',
        evolution: { name: 'Eagle Eye', description: '10 pierce, never miss', bonusDamage: 25 },
        fire(player, level, enemies) {
            const evo = level >= 8;
            const dmg = this.baseDamage + (level-1)*this.damagePerLevel + (evo?this.evolution.bonusDamage:0);
            const count = Math.min(1+Math.floor(level/3), 4);
            const pierce = evo ? 10 : (1+(player.bonusPierce||0));
            const range = (this.baseRange + (level-1)*this.rangePerLevel) * (player.rangeMultiplier||1);
            const projectiles = [];
            const targets = enemies ? [...enemies].sort((a,b)=>
                Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)
            ).slice(0,count) : [];
            for(let i=0;i<Math.max(count,1);i++){
                let angle = player.facingAngle + i*0.3;
                if(targets[i]) angle = Math.atan2(targets[i].y-player.y, targets[i].x-player.x);
                projectiles.push({
                    x:player.x, y:player.y, dx:Math.cos(angle)*9, dy:Math.sin(angle)*9,
                    speed:9, damage:dmg*(player.damageMultiplier||1)+(player.flatDamageBonus||0),
                    range:range, lifetime:range/9, pierce:pierce, color:'#27ae60',
                    size:8, isEnemyProjectile:false, explosive:!!(player.explosiveProjectiles)
                });
            }
            return projectiles;
        }
    }
};
