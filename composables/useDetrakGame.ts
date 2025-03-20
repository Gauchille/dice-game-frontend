import type { Dice, Dices, Grid } from "~/types/game";
import type { Ref } from "vue";

export function useDetrakGame() {

  const isAdjacent = (grid: Grid, lastPlaced: { row: number; col: number }, targetPosition: { row: number; col: number }) => {
    const { row: lastRow, col: lastCol } = lastPlaced;
    const { row: targetRow, col: targetCol } = targetPosition;

    const isVerticallyAdjacent = Math.abs(lastRow - targetRow) === 1 && lastCol === targetCol;
    const isHorizontallyAdjacent = Math.abs(lastCol - targetCol) === 1 && lastRow === targetRow;
    const isTargetEmpty = grid[targetRow][targetCol] === "";

    return (isVerticallyAdjacent || isHorizontallyAdjacent) && isTargetEmpty;
  };

  const isCellAvailable = (
    grid: Grid,
    lastPlaced: { row: number; col: number } | null,
    targetPosition: { row: number; col: number }
  ) => {
    if (!lastPlaced) {
      return grid[targetPosition.row][targetPosition.col] === "";
    }
    return isAdjacent(grid, lastPlaced, targetPosition);
  };

  const isPairOfCellAvailable = (grid: Grid) => {
    const emptyPositions = grid
      .flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          isEmpty: cell === ""
        }))
      )
      .filter(cell => cell.isEmpty);

    return emptyPositions.some((pos1) =>
      emptyPositions.some((pos2) =>
        pos1 !== pos2 && isAdjacent(grid, pos1, pos2)
      )
    );
  };

  const rollDices = (dices: Dices) => {
    Object.values(dices).forEach((dice) => {
      dice.value = Math.floor(Math.random() * 6) + 1;
      dice.position = null;
    });
  };

  const cancelTurn = (dices: Dices, grid: Grid) => {
    [dices.dice1, dices.dice2].forEach((dice) => {
      if (dice.position) {
        grid[dice.position.row][dice.position.col] = "";
        dice.position = null;
      }
    });
  };

  const handleDicePlacement = (
    grid: Grid,
    selectedDice: Dice | null,
    position: { row: number; col: number }
  ) => {
    if (!selectedDice) return;

    selectedDice.position = position;
    grid[position.row][position.col] = selectedDice.value.toString();
    selectedDice = null;
  };

  const getLastPlacedPosition = (dices: Dices) => {
    const { dice1, dice2 } = dices;
    if (dice1.position && dice2.position) return null;
    return dice1.position || dice2.position || null;
  };

  const finalizeGame = (grid: Grid) => {
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          grid[rowIndex][colIndex] = "0";
        }
      });
    });
  };

  return {
    isAdjacent,
    isCellAvailable,
    isPairOfCellAvailable,
    cancelTurn,
    rollDices,
    handleDicePlacement,
    getLastPlacedPosition,
    finalizeGame,
  };
}
