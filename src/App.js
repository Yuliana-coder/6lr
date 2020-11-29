import TradingVue from "trading-vue-js";

export default {
  name: "App",
  components: {
    TradingVue,
  },
  data() {
    return {
      chart: {
        chart: null,
      },
      nRSI: 3,
      ohlcvData: null,
      indicatorType: "Индикаторы",
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
        settings: {},
        grid: {},
      },
      offchart: [
        {
          name: "nnnn, 50",
          type: "Spline",
          data: [
            [1587272400000, 7131],
            [1587276000000, 7132.49],
            [1587279600000, 7133.55],
            [1587283200000, 7134.67],
            [1587286800000, 7136.67],
            [1587290400000, 7138.17],
            [1587294000000, 7139.46],
            [1587297600000, 7140.6],
            [1587301200000, 7139.5],
            [1587304800000, 7138.56],
          ],
          settings: { color: "red" },
        },
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
    },
    setFormatData() {
      this.getArrayData().then(() => {
        this.chart.chart.data = this.ohlcvData.splice(0, 800);
        this.$forceUpdate();
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
        this.setRSI();
      }
    },
    async setRSI() {
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
      this.chart.offchart = [];
      this.chart.offchart.push({
        name: "nnnn, 50",
        type: "Spline",
        data: generalRSIdata,
        settings: { color: "red" },
      });
    },
  },
};
