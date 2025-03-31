# Ultimatum Game: Theoretical Analysis

## Git link:

https://github.com/razvanbaboiucs/BMDC-game-theory-assginment/tree/master/3-ultimatum

## Game Description

The Ultimatum Game is a classic economic experiment that demonstrates strategic decision-making and concepts of fairness:

1. Player 1 is given the opportunity to divide $10 with Player 2.
2. Player 1 makes a proposal to Player 2 about how much to share.
3. Player 2 decides whether to accept or reject.
4. Take it, or leave it. No back and forth bargaining.
5. If Player 2 accepts, each person receives the share agreed upon.
6. Otherwise, the money disappears and neither player gets anything.

## Game Theory Analysis

### Subgame Perfect Nash Equilibrium (SPNE)

The subgame perfect Nash equilibrium for the Ultimatum Game is:

- **Player 1**: Offers the minimum possible positive amount (e.g., $1)
- **Player 2**: Accepts any offer greater than $0

#### Reasoning:

1. **Backward Induction**: We start by analyzing Player 2's decision in the second stage.
   - For Player 2, any positive amount is better than nothing (positive utility > zero utility)
   - Therefore, a rational Player 2 should accept any offer greater than $0

2. **Player 1's Strategy**: Knowing that Player 2 will accept any positive offer, Player 1 maximizes their payoff by offering the minimum possible positive amount.
   - This allows Player 1 to keep almost all of the $10 while still ensuring Player 2 accepts

### Nash Equilibria that are not Subgame Perfect

The Ultimatum Game also has multiple Nash equilibria that are not subgame perfect:

- **Player 1**: Offers amount $X (any amount)
- **Player 2**: Rejects any offer less than $Y where Y > X

#### Why this is a Nash equilibrium:

1. Given Player 2's strategy (reject if less than $Y), Player 1 cannot improve by offering less than $Y
2. Given Player 1's offer of $X, Player 2 cannot improve by accepting if X < Y

#### Why it's not subgame perfect:

This equilibrium relies on Player 2's threat to reject positive offers, but this threat is not credible when analyzed in the subgame. In the subgame where Player 2 must decide, rejecting a positive offer is irrational because:
- Accepting gives Player 2 a positive payoff
- Rejecting gives Player 2 zero payoff

Therefore, these Nash equilibria fail the subgame perfection criterion because they involve non-credible threats.