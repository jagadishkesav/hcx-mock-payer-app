import _ from "lodash";
import { store } from "../store";
import { Participant } from "./token";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const HCX_BASE_URL = process.env.REACT_APP_HCX_BASE_URL;
export const HCX_MOCK_SERVICE_URL = process.env.REACT_APP_HCX_MOCK_SERVICE_URL;


const request = (options: any) => {
  const headers = new Headers({
    ...options.headers,
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


const formRequest = (options: any) => {

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.text().then((text) => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
          message: text
        };
        return Promise.reject(error);
      }
      const data = text ? JSON.parse(text) : {};
      return data;
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

const formData = new URLSearchParams();
  formData.append('client_id', 'registry-frontend');
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('grant_type', 'password');

  return formRequest({
    url: HCX_BASE_URL + "/auth/realms/swasth-health-claim-exchange/protocol/openid-connect/token",
    method: "POST",
    body: formData,
  });
}

export function claims(data: { username: string; password: string }) {
  return request({
    url: API_BASE_URL + "/claims?" + urlParams(data),
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function participantDetails(data: { primaryEmail: string }) {
  const reqBody = { filters: { primary_email: { 'eq': data.primaryEmail}}};
  return request({
    url: HCX_BASE_URL + "/api/v0.7/participant/search",
    method: "POST",
    body: JSON.stringify(reqBody),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function listRequest(data: { type: string }) {
  return request({
    url: API_BASE_URL + "/request/list",
    method: "POST",
    body: JSON.stringify({
      type: data.type,
      recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
      days: 10
    }),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function approveCoverageEligibilityRequest(data: {
  request_id: string;
}) {
  const newData = {
    ...data,
    recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
  };
  return request({
    url: API_BASE_URL + "/coverageeligibility/approve",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function rejectCoverageEligibilityRequest(data: { request_id: string }) {
  const newData = {
    ...data,
    recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
  };
  return request({
    url: API_BASE_URL + "/coverageeligibility/reject",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function approvePreauth(data: {
  request_id: string;
  type: string;
  remarks: string;
  approved_amount: number;
}) {
  const newData = {
    ...data,
    recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
  };
  return request({
    url: API_BASE_URL + "/preauth/approve",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function sendCommunicationRequest(data: {
  request_id: string;
  type: string;
}) {
  const newData = {
    ...data,
  };
  return request({
    url: HCX_MOCK_SERVICE_URL + "/create/communication/request",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}



export function rejectPreauth(data: { request_id: string; type: string }) {
  const newData = {
    ...data,
    recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
  };
  return request({
    url: API_BASE_URL + "/preauth/reject",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function approveClaim(data: {
  request_id: string;
  type: string;
  remarks: string;
  approved_amount: number;
}) {
  const newData = {
    ...data,
    recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
  };
  return request({
    url: API_BASE_URL + "/claim/approve",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function rejectClaim(data: { request_id: string; type: string }) {
  const newData = {
    ...data,
    recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"),
  };
  return request({
    url: API_BASE_URL + "/claim/reject",
    method: "POST",
    body: JSON.stringify(newData),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}

export function updateResponse(data: { request_id: string; response_fhir: string }) {
  return request({
    url: API_BASE_URL + "/response/update",
    method: "POST",
    body: JSON.stringify(data),
    headers:{
      "Authorization": "Bearer " + store.getState().tokenReducer.participantToken,
      "Content-Type": "application/json"
    }
  });
}
