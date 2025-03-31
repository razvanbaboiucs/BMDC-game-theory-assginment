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

Payoff Matrix for Player 1:
[
  [ 3, 3 ], [ 4, 6 ]
]

Payoff Matrix for Player 2:
[
  [ 6, 8 ], [ 3, 3 ]
]

Pure Nash Equilibria:
Found 2 pure Nash Equilibria:
1. Strategy profile: (2, 1)
2. Strategy profile: (2, 2)

## Game 2
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 2
Enter number of strategies for Player 2: 3
Do you want random payoffs? (yes/no): yes

Payoff Matrix for Player 1:
[
  [ 1, 4, 5 ], [ 4, 8, 0 ]
]

Payoff Matrix for Player 2:
[
  [ 9, 8, 0 ], [ 6, 9, 3 ]
]

Pure Nash Equilibria:
Found 1 pure Nash Equilibria:
1. Strategy profile: (2, 2)

## Game 3
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 3
Enter number of strategies for Player 2: 2
Do you want random payoffs? (yes/no): yes

Payoff Matrix for Player 1:
[
  [ 4, 6 ], [ 0, 8 ], [ 2, 1 ]
]

Payoff Matrix for Player 2:
[
  [ 4, 9 ], [ 1, 3 ], [ 6, 9 ]
]

Pure Nash Equilibria:
Found 1 pure Nash Equilibria:
1. Strategy profile: (2, 2)

## Game 4
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 3
Enter number of strategies for Player 2: 3
Do you want random payoffs? (yes/no): yes

Payoff Matrix for Player 1:
[
  [ 3, 2, 7 ], [ 0, 8, 4 ], [ 6, 6, 4 ]
]

Payoff Matrix for Player 2:
[
  [ 1, 1, 9 ], [ 3, 8, 6 ], [ 5, 8, 3 ]
]

Pure Nash Equilibria:
Found 2 pure Nash Equilibria:
1. Strategy profile: (1, 3)
2. Strategy profile: (2, 2)

## Game 5
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 2
Enter number of strategies for Player 2: 2
Do you want random payoffs? (yes/no): yes

Payoff Matrix for Player 1:
[
  [ 1, 8 ], [ 8, 7 ]
]

Payoff Matrix for Player 2:
[
  [ 9, 8 ], [ 9, 4 ]
]

Pure Nash Equilibria:
Found 1 pure Nash Equilibria:
1. Strategy profile: (2, 1)

## Game 6
Pure Nash Equilibria Finder for 2-Player Normal-Form Games

Enter number of strategies for Player 1: 4
Enter number of strategies for Player 2: 4
Do you want random payoffs? (yes/no): yes

Payoff Matrix for Player 1:
[
  [ 6, 7, 4, 0 ], [ 5, 5, 7, 8 ], [ 9, 9, 0, 9 ], [ 2, 4, 1, 9 ]
]

Payoff Matrix for Player 2:
[
  [ 1, 6, 7, 6 ], [ 7, 8, 9, 5 ], [ 2, 5, 1, 0 ], [ 5, 3, 3, 8 ]
]

Pure Nash Equilibria:
Found 3 pure Nash Equilibria:
1. Strategy profile: (2, 3)
2. Strategy profile: (3, 2)
3. Strategy profile: (4, 4)