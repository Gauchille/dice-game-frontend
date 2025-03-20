import { computed } from 'vue';

export function useDetrakScore() {
  function calculateLineScore(line: string[]) {
    if (line.includes('')) return 0;

    let score = 0;
    let i = 0;
    let hasPattern = false;

    while (i < line.length) {
      let currentNumber = line[i];
      let consecutiveCount = 1;
      while (i + consecutiveCount < line.length && line[i + consecutiveCount] === currentNumber) {
        consecutiveCount++;
      }
      switch (consecutiveCount) {
        case 5:
          score += 10;
          hasPattern = true;
          break;
        case 4:
          score += 8;
          hasPattern = true;
          break;
        case 3:
          score += 3;
          hasPattern = true;
          break;
        case 2:
          score += 2;
          hasPattern = true;
          break;
      }
      i += consecutiveCount;
    }
    if (!hasPattern && !line.includes('')) {
      return -5;
    }

    return score;
  }

  function getScores(grid: string[][]) {
    return {
      rowScores: grid.map(row => calculateLineScore(row)),
      columnScores: Array(5).fill(0).map((_, col) =>
        calculateLineScore(grid.map(row => row[col]))
      ),
      diagonalScore: calculateLineScore(
        Array(5).fill(0).map((_, i) => grid[i][4 - i])
      ),
      totalScore: grid.reduce((acc, row) => acc + calculateLineScore(row), 0),
    };
  }

  return { getScores };
}
