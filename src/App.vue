<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
   <trading-vue v-if="typeChart" :data="chart"></trading-vue>
   <trading-vue v-else :data="chart1"></trading-vue>
   <button @click="typeChart = !typeChart">Change</button>
  </div>
</template>

<script src="./App.js" lang="js"></script>

<style src="./App.css"></style>
