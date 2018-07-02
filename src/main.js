import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

window.vm = new Vue({
  render: h => h(App),
}).$mount('#app');
