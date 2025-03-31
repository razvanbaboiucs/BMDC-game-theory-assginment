// Common utility functions for game theory assignments

import readline from 'readline';

/**
 * Creates a readline interface for user input/output
 * @returns {readline.Interface} The readline interface
 */
const createReadlineInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
};

/**
 * Prompts the user with a question and returns the answer
 * @param {string} query - The question to ask the user
 * @param {readline.Interface} rl - The readline interface (optional)
 * @returns {Promise<string>} A promise that resolves to the user's answer
 */
const prompt = (query, rl = null) => {
  const readlineInterface = rl || createReadlineInterface();
  return new Promise((resolve) => readlineInterface.question(query, resolve));
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} A random integer
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Creates a matrix with given dimensions
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {*} defaultValue - Default value for each cell (default: 0)
 * @returns {Array<Array<*>>} A 2D array
 */
const createMatrix = (rows, cols, defaultValue = 0) => {
  return Array(rows).fill().map(() => Array(cols).fill(defaultValue));
};

export {
  createReadlineInterface,
  prompt,
  getRandomInt,
  createMatrix
};