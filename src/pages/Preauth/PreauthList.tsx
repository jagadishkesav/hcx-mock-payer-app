import { useEffect, useState } from "react";
import { unbundleAs } from "../../utils/fhirUtils";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { listRequest, updateResponse } from "../../api/PayerService";
import _ from "lodash";
import { toast } from "react-toastify";
import CommonDataTable from "../../components/CommonDataTable";
import Loader from "../../common/Loader";
import { Navigate, useNavigate } from "react-router-dom";
import { addAppData } from "../../reducers/app_data";
import ModalEditor from "../../components/ModalEditor";
import { addParticipantToken } from "../../reducers/token_reducer";
import { getParticipantByCode } from "../../api/RegistryService";
import { addParticipantDetails } from "../../reducers/participant_details_reducer";

interface IAdditionalInfo {
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  approved_amount?: number;
  account_number? : number;
  ifsc_code? : string;
}
interface Item {
  unitPrice: {
    currency: string;
    value: number;
  };
  sequence: number;
  productOrService: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
}

interface DiagnosisCoding {
  system: string;
  code: string;
  display: string;
}

interface Diagnosis {
  sequence: number;
  type: { coding: DiagnosisCoding[] }[];
  diagnosisCodeableConcept: {
    coding: DiagnosisCoding[];
    text: string;
  };
}




export type ClaimDetail = {
  sender_code:string;
  recipient_code:string;
  id: string;
  request_id: string;
  request_no: string;
  name: string;
  gender: string;
  provider: string;
  address: string;
  items: Item[];
  diagnosis: Diagnosis[];
  sub_type : string;
  insurance_no: string;
  otp_verification: string;
  requested_amount: string;
  approved_amount: string;
  account_number: string;
  ifsc_code: string;
  status: string;
  medical_info: IAdditionalInfo;
  financial_info: IAdditionalInfo;
  resources: {
    patient: object;
    coverage: object;
    claim: object;
  };
  response_fhir: object;
  use: string;
  platform: string;
};

interface claimProps{
  claimType : "preauth" | "claim"
}


const PreauthList:React.FC<claimProps> = ({claimType}:claimProps) => {

    const[claimUseType, setClaimType] = useState(claimType);
    console.log("claimtype", claimType);

    useEffect(() => {
      console.log("came to reload the claims list component");
    },[claimUseType]);
     const currencyObjToString = ({
        currency,
        value,
      }: {
        currency: string;
        value: number;
      }) => {
        if (typeof value === "string") {
          value = parseFloat((value as any).split(" ")[1]);
        }
        return currency + " " + value;
      }
      
     const parseAdditionalInfo = (additional_info: any) => {
        const { medical, financial } = additional_info;
        const approved_amount = (financial as IAdditionalInfo).approved_amount ?? 0;
      
        return {
          approved_amount: currencyObjToString({
            currency: "INR",
            value: approved_amount,
          }),
          medical_info: medical,
          financial_info: financial,
        };
      }
      
     const claimsMapper = (claim: any): ClaimDetail => {
        const { identifier } = claim.payload;
      
        const resources = {
          patient: unbundleAs(claim.payload, "Patient").resource,
          coverage: unbundleAs(claim.payload, "Coverage").resource,
          claim: unbundleAs(claim.payload, "Claim").resource,
        };
      
        const insurance_no = resources.coverage.subscriberId;
        const diagnosis = resources.claim.diagnosis as Diagnosis[];
        const items = resources.claim.item as Item[];
        const requested_amount = currencyObjToString(
          resources.claim.total ?? {
            currency: "INR",
            value: items?.map((i) => i.unitPrice.value).reduce((a, b) => a + b) ?? 0,
          }
        );
      
        return {
          sender_code: claim.sender_code,
          recipient_code:claim.recipient_code,
          id: claim.request_id,
          use: claim.use,
          platform: claim.app || "others",
          otp_verification: claim.otp_verification || "Pending",
          account_number: claim.account_number || "",
          ifsc_code: claim.ifsc_code || "",
          request_id: claim.request_id,
          request_no: identifier?.value,
          name: resources.patient.name ? resources.patient.name[0].text : "Unnamed",
          gender: resources.patient.gender,
          sub_type : resources.claim.subType !== undefined ? resources.claim.subType.coding[0].code : "Others",
          items,
          address: resources.patient.address,
          provider: resources.claim.provider.name,
          diagnosis: diagnosis,
          insurance_no,
          requested_amount,
          ...parseAdditionalInfo(claim.additional_info),
          ...(claim.status === "Pending" && { approved_amount: "-" }),
          status: claim.status,
          resources,
          response_fhir: claim.response_fhir,
        };
      }
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const [claims, setClaims] = useState<ClaimDetail[]>();
      const [showFilter, setShowFilter] = useState<boolean>(false);
      const [showJSON, setShowJSON] = useState(false);
      const [claim, setClaim] = useState("");
      const [claimResponse, setClaimResponse] = useState("");
      const [requestId, setRequestId] = useState("");
      const [showEditor, setShowEditor] = useState(false);
      const [isValidJSON, setIsValidJSON] = useState(true);
      const appData: Object = useSelector((state: RootState) => state.appDataReducer.appData);
      let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
      const [parCode, setParCode] = useState(_.get(appData,"username") || "");
      const [pass, setPass] = useState(_.get(appData,"password") || "");
      const [showComponent, setShowComponent] = useState(false);
    
      async function getClaims() {
        setClaims(undefined);
        listRequest(claimType, authToken).then((res) => {
          setShowComponent(false);
          console.log("claim list", res);
          const result = _.filter(res.data.preauth, (claim) => claim.payload.entry[0].resource.resourceType === 'Claim');
          setClaims(result.map(claimsMapper));
          setShowComponent(true);
        }).catch((err) => {
          console.error("Error while fetching request list", err);
          setClaims([]);
        });
      }
    
      async function getClaim(id: any): Promise<any> {
        const obj = claims?.find(
          (claim: any) => claim.request_id === id
        )
        setRequestId(id)
        dispatch(addAppData({"claim":obj}));
        setClaim(JSON.stringify(obj?.resources.claim, null, 4));
        setClaimResponse(JSON.stringify(obj?.response_fhir, null, 4))
      }
    
      const getClaimFields = (id:string, field:string) => {
        const obj = claims?.find(
          (claim: any) => claim.request_id === id
        );
        return  _.get(obj, field);
      }
    
      useEffect(() => {
        if( sessionStorage.getItem('hcx_user_token') as string == "abcd"){
          navigate("/login");
        }else{
          authToken = sessionStorage.getItem('hcx_user_token') as string;
          dispatch(addAppData({ "username": sessionStorage.getItem('hcx_user_name') as string }));
          dispatch(addAppData({ "password": sessionStorage.getItem('hcx_password') as string }));
          dispatch(addParticipantToken(sessionStorage.getItem('hcx_user_token') as string));
          getParticipantByCode(sessionStorage.getItem('hcx_user_name') as string).then((res: any) => {
          dispatch(addParticipantDetails(res["data"]["participants"][0]));
          getClaims();
        }).catch((error) => {
          toast.error("Something went wrong. Please contact the administrator" || "Internal Server Error", {
            position: toast.POSITION.TOP_RIGHT
          });
        });
        }
      }, []);
    
      useEffect(() => {
        checkResponseJSONValid();
      }, [claimResponse]);
    

      const updateRespFhir = (value:string) => {
        setClaimResponse(value);
        updateResponse({ request_id: requestId, response_fhir: value})
        setShowEditor(false);
        getClaims();
      }
    
      const handleInputChange = (value: any, event: any) => {
        setClaimResponse(value);
      };
    
      const checkResponseJSONValid = () => {
        let input: any = '';
        try {
          if (claimResponse !== 'undefined' && claimResponse !== '') {
            input = JSON.parse(claimResponse);
            setIsValidJSON(true)
          } else {
            input = undefined;
          }
        } catch (err: any) {
          setIsValidJSON(false);
          toast("Invalid json", {
            type: "error",
            autoClose: 1000
          });
          return;
        }
      }
     
      const onClaimClick = (id:string) => {
        getClaim(id);
        navigate(`/${claimUseType}/detail`)
      }

      const onActionClick =(action:string,id:string)=> {
        setRequestId(id);
        getClaim(id);
        if(action == "View"){
          setShowEditor(true);
        }
      }

    return(
        <>
         {showEditor ? 
            <ModalEditor title={"Preauth"} request={claim} response={claimResponse } onUpdate={(value) => updateRespFhir(value)} onClose={() => setShowEditor(false)}></ModalEditor> 
            : null }
        { showComponent ? 
   <CommonDataTable title={claimUseType}
                           header={
                            claims
                              ? [
                                "request_no", // last 8 digits of request_id
                                "patient_name", // actually name
                                "insurance_no",
                                "claim_type",
                                "requested_amount",
                                "approved_amount",
                                "provider",
                                "status"
                              ]
                              : []
                          }
                               data={
                                (claims || []).map((claim) => ({
                                  ...claim,
                                  request_no: claim.request_no?.slice(-8),
                                  insurance_no : claim.insurance_no?.slice(-8),
                                  patient_name: claim.name,
                                  claim_type: claim.sub_type,
                                  enableButtons: true
                                })) as any
                              }
                               actions={[{text:"View",type:"normal",svgicon:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                               <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                             </svg>}]}   
                               onRowClick={(id:string) => onClaimClick(id)}   
                               onAction={(action,id)=>onActionClick(action,id)}    
           ></CommonDataTable> : 
           <>
           <Loader></Loader>
           <label className="m-10 p-5 block text-black dark:text-white">
                   Fetching {claimUseType} List
           </label></>} 
           </>
    )
}

export default PreauthList;