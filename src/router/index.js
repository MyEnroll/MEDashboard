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
			name: 'ACA Issues',
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
		{
			path: '/fsa',
			name: 'FSA Processing',
			component: () =>
				import(
					/* webpackChunkName: "fsa_dashboard" */ '../views/fsaProcessing.vue'
				),
		},
		{
			path: '/oe',
			name: 'Open Enrollment',
			component: () =>
				import(/* webpackChunkName: "OE_Dashboard" */ '../views/oeStats.vue'),
		},
	],
});
