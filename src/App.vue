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
          <div>
          <span>Индикаторы:</span>
          <select class="trading-menu__selector" @change="inputIndicator" v-model="indicatorType">
            <option value="RSI">RSI</option>
            <option value="williams">Процентный диапозон Ульямса</option>
            <option value="PVT">PVT</option>
            <option value="OBV">OBV</option>
            <option value="Momentum">Momentum</option>
          </select>
          </div>
          <button @click="isRefShow = true" class="btn trading-menu__reference">Справка</button>
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

   
      <div v-if="isRefShow" class="trading-popup popup-ref">
        <button @click="isRefShow = false" class="btn trading-popup_close-btn">Закрыть</button>
        <div>
          <div class="title-indicator">1. Индекс Относительной Силы (Relative Strength Index)</div>
          <div class="text-indicator">
            RSI измеряет силу рынка, вычислив изменения его конечных цен. Этот индикатор может разворачиваться
             и подавать сигналы либо с опережением цен, либо одновременно, но не с опаздыванием. RSI показывает внутреннюю силу
              одной бумаги. RSI – это следующий за ценами индикатор инерции, который колеблется в диапазоне от 0 до 100. Лучше всего
               он работает, достигая области экстремумов – это линии на уровне 30 и 70. Область ниже 30 является зоной перепроданности,
                а выше 70 – зоной перекупленности.<br /><br />
                Формула:
                (СУММА(белых свечек))/(СУММА(черных свечек) + СУММА(белых свечек)) * 100
                <br /><br />
                Интерпретация:
                Если после пребывания в зоне перекупленности линия RSI опускается через отметку 70 сверху, констатируют переход от восходящей тенденции к нисходящей.
                 Соответственно, если снизу пересекается уровень перепроданности, говорят о преобразовании нисходящего тренда в восходящий.
          </div>
        </div>
        <div>
          <div class="title-indicator">2. Процентный диапазон Уильямса (William’s % R)</div>
          <div class="text-indicator">
            Процентный диапазон Уильямса (%R) – это динамический индикатор осцилляторного (опережающего) типа,
             определяющий состояния перекупленности/ перепроданности.<br /><br />
             Формула:
             %R = ((HN - C)/(HN - LN))*(-100) , где С – цена закрытия сегодня, HN – максимальная цена за N периодов, LN – минимальная цена за N периодов.
             <br /><br />
             Интерпретация:
             Основным сигнальным фактором здесь также является расхождение в областях перекупленности и перепроданности, или так называемые дивергенции.
              Для построения индикатора %R в перевернутой шкале его значениям обычно присваивается отрицательный знак (например -30%). Значения индикатора в диапазоне от -80% до -100% указывают на состояние перепроданности.
               Значения в диапазоне от -0% до -20% свидетельствуют о том, что рынок перекуплен.
          </div>
        </div>

        <div>
          <div class="title-indicator">3. Тенденция Цены и Объема (Price and Volume Trend)</div>
          <div class="text-indicator">
            PVT добавляет или вычитает часть ежедневного объёма. Сумма объёма, добавленного или вычитаемого в/из общей суммы PVT,
             зависит от суммы роста или падения текущего дня по сравнению с закрытием предыдущего дня. Ценовая динамика цен (PVT) в первую очередь может использоваться
              для подтверждения тенденций, а также для выявления возможных торговых сигналов из-за расхождений.<br /><br />
             Формула: PVTt = PVT(t-1) + ((Pt - P(t-1))/P(t-1))*V, где Pt – текущая цена закрытия, P(t−1) – цена закрытия предыдущего дня,
             Vt – объем торгов.<br /><br />
             Интерпретация: Когда тенденция PVT меняется на восходящую или нисходящую, происходит так называемый «прорыв». Поскольку прорывы 
             индикатора обычно предшествуют ценовым прорывам, инвесторам следует занимать длинные позиции, т.е. покупать при прорывах PVT вверх и соответственно продавать в случае прорыва PVT вниз.
              Открытые позиции нужно сохранять до тех пор, пока направление тенденции не изменится.
          </div>
        </div>

        <div>
          <div class="title-indicator">4. Балансовый объем (Оn Вalance Volume)</div>
          <div class="text-indicator">
           Балансовый объем (ОВV) − это динамический индикатор, соотносящий объем торгов и изменение цены.<br /><br />
           Формула:
           Если Pt > Pt-1, то OBVt=OBVt-1+Vt.
          Если Pt {{symb}} Pt-1, то OBVt=OBVt-1−Vt.
          Если Pt = Pt-1, то OBVt=OBVt-1 , где Pt – текущая цена закрытия,
          Pt-1 – цена закрытия предыдущего дня,
          Vt – объем торгов.
          OBVt − значение индикатора OBV в текущем периоде;
          OBVt-1 − значение индикатора OBV в предыдущем периоде.<br /><br />
          Интерпретация:
          OBV основана на принципе, что изменения OBV опережают ценовые.
           Согласно этому принципу, повышение балансового объема свидетельствует о том, что в ценную бумагу
            вкладывают средства профессионалы (smart money). Когда позднее и широкая публика начинает вкладываться в эту бумагу, 
            и цена, и показания индикатора OBV начинают стремительно расти. 
          Когда тенденция OBV меняется на восходящую или нисходящую, происходит так называемый «прорыв». Поскольку прорывы индикатора
           обычно предшествуют ценовым прорывам, инвесторам следует занимать длинные позиции, т.е. покупать при прорывах OBV вверх и 
           соответственно продавать в случае прорыва OBV вниз. Открытые позиции нужно сохранять до тех пор, пока направление тенденции
            не изменится. 
          </div>
        </div>

        
        <div>
          <div class="title-indicator">5. Осциллятор «Момент» (Momentum)</div>
          <div class="text-indicator">
            «Момент» (Momentum) — это один из основных и часто используемых осцилляторов. Этот индикатор измеряет скорость изменения цен.
             Действительно, на ценовом графике мы можем увидеть только рост или падение цены, а также зрительно оценить скорость ее изменения.
              Momentum позволяет измерить скорость роста более точно как разницу между ценами закрытия. Momentum можно рассматривать как меру 
              инерции цен.<br /><br />
              Формула:
              Momentum=С−Сх,
              где С — последняя цена закрытия, 
              Сх — цена закрытия х дней назад.<br /><br />
              Интерпретация:
              Момент может принимать как положительные, так и отрицательные значения. 
              Momentum>0 означает, что цена закрытия находится выше цены закрытия х дней назад, а следовательно, цены растут. 
              Momentum {{sumb}} 0 означает, что цена закрытия меньше цены закрытия х дней назад, а значит, цены убывают. Чем больше положительное или отрицательное значение Momentum по абсолютной величине, тем более быстрое движение цен происходит.

          </div>
        </div>
      </div>

  </div>
</template>

<script src="./App.js" lang="js"></script>

<style src="./App.css"></style>

<style src="./assets/css/normalize.css"></style>
