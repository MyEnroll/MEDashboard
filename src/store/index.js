import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

Vue.use(Vuex);
Vue.config.devtools =
	location.href.indexOf('bastest.com') > -1 ||
	location.href.indexOf('localhost') > -1 ?
	true :
	false;

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
		setAccountNumber(state, payload) {
			state.account_number = payload;
		},
	},
	actions: {
		setDarkTheme(state, payload) {
			state.commit('setDarkTheme', payload.theme);
		},
		setChosenAcct(state, payload) {
			state.commit('setAccountNumber', payload.acct);
			state.commit('setAccountName', payload.name);
			axios.post('/web_projects/MainHomePage/WebMethods.aspx/SetAccountSelectedSession', {
				selected_account_num: payload.acct,
				display_account: ''
			})
		}
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