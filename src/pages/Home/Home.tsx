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
import _ from "lodash";

const Home: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    const [covCardData, setCovCardData] = useState({});
    const [preauthCardData, setPreauthCardData] = useState({});
    const [claimsCardData, setClaimsCardData] = useState({});

    interface DataItem {
      count: number;
      action: string;
      status?: string;
  }
  
  interface DataStructure {
      total: DataItem[];
      totalByStatus: DataItem[];
      lastThreedays: DataItem[];
      [key: string]: DataItem[]; // Allow other similar arrays if needed
  }

  const  aggregateClaims =(data: DataStructure, type:string) => {
    const result: { [key: string]: number } = {};

    // Function to add counts to the result object
    const addToResult = (key: string, count: number) => {
        if (result[key] === undefined) {
            result[key] = 0;
        }
        result[key] += count;
    };

    _.forEach(data, (items, key) => {
        if (items) {
            _.forEach(items, (item) => {
                if (item.action === type) {
                    if (key === 'total') {
                        addToResult('total', item.count);
                    } else if (key === 'lastThreedays') {
                        addToResult('lastThreedays', item.count);
                    } else if (item.status) {
                        addToResult(item.status.toLowerCase(), item.count);
                    }
                }
            });
        }
    });

    return result;
}

    useEffect(() => {
        if( sessionStorage.getItem('hcx_user_token') as string == "abcd" || sessionStorage.getItem('hcx_user_token') == null){
          navigate("/login");
        }else{
          authToken = sessionStorage.getItem('hcx_user_token') as string;
          dispatch(addAppData({ "username": sessionStorage.getItem('hcx_user_name') as string }));
          dispatch(addAppData({ "password": sessionStorage.getItem('hcx_password') as string }));
          dispatch(addParticipantToken(sessionStorage.getItem('hcx_user_token') as string));
          getParticipantByCode(sessionStorage.getItem('hcx_user_name') as string, authToken).then((res: any) => {
          dispatch(addParticipantDetails(res["data"]["participants"][0]));
          listRequestStats(authToken).then((res:any) => {
            setClaimsCardData(aggregateClaims(res.data, "claim"));
            setPreauthCardData(aggregateClaims(res.data, "preauth"));
            setCovCardData(aggregateClaims(res.data, "coverageeligibility"));
          }).catch(err => {
            toast.error("Something went wrong. Please contact the administrator" || "Internal Server Error", {
              position: toast.POSITION.TOP_RIGHT
            });
          });
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