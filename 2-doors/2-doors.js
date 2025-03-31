// N-doors problem simulation (Monty Hall Problem)

import { createReadlineInterface, prompt, getRandomInt } from '../utility.js';

const readline = createReadlineInterface();

// Function to simulate a single game
const playGame = (N, strategy) => {
  // Place the gift randomly behind one of the doors
  const giftDoor = getRandomInt(1, N);
  
  // First choice is random
  const firstChoice = getRandomInt(1, N);
  
  // The remaining door will be one that's not the first choice
  // and not one of the N-2 opened doors (which don't have the gift)
  let remainingDoor;
  if (firstChoice === giftDoor) {
    // If first choice has the gift, remaining door is any other door
    do {
      remainingDoor = getRandomInt(1, N);
    } while (remainingDoor === firstChoice);
  } else {
    // If first choice doesn't have gift, remaining door must be the one with gift
    remainingDoor = giftDoor;
  }
  
  // Return true if won, false if lost
  return strategy === 1 ? firstChoice === giftDoor : remainingDoor === giftDoor;
};

// Function to run simulation K times
const runSimulation = (N, K) => {
  let strategy1Wins = 0;
  let strategy2Wins = 0;
  
  for (let i = 0; i < K; i++) {
    if (playGame(N, 1)) strategy1Wins++;
    if (playGame(N, 2)) strategy2Wins++;
  }
  
  return {
    strategy1Probability: strategy1Wins / K,
    strategy2Probability: strategy2Wins / K
  };
};

// Main function
const main = async () => {
  console.log('N-doors Problem Simulation\n');
  
  const N = parseInt(await prompt('Enter number of doors (N): ', readline));
  const K = parseInt(await prompt('Enter number of simulations (K): ', readline));
  
  console.log('\nRunning simulation...');
  const results = runSimulation(N, K);
  
  console.log('\nResults:');
  console.log(`Strategy 1 (Keep initial door) - Win Probability: ${(results.strategy1Probability * 100).toFixed(2)}%`);
  console.log(`Strategy 2 (Switch door) - Win Probability: ${(results.strategy2Probability * 100).toFixed(2)}%`);
  
  readline.close();
};

// Run the program
main();