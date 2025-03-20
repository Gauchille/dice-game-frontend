<template>
  <div class="game-container">
    <GameGrid
      :grid="grid"
      :score="score"
      :game-done="gameDone"
      :last-placed-position="getLastPlacedPosition(dices)"
      @place-dice-value="
        (row, col) => {
          handleDicePlacement(grid, selectedDice, { row, col });
        }
      "
    />
    <NumberSelector v-model:initNumber="grid[0][0]" />

    <!-- Contrôles de jeu directement intégrés -->
    <div v-if="grid[0][0]" class="game-controls">
      <div class="dice-container">
        <div
          class="dice"
          :class="{
            selected: selectedDice === dices.dice1,
            used: dices.dice1.position,
          }"
          @click="selectedDice = dices.dice1"
        >
          {{ dices.dice1.value }}
        </div>
        <div
          class="dice"
          :class="{
            selected: selectedDice === dices.dice2,
            used: dices.dice2.position,
          }"
          @click="selectedDice = dices.dice2"
        >
          {{ dices.dice2.value }}
        </div>
      </div>

      <div v-if="!gameDone" class="actions">
        <button
          v-if="usedDiceCount === 2 && isPairOfCellAvailable(grid)"
          class="action-button next"
          @click="rollDices(dices)"
        >
          Tour suivant
        </button>
        <button
          v-if="usedDiceCount > 0"
          class="action-button cancel"
          @click="cancelTurn(dices, grid)"
        >
          Recommencer
        </button>
        <button
          v-if="usedDiceCount === 2 && !isPairOfCellAvailable(grid)"
          class="action-button restart"
          @click="handleGameEnd"
        >
          Terminer la partie
        </button>
      </div>
    </div>
    <br />

    <!-- Affichage du score final -->
    <div v-if="finalScore !== null" class="final-score">
      Score Final : {{ finalScore }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Dice, Dices, Grid } from "~/types/game";
import { useDetrakScore } from "~/composables/useDetrakScore";

// const grid = ref<Grid>(
//   Array(5)
//     .fill(null)
//     .map(() => Array(5).fill(""))
// );

const grid = ref<Grid>([
  ["1", "2", "3", "4", "5"],
  ["2", "3", "4", "5", "6"],
  ["3", "4", "5", "6", "1"],
  ["4", "5", "", "", ""], // Deux cases vides
  ["5", "6", "1", "2", "3"],
]);

const {
  isPairOfCellAvailable,
  cancelTurn,
  rollDices,
  handleDicePlacement,
  getLastPlacedPosition,
  finalizeGame,
} = useDetrakGame();

const { getScores } = useDetrakScore();

const score = computed(() => getScores(grid.value));

const dices = ref<Dices>({
  dice1: {
    value: Math.floor(Math.random() * 6) + 1,
    position: null,
  },
  dice2: {
    value: Math.floor(Math.random() * 6) + 1,
    position: null,
  },
});

const selectedDice = ref<Dice | null>(null);
const gameDone = ref<boolean>(false);
const finalScore = ref<number | null>(null);

const usedDiceCount = computed(() => {
  return (
    (dices.value.dice1.position ? 1 : 0) + (dices.value.dice2.position ? 1 : 0)
  );
});

const handleGameEnd = () => {
  finalizeGame(grid.value);
  finalScore.value = getScores(grid.value).totalScore;

  // Simulation d'enregistrement en DB
  console.log("Saving score to DB:", finalScore.value);
  // TODO: Remplacer par un vrai appel API
  // await saveScore(finalScore.value);
};
</script>

<style>
.game-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
}

.row {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.cell {
  width: 60px;
  height: 60px;
  background-color: #e0e0e0;
  border: 2px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.2s ease;
}

/* Style pour les cases disponibles */
.cell.available {
  background-color: rgba(66, 184, 131, 0.1);
  border: 2px solid #42b883;
  cursor: pointer;
}

/* Effet hover sur les cases disponibles */
.cell.available:hover {
  background-color: rgba(66, 184, 131, 0.3);
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.3);
}

/* Style spécial pour la première case */
.cell.start-cell {
  background-color: rgba(66, 184, 131, 0.2);
  border: 2px dashed #42b883;
  animation: pulse 2s infinite;
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

/* Cases non disponibles */
.cell:not(.available):not(.start-cell) {
  cursor: not-allowed;
}

.init-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.number-options {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.game-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.game-info {
  margin-bottom: 15px;
  text-align: center;
}

.turns-counter {
  font-size: 1.2em;
  color: #2c3e50;
  font-weight: bold;
}

.dice-container {
  display: flex;
  gap: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 15px;
}

.dice {
  width: 60px;
  height: 60px;
  background-color: white;
  border: 2px solid #42b883;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dice.selected {
  background-color: #42b883;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.5);
}

.dice.used {
  opacity: 0.5;
  background-color: #cccccc;
  border-color: #999999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.dice:not(.used):hover {
  transform: scale(1.05);
  box-shadow: 0 0 5px rgba(66, 184, 131, 0.3);
}

.actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  color: white;
  min-width: 120px;
  text-align: center;
}

.action-button.next {
  background-color: #42b883;
}

.action-button.next:hover {
  background-color: #3aa876;
  transform: scale(1.05);
}

.action-button.cancel {
  background-color: #ff7675;
}

.action-button.cancel:hover {
  background-color: #e66767;
  transform: scale(1.05);
}

.action-button.restart {
  background-color: #42b883;
}

.action-button.restart:hover {
  background-color: #3aa876;
  transform: scale(1.05);
}

.cell.sum {
  background-color: #f0f0f0;
  border: 2px solid #666;
  color: #42b883;
  font-weight: bold;
}

/* Style spécifique pour la cellule de somme au survol */
.cell.sum:hover {
  transform: none;
  cursor: default;
}

.final-score {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}
</style>
