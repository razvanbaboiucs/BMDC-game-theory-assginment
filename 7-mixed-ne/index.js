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
const solveMixedStrategy = (payoffMatrix, player) => {
  // For a 2x2 game, we solve the equation where expected payoffs are equal
  // For player 1: q * u1(s1,t1) + (1-q) * u1(s1,t2) = q * u1(s2,t1) + (1-q) * u1(s2,t2)
  // For player 2: p * u2(s1,t1) + (1-p) * u2(s2,t1) = p * u2(s1,t2) + (1-p) * u2(s2,t2)
  
  let a, b, c, d;
  
  if (player === 0) { // Player 1's perspective (solving for player 2's probability q)
    // We need to find q such that player 1 is indifferent between their strategies
    a = payoffMatrix[0][0]; // u1(s1,t1)
    b = payoffMatrix[0][1]; // u1(s1,t2)
    c = payoffMatrix[1][0]; // u1(s2,t1)
    d = payoffMatrix[1][1]; // u1(s2,t2)
  } else { // Player 2's perspective (solving for player 1's probability p)
    // We need to find p such that player 2 is indifferent between their strategies
    a = payoffMatrix[0][0]; // u2(s1,t1)
    b = payoffMatrix[1][0]; // u2(s2,t1)
    c = payoffMatrix[0][1]; // u2(s1,t2)
    d = payoffMatrix[1][1]; // u2(s2,t2)
  }

  // Solve for probability: q * (a - c) + (1-q) * (b - d) = 0 or p * (a - c) + (1-p) * (b - d) = 0
  // Simplifying: q * (a - c - b + d) = (d - b) or p * (a - c - b + d) = (d - b)
  const denominator = a - c - b + d;
  
  // Check if denominator is close to zero (no unique solution)
  if (Math.abs(denominator) < 1e-10) {
    // Check if numerator is also close to zero (infinitely many solutions)
    if (Math.abs(d - b) < 1e-10) {
      return { type: 'infinite', value: null };
    }
    // Otherwise, no solution exists
    return { type: 'none', value: null };
  }

  const probability = (d - b) / denominator;
  
  // Check if probability is in [0,1]
  if (probability < 0 || probability > 1) {
    return { type: 'outside', value: probability };
  }
  
  // Check if probability is 0 or 1 (not completely mixed)
  if (probability === 0 || probability === 1) {
    return { type: 'pure', value: probability };
  }
  
  // Valid completely mixed strategy
  return { type: 'mixed', value: probability };
};

// Function to find completely mixed Nash Equilibria
const findCompletelyMixedNE = (payoffMatrices) => {
  // For player 1, we need to find q (probability of player 2 playing first strategy)
  const player2Solution = solveMixedStrategy(payoffMatrices[0], 0);
  
  // For player 2, we need to find p (probability of player 1 playing first strategy)
  const player1Solution = solveMixedStrategy(payoffMatrices[1], 1);
  
  // Check if we have valid completely mixed solutions for both players
  if (player1Solution.type === 'mixed' && player2Solution.type === 'mixed') {
    return {
      exists: true,
      strategies: [
        [player1Solution.value, 1 - player1Solution.value],
        [player2Solution.value, 1 - player2Solution.value]
      ],
      explanation: 'Found a completely mixed Nash Equilibrium.'
    };
  }
  
  // Handle special cases
  let explanation = '';
  
  if (player1Solution.type === 'infinite' || player2Solution.type === 'infinite') {
    explanation = 'The game has infinitely many mixed equilibria.';
  } else if (player1Solution.type === 'none' || player2Solution.type === 'none') {
    explanation = 'No completely mixed Nash Equilibrium exists for this game.';
  } else if (player1Solution.type === 'outside' || player2Solution.type === 'outside') {
    explanation = 'The calculated probabilities are outside the valid range [0,1].';
  } else if (player1Solution.type === 'pure' || player2Solution.type === 'pure') {
    explanation = 'The game has a mixed equilibrium, but it is not completely mixed (some probabilities are 0 or 1).';
  }
  
  return { exists: false, strategies: null, explanation };
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

// Function to verify if a strategy profile is a Nash Equilibrium
const verifyNashEquilibrium = (payoffMatrices, mixedStrategies) => {
  // For a 2x2 game with completely mixed strategies, we verify that each player
  // is indifferent between their pure strategies given the opponent's mixed strategy
  
  const [p1, p2] = mixedStrategies[0]; // Player 1's mixed strategy
  const [q1, q2] = mixedStrategies[1]; // Player 2's mixed strategy
  
  // Expected payoff for Player 1 when playing pure strategy 1
  const p1s1 = q1 * payoffMatrices[0][0][0] + q2 * payoffMatrices[0][0][1];
  
  // Expected payoff for Player 1 when playing pure strategy 2
  const p1s2 = q1 * payoffMatrices[0][1][0] + q2 * payoffMatrices[0][1][1];
  
  // Expected payoff for Player 2 when playing pure strategy 1
  const p2s1 = p1 * payoffMatrices[1][0][0] + p2 * payoffMatrices[1][1][0];
  
  // Expected payoff for Player 2 when playing pure strategy 2
  const p2s2 = p1 * payoffMatrices[1][0][1] + p2 * payoffMatrices[1][1][1];
  
  // Check if players are indifferent between their strategies (within numerical precision)
  const isP1Indifferent = Math.abs(p1s1 - p1s2) < 1e-10;
  const isP2Indifferent = Math.abs(p2s1 - p2s2) < 1e-10;
  
  return {
    isNashEquilibrium: isP1Indifferent && isP2Indifferent,
    payoffs: {
      player1: { strategy1: p1s1, strategy2: p1s2 },
      player2: { strategy1: p2s1, strategy2: p2s2 }
    }
  };
};

// Main function
const main = async () => {
  console.log('Mixed Nash Equilibria Finder for 2-Player Normal-Form Games\n');

  // Currently supporting only 2x2 games
  const strategies = [2, 2];
  console.log('This implementation finds Nash Equilibria for 2x2 games.');

  // Ask for payoff input method
  const isRandom = (await prompt('Do you want random payoffs? (yes/no): ', readline))
    .toLowerCase().startsWith('y');

  // Get payoffs either randomly or manually
  const payoffMatrices = isRandom
    ? generateRandomPayoffs(strategies)
    : await getManualPayoffs(strategies);

  // Display the game matrices
  for (let i = 0; i < MAX_PLAYERS; i++) {
    displayPayoffMatrix(payoffMatrices[i], i);
  }

  // Find completely mixed Nash Equilibria
  const mixedResult = findCompletelyMixedNE(payoffMatrices);

  console.log('\nCompletely Mixed Nash Equilibria:');
  if (!mixedResult.exists) {
    console.log(mixedResult.explanation);
  } else {
    console.log('Found a completely mixed Nash Equilibrium:');
    console.log(`Player 1's strategy: (${mixedResult.strategies[0].map(p => p.toFixed(4)).join(', ')})`);
    console.log(`Player 2's strategy: (${mixedResult.strategies[1].map(p => p.toFixed(4)).join(', ')})`);
    
    // Verify the Nash Equilibrium
    const verification = verifyNashEquilibrium(payoffMatrices, mixedResult.strategies);
    
    console.log('\nVerification:');
    console.log(`Is this a Nash Equilibrium? ${verification.isNashEquilibrium ? 'Yes' : 'No'}`);
    console.log('\nExpected Payoffs:');
    console.log(`Player 1 - Strategy 1: ${verification.payoffs.player1.strategy1.toFixed(4)}`);
    console.log(`Player 1 - Strategy 2: ${verification.payoffs.player1.strategy2.toFixed(4)}`);
    console.log(`Player 2 - Strategy 1: ${verification.payoffs.player2.strategy1.toFixed(4)}`);
    console.log(`Player 2 - Strategy 2: ${verification.payoffs.player2.strategy2.toFixed(4)}`);
  }

  console.log('\nAlgorithm Explanation:');
  console.log('1. For a 2x2 game, we solve the indifference equations for each player');
  console.log('2. Player 1 must be indifferent: q*u1(s1,t1) + (1-q)*u1(s1,t2) = q*u1(s2,t1) + (1-q)*u1(s2,t2)');
  console.log('3. Player 2 must be indifferent: p*u2(s1,t1) + (1-p)*u2(s2,t1) = p*u2(s1,t2) + (1-p)*u2(s2,t2)');
  console.log('4. We solve for p and q, and check if they are in (0,1) for a completely mixed NE');
  console.log('5. The mixing probabilities depend only on the opponent\'s payoffs');

  readline.close();
};

// Run the program
main();