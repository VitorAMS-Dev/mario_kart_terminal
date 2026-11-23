#!/usr/bin/env node

const { MarioKartGame } = require('./src/game');

// Handle terminal resize and signals
process.on('SIGINT', () => {
  process.stdout.write('\x1b[0m\n\n  👋 Até logo! Obrigado por jogar!\n\n');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  process.stdout.write(`\x1b[0m\n\nErro: ${err.message}\n`);
  process.exit(1);
});

// Set terminal to raw mode for better input handling
if (process.stdin.setRawMode) {
  // We'll manage this manually
}

const game = new MarioKartGame();
game.start().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
