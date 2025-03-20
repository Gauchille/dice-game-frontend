<template>
<div v-if="!initNumber" class="init-selector">
      <div class="start-message">
        Sélectionnez un nombre pour commencer le jeu
      </div>
      <div class="number-options">
        <div
          v-for="n in 6"
          :key="n"
          class="number-choice"
          :class="{ 'selected': initNumber === n.toString() }"
          @click="initNumber = n.toString()"
        >
          {{ n }}
        </div>
      </div>
    </div>

</template>


<script setup lang="ts">
  const initNumber = defineModel<string>('initNumber');
</script>

<style scoped>
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


.number-choice {
  width: 50px;
  height: 50px;
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

.number-choice:hover {
  transform: scale(1.1);
  background-color: #f0f9f4;
}

.number-choice.selected {
  background-color: #42b883;
  color: white;
  transform: scale(1.1);
}

</style>
