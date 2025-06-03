// Mixed Nash Equilibrium Solver for 2x2 Games
// Run with: bun run nash_solver.js

class GameSolver {
    constructor(payoffMatrix) {
        // payoffMatrix[i][j] = [payoff_player1, payoff_player2]
        this.payoffs = payoffMatrix;
        this.validateMatrix();
    }

    validateMatrix() {
        if (this.payoffs.length !== 2 || this.payoffs[0].length !== 2 || this.payoffs[1].length !== 2) {
            throw new Error("Must be a 2x2 game matrix");
        }
        
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (!Array.isArray(this.payoffs[i][j]) || this.payoffs[i][j].length !== 2) {
                    throw new Error("Each cell must contain [player1_payoff, player2_payoff]");
                }
            }
        }
    }

    // Get player 1's payoff when player 1 plays strategy i and player 2 plays strategy j
    getPayoff1(i, j) {
        return this.payoffs[i][j][0];
    }

    // Get player 2's payoff when player 1 plays strategy i and player 2 plays strategy j
    getPayoff2(i, j) {
        return this.payoffs[i][j][1];
    }

    // Find completely mixed Nash equilibrium
    findMixedNashEquilibrium() {
        console.log("=== Finding Completely Mixed Nash Equilibrium ===\n");
        
        // For a completely mixed NE, both players must be indifferent between their strategies
        // This means expected payoffs from both strategies must be equal
        
        // Let p = probability that player 1 plays strategy 0 (top row)
        // Let q = probability that player 2 plays strategy 0 (left column)
        
        // Player 1's indifference condition:
        // Expected payoff from strategy 0 = Expected payoff from strategy 1
        // q * payoff1(0,0) + (1-q) * payoff1(0,1) = q * payoff1(1,0) + (1-q) * payoff1(1,1)
        
        const a11 = this.getPayoff1(0, 0); // Player 1's payoff: (Top, Left)
        const a12 = this.getPayoff1(0, 1); // Player 1's payoff: (Top, Right)
        const a21 = this.getPayoff1(1, 0); // Player 1's payoff: (Bottom, Left)
        const a22 = this.getPayoff1(1, 1); // Player 1's payoff: (Bottom, Right)
        
        console.log("Player 1's payoff matrix:");
        console.log(`[${a11}, ${a12}]`);
        console.log(`[${a21}, ${a22}]`);
        
        // Solve for q (Player 2's mixing probability)
        // q * a11 + (1-q) * a12 = q * a21 + (1-q) * a22
        // q * (a11 - a12) + a12 = q * (a21 - a22) + a22
        // q * (a11 - a12 - a21 + a22) = a22 - a12
        
        const denominator1 = a11 - a12 - a21 + a22;
        let q = null;
        
        if (Math.abs(denominator1) > 1e-10) {
            q = (a22 - a12) / denominator1;
            console.log(`\nPlayer 1's indifference condition:`);
            console.log(`q * ${a11} + (1-q) * ${a12} = q * ${a21} + (1-q) * ${a22}`);
            console.log(`Solving for q: q = ${q.toFixed(6)}`);
        } else {
            console.log("\nPlayer 1 has no indifference condition (strategies have same payoff difference)");
        }
        
        // Player 2's indifference condition:
        const b11 = this.getPayoff2(0, 0); // Player 2's payoff: (Top, Left)
        const b12 = this.getPayoff2(0, 1); // Player 2's payoff: (Top, Right)
        const b21 = this.getPayoff2(1, 0); // Player 2's payoff: (Bottom, Left)
        const b22 = this.getPayoff2(1, 1); // Player 2's payoff: (Bottom, Right)
        
        console.log("\nPlayer 2's payoff matrix:");
        console.log(`[${b11}, ${b12}]`);
        console.log(`[${b21}, ${b22}]`);
        
        // Solve for p (Player 1's mixing probability)
        // p * b11 + (1-p) * b21 = p * b12 + (1-p) * b22
        const denominator2 = b11 - b21 - b12 + b22;
        let p = null;
        
        if (Math.abs(denominator2) > 1e-10) {
            p = (b22 - b21) / denominator2;
            console.log(`\nPlayer 2's indifference condition:`);
            console.log(`p * ${b11} + (1-p) * ${b21} = p * ${b12} + (1-p) * ${b22}`);
            console.log(`Solving for p: p = ${p.toFixed(6)}`);
        } else {
            console.log("\nPlayer 2 has no indifference condition (strategies have same payoff difference)");
        }
        
        // Check if we have a valid completely mixed NE
        if (p !== null && q !== null && p >= 0 && p <= 1 && q >= 0 && q <= 1) {
            console.log(`\n✓ Completely Mixed Nash Equilibrium Found!`);
            console.log(`Player 1 plays strategy 0 with probability: ${p.toFixed(6)}`);
            console.log(`Player 1 plays strategy 1 with probability: ${(1-p).toFixed(6)}`);
            console.log(`Player 2 plays strategy 0 with probability: ${q.toFixed(6)}`);
            console.log(`Player 2 plays strategy 1 with probability: ${(1-q).toFixed(6)}`);
            
            // Verify the equilibrium
            this.verifyMixedEquilibrium(p, q);
            
            return { p, q, exists: true };
        } else {
            console.log(`\n✗ No valid completely mixed Nash equilibrium exists`);
            if (p !== null) console.log(`Player 1's optimal p = ${p.toFixed(6)} ${p < 0 || p > 1 ? '(invalid - outside [0,1])' : ''}`);
            if (q !== null) console.log(`Player 2's optimal q = ${q.toFixed(6)} ${q < 0 || q > 1 ? '(invalid - outside [0,1])' : ''}`);
            
            return { p, q, exists: false };
        }
    }
    
    verifyMixedEquilibrium(p, q) {
        console.log(`\n=== Verification ===`);
        
        // Calculate expected payoffs for Player 1
        const expectedPayoff1_strategy0 = q * this.getPayoff1(0, 0) + (1-q) * this.getPayoff1(0, 1);
        const expectedPayoff1_strategy1 = q * this.getPayoff1(1, 0) + (1-q) * this.getPayoff1(1, 1);
        
        console.log(`Player 1's expected payoff from strategy 0: ${expectedPayoff1_strategy0.toFixed(6)}`);
        console.log(`Player 1's expected payoff from strategy 1: ${expectedPayoff1_strategy1.toFixed(6)}`);
        console.log(`Difference: ${Math.abs(expectedPayoff1_strategy0 - expectedPayoff1_strategy1).toFixed(8)} (should be ≈ 0)`);
        
        // Calculate expected payoffs for Player 2
        const expectedPayoff2_strategy0 = p * this.getPayoff2(0, 0) + (1-p) * this.getPayoff2(1, 0);
        const expectedPayoff2_strategy1 = p * this.getPayoff2(0, 1) + (1-p) * this.getPayoff2(1, 1);
        
        console.log(`Player 2's expected payoff from strategy 0: ${expectedPayoff2_strategy0.toFixed(6)}`);
        console.log(`Player 2's expected payoff from strategy 1: ${expectedPayoff2_strategy1.toFixed(6)}`);
        console.log(`Difference: ${Math.abs(expectedPayoff2_strategy0 - expectedPayoff2_strategy1).toFixed(8)} (should be ≈ 0)`);
    }
    
    findPureStrategyEquilibria() {
        console.log("\n=== Finding Pure Strategy Nash Equilibria ===\n");
        
        const equilibria = [];
        const strategies = ['Top', 'Bottom'];
        const strategies2 = ['Left', 'Right'];
        
        // Check all four pure strategy combinations
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (this.isPureNashEquilibrium(i, j)) {
                    equilibria.push([i, j]);
                    console.log(`✓ Pure Nash Equilibrium: (${strategies[i]}, ${strategies2[j]})`);
                    console.log(`  Payoffs: Player 1 = ${this.getPayoff1(i, j)}, Player 2 = ${this.getPayoff2(i, j)}`);
                }
            }
        }
        
        if (equilibria.length === 0) {
            console.log("✗ No pure strategy Nash equilibria found");
        }
        
        return equilibria;
    }
    
    isPureNashEquilibrium(i, j) {
        // Check if (i, j) is a Nash equilibrium
        // Player 1 should not want to deviate from strategy i
        // Player 2 should not want to deviate from strategy j
        
        const currentPayoff1 = this.getPayoff1(i, j);
        const alternativePayoff1 = this.getPayoff1(1-i, j);
        
        const currentPayoff2 = this.getPayoff2(i, j);
        const alternativePayoff2 = this.getPayoff2(i, 1-j);
        
        return currentPayoff1 >= alternativePayoff1 && currentPayoff2 >= alternativePayoff2;
    }
    
    displayGame() {
        console.log("=== Game Payoff Matrix ===");
        console.log("Format: [Player1_payoff, Player2_payoff]\n");
        console.log("           Player 2");
        console.log("         Left    Right");
        console.log(`Player 1 Top   ${JSON.stringify(this.payoffs[0][0])}  ${JSON.stringify(this.payoffs[0][1])}`);
        console.log(`       Bottom ${JSON.stringify(this.payoffs[1][0])}  ${JSON.stringify(this.payoffs[1][1])}`);
        console.log();
    }
}

// Example 1: Manually defined game (Battle of the Sexes variant)
function example1() {
    console.log("EXAMPLE 1: Manually defined game");
    console.log("=====================================\n");
    
    const payoffs = [
        [[3, 1], [0, 0]], // Top row: (3,1) when both choose Left, (0,0) when P1=Top, P2=Right
        [[0, 0], [1, 3]]  // Bottom row: (0,0) when P1=Bottom, P2=Left, (1,3) when both choose Right
    ];
    
    const game = new GameSolver(payoffs);
    game.displayGame();
    
    const pureEquilibria = game.findPureStrategyEquilibria();
    const mixedEquilibrium = game.findMixedNashEquilibrium();
    
    console.log(`\nSummary: Found ${pureEquilibria.length} pure strategy equilibria and ${mixedEquilibrium.exists ? 1 : 0} mixed strategy equilibrium`);
}

// Example 2: Randomly generated game
function example2() {
    console.log("\n\nEXAMPLE 2: Randomly generated game");
    console.log("=====================================\n");
    
    // Generate random payoffs between -10 and 10
    const payoffs = [
        [
            [Math.floor(Math.random() * 21) - 10, Math.floor(Math.random() * 21) - 10],
            [Math.floor(Math.random() * 21) - 10, Math.floor(Math.random() * 21) - 10]
        ],
        [
            [Math.floor(Math.random() * 21) - 10, Math.floor(Math.random() * 21) - 10],
            [Math.floor(Math.random() * 21) - 10, Math.floor(Math.random() * 21) - 10]
        ]
    ];
    
    const game = new GameSolver(payoffs);
    game.displayGame();
    
    const pureEquilibria = game.findPureStrategyEquilibria();
    const mixedEquilibrium = game.findMixedNashEquilibrium();
    
    console.log(`\nSummary: Found ${pureEquilibria.length} pure strategy equilibria and ${mixedEquilibrium.exists ? 1 : 0} mixed strategy equilibrium`);
}

// Run examples
example1();
example2();

/* 
ALGORITHM EXPLANATION:
======================

The algorithm for finding completely mixed Nash equilibria in 2x2 games works as follows:

1. **Setup**: 
   - Let p = probability that Player 1 plays their first strategy (row 0)
   - Let q = probability that Player 2 plays their first strategy (column 0)
   - For a completely mixed equilibrium: 0 < p < 1 and 0 < q < 1

2. **Indifference Conditions**:
   In a mixed Nash equilibrium, each player must be indifferent between their strategies.
   This means the expected payoff from each strategy must be equal.
   
   For Player 1:
   Expected payoff from strategy 0 = Expected payoff from strategy 1
   q * a₁₁ + (1-q) * a₁₂ = q * a₂₁ + (1-q) * a₂₂
   
   For Player 2:
   Expected payoff from strategy 0 = Expected payoff from strategy 1
   p * b₁₁ + (1-p) * b₂₁ = p * b₁₂ + (1-p) * b₂₂

3. **Solving**:
   From Player 1's indifference: q = (a₂₂ - a₁₂) / (a₁₁ - a₁₂ - a₂₁ + a₂₂)
   From Player 2's indifference: p = (b₂₂ - b₂₁) / (b₁₁ - b₂₁ - b₁₂ + b₂₂)

4. **Validation**:
   Check if 0 ≤ p ≤ 1 and 0 ≤ q ≤ 1. If both conditions hold, we have a valid mixed NE.

5. **Key Insights**:
   - A 2x2 game has at most one completely mixed Nash equilibrium
   - If no mixed equilibrium exists, the game is solved by pure strategy equilibria
   - The mixing probabilities depend only on the opponent's payoffs (not your own)
   - This is because you need to make your opponent indifferent

Time Complexity: O(1) - constant time for 2x2 games
Space Complexity: O(1) - constant space
*/