const { ITEMS, ITEM_PROBABILITIES } = require('./constants');

class Racer {
  constructor(character) {
    this.character = character;
    this.name = character.name;
    this.emoji = character.emoji;
    this.color = character.color;
    
    // Race state
    this.position = 0;       // Track position (0-100%)
    this.lap = 1;
    this.speed = 0;
    this.maxSpeed = character.stats.speed * 10 + 20; // 90-120
    this.acceleration = character.stats.acceleration;
    this.handling = character.stats.handling;
    this.weight = character.stats.weight;
    
    // Status
    this.item = null;
    this.stunned = 0;         // Ticks stunned
    this.boosted = 0;         // Ticks boosted
    this.invincible = 0;      // Ticks invincible
    this.finished = false;
    this.finishTime = null;
    this.racePosition = 0;    // Current standing
    this.coins = 0;
    
    // Drift mechanic
    this.driftCharge = 0;
    this.isDrifting = false;
    
    // Item uses left (for triple mushroom)
    this.itemUses = 1;
    
    // Event log
    this.events = [];
  }

  applyBoost(multiplier = 1.5, duration = 3) {
    this.boosted = duration;
    this.speed = Math.min(this.maxSpeed * multiplier, this.maxSpeed * 1.8);
    this.addEvent('💨 BOOST!');
  }

  applyStun(duration = 3) {
    if (this.invincible > 0) {
      this.addEvent('⭐ Invencível! Bloqueou o ataque!');
      return false;
    }
    this.stunned = duration;
    this.speed = Math.max(0, this.speed * 0.3);
    return true;
  }

  giveItem(racePos) {
    if (this.item) return; // Already has item
    
    const posKey = Math.min(racePos, 4);
    const pool = ITEM_PROBABILITIES[posKey] || ITEM_PROBABILITIES[4];
    const itemId = pool[Math.floor(Math.random() * pool.length)];
    const item = ITEMS[itemId];
    
    this.item = item;
    this.itemUses = item.uses || 1;
  }

  addEvent(msg) {
    this.events.push({ msg, tick: Date.now() });
    if (this.events.length > 3) this.events.shift();
  }

  getRecentEvent() {
    if (this.events.length === 0) return null;
    const last = this.events[this.events.length - 1];
    if (Date.now() - last.tick < 2000) return last.msg;
    return null;
  }
}

class Player extends Racer {
  constructor(character) {
    super(character);
    this.isPlayer = true;
  }
}

module.exports = { Player, Racer };
