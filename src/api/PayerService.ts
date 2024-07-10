import _ from 'lodash';
import { post, postPath } from './APIService';
import { store } from '../store';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const HCX_BASE_URL = process.env.REACT_APP_HCX_BASE_URL;
export const HCX_MOCK_SERVICE_URL = process.env.REACT_APP_HCX_MOCK_SERVICE_URL;


export const listRequest = async (type: string, token="") => {
    var payload = { type:type, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"), days: 100 };
    return postPath(API_BASE_URL + "/request/list", payload, {}, token);
}

export const listRequestById = async (type: string, request_id:string, token="") => {
    var payload = { type:type, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"), days: 100 };
    return postPath(API_BASE_URL  + `/request/list/?request_id=${request_id}`, payload, {}, token);
}

export const listForwardResponse = async (type: string, correlation_id:string, token="") => {
    var payload = { type:type, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"), days: 100 };
    return postPath(API_BASE_URL  + `/request/list/?correlation_id=${correlation_id}`, payload, {}, token);
}

export const listRequestStats = async (token="") => {
    var payload = {recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"), days: 100 };
    return postPath(API_BASE_URL + "/request/stats", payload, {}, token);
}

export const updateResponse = async (data: { request_id: string; response_fhir: string }, token="") => {
    var payload = data;
    return postPath(API_BASE_URL + "/response/update", payload, {}, token);
}

export const approveCoverageEligibilityRequest = async (requestId:string, token="") => {
    var payload = { request_id:requestId, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code")};    
    return postPath(API_BASE_URL + "/coverageeligibility/approve", payload, {}, token);
}

export const rejectCoverageEligibilityRequest = async (requestId:string, token="") => {
    var payload = { request_id:requestId, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code")};    
    return postPath(API_BASE_URL + "/coverageeligibility/reject", payload, {}, token);
}

export const approveClaim = async (requestId:string, type:string, remarks:string,approved_amount:number,token="",url:string) => {
    var payload = { request_id:requestId, type:type,remarks:remarks,approved_amount:approved_amount, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code")};    
    return postPath(API_BASE_URL + url, payload, {}, token);
}

export const rejectClaim = async (requestId:string,type:string ,token="",url:string) => {
    var payload = { request_id:requestId, type:type,recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code")};    
    return postPath(API_BASE_URL + url, payload, {}, token);
}

export const listBeneficiary = async (searchField:string, searchValue:string, token="") => {
    var payload = {[searchField]:searchValue, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code")};
    return postPath(API_BASE_URL+ "/beneficiary/request/list", payload, {}, token);
}

export const listNotification = async (token="") => {
    var payload = {recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code")};
    return postPath(API_BASE_URL+ "/notification/request/list", payload, {}, token);
}


export const listCommunication = async (correlation_id:string ,token="") => {
    var payload = {correlation_id: correlation_id};
    return postPath(API_BASE_URL+ "/communication/request/list", payload, {}, token);
}


export const forwardRequest = async (recipient_code:string, sender_code:string,correlation_id:string,operation:string,request_fhir:string, token="") => {
    var payload = {recipient_code,sender_code,correlation_id,operation,request_fhir};
    return postPath(API_BASE_URL+ "/request/forward", payload, {}, token);
}

export const sendCommunicationRequest = async (
    request_id: string,
    type: string,
    participantCode:string,
    password:string,
    recipientCode:string,
    text="",
    token="") => {
    var payload = {}
    if(text !== ""){
      payload = { request_id:request_id, type:type,recipientCode: recipientCode, participantCode:participantCode, password:password, text:text};        
    }else{
      payload = { request_id:request_id, type:type,recipientCode: recipientCode, participantCode:participantCode, password:password};}    
    return postPath(HCX_MOCK_SERVICE_URL + "/create/communication/request", payload, {}, token);
  }



