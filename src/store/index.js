import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "web_account",
      paths: ["account"],
      // storage: window.sessionStorage
      // storage: {
      //   getItem: key => ls.get(key),
      //   setItem: (key, value) => ls.set(key, value),
      //   removeItem: key => ls.remove(key)
      // }
    }),
  ],
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
