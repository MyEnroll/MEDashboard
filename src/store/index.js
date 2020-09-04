import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		darkTheme: false,
		account_name: '',
		account_number: ''
	},
	mutations: {
		setDarkTheme(state, payload) {
			state.darkTheme = payload;
		},
		setAccountName(state, payload) {
			state.account_name = payload;
		},
		setAccountNum(state, payload) {
			state.account_number = payload;
		},
	},
	actions: {
		setDarkTheme(state, payload) {
			state.commit('setDarkTheme', payload.theme);
		},
		setAccountName(state, payload) {
			state.commit('setAccountName', payload.name);
		},
		setAccountNum(state, payload) {
			state.commit('setAccountNumber', payload.acct);
		},
	},
	getters: {
		darkTheme(state) {
			return state.darkTheme;
		},
		accountName(state) {
			return state.account_name
		},
		accountNumber(state) {
			return state.account_number
		}
	},
	modules: {},
});