const state = {
  config: {
    isPageLoading: false,
  },
};

const mutations = {
  setPageLoading(state, isPageLoading) {
    state.config.isPageLoading = isPageLoading;
  },
};

const getters = {
  isPageLoading() {
    return state.config.isPageLoading;
  },
};

export default {
  state,
  mutations,
  getters,
};
