const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const BLINK = '\x1b[5m';
const REVERSE = '\x1b[7m';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';
const BRIGHT_RED = '\x1b[91m';
const BRIGHT_GREEN = '\x1b[92m';
const BRIGHT_YELLOW = '\x1b[93m';
const BRIGHT_BLUE = '\x1b[94m';
const BRIGHT_MAGENTA = '\x1b[95m';
const BRIGHT_CYAN = '\x1b[96m';
const BRIGHT_WHITE = '\x1b[97m';

const BG_RED = '\x1b[41m';
const BG_GREEN = '\x1b[42m';
const BG_YELLOW = '\x1b[43m';
const BG_BLUE = '\x1b[44m';
const BG_MAGENTA = '\x1b[45m';
const BG_CYAN = '\x1b[46m';
const BG_BLACK = '\x1b[40m';

class Display {
  clearScreen() {
    process.stdout.write('\x1b[2J\x1b[H');
  }

  showTitle() {
    const lines = [
      '',
      `${BRIGHT_YELLOW}${BOLD}`,
      '  ███╗   ███╗ █████╗ ██████╗ ██╗ ██████╗     ██╗  ██╗ █████╗ ██████╗ ████████╗',
      '  ████╗ ████║██╔══██╗██╔══██╗██║██╔═══██╗    ██║ ██╔╝██╔══██╗██╔══██╗╚══██╔══╝',
      '  ██╔████╔██║███████║██████╔╝██║██║   ██║    █████╔╝ ███████║██████╔╝   ██║   ',
      '  ██║╚██╔╝██║██╔══██║██╔══██╗██║██║   ██║    ██╔═██╗ ██╔══██║██╔══██╗   ██║   ',
      '  ██║ ╚═╝ ██║██║  ██║██║  ██║██║╚██████╔╝    ██║  ██╗██║  ██║██║  ██║   ██║   ',
      '  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ',
      `${RESET}`,
      `${BRIGHT_RED}${BOLD}                    ══════════════════════════════════`,
      `                     🏎️  TERMINAL GRAND PRIX  🏎️`,
      `                    ══════════════════════════════════${RESET}`,
      '',
      `${CYAN}                      Desenvolvido em Node.js${RESET}`,
      '',
    ];
    lines.forEach(l => console.log(l));
  }

  showMainMenu() {
    this.showTitle();
    console.log(`${BRIGHT_WHITE}${BOLD}╔══════════════════════════════════════╗`);
    console.log(`║           MENU PRINCIPAL             ║`);
    console.log(`╠══════════════════════════════════════╣`);
    console.log(`║  ${BRIGHT_GREEN}1${BRIGHT_WHITE}) 🏁 Iniciar Corrida               ║`);
    console.log(`║  ${BRIGHT_YELLOW}2${BRIGHT_WHITE}) 📖 Como Jogar                    ║`);
    console.log(`║  ${BRIGHT_CYAN}3${BRIGHT_WHITE}) 🏆 Créditos                      ║`);
    console.log(`║  ${BRIGHT_RED}4${BRIGHT_WHITE}) 🚪 Sair                          ║`);
    console.log(`╚══════════════════════════════════════╝${RESET}`);
    process.stdout.write(`\n${BRIGHT_WHITE}Escolha uma opção: ${RESET}`);
  }

  showCharacterSelect(characters) {
    console.log(`${BRIGHT_YELLOW}${BOLD}`);
    console.log('  ╔══════════════════════════════════════════════════════╗');
    console.log('  ║             ESCOLHA SEU PERSONAGEM                  ║');
    console.log('  ╚══════════════════════════════════════════════════════╝');
    console.log(RESET);
    
    characters.forEach((char, i) => {
      const num = `${BRIGHT_CYAN}${i + 1}${RESET}`;
      const name = `${char.color}${BOLD}${char.emoji} ${char.name.padEnd(14)}${RESET}`;
      const stats = this.renderMiniStats(char.stats);
      console.log(`  ${num}) ${name} ${stats}`);
      console.log(`      ${DIM}${char.description}${RESET}`);
      console.log();
    });
  }

  renderMiniStats(stats) {
    const spd = this.miniBar(stats.speed, 10, '🔵');
    const acc = this.miniBar(stats.acceleration, 10, '🟡');
    const hdl = this.miniBar(stats.handling, 10, '🟢');
    return `Vel:${spd} Acc:${acc} Ctrl:${hdl}`;
  }

  miniBar(val, max, char) {
    const filled = Math.round((val / max) * 5);
    return char.repeat(filled) + '⬜'.repeat(5 - filled);
  }

  showCharacterConfirm(char) {
    console.log(`\n${char.color}${BOLD}✅ ${char.emoji} ${char.name} selecionado! Vamos nessa!${RESET}\n`);
  }

  showTrackSelect(tracks) {
    console.log(`${BRIGHT_MAGENTA}${BOLD}`);
    console.log('  ╔══════════════════════════════════════════════════════╗');
    console.log('  ║                ESCOLHA A PISTA                      ║');
    console.log('  ╚══════════════════════════════════════════════════════╝');
    console.log(RESET);
    
    tracks.forEach((track, i) => {
      const num = `${BRIGHT_CYAN}${i + 1}${RESET}`;
      const name = `${track.color}${BOLD}${track.emoji} ${track.name}${RESET}`;
      console.log(`  ${num}) ${name}  ${track.difficulty}`);
      console.log(`      ${DIM}${track.description}${RESET}`);
      console.log(`      Perigos: ${track.hazards.map(h => this.hazardEmoji(h)).join(' ')}  Boost Pads: ${'🔶'.repeat(track.boostPads)}`);
      console.log();
    });
  }

  hazardEmoji(hazard) {
    const map = {
      banana_patch: '🍌', slow_zone: '🐌', sand_trap: '🏖️', wave: '🌊',
      crab: '🦀', void: '🕳️', lightning_storm: '⚡', thwomp: '💥',
      lava: '🌋', fireball: '🔥'
    };
    return map[hazard] || '⚠️';
  }

  showTrackConfirm(track) {
    console.log(`\n${track.color}${BOLD}✅ Pista ${track.emoji} ${track.name} selecionada!${RESET}\n`);
  }

  async showCountdown() {
    const steps = ['3', '2', '1', 'GO!'];
    const colors = [BRIGHT_RED, BRIGHT_YELLOW, BRIGHT_GREEN, `${BRIGHT_WHITE}${BLINK}`];
    
    for (let i = 0; i < steps.length; i++) {
      this.clearScreen();
      console.log('\n\n\n\n\n');
      const txt = steps[i];
      const pad = ' '.repeat(Math.floor((50 - txt.length) / 2));
      console.log(`${colors[i]}${BOLD}${pad}${txt}${RESET}`);
      console.log('\n\n');
      await this.sleep(800);
    }
    await this.sleep(300);
  }

  showRaceHUD(engine) {
    const player = engine.player;
    const sorted = engine.getSortedRacers();
    const playerPos = engine.getRacePosition(player);
    const progress = engine.getProgressPercent(player);
    const track = engine.track;
    
    // Header
    console.log(`${track.color}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}`);
    console.log(`${track.color}${BOLD}║  ${track.emoji} ${track.name.padEnd(30)} Volta: ${player.lap}/${engine.totalLaps}        ║${RESET}`);
    console.log(`${track.color}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}`);
    
    // Player stats row
    const posEmoji = ['🥇', '🥈', '🥉', '4️⃣'][playerPos - 1] || `${playerPos}º`;
    const speedStr = `${Math.round(player.speed)}km/h`.padEnd(8);
    const statusStr = this.getStatusString(player);
    const itemStr = player.item ? `${player.item.emoji} ${player.item.name}` : '📦 Sem item';
    
    console.log(`\n${player.color}${BOLD}  ${player.emoji} VOCÊ  ${RESET}${posEmoji} ${BRIGHT_WHITE}${speedStr}${RESET} ${statusStr}`);
    console.log(`  Item: ${BRIGHT_YELLOW}${itemStr}${RESET}   Moedas: ${'🪙'.repeat(Math.min(player.coins, 10))}`);
    
    // Progress bar
    const barLen = 50;
    const filled = Math.round((progress / 100) * barLen);
    const progressBar = `${BRIGHT_GREEN}${'█'.repeat(filled)}${RESET}${DIM}${'░'.repeat(barLen - filled)}${RESET}`;
    console.log(`  Progresso: [${progressBar}] ${Math.round(progress)}%`);
    
    // Standings
    console.log(`\n${BRIGHT_WHITE}${BOLD}  ┌─ CLASSIFICAÇÃO ────────────────────┐${RESET}`);
    sorted.forEach((racer, idx) => {
      const place = ['🥇', '🥈', '🥉', '4️⃣'][idx] || `${idx + 1}`;
      const isPlayer = racer.isPlayer;
      const highlight = isPlayer ? BRIGHT_CYAN + BOLD : DIM;
      const prog = engine.getProgressPercent(racer);
      const racerSpd = Math.round(racer.speed);
      const status = this.getStatusString(racer);
      const finStr = racer.finished ? `✅ ${racer.finishTime?.toFixed(1)}s` : `${prog.toFixed(0)}% ${status}`;
      console.log(`  │ ${place} ${highlight}${racer.emoji} ${racer.name.padEnd(12)}${RESET} ${finStr.substring(0, 20)}`);
    });
    console.log(`${BRIGHT_WHITE}${BOLD}  └────────────────────────────────────┘${RESET}`);
  }

  getStatusString(racer) {
    if (racer.stunned > 0) return `${BRIGHT_RED}💫 ATORDOADO(${racer.stunned})${RESET}`;
    if (racer.invincible > 0) return `${BRIGHT_YELLOW}⭐ INVENCÍVEL(${racer.invincible})${RESET}`;
    if (racer.boosted > 0) return `${BRIGHT_GREEN}🚀 TURBO(${racer.boosted})${RESET}`;
    return '';
  }

  showTrackView(engine) {
    const track = engine.track;
    const sorted = engine.getSortedRacers();
    const WIDTH = 62;
    
    console.log(`\n${track.color}${BOLD}  ┌${'─'.repeat(WIDTH)}┐${RESET}`);
    
    // Track line - show racer positions
    const trackLine = Array(WIDTH).fill('·');
    
    // Place boost pads
    const boostPositions = [10, 25, 40, 55];
    boostPositions.forEach(p => {
      if (p < WIDTH) trackLine[p] = '🟧';
    });
    
    // Place item boxes
    const itemPositions = [8, 20, 35, 50];
    itemPositions.forEach(p => {
      if (p < WIDTH) trackLine[p] = '📦';
    });
    
    // Place racers
    sorted.forEach((racer, idx) => {
      const progress = engine.getProgressPercent(racer);
      const x = Math.min(Math.floor((progress / 100) * (WIDTH - 2)), WIDTH - 2);
      trackLine[x] = racer.emoji;
    });
    
    console.log(`${track.color}${BOLD}  │${RESET}${trackLine.join('')}${track.color}${BOLD}│${RESET}`);
    
    // Show finish line
    const finishX = WIDTH - 1;
    console.log(`${track.color}${BOLD}  │${' '.repeat(finishX - 1)}🏁│${RESET}`);
    console.log(`${track.color}${BOLD}  └${'─'.repeat(WIDTH)}┘${RESET}`);
    
    // Dropped items on track
    if (engine.droppedItems.length > 0) {
      const items = engine.droppedItems.map(i => i.type === 'BANANA' ? '🍌' : '🟢').join(' ');
      console.log(`  ${DIM}Items no chão: ${items}${RESET}`);
    }
    
    // Event messages
    const msgs = engine.getRecentMessages();
    if (msgs.length > 0) {
      console.log(`\n${BRIGHT_YELLOW}${BOLD}  ┌─ EVENTOS ──────────────────────────────┐${RESET}`);
      msgs.slice(-3).forEach(msg => {
        console.log(`  │ ${msg.substring(0, 44).padEnd(44)} │`);
      });
      console.log(`${BRIGHT_YELLOW}${BOLD}  └────────────────────────────────────────┘${RESET}`);
    }
  }

  showControls(player) {
    const stunned = player.stunned > 0;
    const itemStr = player.item ? `[F] Usar ${player.item.emoji}` : '[F] Sem item';
    
    console.log(`\n${DIM}${BOLD}  ┌─ CONTROLES ─────────────────────────────────┐${RESET}`);
    console.log(`${DIM}  │  [W] Acelerar   [A] Esq.  [D] Dir.          │${RESET}`);
    console.log(`${DIM}  │  [R] Drift      ${BRIGHT_YELLOW}${BOLD}${itemStr.padEnd(25)}${RESET}${DIM}  │${RESET}`);
    console.log(`${DIM}  │  [Q] Sair da corrida                        │${RESET}`);
    console.log(`${DIM}  └─────────────────────────────────────────────┘${RESET}`);
    
    if (stunned) {
      console.log(`\n${BRIGHT_RED}${BOLD}  💫 ATORDOADO! Aguardando... ${player.stunned} turnos${RESET}`);
    } else {
      process.stdout.write(`\n${BRIGHT_WHITE}> Ação (W/A/D/R/F): ${RESET}`);
    }
  }

  async showRaceResults(results, player) {
    this.clearScreen();
    
    const playerResult = results.find(r => r.racer.isPlayer);
    const place = playerResult?.place || 4;
    const placeEmoji = ['🥇', '🥈', '🥉', '💔'][place - 1] || '🏎️';
    const msgs = ['VITÓRIA!!!', '2º Lugar!', '3º Lugar!', 'Última...'][place - 1] || 'Terminou!';
    
    // Dramatic pause
    await this.sleep(500);
    
    console.log(`\n${BRIGHT_YELLOW}${BOLD}`);
    console.log('  ╔══════════════════════════════════════════════════╗');
    console.log('  ║               FIM DE CORRIDA! 🏁                ║');
    console.log('  ╚══════════════════════════════════════════════════╝');
    console.log(RESET);
    
    // Player result
    console.log(`${player.color}${BOLD}  ${placeEmoji} VOCÊ: ${msgs}${RESET}\n`);
    
    // Full standings
    console.log(`${BRIGHT_WHITE}${BOLD}  ╔══════════════════════════════════════════════════╗`);
    console.log('  ║               RESULTADO FINAL                   ║');
    console.log('  ╠══════════════════════════════════════════════════╣');
    
    results.forEach(({ place, racer, time, finished }) => {
      const placeStr = ['🥇', '🥈', '🥉', '4️⃣'][place - 1] || `${place}º`;
      const highlight = racer.isPlayer ? `${BRIGHT_CYAN}${BOLD}` : WHITE;
      const timeStr = finished ? `${time}s` : 'DNF';
      const stars = place === 1 ? ' ⭐⭐⭐' : place === 2 ? ' ⭐⭐' : place === 3 ? ' ⭐' : '';
      console.log(`  ║  ${placeStr} ${highlight}${racer.emoji} ${racer.name.padEnd(15)}${RESET}${WHITE}${timeStr.padEnd(10)}${stars}${RESET}`);
    });
    
    console.log('  ╚══════════════════════════════════════════════════╝');
    
    // Award message
    const awards = {
      1: `\n${BRIGHT_YELLOW}${BOLD}  🏆 CAMPEÃO! Excelente corrida! Você dominou!${RESET}`,
      2: `\n${BRIGHT_WHITE}${BOLD}  🥈 Quase lá! Na próxima é a vitória!${RESET}`,
      3: `\n${GREEN}${BOLD}  🥉 Bom trabalho! Continue praticando!${RESET}`,
      4: `\n${DIM}  💪 Não desista! A próxima corrida é sua!${RESET}`
    };
    console.log(awards[place] || '');
    
    // Stats
    console.log(`\n${DIM}  Velocidade máx: ${Math.round(player.maxSpeed)}km/h | Personagem: ${player.character.name}${RESET}`);
  }

  showHowToPlay() {
    this.clearScreen();
    console.log(`${BRIGHT_YELLOW}${BOLD}`);
    console.log('  ╔══════════════════════════════════════════════════╗');
    console.log('  ║                 COMO JOGAR                      ║');
    console.log('  ╚══════════════════════════════════════════════════╝');
    console.log(RESET);
    
    const sections = [
      ['🎮 CONTROLES', [
        '[W] → Acelerar (pressione frequentemente!)',
        '[A] → Virar à esquerda / desviar',
        '[D] → Virar à direita / desviar',
        '[R] → Drift (acumule 3x para turbo!)',
        '[F ou Espaço] → Usar item coletado',
        '[Q] → Sair da corrida'
      ]],
      ['📦 ITENS', [
        '🍄 Cogumelo → Turbo de velocidade',
        '🔴 Casco Vermelho → Ataca o kart à frente',
        '🟢 Casco Verde → Projétil em linha reta',
        '💙 Casco Azul → Explode no 1º lugar!',
        '⭐ Estrela → Invencível + Turbo',
        '⚡ Raio → Atinge TODOS os oponentes',
        '👻 Boo → Rouba item do líder',
        '💣 Bob-omb → Explosão em área',
        '🍌 Banana → Deixa armadilha no chão'
      ]],
      ['💡 DICAS', [
        'Quanto pior sua posição, melhor o item recebido!',
        'Drift consecutivos carregam boost extra',
        '🔶 Boost Pads dão turbo automático',
        'Use itens defensivos quando em 1º lugar',
        'Cada personagem tem estatísticas únicas'
      ]]
    ];
    
    sections.forEach(([title, items]) => {
      console.log(`${BRIGHT_CYAN}${BOLD}  ${title}:${RESET}`);
      items.forEach(item => console.log(`  ${DIM}• ${item}${RESET}`));
      console.log();
    });
  }

  showCredits() {
    this.clearScreen();
    console.log(`${BRIGHT_MAGENTA}${BOLD}`);
    console.log('  ╔══════════════════════════════════════════════════╗');
    console.log('  ║                  CRÉDITOS                       ║');
    console.log('  ╚══════════════════════════════════════════════════╝');
    console.log(RESET);
    console.log(`${BRIGHT_WHITE}  Mario Kart Terminal Simulator`);
    console.log(`${DIM}  Desenvolvido com Node.js puro`);
    console.log(`  Inspirado no clássico Mario Kart da Nintendo${RESET}`);
    console.log();
    console.log(`${BRIGHT_YELLOW}  🏎️  Personagens: Mario, Luigi, Bowser, Yoshi, Peach, DK`);
    console.log(`  🏁 Pistas: Cogumelo, Koopa, Rainbow Road, Castelo`);
    console.log(`  🎮 Itens: 10 itens únicos com efeitos especiais${RESET}`);
    console.log();
    console.log(`${DIM}  "It's-a me, Mario!" — Nintendo, 1992${RESET}`);
  }

  showGoodbye() {
    console.log(`\n${BRIGHT_YELLOW}${BOLD}  🏎️  Obrigado por jogar Mario Kart Terminal!${RESET}`);
    console.log(`${DIM}  Thank you for playing! See you next race! 🏁${RESET}\n`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { Display };
