import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		darkTheme: false,
	},
	mutations: {
		setDarkTheme(state, payload) {
			state.darkTheme = payload;
		},
	},
	actions: {
		setDarkTheme(state, payload) {
			state.commit('setDarkTheme', payload.theme);
		},
	},
	getters: {
		darkTheme(state) {
			return state.darkTheme;
		},
	},
	modules: {},
});
