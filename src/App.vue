<template>
  <div id="app">
    <div :key="chart.chart.data.length" class="trading-wrapper">
      <div class="trading-menu">
        <button id="btn-spline" @click="chart.chart.type = 'Spline'" class="trading-menu-item"
         :class="{'trading-menu-item_active': chart.chart.type === 'Spline'}">Диаграмма</button>
        <button @click="chart.chart.type = 'Candles'" class="trading-menu-item"
         :class="{'trading-menu-item_active': chart.chart.type === 'Candles'}">Японские свечи</button>
          <input type="file" @change="inputFile" id="file" />
          <button @click="setFormatData" v-if="ohlcvData && ohlcvData.length">Построить диаграмму</button>
          <select @change="inputIndicator" v-model="indicatorType">
            <option value="RSI">RSI</option>
          </select>
      </div>
      <div v-if="chart.chart.data.length" class="trading-diagram-wrapper">
        <trading-vue class="trading-diagram" :title-txt="chart.chart.name"
        color-title="black"
        :data="chart"></trading-vue>
      </div>
    </div>
   <!-- <button @click="changeType">Change</button> -->
  </div>
</template>

<script src="./App.js" lang="js"></script>

<style src="./App.css"></style>

<style src="./assets/css/normalize.css"></style>
