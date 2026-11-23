const readline = require('readline');
const { CHARACTERS, ITEMS, TRACKS, ITEM_PROBABILITIES } = require('./constants');
const { RaceEngine } = require('./raceEngine');
const { Display } = require('./display');
const { Player } = require('./player');
const { CPU } = require('./cpu');

class MarioKartGame {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.display = new Display();
    this.state = 'MENU'; // MENU, CHARACTER_SELECT, TRACK_SELECT, RACE, RESULTS
    this.player = null;
    this.cpus = [];
    this.raceEngine = null;
    this.selectedTrack = null;
    this.totalLaps = 3;
    this.raceResults = [];
  }

  async start() {
    this.display.clearScreen();
    this.display.showTitle();
    await this.sleep(1500);
    await this.mainMenu();
  }

  async mainMenu() {
    this.state = 'MENU';
    this.display.clearScreen();
    this.display.showMainMenu();
    
    const choice = await this.getInput('');
    
    switch(choice.trim()) {
      case '1': await this.characterSelect(); break;
      case '2': this.display.showHowToPlay(); await this.getInput('\nPressione ENTER para voltar...'); await this.mainMenu(); break;
      case '3': this.display.showCredits(); await this.getInput('\nPressione ENTER para voltar...'); await this.mainMenu(); break;
      case '4': this.exitGame(); break;
      default: await this.mainMenu();
    }
  }

  async characterSelect() {
    this.state = 'CHARACTER_SELECT';
    this.display.clearScreen();
    this.display.showCharacterSelect(CHARACTERS);
    
    const choice = await this.getInput('\n🎮 Escolha seu personagem (1-' + CHARACTERS.length + '): ');
    const idx = parseInt(choice) - 1;
    
    if (idx >= 0 && idx < CHARACTERS.length) {
      const selectedChar = CHARACTERS[idx];
      this.display.showCharacterConfirm(selectedChar);
      await this.sleep(800);
      
      // Create player
      this.player = new Player(selectedChar);
      
      // Create CPU opponents
      this.cpus = [];
      const availableChars = CHARACTERS.filter((_, i) => i !== idx);
      const shuffled = availableChars.sort(() => Math.random() - 0.5);
      for (let i = 0; i < 3; i++) {
        this.cpus.push(new CPU(shuffled[i]));
      }
      
      await this.trackSelect();
    } else {
      await this.characterSelect();
    }
  }

  async trackSelect() {
    this.state = 'TRACK_SELECT';
    this.display.clearScreen();
    this.display.showTrackSelect(TRACKS);
    
    const choice = await this.getInput('\n🏁 Escolha a pista (1-' + TRACKS.length + '): ');
    const idx = parseInt(choice) - 1;
    
    if (idx >= 0 && idx < TRACKS.length) {
      this.selectedTrack = TRACKS[idx];
      this.display.showTrackConfirm(this.selectedTrack);
      await this.sleep(800);
      await this.startRace();
    } else {
      await this.trackSelect();
    }
  }

  async startRace() {
    this.state = 'RACE';
    this.display.clearScreen();
    
    // Countdown
    await this.display.showCountdown();
    
    // Init race engine
    this.raceEngine = new RaceEngine(
      this.player,
      this.cpus,
      this.selectedTrack,
      this.totalLaps
    );
    
    await this.runRaceLoop();
  }

  async runRaceLoop() {
    this.display.clearScreen();
    
    while (!this.raceEngine.isRaceOver()) {
      this.display.clearScreen();
      this.display.showRaceHUD(this.raceEngine);
      this.display.showTrackView(this.raceEngine);
      this.display.showControls(this.player);
      
      // Check if player finished
      if (this.player.finished) {
        await this.sleep(500);
        this.raceEngine.tickCPUs();
        this.raceEngine.tick++;
        continue;
      }
      
      // Get player input with timeout
      const input = await this.getInputWithTimeout(1200);
      
      if (input !== null) {
        await this.processPlayerInput(input.trim().toLowerCase());
      }
      
      // Advance race simulation
      this.raceEngine.tickCPUs();
      this.raceEngine.applyHazards();
      this.raceEngine.checkFinishLine();
      this.raceEngine.tick++;
      
      await this.sleep(100);
    }
    
    await this.showResults();
  }

  async processPlayerInput(input) {
    const engine = this.raceEngine;
    const player = this.player;
    
    switch(input) {
      case 'w':
      case 'a':
      case 'd':
        engine.movePlayer(input);
        break;
      case ' ':
      case 'f':
        engine.usePlayerItem();
        break;
      case 'r':
        engine.playerDrift();
        break;
      case 'q':
        const confirm = await this.getInput('Sair da corrida? (s/n): ');
        if (confirm.toLowerCase() === 's') {
          await this.mainMenu();
        }
        break;
    }
  }

  async showResults() {
    this.state = 'RESULTS';
    const results = this.raceEngine.getFinalResults();
    
    this.display.clearScreen();
    await this.display.showRaceResults(results, this.player);
    
    const choice = await this.getInput('\n1) Jogar Novamente  2) Menu Principal  3) Sair\nEscolha: ');
    
    switch(choice.trim()) {
      case '1': 
        this.player = new Player(this.player.character);
        this.cpus = this.cpus.map(cpu => new CPU(cpu.character));
        await this.startRace(); 
        break;
      case '2': await this.mainMenu(); break;
      case '3': this.exitGame(); break;
      default: await this.showResults();
    }
  }

  getInput(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, resolve);
    });
  }

  getInputWithTimeout(timeout) {
    return new Promise(resolve => {
      let resolved = false;
      
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.rl.removeListener('line', lineHandler);
          resolve(null);
        }
      }, timeout);
      
      const lineHandler = (line) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(line);
        }
      };
      
      this.rl.once('line', lineHandler);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  exitGame() {
    this.display.clearScreen();
    this.display.showGoodbye();
    this.rl.close();
    process.exit(0);
  }
}

module.exports = { MarioKartGame };
