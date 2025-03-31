# Pure Nash Equilibria Finder for 2-Player Normal-Form Games

## Algorithm Explanation:

### Pseudocode:
```
FOR i FROM 0 TO rows-1 DO
    FOR j FROM 0 TO cols-1 DO
        isEquilibrium ← TRUE
        
        // Check if Player 1 can improve by deviating
        FOR k FROM 0 TO rows-1 DO
            IF payoffMatrix1[k][j] > payoffMatrix1[i][j] THEN
                isEquilibrium ← FALSE
                BREAK
            END IF
        END FOR
        
        // If still an equilibrium, check if Player 2 can improve
        IF isEquilibrium THEN
            FOR k FROM 0 TO cols-1 DO
                IF payoffMatrix2[i][k] > payoffMatrix2[i][j] THEN
                    isEquilibrium ← FALSE
                    BREAK
                END IF
            END FOR
        END IF
        
        // If neither player can improve, it's a Nash equilibrium
        IF isEquilibrium THEN
            ADD [i+1, j+1] TO equilibria
        END IF
    END FOR
END FOR

RETURN equilibria
```

### Explanation:
1. The algorithm examines each cell (i,j) in the payoff matrices.
2. For each cell, it checks if it represents a Nash equilibrium by verifying:
   - Player 1 cannot improve by unilaterally changing their strategy (row)
   - Player 2 cannot improve by unilaterally changing their strategy (column)
3. If neither player can improve their payoff by deviating, the strategy profile is a Nash equilibrium.
4. The algorithm returns all Nash equilibria found in the game.


## Game 1
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 2
Enter number of strategies for Player 2: 2
Do you want random payoffs? (yes/no): yes

### Payoff Matrix (Player 1, Player 2)

|           | Player 2: Strategy 1 | Player 2: Strategy 2 |
|-----------|:--------------------:|:--------------------:|
| **Player 1: Strategy 1** | (3, 6) | (3, 8) |
| **Player 1: Strategy 2** | **(4, 3)** | **(6, 3)** |

Pure Nash Equilibria:
Found 2 pure Nash Equilibria:
1. Strategy profile: (2, 1)
2. Strategy profile: (2, 2)

## Game 2
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 2
Enter number of strategies for Player 2: 3
Do you want random payoffs? (yes/no): yes

### Payoff Matrix (Player 1, Player 2)

|           | Player 2: Strategy 1 | Player 2: Strategy 2 | Player 2: Strategy 3 |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| **Player 1: Strategy 1** | (1, 9) | (4, 8) | (5, 0) |
| **Player 1: Strategy 2** | (4, 6) | **(8, 9)** | (0, 3) |

Pure Nash Equilibria:
Found 1 pure Nash Equilibria:
1. Strategy profile: (2, 2)

## Game 3
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 3
Enter number of strategies for Player 2: 2
Do you want random payoffs? (yes/no): yes

### Payoff Matrix (Player 1, Player 2)

|           | Player 2: Strategy 1 | Player 2: Strategy 2 |
|-----------|:--------------------:|:--------------------:|
| **Player 1: Strategy 1** | (4, 4) | (6, 9) |
| **Player 1: Strategy 2** | (0, 1) | **(8, 3)** |
| **Player 1: Strategy 3** | (2, 6) | (1, 9) |

Pure Nash Equilibria:
Found 1 pure Nash Equilibria:
1. Strategy profile: (2, 2)

## Game 4
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 3
Enter number of strategies for Player 2: 3
Do you want random payoffs? (yes/no): yes

### Payoff Matrix (Player 1, Player 2)

|           | Player 2: Strategy 1 | Player 2: Strategy 2 | Player 2: Strategy 3 |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| **Player 1: Strategy 1** | (3, 1) | (2, 1) | **(7, 9)** |
| **Player 1: Strategy 2** | (0, 3) | **(8, 8)** | (4, 6) |
| **Player 1: Strategy 3** | (6, 5) | (6, 8) | (4, 3) |

Pure Nash Equilibria:
Found 2 pure Nash Equilibria:
1. Strategy profile: (1, 3)
2. Strategy profile: (2, 2)

## Game 5
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 2
Enter number of strategies for Player 2: 2
Do you want random payoffs? (yes/no): yes

### Payoff Matrix (Player 1, Player 2)

|           | Player 2: Strategy 1 | Player 2: Strategy 2 |
|-----------|:--------------------:|:--------------------:|
| **Player 1: Strategy 1** | (1, 9) | (8, 8) |
| **Player 1: Strategy 2** | **(8, 9)** | (7, 4) |

Pure Nash Equilibria:
Found 1 pure Nash Equilibria:
1. Strategy profile: (2, 1)

## Game 6
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 4
Enter number of strategies for Player 2: 4
Do you want random payoffs? (yes/no): yes

### Payoff Matrix (Player 1, Player 2)

|           | Player 2: Strategy 1 | Player 2: Strategy 2 | Player 2: Strategy 3 | Player 2: Strategy 4 |
|-----------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| **Player 1: Strategy 1** | (6, 1) | (7, 6) | (4, 7) | (0, 6) |
| **Player 1: Strategy 2** | (5, 7) | (5, 8) | **(7, 9)** | (8, 5) |
| **Player 1: Strategy 3** | (9, 2) | **(9, 5)** | (0, 1) | (9, 0) |
| **Player 1: Strategy 4** | (2, 5) | (4, 3) | (1, 3) | **(9, 8)** |

Pure Nash Equilibria:
Found 3 pure Nash Equilibria:
1. Strategy profile: (2, 3)
2. Strategy profile: (3, 2)
3. Strategy profile: (4, 4)