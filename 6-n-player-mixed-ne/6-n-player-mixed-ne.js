// Mixed Nash Equilibria Finder for 2-Player Normal-Form Games

const { createReadlineInterface, prompt, createMatrix, getRandomInt } = require('../utility');

const readline = createReadlineInterface();
const MAX_PLAYERS = 2; // Fixed to 2 players for this implementation

// Function to create payoff matrices for both players
const createPayoffMatrices = (strategies) => {
  return Array(MAX_PLAYERS).fill().map(() => createMatrix(strategies[0], strategies[1]));
};

// Function to get manual payoffs
const getManualPayoffs = async (strategies) => {
  const payoffMatrices = createPayoffMatrices(strategies);

  for (let player = 0; player < MAX_PLAYERS; player++) {
    console.log(`\nEnter payoffs for Player ${player + 1}:`);
    for (let i = 0; i < strategies[0]; i++) {
      for (let j = 0; j < strategies[1]; j++) {
        payoffMatrices[player][i][j] = parseInt(
          await prompt(`Enter payoff for strategy profile (${i + 1}, ${j + 1}): `, readline)
        );
      }
    }
  }

  return payoffMatrices;
};

// Function to generate random payoffs
const generateRandomPayoffs = (strategies) => {
  const payoffMatrices = createPayoffMatrices(strategies);

  for (let player = 0; player < MAX_PLAYERS; player++) {
    for (let i = 0; i < strategies[0]; i++) {
      for (let j = 0; j < strategies[1]; j++) {
        payoffMatrices[player][i][j] = getRandomInt(0, 10);
      }
    }
  }

  return payoffMatrices;
};

// Function to solve 2x2 system of linear equations for mixed strategy probabilities
const solveMixedStrategy = (payoffMatrix) => {
  // For a 2x2 game, we solve the equation where expected payoffs are equal
  // p * a11 + (1-p) * a21 = p * a12 + (1-p) * a22
  const a11 = payoffMatrix[0][0];
  const a12 = payoffMatrix[0][1];
  const a21 = payoffMatrix[1][0];
  const a22 = payoffMatrix[1][1];

  // Solve for p: p * (a11 - a12 - a21 + a22) = a21 - a22
  const denominator = a11 - a12 - a21 + a22;
  if (Math.abs(denominator) < 1e-1) return null; // No solution or infinitely many solutions

  const p = (a21 - a22) / denominator;
  if (p < 0 || p > 1) return null; // Solution exists but not in [0,1]

  return p;
};

// Function to find completely mixed Nash Equilibria
const findCompletelyMixedNE = (payoffMatrices) => {
  // For 2x2 games, find probabilities where players are indifferent
  const p1 = solveMixedStrategy(payoffMatrices[0]); // Probability for Player 1's first strategy
  const p2 = solveMixedStrategy(payoffMatrices[1].map(col => [col[0], col[1]])); // Probability for Player 2's first strategy

  if (p1 === null || p2 === null) return [];
  if (p1 === 0 || p1 === 1 || p2 === 0 || p2 === 1) return []; // Not completely mixed

  return [[p1, 1 - p1], [p2, 1 - p2]];
};

// Function to display payoff matrix
const displayPayoffMatrix = (matrix, player) => {
  console.log(`\nPayoff Matrix for Player ${player + 1}:`);
  console.log('[');
  matrix.forEach(row => {
    console.log(`  [${row.join(', ')}]`);
  });
  console.log(']\n');
};

// Main function
const main = async () => {
  console.log('Mixed Nash Equilibria Finder for 2-Player Normal-Form Games\n');

  // Currently supporting only 2x2 games
  const strategies = [2, 2];
  console.log('This implementation finds completely mixed Nash Equilibria for 2x2 games.');

  // Ask for payoff input method
  const isRandom = (await prompt('Do you want random payoffs? (yes/no): ', readline))
    .toLowerCase() === 'yes';

  // Get payoffs either randomly or manually
  const payoffMatrices = isRandom
    ? generateRandomPayoffs(strategies)
    : await getManualPayoffs(strategies);

  // Display the game matrices
  for (let i = 0; i < MAX_PLAYERS; i++) {
    displayPayoffMatrix(payoffMatrices[i], i);
  }

  // Find and display completely mixed Nash Equilibria
  const mixedNE = findCompletelyMixedNE(payoffMatrices);

  console.log('\nCompletely Mixed Nash Equilibria:');
  if (mixedNE.length === 0) {
    console.log('No completely mixed Nash Equilibria exist in this game.');
  } else {
    console.log('Found a completely mixed Nash Equilibrium:');
    console.log(`Player 1's strategy: (${mixedNE[0].map(p => p.toFixed(4)).join(', ')})`);
    console.log(`Player 2's strategy: (${mixedNE[1].map(p => p.toFixed(4)).join(', ')})`);
  }

  console.log('\nNote on generalization to games with n strategies:');
  console.log('For games with more strategies, the algorithm would need to:');
  console.log('1. Solve a system of n-1 linear equations for each player');
  console.log('2. Check that all probabilities are strictly between 0 and 1');
  console.log('3. Verify that the solution is indeed a Nash Equilibrium');
  console.log('This would require more sophisticated linear algebra methods.');

  readline.close();
};

// Run the program
main();