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
			displayName: 'ACA',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
				import(
					/* webpackChunkName: "aca_dashboard" */ '../views/acaDashboard.vue'
				),
		},
		{
			path: '/cobra',
			name: 'COBRA',
			displayName: 'COBRA/COVID',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
				import(
					/* webpackChunkName: "cobra_dashboard" */ '../views/cobraDashboard.vue'
				),
		},
	],
});
