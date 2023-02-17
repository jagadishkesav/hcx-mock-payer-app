import { claimslistres, coverageeligibilitylistres, preauthlistres } from "./dummyresponse";

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

export function listRequest(data: {type: string}) {
  if (data.type === "coverageeligibility") {
    return coverageeligibilitylistres;
  }
  if (data.type === "claim") {
    return claimslistres;
  }
  if (data.type === "preauth") {
    return preauthlistres;
  }
  // return request({
  //   url: API_BASE_URL + "/request/list",
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });
}


export function approveCoverageEligibilityRequest(data: { identifier: string }) {
  return request({
    url: API_BASE_URL + "/coverageeligibility/approve",
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function rejectCoverageEligibilityRequest(data: { identifier: string }) {
  return request({
    url: API_BASE_URL + "/coverageeligibility/reject",
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function approvePreauth(data: { identifier: string, type: string }) {
  return request({
    url: API_BASE_URL + "/payer/preauth/approve",
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function rejectPreauth(data: { identifier: string, type: string }) {
  return request({
    url: API_BASE_URL + "/payer/preauth/reject",
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function approveClaim(data: { identifier: string, type: string }) {
  return request({
    url: API_BASE_URL + "/payer/claim/approve",
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function rejectClaim(data: { identifier: string, type: string }) {
  return request({
    url: API_BASE_URL + "/payer/claim/reject",
    method: "POST",
    body: JSON.stringify(data),
  })
}