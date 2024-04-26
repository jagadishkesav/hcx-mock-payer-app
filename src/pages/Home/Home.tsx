import { useNavigate } from "react-router-dom";
import CardsItemThree from "../../components/CardsItemThree";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../store";
import { addAppData } from "../../reducers/app_data";
import { addParticipantToken } from "../../reducers/token_reducer";
import { getParticipantByCode } from "../../api/RegistryService";
import { addParticipantDetails } from "../../reducers/participant_details_reducer";
import { toast } from "react-toastify";

const Home: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);

    useEffect(() => {
        if( sessionStorage.getItem('hcx_user_token') as string == "abcd"){
          navigate("/login");
        }else{
          authToken = sessionStorage.getItem('hcx_user_token') as string;
          dispatch(addAppData({ "username": sessionStorage.getItem('hcx_user_name') as string }));
          dispatch(addAppData({ "password": sessionStorage.getItem('hcx_password') as string }));
          dispatch(addParticipantToken(sessionStorage.getItem('hcx_user_token') as string));
          getParticipantByCode(sessionStorage.getItem('hcx_user_name') as string, authToken).then((res: any) => {
          dispatch(addParticipantDetails(res["data"]["participants"][0]));
        }).catch((error) => {
          toast.error("Something went wrong. Please contact the administrator" || "Internal Server Error", {
            position: toast.POSITION.TOP_RIGHT
          });
        });
        }
      }, []);

    return(
        <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
        <CardsItemThree
          cardTitle="Coverage Eligibility"
          cardContent="Shows the list of Coverage Eligibility requests submitted by a provider"
          cardRedirectURL="/coverageeligibility/list"
        />

        <CardsItemThree
          cardTitle="Pre Authorization"
          cardContent="Shows the list of Pre Authorization requests submitted by a provider"
          cardRedirectURL="/preauth/list"
        />

        <CardsItemThree
          cardTitle="Claims"
          cardContent="Shows the list of Claim requests submitted by a provider"
          cardRedirectURL="/claims/list"
        />
      </div>);
}

export default Home;