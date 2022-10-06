import { TokenService, TOKEN_STRING } from "./storage.service";
import store from "@/store/index";

export default function authHeader() {
  const accessToken =
    store.state.account && store.state.account.user
      ? store.state.account.user.accessToken
      : null;

  const _accessToken = TokenService.getToken() || accessToken;

  if (_accessToken) {
    return { Authorization: TOKEN_STRING + " " + _accessToken };
  } else {
    return {};
  }
}
