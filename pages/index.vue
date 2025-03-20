<template>
  <div>
    <h1>Hello World</h1>
    <h2>choisi le jeu auquel tu veux jouer</h2>
    <button @click="startGame">Détrak</button>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
  router.push('/detrak');
};
</script>
