# Monty Hall Problem Simulation Results

## N = 10 Doors

| Simulations (K) | Keep Initial Door Win % | Switch Door Win % |
|----------------:|------------------------:|------------------:|
| 10              | 0.00%                   | 80.00%            |
| 100             | 10.00%                  | 96.00%            |
| 1,000           | 10.10%                  | 91.20%            |
| 10,000          | 10.54%                  | 89.92%            |

## N = 100 Doors

| Simulations (K) | Keep Initial Door Win % | Switch Door Win % |
|----------------:|------------------------:|------------------:|
| 10              | 0.00%                   | 100.00%           |
| 100             | 1.00%                   | 98.00%            |
| 1,000           | 1.60%                   | 99.20%            |
| 10,000          | 1.04%                   | 99.09%            |

## N = 1,000 Doors

| Simulations (K) | Keep Initial Door Win % | Switch Door Win % |
|----------------:|------------------------:|------------------:|
| 10              | 0.00%                   | 100.00%           |
| 100             | 1.00%                   | 100.00%           |
| 1,000           | 0.10%                   | 100.00%           |
| 10,000          | 0.08%                   | 99.93%            |

## N = 10,000 Doors

| Simulations (K) | Keep Initial Door Win % | Switch Door Win % |
|----------------:|------------------------:|------------------:|
| 10              | 0.00%                   | 100.00%           |
| 100             | 0.00%                   | 100.00%           |
| 1,000           | 0.10%                   | 100.00%           |
| 10,000          | 0.01%                   | 99.96%            |

## Analysis

The simulation results clearly demonstrate that:

1. As the number of doors (N) increases, the advantage of switching doors becomes more pronounced.
2. The win probability for keeping the initial door approaches 1/N, which is the theoretical expectation.
3. The win probability for switching doors approaches (N-1)/N, which is the theoretical expectation.
4. With larger numbers of simulations (K), the results tend to converge closer to the theoretical probabilities.

These results confirm the counter-intuitive nature of the Monty Hall problem, showing that switching doors is always the optimal strategy, with the advantage becoming more dramatic as the number of doors increases.