import axios from "axios";
import router from "@/router/index";
import store from "@/store/index";

import { TokenService, TOKEN_STRING } from "./storage.service";

import {
  interceptorRequest,
  interceptorRequestError,
} from "./interceptors/request";
import { interceptorResponse } from "./interceptors/response";

const headers = {
  // "Access-Control-Allow-Origin": "*",
};

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  headers: headers,
});

let resInterceptor;

const createAxiosResponseInterceptor = () => {
  httpClient.interceptors.response.handlers = [];
  resInterceptor = httpClient.interceptors.response.use(
    interceptorResponse,
    interceptorResponseError
  );
};

const manageError = (error) => {
  if (
    error.response.status == null ||
    error.response.status == 0 ||
    error.response.status == undefined
  ) {
    return { data: { myMessage: error.message }, status: 0 };
  }

  if (error.response.status != 400) {
    return { data: { myMessage: error.message }, status: 0 };
  }

  const { data, status } = error.response || {};

  const result = {
    data: { ...data, myMessage: data.message || data.title },
    status: status,
  };

  if (error.response.data?.type === "application/json") {
    const data = error.response.data;

    result["dataBlob"] = data;
  }

  return { ...result };
};

const interceptorResponseError = async (error) => {
  console.log("resInterceptor:ERROR", error);

  if (error.response === undefined) {
    console.log("error.response", error.response);
    return Promise.reject(error);
  }

  // Reject promise if usual error
  if (error.response && error.response.status !== 401) {
    console.log("error.response.status", error.response.status);

    return Promise.reject(manageError(error));
  }

  /*
   * When response code is 401, try to refresh the token.
   * Eject the interceptor so it doesn't loop in case
   * token refresh causes the 401 response
   */
  httpClient.interceptors.response.eject(resInterceptor);

  const refreshToken =
    store.state.account && store.state.account.user
      ? store.state.account.user.refreshToken
      : null;
  const getRefresh = TokenService.getRefreshToken();

  const data = {
    refreshToken: getRefresh || refreshToken,
  };

  const newToken = await axios
    .post(process.env.VUE_APP_BASE_API + "account/RefreshToken", data)
    .then(
      async (response) => {
        if (response && response.data) {
          const data = response.data.data;
          const { accessToken, refreshToken } = data;

          if (accessToken && refreshToken) {
            TokenService.saveToken(accessToken);
            TokenService.saveRefreshToken(refreshToken);

            store.commit("account/loginSuccess", {
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
            error.response.config.headers["Authorization"] =
              TOKEN_STRING + " " + accessToken;
          }
        }

        return error;
      },
      (error) => {
        //call refresh token failed
        console.log("http-response-error", error);

        //clear token, vuex account
        TokenService.removeToken();
        TokenService.removeRefreshToken();
        store.commit("account/logoutSuccess");

        //redirect to login page
        router.push({ name: "Login" });
        return Promise.reject(error);
      }
    )
    .then(
      async (res) => {
        const axiosResponse = await axios.request(res.response.config).then(
          (response) => {
            return Promise.resolve(response.data);
          },
          (error) => {
            return Promise.reject(manageError(error));
          }
        );
        return axiosResponse;
      },
      (error) => {
        return Promise.reject(manageError(error));
      }
    )
    .finally(createAxiosResponseInterceptor);

  return newToken;
};

httpClient.interceptors.request.use(
  interceptorRequest,
  interceptorRequestError
);

resInterceptor = httpClient.interceptors.response.use(
  interceptorResponse,
  interceptorResponseError
);

export default httpClient;
