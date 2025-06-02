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

// Function to get payoff for a specific strategy profile
const getPayoff = (payoffMatrix, profile) => {
  return payoffMatrix[profile.join('][')];
};

// Function to check if strategy s1 strictly dominates strategy s2 for a player
const strictlyDominates = (payoffMatrix, player, s1, s2, strategies, activePlayers, activeStrategies) => {
  // Generate all possible strategy profiles for other players
  const checkDomination = (profile = [], playerIndex = 0) => {
    // Skip the player we're checking dominance for
    if (playerIndex === player) {
      return checkDomination(profile, playerIndex + 1);
    }
    
    // If we've assigned strategies to all players
    if (playerIndex === activePlayers.length) {
      // Create two profiles: one with s1 and one with s2
      const profileWithS1 = [...profile];
      profileWithS1[player] = s1;
      
      const profileWithS2 = [...profile];
      profileWithS2[player] = s2;
      
      // If s1 doesn't give strictly higher payoff, it doesn't strictly dominate
      if (getPayoff(payoffMatrix, profileWithS1) <= getPayoff(payoffMatrix, profileWithS2)) {
        return false;
      }
      
      return true;
    }
    
    // Try each active strategy for the current player
    for (let i = 0; i < activeStrategies[playerIndex].length; i++) {
      const strategy = activeStrategies[playerIndex][i];
      const newProfile = [...profile];
      newProfile[playerIndex] = strategy;
      
      // If any profile doesn't maintain dominance, s1 doesn't strictly dominate s2
      if (!checkDomination(newProfile, playerIndex + 1)) {
        return false;
      }
    }
    
    return true;
  };
  
  // Start with an empty profile
  const initialProfile = Array(activePlayers.length).fill(0);
  return checkDomination(initialProfile);
};

// Function to perform iterated elimination of strictly dominated strategies
const eliminateStrictlyDominatedStrategies = (payoffMatrices, originalStrategies) => {
  const players = payoffMatrices.length;
  
  // Initialize active players and strategies
  const activePlayers = Array.from({ length: players }, (_, i) => i);
  const activeStrategies = Array.from({ length: players }, (_, i) => 
    Array.from({ length: originalStrategies[i] }, (_, j) => j)
  );
  
  let eliminated = true;
  let iterationCount = 0;
  
  // Continue until no more strategies can be eliminated
  while (eliminated) {
    eliminated = false;
    iterationCount++;
    
    // For each player
    for (let player = 0; player < players; player++) {
      // Skip if player has only one strategy left
      if (activeStrategies[player].length <= 1) continue;
      
      // Check each strategy against others
      for (let i = 0; i < activeStrategies[player].length; i++) {
        const s1 = activeStrategies[player][i];
        let isDominated = false;
        
        // Compare with all other strategies
        for (let j = 0; j < activeStrategies[player].length; j++) {
          if (i === j) continue;
          
          const s2 = activeStrategies[player][j];
          
          // Check if s2 strictly dominates s1
          if (strictlyDominates(payoffMatrices[player], player, s2, s1, originalStrategies, activePlayers, activeStrategies)) {
            isDominated = true;
            break;
          }
        }
        
        // If strategy is dominated, remove it
        if (isDominated) {
          console.log(`Iteration ${iterationCount}: Eliminated strategy ${s1 + 1} for Player ${player + 1} (strictly dominated)`);
          activeStrategies[player].splice(i, 1);
          eliminated = true;
          i--; // Adjust index after removal
        }
      }
    }
  }
  
  // Create new strategies array with reduced strategies
  const reducedStrategies = activeStrategies.map(strategies => strategies.length);
  
  console.log('\nAfter eliminating strictly dominated strategies:');
  for (let i = 0; i < players; i++) {
    console.log(`Player ${i + 1}: ${activeStrategies[i].map(s => s + 1).join(', ')}`);
  }
  
  return { reducedStrategies, activeStrategies };
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
const findPureNashEquilibria = (payoffMatrices, strategies, activeStrategies = null) => {
  const equilibria = [];
  const players = payoffMatrices.length;
  
  // If no active strategies provided, use all strategies
  if (!activeStrategies) {
    activeStrategies = Array.from({ length: players }, (_, i) => 
      Array.from({ length: strategies[i] }, (_, j) => j)
    );
  }

  const checkProfile = (currentProfile = [], depth = 0) => {
    if (depth === players) {
      if (isNashEquilibrium(payoffMatrices, strategies, currentProfile)) {
        equilibria.push(currentProfile.map(s => s + 1));
      }
      return;
    }

    // Only check active strategies for this player
    for (let i = 0; i < activeStrategies[depth].length; i++) {
      const strategy = activeStrategies[depth][i];
      checkProfile([...currentProfile, strategy], depth + 1);
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
  
  // Ask if user wants to use IESDS
  const useIESDS = (await prompt('Do you want to use Iterated Elimination of Strictly Dominated Strategies? (yes/no): ', readline))
    .toLowerCase() === 'yes';
  
  let activeStrategies = null;
  
  if (useIESDS) {
    console.log('\nPerforming Iterated Elimination of Strictly Dominated Strategies...');
    const result = eliminateStrictlyDominatedStrategies(payoffMatrices, strategies);
    activeStrategies = result.activeStrategies;
  }

  // Find and display pure Nash Equilibria
  console.log('\nFinding Pure Nash Equilibria...');
  const equilibria = findPureNashEquilibria(payoffMatrices, strategies, activeStrategies);

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