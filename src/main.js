import 'materialize-css/dist/css/materialize.min.css';
import 'font-awesome/css/font-awesome.min.css';

import Vue from 'vue';
import App from './App';


Vue.filter('hashrate', (value) => {
  let unit = 'Mh/s';
  let hashrate = parseFloat(value);

  if (hashrate > 1024) {
    unit = 'Gh/s';
    hashrate /= 1024;

    if (hashrate > 1024) {
      unit = 'Th/s';
      hashrate /= 1024;

      if (hashrate > 1024) {
        unit = 'Ph/s';
        hashrate /= 1024;
      }
    }
  }

  return `${hashrate.toFixed(2)} ${unit}`;
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
});
