import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');

const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () {
            return EventBus
        }
    }
});
