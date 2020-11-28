import TradingVue from "trading-vue-js";
import Data from "./data.json";
import Data1 from "./data1.json";

export default {
  name: "App",
  components: {
    TradingVue,
  },
  data() {
    return {
      chart: Data,
      chart1: Data1,
      typeChart: false,
    };
  },
};
