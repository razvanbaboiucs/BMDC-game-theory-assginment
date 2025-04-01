// Pure Nash Equilibria Finder for 2-Player Normal-Form Games

const { createReadlineInterface, prompt, createMatrix, getRandomInt } = require('../utility');

const readline = createReadlineInterface();

// Function to generate random payoffs
const generateRandomPayoffs = (rows, cols) => {
  const matrix1 = createMatrix(rows, cols);
  const matrix2 = createMatrix(rows, cols);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      matrix1[i][j] = getRandomInt(-1000000, 10000000)
      matrix2[i][j] = getRandomInt(-1000000, 10000000)
    }
  }

  return [matrix1, matrix2];
};

// Function to get manual payoffs
const getManualPayoffs = async (rows, cols) => {
  const matrix1 = createMatrix(rows, cols);
  const matrix2 = createMatrix(rows, cols);

  console.log('\nEnter payoffs for Player 1:');
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      matrix1[i][j] = parseInt(await prompt(`Enter payoff for strategy (${i + 1},${j + 1}): `, readline));
    }
  }

  console.log('\nEnter payoffs for Player 2:');
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      matrix2[i][j] = parseInt(await prompt(`Enter payoff for strategy (${i + 1},${j + 1}): `, readline));
    }
  }

  return [matrix1, matrix2];
};

// Function to find pure Nash Equilibria
const findPureNashEquilibria = (payoffMatrix1, payoffMatrix2) => {
  const rows = payoffMatrix1.length;
  const cols = payoffMatrix1[0].length;
  const equilibria = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let isEquilibrium = true;

      // Check if Player 1 can improve by deviating
      for (let k = 0; k < rows; k++) {
        if (payoffMatrix1[k][j] > payoffMatrix1[i][j]) {
          isEquilibrium = false;
          break;
        }
      }

      // Check if Player 2 can improve by deviating
      if (isEquilibrium) {
        for (let k = 0; k < cols; k++) {
          if (payoffMatrix2[i][k] > payoffMatrix2[i][j]) {
            isEquilibrium = false;
            break;
          }
        }
      }

      if (isEquilibrium) {
        equilibria.push([i + 1, j + 1]);
      }
    }
  }

  return equilibria;
};

// Main function
const main = async () => {
  console.log('Pure Nash Equilibria Finder for 2-Player Normal-Form Games\n');

  // Get number of strategies for both players
  const rows = parseInt(await prompt('Enter number of strategies for Player 1: ', readline));
  const cols = parseInt(await prompt('Enter number of strategies for Player 2: ', readline));

  // Ask for payoff input method
  const isRandom = (await prompt('Do you want random payoffs? (yes/no): ', readline)).toLowerCase() === 'yes';

  // Get payoffs either randomly or manually
  const [payoffMatrix1, payoffMatrix2] = isRandom 
    ? generateRandomPayoffs(rows, cols)
    : await getManualPayoffs(rows, cols);

  // Display the game matrices
  console.log('\nPayoff Matrix for Player 1:');
  console.log(payoffMatrix1);
  console.log('\nPayoff Matrix for Player 2:');
  console.log(payoffMatrix2);

  // Find and display pure Nash Equilibria
  const equilibria = findPureNashEquilibria(payoffMatrix1, payoffMatrix2);

  console.log('\nPure Nash Equilibria:');
  if (equilibria.length === 0) {
    console.log('No pure Nash Equilibria exist in this game.');
  } else {
    console.log(`Found ${equilibria.length} pure Nash Equilibria:`);
    equilibria.forEach((eq, index) => {
      console.log(`${index + 1}. Strategy profile: (${eq[0]}, ${eq[1]})`);
    });
  }

  readline.close();
};

// Run the program
main();