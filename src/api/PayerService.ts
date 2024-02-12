import _ from 'lodash';
import { post, postPath } from './APIService';
import { store } from '../store';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const HCX_BASE_URL = process.env.REACT_APP_HCX_BASE_URL;
export const HCX_MOCK_SERVICE_URL = process.env.REACT_APP_HCX_MOCK_SERVICE_URL;


export const listRequest = async (type: string, token="") => {
    var payload = { type:type, recipient_code: _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code"), days: 10 };
    return postPath(API_BASE_URL + "/request/list", payload, {}, token);
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



