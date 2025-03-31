// Extensive Form Game Solver using Backward Induction (SPNE)

import { createReadlineInterface, prompt, getRandomInt } from '../utility.js';

const readline = createReadlineInterface();

// Function to generate random payoffs for the game
const generateRandomPayoffs = (rounds) => {
  const payoffsPlayer1 = [];
  const payoffsPlayer2 = [];
  
  for (let i = 0; i < rounds; i++) {
    payoffsPlayer1.push(getRandomInt(-10, 9)); // Random values between -10 and 9
    payoffsPlayer2.push(getRandomInt(-10, 9));
  }
  
  return [payoffsPlayer1, payoffsPlayer2];
};

// Function to get manual payoffs from user
const getManualPayoffs = async (rounds) => {
  const payoffsPlayer1 = [];
  const payoffsPlayer2 = [];
  
  console.log('\nEnter payoffs for each round:');
  for (let i = 0; i < rounds; i++) {
    payoffsPlayer1.push(parseInt(await prompt(`Enter payoff L${i+1} (Player 1) for round ${i+1}: `, readline)));
    payoffsPlayer2.push(parseInt(await prompt(`Enter payoff R${i+1} (Player 2) for round ${i+1}: `, readline)));
  }
  
  return [payoffsPlayer1, payoffsPlayer2];
};

// Function to solve the game using backward induction
const solveByBackwardInduction = (payoffsPlayer1, payoffsPlayer2, rounds) => {
  // Create arrays to store the optimal decisions and values
  const optimalDecisions = new Array(rounds).fill(false); // false = continue, true = stop
  const optimalValues1 = new Array(rounds + 1).fill(0); // Player 1's optimal values
  const optimalValues2 = new Array(rounds + 1).fill(0); // Player 2's optimal values
  
  // Base case: If we reach the last round, the player must stop
  optimalDecisions[rounds - 1] = true;
  optimalValues1[rounds - 1] = payoffsPlayer1[rounds - 1];
  optimalValues2[rounds - 1] = payoffsPlayer2[rounds - 1];
  
  // Work backwards from the second-to-last round
  for (let round = rounds - 2; round >= 0; round--) {
    const playerTurn = (round % 2 === 0) ? 1 : 2; // Player 1 on even rounds, Player 2 on odd rounds
    
    if (playerTurn === 1) {
      // Player 1's turn
      if (payoffsPlayer1[round] >= optimalValues1[round + 1]) {
        // Better to stop
        optimalDecisions[round] = true;
        optimalValues1[round] = payoffsPlayer1[round];
        optimalValues2[round] = payoffsPlayer2[round];
      } else {
        // Better to continue
        optimalDecisions[round] = false;
        optimalValues1[round] = optimalValues1[round + 1];
        optimalValues2[round] = optimalValues2[round + 1];
      }
    } else {
      // Player 2's turn
      if (payoffsPlayer2[round] >= optimalValues2[round + 1]) {
        // Better to stop
        optimalDecisions[round] = true;
        optimalValues1[round] = payoffsPlayer1[round];
        optimalValues2[round] = payoffsPlayer2[round];
      } else {
        // Better to continue
        optimalDecisions[round] = false;
        optimalValues1[round] = optimalValues1[round + 1];
        optimalValues2[round] = optimalValues2[round + 1];
      }
    }
  }
  
  // Find the first round where a player decides to stop
  let stoppingRound = 0;
  while (stoppingRound < rounds && !optimalDecisions[stoppingRound]) {
    stoppingRound++;
  }
  
  // If no one stops, the game reaches the last round
  if (stoppingRound === rounds) {
    stoppingRound = rounds - 1;
  }
  
  const stoppingPlayer = (stoppingRound % 2 === 0) ? 1 : 2;
  
  return {
    stoppingRound: stoppingRound + 1, // Convert to 1-indexed for output
    stoppingPlayer,
    payoffPlayer1: optimalValues1[0],
    payoffPlayer2: optimalValues2[0],
    decisions: optimalDecisions
  };
};

// Function to display the game tree and solution
const displayGameTree = (payoffsPlayer1, payoffsPlayer2, solution, rounds) => {
  console.log('\nGame Tree:');
  console.log('Player turns: 1 2 1 2 ...');
  
  let treeStr = '';
  for (let i = 0; i < rounds; i++) {
    treeStr += `(L${i+1}=${payoffsPlayer1[i]},R${i+1}=${payoffsPlayer2[i]}) `;
  }
  console.log(treeStr);
  
  console.log('\nSolution by Backward Induction:');
  console.log(`The game stops at round ${solution.stoppingRound} by Player ${solution.stoppingPlayer}`);
  console.log(`Final payoffs: Player 1 = ${solution.payoffPlayer1}, Player 2 = ${solution.payoffPlayer2}`);
  
  console.log('\nOptimal decisions (Stop/Continue) for each round:');
  for (let i = 0; i < rounds; i++) {
    const playerTurn = (i % 2 === 0) ? 1 : 2;
    console.log(`Round ${i+1} (Player ${playerTurn}): ${solution.decisions[i] ? 'Stop' : 'Continue'}`);
  }
};

// Main function
const main = async () => {
  console.log('Extensive Form Game Solver using Backward Induction (SPNE)\n');
  
  // Get number of rounds (must be even)
  let rounds;
  do {
    rounds = parseInt(await prompt('Enter number of rounds (must be even): ', readline));
    if (rounds % 2 !== 0 || rounds <= 0) {
      console.log('Number of rounds must be a positive even number. Please try again.');
    }
  } while (rounds % 2 !== 0 || rounds <= 0);
  
  // Ask for payoff input method
  const isRandom = (await prompt('Do you want random payoffs? (yes/no): ', readline)).toLowerCase() === 'yes';
  
  // Get payoffs either randomly or manually
  const [payoffsPlayer1, payoffsPlayer2] = isRandom 
    ? generateRandomPayoffs(rounds)
    : await getManualPayoffs(rounds);
  
  // Solve the game using backward induction
  const solution = solveByBackwardInduction(payoffsPlayer1, payoffsPlayer2, rounds);
  
  // Display the game tree and solution
  displayGameTree(payoffsPlayer1, payoffsPlayer2, solution, rounds);
  
  readline.close();
};

// Run the program
main();