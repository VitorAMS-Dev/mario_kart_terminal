const CHARACTERS = [
  {
    id: 'mario',
    name: 'Mario',
    emoji: '👨',
    color: '\x1b[31m',
    stats: { speed: 7, acceleration: 7, handling: 7, weight: 5 },
    description: 'Equilibrado em tudo. Perfeito para iniciantes!'
  },
  {
    id: 'luigi',
    name: 'Luigi',
    emoji: '👷',
    color: '\x1b[32m',
    stats: { speed: 7, acceleration: 6, handling: 8, weight: 5 },
    description: 'Leve e ágil. Excelente curvas!'
  },
  {
    id: 'bowser',
    name: 'Bowser',
    emoji: '🐢',
    color: '\x1b[33m',
    stats: { speed: 9, acceleration: 4, handling: 4, weight: 9 },
    description: 'Pesado e veloz. Difícil de controlar!'
  },
  {
    id: 'yoshi',
    name: 'Yoshi',
    emoji: '🦕',
    color: '\x1b[92m',
    stats: { speed: 6, acceleration: 9, handling: 7, weight: 4 },
    description: 'Acelera rápido. Ótimo para pistas técnicas!'
  },
  {
    id: 'peach',
    name: 'Peach',
    emoji: '👸',
    color: '\x1b[35m',
    stats: { speed: 6, acceleration: 8, handling: 9, weight: 3 },
    description: 'Levíssima com controle preciso!'
  },
  {
    id: 'donkeykong',
    name: 'Donkey Kong',
    emoji: '🦍',
    color: '\x1b[38;5;130m',
    stats: { speed: 8, acceleration: 5, handling: 5, weight: 8 },
    description: 'Força bruta! Ideal para retas longas.'
  }
];

const ITEMS = {
  MUSHROOM: {
    id: 'MUSHROOM',
    name: 'Cogumelo',
    emoji: '🍄',
    description: 'Boost de velocidade temporário!',
    rarity: 30,
    effect: 'boost',
    duration: 3
  },
  TRIPLE_MUSHROOM: {
    id: 'TRIPLE_MUSHROOM',
    name: '3x Cogumelos',
    emoji: '🍄🍄🍄',
    description: 'Três boosts de velocidade!',
    rarity: 10,
    effect: 'triple_boost',
    duration: 3,
    uses: 3
  },
  RED_SHELL: {
    id: 'RED_SHELL',
    name: 'Casco Vermelho',
    emoji: '🔴',
    description: 'Persegue o kart à frente!',
    rarity: 20,
    effect: 'target_ahead',
    damage: 3
  },
  GREEN_SHELL: {
    id: 'GREEN_SHELL',
    name: 'Casco Verde',
    emoji: '🟢',
    description: 'Projétil reto. Mira bem!',
    rarity: 20,
    effect: 'straight_shot',
    damage: 2
  },
  BANANA: {
    id: 'BANANA',
    name: 'Banana',
    emoji: '🍌',
    description: 'Deixa uma casca atrás!',
    rarity: 25,
    effect: 'drop_behind',
    damage: 2
  },
  STAR: {
    id: 'STAR',
    name: 'Estrela',
    emoji: '⭐',
    description: 'Invencível e turbo por alguns segundos!',
    rarity: 5,
    effect: 'invincible',
    duration: 5
  },
  LIGHTNING: {
    id: 'LIGHTNING',
    name: 'Raio',
    emoji: '⚡',
    description: 'Atinge TODOS os oponentes!',
    rarity: 3,
    effect: 'hit_all',
    damage: 2
  },
  BOO: {
    id: 'BOO',
    name: 'Boo',
    emoji: '👻',
    description: 'Rouba o item do líder!',
    rarity: 7,
    effect: 'steal_item'
  },
  BLUE_SHELL: {
    id: 'BLUE_SHELL',
    name: 'Casco Azul',
    emoji: '💙',
    description: 'Explode no 1º lugar! Imparável!',
    rarity: 5,
    effect: 'target_first',
    damage: 5
  },
  BOMB: {
    id: 'BOMB',
    name: 'Bob-omb',
    emoji: '💣',
    description: 'Explode ao redor atingindo todos próximos!',
    rarity: 10,
    effect: 'area_blast',
    damage: 4
  }
};

const TRACKS = [
  {
    id: 'mushroom_cup',
    name: 'Circuito Cogumelo',
    emoji: '🍄',
    difficulty: '⭐',
    length: 20,
    laps: 3,
    description: 'A pista clássica! Reta longa com curvas suaves.',
    hazards: ['banana_patch', 'slow_zone'],
    boostPads: 3,
    layout: [
      '════════════════╗',
      '                ║',
      '╔═══════════════╝',
      '║                ',
      '╚═══════════════╗',
      '                ║',
      '════════════════╝'
    ],
    color: '\x1b[32m'
  },
  {
    id: 'koopa_beach',
    name: 'Praia do Koopa',
    emoji: '🏖️',
    difficulty: '⭐⭐',
    length: 22,
    laps: 3,
    description: 'Pista na praia com areia e ondas atrapalhando!',
    hazards: ['sand_trap', 'wave', 'crab'],
    boostPads: 2,
    layout: [
      '~~~~~~~~~~~~~~~~~~~',
      '═══════════════════',
      '~~~~~~~~~~~~~~~~~~~'
    ],
    color: '\x1b[33m'
  },
  {
    id: 'rainbow_road',
    name: 'Rainbow Road',
    emoji: '🌈',
    difficulty: '⭐⭐⭐',
    length: 30,
    laps: 3,
    description: 'A lendária pista no espaço! Sem guardrails!',
    hazards: ['void', 'lightning_storm', 'thwomp'],
    boostPads: 5,
    layout: [
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
      '                      ',
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'
    ],
    color: '\x1b[35m'
  },
  {
    id: 'bowser_castle',
    name: 'Castelo do Bowser',
    emoji: '🏰',
    difficulty: '⭐⭐⭐',
    length: 25,
    laps: 3,
    description: 'Armadilhas e lava por toda parte!',
    hazards: ['lava', 'thwomp', 'fireball'],
    boostPads: 1,
    layout: [
      '█████████████████████',
      '█                   █',
      '█████████████████████'
    ],
    color: '\x1b[31m'
  }
];

const ITEM_PROBABILITIES = {
  // Position 1 (leader) gets worse items
  1: ['BANANA', 'GREEN_SHELL'],
  // Position 2-3 gets medium items
  2: ['MUSHROOM', 'GREEN_SHELL', 'RED_SHELL', 'BANANA', 'BOMB'],
  3: ['MUSHROOM', 'GREEN_SHELL', 'RED_SHELL', 'BANANA', 'BOMB'],
  // Last positions get better items
  4: ['TRIPLE_MUSHROOM', 'RED_SHELL', 'BLUE_SHELL', 'STAR', 'LIGHTNING', 'BOO', 'BOMB']
};

const HAZARD_MESSAGES = {
  banana_patch: ['🍌 Escorregou em uma banana!', '🍌 Casca de banana no caminho!'],
  slow_zone: ['🐌 Zona lenta! Diminuiu!', '⚠️ Zona de buracos!'],
  sand_trap: ['🏖️ Preso na areia!', '🏜️ A areia te desacelerou!'],
  wave: ['🌊 Uma onda te atingiu!', '🌊 Onda gigante!'],
  crab: ['🦀 Caranguejo no caminho!', '🦀 Caranguejo te agarrou!'],
  void: ['🕳️ Caiu no vazio! Lakitu te resgatou!', '⭐ Lakitu ao resgate!'],
  lava: ['🌋 Lava! Lakitu ao resgate!', '🔥 Caiu na lava!'],
  thwomp: ['💥 Thwomp te esmagou!', '😱 Thwomp caiu!'],
  fireball: ['🔥 Bola de fogo!', '🔥 Fireball do Bowser!'],
  lightning_storm: ['⛈️ Tempestade de raios!', '⚡ Raio na Rainbow Road!']
};

module.exports = { CHARACTERS, ITEMS, TRACKS, ITEM_PROBABILITIES, HAZARD_MESSAGES };
