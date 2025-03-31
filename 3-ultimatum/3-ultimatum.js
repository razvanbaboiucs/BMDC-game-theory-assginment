// Ultimatum Game Analysis - Subgame Perfect Nash Equilibrium and Nash Equilibria
import { createReadlineInterface, prompt } from '../utility.js';

const readline = createReadlineInterface();

// Function to analyze the Ultimatum Game
const analyzeUltimatumGame = async () => {
  console.log('Ultimatum Game Analysis\n');
  console.log('Game Description:');
  console.log('1) Player 1 is given the opportunity to divide $10 with player 2.');
  console.log('2) Player 1 makes a proposal to player 2 about how much to share.');
  console.log('3) Player 2 decides whether to accept or reject.');
  console.log('4) Take it, or leave it. No back and forth bargaining.');
  console.log('5) If player 2 accepts, each person receives the share agreed upon.');
  console.log('6) Otherwise, the money disappears and neither player gets anything.\n');

  // Theoretical analysis
  console.log('Theoretical Analysis:');
  console.log('Subgame Perfect Nash Equilibrium (SPNE):');
  console.log('- Player 1 offers the minimum possible amount (e.g., $1)');
  console.log('- Player 2 accepts any offer greater than $0');
  console.log('This is because in the subgame where Player 2 must decide, any positive amount');
  console.log('is better than nothing, so rational Player 2 should accept any positive offer.');
  console.log('Player 1, knowing this, maximizes their payoff by offering the minimum.\n');

  console.log('Nash Equilibria that are not Subgame Perfect:');
  console.log('- Player 1 offers $X (any amount)');
  console.log('- Player 2 rejects any offer less than $Y where Y > X');
  console.log('This is a Nash equilibrium because:');
  console.log('1. Given Player 2\'s strategy, Player 1 cannot improve by offering less than $Y');
  console.log('2. Given Player 1\'s offer of $X, Player 2 cannot improve by accepting if X < Y');
  console.log('However, this is not subgame perfect because Player 2\'s threat to reject');
  console.log('positive offers is not credible in the subgame.\n');

  // Interactive simulation
  const runSimulation = async () => {
    console.log('\n--- Interactive Simulation ---');
    console.log('Let\'s simulate the game with you as Player 1:');
    
    // Get Player 1's offer
    let offer = -1;
    while (offer < 0 || offer > 10) {
      offer = parseFloat(await prompt('How much of the $10 will you offer to Player 2? ($0-$10): ', readline));
      if (isNaN(offer) || offer < 0 || offer > 10) {
        console.log('Please enter a valid amount between $0 and $10.');
        offer = -1;
      }
    }
    
    // Simulate Player 2's response based on rational behavior
    const player1Amount = 10 - offer;
    console.log(`\nYou (Player 1) offered $${offer.toFixed(2)} to Player 2, keeping $${player1Amount.toFixed(2)} for yourself.`);
    
    if (offer > 0) {
      console.log('Player 2 accepts the offer (rational decision based on SPNE).');
      console.log(`Final outcome: Player 1 gets $${player1Amount.toFixed(2)}, Player 2 gets $${offer.toFixed(2)}`);
    } else {
      console.log('Player 2 is indifferent between accepting and rejecting (both give $0).');
      console.log('In practice, psychological factors might lead to rejection even though it\'s not strictly rational.');
      console.log('Final outcome: Player 1 gets $0, Player 2 gets $0');
    }
    
    // Explain the relationship to SPNE
    console.log('\nRelationship to SPNE:');
    if (offer <= 1) {
      console.log('Your offer was close to the SPNE prediction (minimum positive offer).');
    } else {
      console.log('Your offer was more generous than the SPNE prediction.');
      console.log('This is common in real experiments due to fairness considerations.');
    }
  };

  // Ask if user wants to run a simulation
  const runSim = (await prompt('Would you like to run an interactive simulation? (yes/no): ', readline)).toLowerCase();
  if (runSim === 'yes' || runSim === 'y') {
    await runSimulation();
  }
};

// Run the analysis
const main = async () => {
  await analyzeUltimatumGame();
  readline.close();
};

main();