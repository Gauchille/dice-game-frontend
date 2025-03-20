<template>
  <div class="grid">
    <div class="row">
      <div class="cell sum">
        {{ props.score.diagonalScore }}
      </div>
    </div>
    <div
      v-for="(row, rowIndex) in props.grid"
      :key="'row-' + rowIndex"
      class="row"
    >
      <div
        v-for="(cell, colIndex) in row"
        :key="`cell-${rowIndex}-${colIndex}`"
        class="cell"
        :class="{
          available: isPlayableCell(rowIndex, colIndex),
          'start-cell': isStartCell(rowIndex, colIndex),
        }"
        @click="handleCellClick(rowIndex, colIndex)"
      >
        {{ cell }}
      </div>
      <div class="cell sum">
        {{ props.score.rowScores[rowIndex] }}
      </div>
    </div>
    <div class="row">
      <div class="cell sum">
        {{ props.score.diagonalScore }}
      </div>
      <div
        v-for="(score, index) in props.score.columnScores"
        :key="'result-col-' + index"
        class="cell sum"
      >
        {{ score }}
      </div>
      <div class="cell sum total-score">
        {{ props.score.totalScore }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDetrakGame } from "~/composables/useDetrakGame";

const { isCellAvailable } = useDetrakGame();

const props = defineProps<{
  lastPlacedPosition: { row: number; col: number } | null;
  grid: Array<Array<string>>;
  score: {
    rowScores: Array<number>;
    columnScores: Array<number>;
    diagonalScore: number;
    totalScore: number;
  };
  gameDone: boolean;
}>();

const emit = defineEmits<{
  "place-dice-value": [row: number, col: number];
}>();

const handleCellClick = (row: number, col: number) => {
  if (isCellAvailable(props.grid, props.lastPlacedPosition, { row, col })) {
    emit("place-dice-value", row, col);
  }
};

const isPlayableCell = (rowIndex: number, colIndex: number) => {
  return (
    isCellAvailable(props.grid, props.lastPlacedPosition, {
      row: rowIndex,
      col: colIndex,
    }) && props.grid[0][0]
  );
};

const isStartCell = (rowIndex: number, colIndex: number) => {
  return !props.grid[0][0] && rowIndex === 0 && colIndex === 0;
};
</script>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.row {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  width: 100%;
}

.cell {
  width: calc(100% / 7);
  aspect-ratio: 1;
  min-width: 40px;
  max-width: 60px;
  background-color: #e0e0e0;
  border: 2px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(14px, 3vw, 20px);
  font-weight: bold;
  transition: all 0.2s ease;
}

.cell.available {
  background-color: rgba(66, 184, 131, 0.1);
  border: 2px solid #42b883;
  cursor: pointer;
}

.cell.available:hover {
  background-color: rgba(66, 184, 131, 0.3);
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.3);
}

.cell.start-cell {
  background-color: rgba(66, 184, 131, 0.2);
  border: 2px dashed #42b883;
  animation: pulse 2s infinite;
}

.cell.sum {
  background-color: #f0f0f0;
  border: 2px solid #666;
  color: #42b883;
  font-weight: bold;
}

.cell.sum:hover {
  transform: none;
  cursor: default;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.total-score {
  background-color: #42b883;
  color: white;
}
</style>
