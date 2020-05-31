import Vue from 'vue';
import VueRouter from 'vue-router';
import theLanding from '../views/theLanding.vue';

Vue.use(VueRouter);

export default new VueRouter({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: theLanding,
		},
		{
			path: '/aca',
			name: 'ACA',
			component: () =>
				import(
					/* webpackChunkName: "aca_dashboard" */ '../views/acaDashboard.vue'
				),
		},
		{
			path: '/cobra',
			name: 'COBRA',
			component: () =>
				import(
					/* webpackChunkName: "cobra_dashboard" */ '../views/cobraDashboard.vue'
				),
		},
	],
});
