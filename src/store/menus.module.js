const menuList = [];

const breadcrumbs = [];

const state = {
  menus: [...menuList],
  breadcrumbs: [...breadcrumbs],
};

export const menus = {
  namespaced: true,
  state,
};
