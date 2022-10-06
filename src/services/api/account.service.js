import httpClient from "../httpClient";
import { TokenService } from "../storage.service";

const END_POINT = "account";

class AccountService {
  async login(user) {
    const params = {
      username: user.username,
      password: user.password,
    };

    const config = {
      method: "post",
      url: `${END_POINT}/login`,
      data: params,
    };

    const response = await httpClientPublic(config);

    if (response && response?.data) {
      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        TokenService.saveToken(accessToken);
        TokenService.saveRefreshToken(refreshToken);
      }
    }

    return response.data || {};
  }

  async logout() {
    const params = {
      refreshToken: TokenService.getRefreshToken(),
    };

    const config = {
      method: "post",
      url: `${END_POINT}/logout`,
      data: params,
    };

    const response = await httpClient(config);

    TokenService.removeToken();
    TokenService.removeRefreshToken();

    return response || {};
  }

  async refreshToken() {
    const config = {
      method: "post",
      url: `${END_POINT}/refreshtoken`,
      data: {
        RefreshToken: TokenService.getRefreshToken(),
      },
      headers: {
        Authorization: null,
      },
    };
    const response = await httpClient(config);

    if (response && response.data) {
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        TokenService.saveToken(accessToken);
        TokenService.saveRefreshToken(refreshToken);
      }
    }

    return response.data;
  }

  async getAccountProfile() {
    const config = {
      method: "get",
      url: `${END_POINT}/profile`,
    };

    const response = await httpClient(config);

    return response.data || {};
  }
}

export default new AccountService();
