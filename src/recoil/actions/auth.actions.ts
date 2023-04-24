import { useRecoilState } from "recoil";

import { authAtom } from "../state/auth";

import * as Api from "../../api/api";
import { navigate } from "raviger";
import { toast } from "react-toastify";
import { Participant, SenderCode } from "../../api/token";
import * as _ from 'lodash';

export function useAuthActions() {
  const [auth, setAuth] = useRecoilState(authAtom);

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
      localStorage.setItem("ACCESS_TOKEN", res.access_token);
      setAuth({
        username: username,
        token: res.access_token,
        isAuthenticated: "true",
      });
      Api.participantDetails({primaryEmail: username}).then((resp) => {
        const participant = _.get(resp, 'participants')[0] || {}
        Participant.setParticipant(JSON.stringify(participant));
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
