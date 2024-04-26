import { post } from './APIService';

export const getParticipantByCode = async (code:any, token="") => {
    var payload = { "filters": { "participant_code": { "eq":  code} } };
    return post("/participant/search", payload, {}, token);
}

