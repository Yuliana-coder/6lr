import TradingVue from "trading-vue-js";
import ColourPicker from "vue-colour-picker";
import Vue from "vue";

Vue.component("ColourPicker", ColourPicker);

export default {
  name: "App",
  components: {
    TradingVue,
    "colour-picker": ColourPicker,
  },
  data() {
    return {
      diagramColor: "green",
      chart: {
        chart: null,
      },
      nRSI: 3,
      nWilliams: 3,
      isShowPopupRSI: false,
      isError: false,
      isShowPopupWilliams: false,
      isShowPopupMomentum: false,
      //   isShowEditData: false,
      nMomentum: 3,
      ohlcvData: null,
      indicatorType: "Индикаторы",
      isNotDrawDiagram: true,
      isShowEditDiagramPopup: false,
      lineThickness: 1,
      editLine: "diagram",
    };
  },
  beforeMount() {
    this.chart = {
      chart: {
        name: "Example",
        type: "Spline",
        data: [
          [1587272400000, 7240.1, 7240.2, 7120, 7131, 709.93],
          [1587276000000, 7130.96, 7174, 7120, 7169.1, 485.44],
          [1587279600000, 7169.1, 7170, 7134.9, 7159.5, 174.1],
          [1587283200000, 7159.1, 7169.5, 7136, 7162.06, 129.79],
          [1587286800000, 7161.7, 7205, 7150, 7185.6, 118.13],
          [1587290400000, 7185.77, 7195.1, 7166.7, 7175.01, 141.86],
          [1587294000000, 7175.1, 7175.1, 7149.1, 7170.98, 119.36],
          [1587297600000, 7171.2, 7179.89, 7159.8, 7168.7, 207.99],
          [1587301200000, 7168.7, 7168.8, 7085, 7112.4, 448.23],
          [1587304800000, 7112.03, 7123, 7056.9, 7115.5, 419.09],
        ],
        settings: { color: this.diagramColor, lineWidth: 1 },
        grid: {},
      },
      onchart: [
        {
          type: "Spline",
          data: [
            // [1587272400000, 7120.93],
            // [1587276000000, 7130.96],
            // [1587279600000, 7134.1],
            // [1587283200000, 7150.1],
            // [1587286800000, 7175.7],
            // [1587290400000, 7195.77],
            // [1587294000000, 7150.1],
            // [1587297600000, 7150.2],
            // [1587301200000, 7150.7],
            // [1587304800000, 7150.03],
          ],
          settings: {
            upper: 70,
            lower: 30,
            backColor: "#9b9ba316",
            color: "red",
          },
        },
      ],
      offchart: [
        // {
        //   type: "Spline",
        //   data: [
        //     [1587272400000, 7400.1],
        //     [1587276000000, 7300.96],
        //     [1587279600000, 7690.1],
        //     [1587283200000, 7590.1],
        //     [1587286800000, 7601.7],
        //     [1587290400000, 7850.77],
        //     [1587294000000, 7750.1],
        //     [1587297600000, 7701.2],
        //     [1587301200000, 7680.7],
        //     [1587304800000, 7120.03],
        //   ],
        //   settings: { color: "black" },
        // },
      ],
    };
  },
  methods: {
    changeFormatDate(dat, tim) {
      // dat = "20200901";
      // tim = "110000";
      if (tim === "0") {
        tim = "000000";
      }
      let dateFormat = new Date(
        String(dat).substr(0, 4),
        String(Number(String(dat).substr(4, 2)) + 1),
        String(dat).substr(6, 2),
        String(tim).substr(0, 2),
        String(tim).substr(2, 2),
        String(tim).substr(4, 2)
      );
      return dateFormat.getTime() + 18000000;
    },
    inputFile(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      let arrData = [];

      reader.onload = function(e) {
        var text = e.target.result;
        var array = text.split("\n");

        for (var i = 1; i < array.length; i++) {
          arrData.push(array[i]);
        }
      };
      this.ohlcvData = arrData;

      reader.readAsText(file);
      this.isNotDrawDiagram = false;
    },
    setFormatData() {
      this.getArrayData().then(() => {
        this.chart.chart.data = this.ohlcvData.splice(0, 800);
        this.$forceUpdate();
        this.isNotDrawDiagram = true;
      });
    },
    async getArrayData() {
      let dataArray = await this.ohlcvData.map((item) => {
        return item.split(",");
      });
      await dataArray.forEach((element) => {
        element.splice(0, 2);
        let dat = element[0];
        let tim = element[1];
        element.splice(0, 2);
        element.unshift(this.changeFormatDate(dat, tim));
      });

      dataArray = await dataArray.map((item) => {
        return (item = item.map((element) => {
          return Number(element);
        }));
      });
      this.ohlcvData = await dataArray;
    },
    inputIndicator() {
      if (this.indicatorType === "RSI") {
        this.isShowPopupRSI = true;
      }
      if (this.indicatorType === "williams") {
        this.isShowPopupWilliams = true;
      }
      if (this.indicatorType === "PVT") {
        this.setPVT();
      }
      if (this.indicatorType === "OBV") {
        this.setOBV();
      }
      if (this.indicatorType === "Momentum") {
        this.isShowPopupMomentum = true;
      }
    },
    async setRSI() {
      if (this.nRSI) {
        this.isShowPopupRSI = false;
        this.isError = false;
        let generalRSIdata = [];
        let arrayOfGroup = [];
        let arr = [...this.chart.chart.data];
        for (let i = 0; i <= arr.length; i++) {
          let newarr = [];
          for (let j = 1; j < this.nRSI + 1; j++) {
            if (i - j >= 0) {
              newarr.push(arr[i - j]);
            }
          }
          arrayOfGroup.push(newarr);
        }

        arrayOfGroup.forEach((element) => {
          let upCandles = 0;
          let downCadles = 0;
          element.forEach((item) => {
            if (item[1] < item[4]) {
              upCandles = upCandles + 1;
            } else {
              downCadles = downCadles + 1;
            }
          });
          let rsiValue = (upCandles / (upCandles + downCadles)) * 100;
          if (element[0] && element[0][0]) {
            generalRSIdata.push([element[0][0], rsiValue]);
          }
        });
        this.chart.offchart.push({
          name: "RSI",
          type: "Spline",
          data: generalRSIdata,
          settings: { color: "red", lineWidth: 1 },
        });
      } else {
        this.isError = true;
      }
    },
    setWilliams() {
      if (this.nWilliams) {
        this.isShowPopupWilliams = false;
        this.isError = false;
        let generalWilliamsdata = [];
        let arrayOfGroup = [];
        let arr = [...this.chart.chart.data];
        for (let i = 0; i <= arr.length; i++) {
          let newarr = [];
          for (let j = 1; j < this.nWilliams + 1; j++) {
            if (i - j >= 0) {
              newarr.push(arr[i - j]);
            }
          }
          arrayOfGroup.push(newarr);
        }

        arrayOfGroup.forEach((element) => {
          let arrayOfClosePrice = [];
          element.forEach((item) => {
            arrayOfClosePrice.push(item[4]);
          });

          if (element[0] && element[1] && element[0][0]) {
            let williamsValue =
              ((Math.max(...arrayOfClosePrice) - element[0][4]) /
                (Math.max(...arrayOfClosePrice) -
                  Math.min(...arrayOfClosePrice))) *
              -100;
            generalWilliamsdata.push([element[0][0], williamsValue]);
          }
        });

        this.chart.offchart.push({
          name: "Williams",
          type: "Spline",
          data: generalWilliamsdata,
          settings: { color: "blue", lineWidth: 1 },
        });
      } else {
        this.isError = true;
      }
    },
    setPVT() {
      let generalPVTdata = [];
      let preP = 0;
      let dataArray = [...this.chart.chart.data];
      let PVT = 0;
      for (let i = 1; i < dataArray.length; i++) {
        if (i - 1 >= 0) {
          preP = dataArray[i - 1][4];
        }
        PVT = PVT + ((dataArray[i][4] - preP) / preP) * dataArray[i][5];
        generalPVTdata.push([dataArray[i][0], PVT]);
      }
      this.chart.offchart.push({
        name: "PVT",
        type: "Spline",
        data: generalPVTdata,
        settings: { color: "black", lineWidth: 1 },
      });
    },
    setOBV() {
      let generaOBVTdata = [];
      let dataArray = [...this.chart.chart.data];
      let obv = 0;
      for (let i = 1; i < dataArray.length; i++) {
        if (dataArray[i][4] > dataArray[i - 1][4]) {
          obv = obv + dataArray[i][4];
        } else if (dataArray[i][4] < dataArray[i - 1][4]) {
          obv = obv - dataArray[i][4];
        }
        generaOBVTdata.push([dataArray[i][0], obv]);
      }

      this.chart.offchart.push({
        name: "OBV",
        type: "Spline",
        data: generaOBVTdata,
        settings: { color: "#FF4500", lineWidth: 1 },
      });
    },
    setMomentum() {
      if (this.nMomentum) {
        this.isShowPopupMomentum = false;
        this.isError = false;
        let generaMomentumTdata = [];
        let dataArray = [...this.chart.chart.data];
        for (let i = 0; i < dataArray.length; i++) {
          if (i - this.nMomentum >= 0) {
            generaMomentumTdata.push([
              dataArray[i][0],
              dataArray[i][4] - dataArray[i - this.nMomentum][4],
            ]);
          } else {
            generaMomentumTdata.push([
              dataArray[i][0],
              dataArray[i][4] - dataArray[0][4],
            ]);
          }
        }

        this.chart.offchart.push({
          name: "Momentum",
          type: "Spline",
          data: generaMomentumTdata,
          settings: { color: "#00FF00", lineWidth: 1 },
        });
      } else {
        this.isError = true;
      }
    },
    setEditDiagram() {
      if (this.editLine === "diagram") {
        this.chart.chart.settings.color = this.diagramColor;
        this.chart.chart.settings.lineWidth = this.lineThickness;
      } else {
        let dataArray = [...this.chart.offchart];
        [...dataArray].find((element) => {
          return element.name === this.editLine;
        }).settings.color = this.diagramColor;
        [...dataArray].find((element) => {
          return element.name === this.editLine;
        }).settings.lineWidth = this.lineThickness;
      }
    },
  },
  computed: {
    isShowEditData() {
      return this.chart.chart.data.length;
    },
    allIndicators() {
      let dataArray = [...this.chart.offchart];
      dataArray = dataArray.map((element) => {
        return element.name;
      });

      return dataArray;
    },
  },
};
