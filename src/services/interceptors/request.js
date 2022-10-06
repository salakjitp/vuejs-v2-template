import authHeader from "@/services/auth-header";

export const interceptorRequest = (request) => {
  // set header token
  const auth = authHeader();
  if (auth && auth.Authorization) {
    request.headers["Authorization"] = auth.Authorization;
  }

  return request;
};

export const interceptorRequestError = (error) => {
  return Promise.reject(error);
};
