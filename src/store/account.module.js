import AccountService from "@/services/api/account.service";

const user = {
  accessToken: null,
  refreshToken: null,
};

const initialState = {
  user: { ...user },
  userInfo: {},
};

const actions = {
  login({ commit }, data) {
    return AccountService.login(data).then(
      (res) => {
        if (res) {
          const { accessToken, refreshToken } = { ...res };
          const user = {
            accessToken: accessToken,
            refreshToken: refreshToken,
          };

          commit("loginSuccess", user);
          return Promise.resolve(true);
        } else {
          commit("loginFailure");
          return Promise.resolve(undefined);
        }
      },
      (error) => {
        commit("loginFailure");
        return Promise.reject(error);
      }
    );
  },
  userInfo({ commit }) {
    return AccountService.getAccountProfile().then(
      (res) => {
        commit("setUserInfo", res);
        return Promise.resolve(res);
      },
      (error) => {
        commit("setUserInfo", {});
        return Promise.reject(error);
      }
    );
  },
  logout({ commit }) {
    return AccountService.logout().then(
      (res) => {
        commit("logoutSuccess");
        return Promise.resolve(res);
      },
      (error) => {
        commit("logoutFailure");
        return Promise.reject(error);
      }
    );
  },
};

const mutations = {
  loginSuccess(state, user) {
    state.user = { ...user };
  },
  loginFailure(state) {
    state.userInfo = {};
    state.user = {};
  },
  logoutSuccess(state) {
    state.userInfo = {};
    state.user = {};
  },
  logoutFailure(state) {
    state.userInfo = {};
    state.user = {};
  },
  setUserInfo(state, detail = {}) {
    state.userInfo = { ...detail };
  },
};

export const account = {
  namespaced: true,
  state: initialState,
  actions,
  mutations,
};
