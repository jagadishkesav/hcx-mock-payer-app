import { useRecoilState } from "recoil";

import { authAtom } from "../state/auth";

import * as Api from "../../api/api";
import { navigate } from "raviger";
import { toast } from "react-toastify";
import * as _ from 'lodash';
import { useDispatch } from 'react-redux'
import { addParticipantToken } from "../../reducers/token_reducer";
import { addParticipantDetails } from "../../reducers/participant_details_reducer";

export function useAuthActions() {
  const [auth, setAuth] = useRecoilState(authAtom);
  const dispatch = useDispatch();

  return {
    login: login,
    loginApi: temp_login,
    logout,
    currentUser,
  };

  function temp_login(username: string, password: string) {
    setAuth(() => ({
      username: "username",
      token: "access_token",
      isAuthenticated: "true",
    }));
    toast("Logged in successfully", { type: "success" });
  }

  function login(username: string, password: string) {
    return Api.login({ username, password }).then(async(res: any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      console.log("keycloak response", res);
      dispatch(addParticipantToken(res.access_token));
      setAuth({
        username: username,
        token: res.access_token,
        isAuthenticated: "true",
      });
      Api.participantDetails({primaryEmail: username}).then((resp) => {
        console.log("participant search response", resp);
        const participant = _.get(resp, 'participants')[0] || {}
        dispatch(addParticipantDetails(participant));
        if(Object.entries(participant).length == 0){
          Api.participantDetailsByCode({participant_code:username}).then((res) => {
            const participant2 = _.get(res, 'participants')[0] || {}
            dispatch(addParticipantDetails(participant2));
          })
        }
      })
      navigate("/")
    });
  }

  function logout() {
    localStorage.clear()
    setAuth(() => ({
      isAuthenticated: "false",
      token: null,
    }));

    navigate("/");
  }

  function currentUser() {
    return auth;
  }
}
