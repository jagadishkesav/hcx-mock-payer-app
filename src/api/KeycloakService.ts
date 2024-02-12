import { get, post, put } from '../utils/HttpUtil';
import qs from 'qs';

window.console.log("react env",process.env);
const hcxUrl = process.env.REACT_APP_HCX_BASE_URL;

export async function generateToken(username: string | undefined, password: string | undefined){
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = {
        'client_id': "registry-frontend",
        'username': username, 
        'password': password, 
        'grant_type': 'password'
    }

    return new Promise((resolve, reject) => {
        post(`${hcxUrl}/auth/realms/swasth-health-claim-exchange/protocol/openid-connect/token`, body, headers)
        .then(function (response: { data: { access_token: any; }; }) {
            const accessToken = response.data.access_token;
            resolve(accessToken);
          })
          .catch(function (error: any) {
            console.error(error);
            reject(error);
          });
      });
}




