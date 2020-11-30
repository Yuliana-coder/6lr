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
            <option value="williams">Процентный диапозон Ульямса</option>
            <option value="PVT">PVT</option>
            <option value="OBV">OBV</option>
            <option value="Momentum">Momentum</option>
          </select>
      </div>
      <div v-if="chart.chart.data.length" class="trading-diagram-wrapper">
        <trading-vue class="trading-diagram" :title-txt="chart.chart.name"
        color-title="black"
        :data="chart"></trading-vue>
      </div>
    </div>
   <div v-if="isShowPopupRSI" class="trading-popup">
     <div class="trading-popup_title">Пожалуйста, укажите параметр для расчета индикатора RSI:</div>
     <div class="trading-popup_input-wrapper">
       N = <input type="number" min="2" :max="chart.chart.data.length-2" v-model="nRSI" class="trading-popup_input" />
       <button @click="setRSI">Ок</button>
     </div>
     <div v-if="isError" class="trading-popup-rsi_error">пожалуйста, eкажите параметр</div>
   </div>
    <div v-if="isShowPopupWilliams" class="trading-popup">
     <div class="trading-popup_title">Пожалуйста, укажите параметр для расчета индикатора процентного диапозона Уильямса:</div>
     <div class="trading-popup_input-wrapper">
       N = <input type="number" min="2" :max="chart.chart.data.length-2" v-model="nWilliams" class="trading-popup_input" />
       <button @click="setWilliams">Ок</button>
     </div>
     <div v-if="isError" class="trading-popup_error">пожалуйста, укажите параметр</div>
   </div>

    <div v-if="isShowPopupMomentum" class="trading-popup">
     <div class="trading-popup_title">Пожалуйста, укажите параметр для расчета индикатора Momentum:</div>
     <div class="trading-popup_input-wrapper">
       N = <input type="number" min="2" :max="chart.chart.data.length-2" v-model="nMomentum" class="trading-popup_input" />
       <button @click="setMomentum">Ок</button>
     </div>
     <div v-if="isError" class="trading-popup_error">пожалуйста, укажите параметр</div>
   </div>

  </div>
</template>

<script src="./App.js" lang="js"></script>

<style src="./App.css"></style>

<style src="./assets/css/normalize.css"></style>
