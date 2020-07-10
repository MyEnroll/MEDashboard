import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire';

Vue.use(firestorePlugin);
Vue.config.devtools =
	location.href.indexOf('bastest.com') > -1 ||
	location.href.indexOf('localhost') > -1
		? true
		: false;

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
