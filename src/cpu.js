const { Racer } = require('./player');

class CPU extends Racer {
  constructor(character) {
    super(character);
    this.isPlayer = false;
    this.difficulty = Math.random() * 0.3 + 0.7; // 0.7-1.0
    this.aggressiveness = Math.random(); // 0-1
    this.aiCooldown = 0;
  }

  // CPU AI decision making
  makeDecision(engine) {
    if (this.stunned > 0 || this.finished) return;
    
    this.aiCooldown--;
    
    // Natural speed adjustment based on stats
    const targetSpeed = this.maxSpeed * this.difficulty;
    const accelRate = (this.acceleration / 10) * 3;
    
    if (this.boosted > 0) {
      this.position += this.speed * 0.015;
    } else {
      // Gradually approach target speed
      if (this.speed < targetSpeed) {
        this.speed = Math.min(this.speed + accelRate, targetSpeed);
      } else {
        this.speed = Math.max(this.speed - 1, targetSpeed * 0.8);
      }
      this.position += this.speed * 0.012;
    }
    
    // Use item decision
    if (this.item && this.aiCooldown <= 0) {
      const shouldUse = this.decideItemUse(engine);
      if (shouldUse) {
        this.useItem(engine);
        this.aiCooldown = 5 + Math.floor(Math.random() * 10);
      }
    }
    
    // Drift boost randomly
    if (Math.random() < 0.05 * (this.handling / 10)) {
      this.applyBoost(1.2, 2);
    }
  }

  decideItemUse(engine) {
    if (!this.item) return false;
    const effect = this.item.effect;
    
    // Offensive items: use when close to target
    if (['target_ahead', 'straight_shot', 'target_first', 'hit_all', 'area_blast'].includes(effect)) {
      return Math.random() < 0.4 * this.aggressiveness;
    }
    
    // Defensive items: use when someone is close behind
    if (['drop_behind'].includes(effect)) {
      return Math.random() < 0.3;
    }
    
    // Boost items: use almost immediately
    if (['boost', 'triple_boost', 'invincible'].includes(effect)) {
      return Math.random() < 0.7;
    }
    
    return Math.random() < 0.2;
  }

  useItem(engine) {
    engine.executeItemEffect(this, this.item, engine.getAllRacers());
    this.itemUses--;
    if (this.itemUses <= 0) this.item = null;
  }
}

module.exports = { CPU };
