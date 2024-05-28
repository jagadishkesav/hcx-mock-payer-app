import { useNavigate } from "react-router-dom";
import CardsItemThree from "../../components/CardsItemThree";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../store";
import { addAppData } from "../../reducers/app_data";
import { addParticipantToken } from "../../reducers/token_reducer";
import { getParticipantByCode } from "../../api/RegistryService";
import { addParticipantDetails } from "../../reducers/participant_details_reducer";
import { toast } from "react-toastify";
import { listRequestStats } from "../../api/PayerService";

const Home: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    const [covCardData, setCovCardData] = useState({});
    const [preauthCardData, setPreauthCardData] = useState({});
    const [claimsCardData, setClaimsCardData] = useState({});

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
        let totalClaim = 0;
        let totalPreAuth = 0;
        let totalCoverage = 0;
        listRequestStats(authToken).then((res:any) => {
          console.log("payor table stats ", res);

          res.data.total.map((value:any) => {
            if(value.action == "claim"){
              setClaimsCardData({
                ...claimsCardData, "last3":value.count
              })
            }
            if(value.action == "preauth"){
              setPreauthCardData({
                ...preauthCardData, "last3":value.count
              })
            }
            if(value.action == "coverageeligibility"){
              setCovCardData({
                ...covCardData, "last3":value.count
              })
            }
          });

          res.data.total.map((value:any) => {
            if(value.action == "claim" && value.status == "Pending"){
              console.log(" i came in pending")
              totalClaim = totalClaim + value.count;
              setClaimsCardData({
                ...claimsCardData, "TotalPending":value.count, "TotalValue":totalClaim
              })
            }
            if(value.action == "claim" && value.status != "Pending"){
              totalClaim = totalClaim + value.count;
              setClaimsCardData({
                ...claimsCardData, "TotalValue":totalClaim
              })
            }

            if(value.action == "preauth" && value.status == "Pending"){
              console.log(" i came in pending")
              totalPreAuth = totalPreAuth + value.count;
              setPreauthCardData({
                ...preauthCardData, "TotalPending":value.count, "TotalValue":totalClaim
              })
            }
            if(value.action == "preauth" && value.status != "Pending"){
              totalPreAuth = totalPreAuth + value.count;
              setPreauthCardData({
                ...preauthCardData, "TotalValue":totalClaim
              })
            }

            if(value.action == "coverageeligibility" && value.status == "Pending"){
              console.log(" i came in pending")
              totalCoverage = totalCoverage + value.count;
              setCovCardData({
                ...covCardData, "TotalPending":value.count, "TotalValue":totalClaim
              })
            }
            if(value.action == "coverageeligibility" && value.status != "Pending"){
              totalCoverage = totalCoverage + value.count;
              setCovCardData({
                ...covCardData, "TotalValue":totalClaim
              })
            }
          });
        }).catch(err => {
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
          cardData={covCardData}
        />

        <CardsItemThree
          cardTitle="Pre Authorization"
          cardContent="Shows the list of Pre Authorization requests submitted by a provider"
          cardRedirectURL="/preauth/list"
          cardData={preauthCardData}
        />

        <CardsItemThree
          cardTitle="Claims"
          cardContent="Shows the list of Claim requests submitted by a provider"
          cardRedirectURL="/claims/list"
          cardData={claimsCardData}
        />

        <CardsItemThree
          cardTitle="Beneficiary Search"
          cardContent="Search the beneficiary and list their recent claims submission"
          cardRedirectURL="/beneficiary/search"
        />
      </div>);
}

export default Home;