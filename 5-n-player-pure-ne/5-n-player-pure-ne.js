// Pure Nash Equilibria Finder for N-Player Normal-Form Games

const { createReadlineInterface, prompt, createMatrix, getRandomInt } = require('../utility');

const readline = createReadlineInterface();
const MAX_PLAYERS = 10;

// Function to create an n-dimensional payoff matrix
const createPayoffMatrix = (dimensions) => {
  if (dimensions.length === 0) return 0;
  if (dimensions.length === 1) return Array(dimensions[0]).fill(0);
  
  return Array(dimensions[0]).fill().map(() => 
    createPayoffMatrix(dimensions.slice(1))
  );
};

// Function to get manual payoffs for n-dimensional matrix
const getManualPayoffs = async (players, strategies) => {
  const payoffMatrices = Array(players).fill().map(() => 
    createPayoffMatrix(strategies)
  );

  for (let player = 0; player < players; player++) {
    console.log(`\nEnter payoffs for Player ${player + 1}:`);
    const fillPayoffs = async (matrix, indices = []) => {
      if (indices.length === strategies.length) {
        const strategyProfile = indices.map(i => i + 1).join(',');
        matrix[indices.join('][')] = parseInt(
          await prompt(`Enter payoff for strategy profile (${strategyProfile}): `, readline)
        );
        return;
      }

      for (let i = 0; i < strategies[indices.length]; i++) {
        await fillPayoffs(matrix, [...indices, i]);
      }
    };

    await fillPayoffs(payoffMatrices[player]);
  }

  return payoffMatrices;
};

// Function to generate random payoffs for n-dimensional matrix
const generateRandomPayoffs = (players, strategies) => {
  const payoffMatrices = Array(players).fill().map(() => 
    createPayoffMatrix(strategies)
  );

  const fillRandom = (matrix, indices = []) => {
    if (indices.length === strategies.length) {
      matrix[indices.join('][')] = getRandomInt(0, 100);
      return;
    }

    for (let i = 0; i < strategies[indices.length]; i++) {
      fillRandom(matrix, [...indices, i]);
    }
  };

  for (let player = 0; player < players; player++) {
    fillRandom(payoffMatrices[player]);
  }

  return payoffMatrices;
};

// Function to check if a strategy profile is a Nash Equilibrium
const isNashEquilibrium = (payoffMatrices, strategies, currentProfile) => {
  const players = payoffMatrices.length;

  // Check each player's potential deviations
  for (let player = 0; player < players; player++) {
    const currentPayoff = payoffMatrices[player][currentProfile.join('][')];

    // Try each alternative strategy for the current player
    for (let altStrategy = 0; altStrategy < strategies[player]; altStrategy++) {
      if (altStrategy === currentProfile[player]) continue;

      // Create alternative profile with the deviation
      const deviationProfile = [...currentProfile];
      deviationProfile[player] = altStrategy;

      const deviationPayoff = payoffMatrices[player][deviationProfile.join('][')];

      // If player can improve by deviating, not a Nash Equilibrium
      if (deviationPayoff > currentPayoff) {
        return false;
      }
    }
  }

  return true;
};

// Function to find all pure Nash Equilibria
const findPureNashEquilibria = (payoffMatrices, strategies) => {
  const equilibria = [];
  const players = payoffMatrices.length;

  const checkProfile = (currentProfile = [], depth = 0) => {
    if (depth === players) {
      if (isNashEquilibrium(payoffMatrices, strategies, currentProfile)) {
        equilibria.push(currentProfile.map(s => s + 1));
      }
      return;
    }

    for (let i = 0; i < strategies[depth]; i++) {
      checkProfile([...currentProfile, i], depth + 1);
    }
  };

  checkProfile();
  return equilibria;
};

// Function to display n-dimensional payoff matrix
const displayPayoffMatrix = (matrix, player, strategies) => {
  console.log(`\nPayoff Matrix for Player ${player + 1}:`);
  const display = (indices = []) => {
    if (indices.length === strategies.length) {
      process.stdout.write(`${matrix[indices.join('][')] || 0}\t`);
      return;
    }

    if (indices.length === 0) console.log('[');
    for (let i = 0; i < strategies[indices.length]; i++) {
      if (indices.length < strategies.length - 1) process.stdout.write('  '.repeat(indices.length) + '[');
      display([...indices, i]);
      if (indices.length < strategies.length - 1) {
        console.log(']');
      }
    }
    if (indices.length === 0) console.log(']\n');
  };

  display();
};

// Main function
const main = async () => {
  console.log('Pure Nash Equilibria Finder for N-Player Normal-Form Games\n');

  // Get number of players
  const numPlayers = parseInt(
    await prompt(`Enter number of players (maximum ${MAX_PLAYERS}): `, readline)
  );

  if (numPlayers < 2 || numPlayers > MAX_PLAYERS) {
    console.log(`Number of players must be between 2 and ${MAX_PLAYERS}`);
    readline.close();
    return;
  }

  // Get number of strategies for each player
  const strategies = [];
  for (let i = 0; i < numPlayers; i++) {
    strategies.push(
      parseInt(await prompt(`Enter number of strategies for Player ${i + 1}: `, readline))
    );
  }

  // Ask for payoff input method
  const isRandom = (await prompt('Do you want random payoffs? (yes/no): ', readline))
    .toLowerCase() === 'yes';

  // Get payoffs either randomly or manually
  const payoffMatrices = isRandom
    ? generateRandomPayoffs(numPlayers, strategies)
    : await getManualPayoffs(numPlayers, strategies);

  // Display the game matrices
  for (let i = 0; i < numPlayers; i++) {
    displayPayoffMatrix(payoffMatrices[i], i, strategies);
  }

  // Find and display pure Nash Equilibria
  const equilibria = findPureNashEquilibria(payoffMatrices, strategies);

  console.log('\nPure Nash Equilibria:');
  if (equilibria.length === 0) {
    console.log('No pure Nash Equilibria exist in this game.');
  } else {
    console.log(`Found ${equilibria.length} pure Nash Equilibria:`);
    equilibria.forEach((eq, index) => {
      console.log(`${index + 1}. Strategy profile: (${eq.join(', ')})`);
    });
  }

  readline.close();
};

// Run the program
main();