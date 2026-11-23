const { ITEMS, ITEM_PROBABILITIES, HAZARD_MESSAGES } = require('./constants');

class RaceEngine {
  constructor(player, cpus, track, totalLaps) {
    this.player = player;
    this.cpus = cpus;
    this.track = track;
    this.totalLaps = totalLaps;
    this.tick = 0;
    this.finishOrder = [];
    this.itemBoxPositions = this.generateItemBoxes();
    this.hazardPositions = this.generateHazards();
    this.boostPadPositions = this.generateBoostPads();
    this.droppedItems = []; // Bananas, shells on track
    this.messages = [];
    this.raceStartTime = Date.now();
    
    // Init speeds
    const allRacers = this.getAllRacers();
    allRacers.forEach(r => {
      r.speed = r.acceleration * 2;
      r.position = 0;
      r.lap = 1;
    });
  }

  getAllRacers() {
    return [this.player, ...this.cpus];
  }

  isRaceOver() {
    const allRacers = this.getAllRacers();
    return allRacers.every(r => r.finished);
  }

  // Player movement based on input
  movePlayer(input) {
    const player = this.player;
    if (player.stunned > 0 || player.finished) return;
    
    const accelBonus = player.acceleration * 0.5;
    
    switch(input) {
      case 'w': // Accelerate
        const maxSpd = player.boosted > 0 ? player.maxSpeed * 1.6 : player.maxSpeed;
        player.speed = Math.min(player.speed + accelBonus + 2, maxSpd);
        player.position += player.speed * 0.015;
        this.addMessage(`💨 ${player.name} acelera! Velocidade: ${Math.round(player.speed)}`);
        break;
        
      case 'a': // Steer left (dodge hazards)
        if (Math.random() < player.handling / 10) {
          this.addMessage(`↩️ ${player.name} desvia para a esquerda!`);
          player.position += player.speed * 0.008;
        } else {
          player.position += player.speed * 0.006;
        }
        break;
        
      case 'd': // Steer right
        if (Math.random() < player.handling / 10) {
          this.addMessage(`↪️ ${player.name} desvia para a direita!`);
          player.position += player.speed * 0.008;
        } else {
          player.position += player.speed * 0.006;
        }
        break;
    }
    
    // Check item boxes
    this.checkItemBoxes(player);
    // Check boost pads
    this.checkBoostPads(player);
    // Check dropped items
    this.checkDroppedItems(player);
  }

  playerDrift() {
    const player = this.player;
    if (player.stunned > 0) return;
    
    player.driftCharge++;
    player.position += player.speed * 0.010;
    
    if (player.driftCharge >= 3) {
      const boostPower = Math.min(1.0 + (player.driftCharge * 0.05), 1.5);
      player.applyBoost(boostPower, 2);
      player.driftCharge = 0;
      this.addMessage(`🔥 DRIFT BOOST! (x${boostPower.toFixed(1)})`);
    } else {
      this.addMessage(`🌀 Driftando... (${player.driftCharge}/3)`);
    }
  }

  usePlayerItem() {
    const player = this.player;
    if (!player.item) {
      this.addMessage('❌ Sem item!');
      return;
    }
    
    this.executeItemEffect(player, player.item, this.getAllRacers());
    player.itemUses--;
    
    if (player.itemUses <= 0) {
      player.item = null;
    } else {
      // Update display for remaining uses
      this.addMessage(`🎯 Ainda tem ${player.itemUses} uso(s)!`);
    }
  }

  executeItemEffect(user, item, allRacers) {
    const others = allRacers.filter(r => r !== user && !r.finished);
    const sorted = this.getSortedRacers();
    
    this.addMessage(`${user.emoji} ${user.name} usou ${item.emoji} ${item.name}!`);
    
    switch(item.effect) {
      case 'boost':
        user.applyBoost(1.6, item.duration || 3);
        this.addMessage(`🚀 TURBO ATIVADO por ${item.duration} turnos!`);
        break;
        
      case 'triple_boost':
        user.applyBoost(1.6, item.duration || 3);
        this.addMessage(`🚀🚀🚀 TRIPLO TURBO!`);
        break;
        
      case 'target_ahead': {
        // Hits the racer directly ahead
        const ahead = this.getRacerAhead(user, sorted);
        if (ahead) {
          const hit = ahead.applyStun(item.damage || 3);
          if (hit) this.addMessage(`🔴 CASCO VERMELHO acertou ${ahead.emoji} ${ahead.name}!`);
        } else {
          this.addMessage(`🔴 Casco vermelho... sem alvo à frente!`);
        }
        break;
      }
        
      case 'straight_shot': {
        // Hits random opponent ahead
        const ahead2 = others.filter(r => r.position >= user.position);
        if (ahead2.length > 0) {
          const target = ahead2[Math.floor(Math.random() * ahead2.length)];
          const hit = target.applyStun(item.damage || 2);
          if (hit) this.addMessage(`🟢 CASCO VERDE acertou ${target.emoji} ${target.name}!`);
        } else {
          this.addMessage(`🟢 Casco verde passou direto!`);
          // Drop on track
          this.droppedItems.push({ type: 'GREEN_SHELL', position: user.position + 5 });
        }
        break;
      }
        
      case 'drop_behind':
        // Drops banana behind
        this.droppedItems.push({ type: 'BANANA', position: Math.max(0, user.position - 2) });
        this.addMessage(`🍌 Banana largada atrás!`);
        break;
        
      case 'invincible':
        user.invincible = item.duration || 5;
        user.applyBoost(1.5, item.duration || 5);
        this.addMessage(`⭐ ESTRELA! Invencível por ${item.duration} turnos!`);
        break;
        
      case 'hit_all':
        others.forEach(r => {
          const hit = r.applyStun(item.damage || 2);
          if (hit) this.addMessage(`⚡ RAIO atingiu ${r.emoji} ${r.name}!`);
        });
        break;
        
      case 'steal_item': {
        // Steal item from leader
        const leader = sorted[0];
        if (leader !== user && leader.item) {
          const stolen = leader.item;
          user.item = stolen;
          user.itemUses = stolen.uses || 1;
          leader.item = null;
          this.addMessage(`👻 BOO roubou ${stolen.emoji} ${stolen.name} de ${leader.name}!`);
          return; // Don't clear item yet
        } else {
          this.addMessage(`👻 Boo não encontrou item para roubar!`);
        }
        break;
      }
        
      case 'target_first': {
        // Blue shell - hits leader
        const leader2 = sorted[0];
        if (leader2 !== user) {
          const hit = leader2.applyStun(item.damage || 5);
          if (hit) {
            this.addMessage(`💙💥 CASCO AZUL EXPLODIU ${leader2.emoji} ${leader2.name} (1º lugar)!!!`);
          }
        }
        break;
      }
        
      case 'area_blast': {
        // Bob-omb - hits all nearby
        const nearby = others.filter(r => Math.abs(r.position - user.position) < 10);
        nearby.forEach(r => {
          const hit = r.applyStun(item.damage || 4);
          if (hit) this.addMessage(`💣💥 BOB-OMB explodiu perto de ${r.emoji} ${r.name}!`);
        });
        if (nearby.length === 0) this.addMessage(`💣💥 Explosão no vazio!`);
        break;
      }
    }
  }

  tickCPUs() {
    this.cpus.forEach(cpu => {
      if (cpu.finished) return;
      
      // Decrease status timers
      if (cpu.stunned > 0) cpu.stunned--;
      if (cpu.boosted > 0) {
        cpu.boosted--;
        if (cpu.boosted === 0) cpu.speed = cpu.maxSpeed * 0.8;
      }
      if (cpu.invincible > 0) cpu.invincible--;
      
      if (cpu.stunned > 0) {
        cpu.speed = Math.max(0, cpu.speed - 5);
        return;
      }
      
      cpu.makeDecision(this);
      
      // Random item box pickup
      if (Math.random() < 0.08) {
        cpu.giveItem(this.getRacePosition(cpu));
      }
      
      this.checkBoostPads(cpu);
    });
    
    // Player status ticks
    const p = this.player;
    if (p.stunned > 0) p.stunned--;
    if (p.boosted > 0) {
      p.boosted--;
      if (p.boosted === 0) {
        p.speed = Math.max(p.speed * 0.7, p.maxSpeed * 0.5);
        this.addMessage('💨 Boost acabou!');
      }
    }
    if (p.invincible > 0) p.invincible--;
    
    // Natural deceleration when not pressing W
    if (!p.finished && p.speed > 10) {
      p.speed = Math.max(p.speed - 1.5, 0);
    }
  }

  applyHazards() {
    const allRacers = this.getAllRacers();
    
    allRacers.forEach(racer => {
      if (racer.finished || racer.stunned > 0 || racer.invincible > 0) return;
      
      // Random hazard chance based on track
      if (Math.random() < 0.04) {
        const hazards = this.track.hazards;
        if (!hazards || hazards.length === 0) return;
        
        const hazard = hazards[Math.floor(Math.random() * hazards.length)];
        const messages = HAZARD_MESSAGES[hazard];
        if (!messages) return;
        
        const msg = messages[Math.floor(Math.random() * messages.length)];
        
        // Apply hazard effects
        switch(hazard) {
          case 'void':
          case 'lava':
            racer.applyStun(4);
            racer.position = Math.max(0, racer.position - 3);
            break;
          case 'thwomp':
            racer.applyStun(3);
            break;
          case 'banana_patch':
          case 'sand_trap':
          case 'wave':
          case 'crab':
          case 'fireball':
          case 'lightning_storm':
          case 'slow_zone':
            racer.applyStun(2);
            break;
        }
        
        if (racer.isPlayer) {
          this.addMessage(`⚠️ ${msg}`);
        } else {
          racer.addEvent(msg);
        }
      }
    });
  }

  checkFinishLine() {
    const allRacers = this.getAllRacers();
    const lapLength = 100; // Each lap = 100 position units
    
    allRacers.forEach(racer => {
      if (racer.finished) return;
      
      const totalNeeded = lapLength * this.totalLaps;
      
      if (racer.position >= totalNeeded) {
        racer.finished = true;
        racer.finishTime = (Date.now() - this.raceStartTime) / 1000;
        this.finishOrder.push(racer);
        
        const place = this.finishOrder.length;
        const placeStr = ['🥇', '🥈', '🥉', '4️⃣'][place - 1] || `${place}º`;
        
        if (racer.isPlayer) {
          this.addMessage(`🏁 VOCÊ CRUZOU A LINHA! ${placeStr} LUGAR!`);
        } else {
          this.addMessage(`🏁 ${racer.emoji} ${racer.name} terminou em ${place}º lugar!`);
        }
      } else {
        // Check lap crossing
        const currentLap = Math.floor(racer.position / lapLength) + 1;
        if (currentLap > racer.lap) {
          racer.lap = currentLap;
          if (racer.isPlayer) {
            this.addMessage(`🔄 VOLTA ${racer.lap}/${this.totalLaps}! Continue!`);
          }
        }
      }
    });
  }

  checkItemBoxes(racer) {
    // Simulate item box collection (25% chance per move)
    if (!racer.item && Math.random() < 0.12) {
      const pos = this.getRacePosition(racer);
      racer.giveItem(pos);
      if (racer.isPlayer && racer.item) {
        this.addMessage(`📦 Peguei: ${racer.item.emoji} ${racer.item.name}!`);
      }
    }
  }

  checkBoostPads(racer) {
    if (Math.random() < 0.05 * this.track.boostPads) {
      racer.applyBoost(1.3, 2);
      if (racer.isPlayer) {
        this.addMessage(`🔶 BOOST PAD! Turbo!`);
      }
    }
  }

  checkDroppedItems(racer) {
    const toRemove = [];
    this.droppedItems.forEach((item, i) => {
      if (Math.abs(racer.position - item.position) < 3) {
        if (racer.invincible > 0) return;
        racer.applyStun(2);
        toRemove.push(i);
        if (racer.isPlayer) {
          this.addMessage(`💥 Acertou um ${item.type === 'BANANA' ? '🍌' : '🟢'} no chão!`);
        }
      }
    });
    toRemove.reverse().forEach(i => this.droppedItems.splice(i, 1));
  }

  getSortedRacers() {
    return [...this.getAllRacers()].sort((a, b) => {
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      return b.position - a.position;
    });
  }

  getRacePosition(racer) {
    const sorted = this.getSortedRacers();
    return sorted.indexOf(racer) + 1;
  }

  getRacerAhead(racer, sorted) {
    const idx = sorted.indexOf(racer);
    if (idx > 0) return sorted[idx - 1];
    return null;
  }

  getProgressPercent(racer) {
    const total = 100 * this.totalLaps;
    return Math.min(100, (racer.position / total) * 100);
  }

  generateItemBoxes() {
    return Array.from({ length: 8 }, (_, i) => (i + 1) * 12);
  }

  generateHazards() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
  }

  generateBoostPads() {
    return Array.from({ length: this.track.boostPads }, () => Math.floor(Math.random() * 100));
  }

  addMessage(msg) {
    this.messages.push({ text: msg, time: Date.now() });
    if (this.messages.length > 5) this.messages.shift();
  }

  getRecentMessages() {
    const now = Date.now();
    return this.messages.filter(m => now - m.time < 3000).map(m => m.text);
  }

  getFinalResults() {
    const allRacers = this.getAllRacers();
    const sorted = this.getSortedRacers();
    
    return sorted.map((racer, idx) => ({
      place: idx + 1,
      racer,
      time: racer.finishTime ? racer.finishTime.toFixed(2) : 'DNF',
      finished: racer.finished
    }));
  }
}

module.exports = { RaceEngine };
