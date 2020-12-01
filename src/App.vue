<template>
  <div id="app">
    <div :key="chart.chart.data.length" class="trading-wrapper">
      <div class="trading-menu">
        <div>
          <button id="btn-spline" @click="chart.chart.type = 'Spline'" class="trading-menu-item"
          :class="{'trading-menu-item_active': chart.chart.type === 'Spline'}">Диаграмма</button>
          <button @click="chart.chart.type = 'Candles'" class="trading-menu-item"
          :class="{'trading-menu-item_active': chart.chart.type === 'Candles'}">Японские свечи</button>
        </div>
          <input type="file" style="display:none" @change="inputFile" id="file" />
          <label class="trading-menu__download-label" for="file">Загрузить данные</label>
          <button class="trading-menu__confirm-data" 
          @click="setFormatData" v-if="ohlcvData && ohlcvData.length && !isNotDrawDiagram">
          Построить диаграмму</button>
          <button class="trading-menu__edit-diagram" @click="isShowEditDiagramPopup = true" v-if="isShowEditData">Настроить диаграмму</button>
          <select class="trading-menu__selector" @change="inputIndicator" v-model="indicatorType">
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
     <div v-if="isError" class="trading-popup-rsi_error">пожалуйста, укажите параметр</div>
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

   <div v-if="isShowEditDiagramPopup" class="trading-popup trading-popup_edit-diagram">
     <div class="trading-popup__radio-param">
       <div class="trading-popup__radio-param-item">
        <label class="trading-popup__radio-param-item-label"  for="diagram">Диаграмма</label>
        <input v-model="editLine" value="diagram" name="diagram" type="radio" />
      </div>
      <div v-for="(item, key1) in allIndicators" :key="key1" class="trading-popup__radio-param-item">
        <label class="trading-popup__radio-param-item-label" :for="item">{{item}}</label>
        <input v-model="editLine" :value="item" :name="item" type="radio" />
      </div>
     </div>
     <div class="trading-popup_edit-diagram-item">
        <colour-picker
          v-model="diagramColor"
          :value="diagramColor"
          label="Выберите цвет диаграммы"
          picker="compact" />
      </div>
      <div class="trading-popup_edit-diagram-item">
        <div class="trading-popup_edit-diagram-item-text">Укажите толщину линии:</div>
        <div class="trading-popup__line-wrapper">
          <select @change="lineThickness=$event.target.value" v-model="lineThickness" class="trading-popup_edit-diagram-item-select">
            <option value="1">тонкая</option>
            <option value="2">средняя</option>
            <option value="3">жирная</option>
          </select>
        </div>
      </div>
      <div class="trading-popup_edit-diagram-item trading-popup_edit-diagram-btn-wrapper">
        <button class="btn trading-popup_edit-diagram-btn"  @click="isShowEditDiagramPopup = false">Закрыть</button>
        <button class="btn trading-popup_edit-diagram-btn" @click="setEditDiagram">Применить</button>
      </div>
   </div>

  </div>
</template>

<script src="./App.js" lang="js"></script>

<style src="./App.css"></style>

<style src="./assets/css/normalize.css"></style>
