export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const request = (options: any) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

const urlParams = (params: any) => {
  console.log("Parameterizing", Object.entries(params));
  return Object.entries(params).reduce(
    (url, [key, value]) =>
      value
        ? url === ""
          ? `?${key}=${value}`
          : `${url}&${key}=${value}`
        : url,
    ""
  );
};

export function clearAccessTokens() {
  localStorage.removeItem("ACCESS_TOKEN");
}

export function login(data: { username: string; password: string }) {
  return request({
    url: API_BASE_URL + "/auth/login",
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function claims(data: { username: string; password: string }) {
  return request({
    url: API_BASE_URL + "/claims?" + urlParams(data),
    method: "POST",
    body: JSON.stringify(data),
  });
}
