import { useEffect, useState } from "react";
import { formatDate } from "../../utils/StringUtils";
import { unbundleAs } from "../../utils/fhirUtils";
import { toast } from "react-toastify";
import { approveCoverageEligibilityRequest, listRequest, rejectCoverageEligibilityRequest, updateResponse } from "../../api/PayerService";
import CommonDataTable from "../../components/CommonDataTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Loader from "../../common/Loader";
import ModalEditor from "../../components/ModalEditor";
import ModalCoverageEligibility from "../../components/ModalCoverageEligibility";
import { useNavigate } from "react-router-dom";
import { addAppData } from "../../reducers/app_data";
import { addParticipantToken } from "../../reducers/token_reducer";
import { getParticipantByCode } from "../../api/RegistryService";
import { addParticipantDetails } from "../../reducers/participant_details_reducer";


  export type CoverageDetail = {
    id:string;
    request_id: string;
    request_no: string;
    name: string;
    insurance_no: string;
    provider:string;
    expiry: string;
    status: string;
    resource: object;
    response_fhir: object;
    servicedPeriod:object;
  }

  const CoverageEligibilityList = () => {

    const participantDetails: Object = useSelector((state: RootState) => state.participantDetailsReducer.participantDetails);
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    const [showComponent, setShowComponent] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const coverageEligibilityMapper = (coverage: any):CoverageDetail => {
        const { resource } = unbundleAs(
          coverage.payload,
          "CoverageEligibilityRequest"
        );
      
        return {
          id: coverage.request_id,
          request_id: coverage.request_id,
          request_no: resource.id,
          name: resource.patient?.name[0].text,
          provider: resource.provider?.name,
          insurance_no: resource.insurance[0].coverage?.subscriberId,
          status: coverage.status,
          servicedPeriod: resource.servicedPeriod,
          expiry: resource.servicedPeriod?.end
            ? formatDate(resource.servicedPeriod.end)
            : "",
          resource,
          response_fhir: coverage.response_fhir,
        };
      }

      const [selectedRequest, setSelectedRequest] = useState<string>("");
      const [showFilter, setShowFilter] = useState<boolean>(false);
      const [coverageEligibilityRequests, setCoverageEligibilityRequests] =
        useState<
          {
            request_id: string;
            request_no: string;
            name: string;
            insurance_no: string;
            expiry: string;
            status: string;
            resource: object;
            response_fhir: object;
          }[]
        >();
      const [showJSON, setShowJSON] = useState(false);
      const [showEditor, setShowEditor] = useState(false);
      const [coverage, setCoverage] = useState<{}>();
      const [coverageString, setCoverageString] = useState("");
      const [coverageResponse, setCoverageResponse] = useState("");
      const [requestId, setRequestId] = useState("");
      const [showEditorResponse, setShowEditorResponse] = useState(false);
      const [coverageMapped, setCoverageMapped] =  useState<
      {
        request_id: string;
        request_no: string;
        name: string;
        insurance_no: string;
        expiry: string;
        status: string;
        resource: object;
        response_fhir: object;
      } >();
      const [showCoverageModal, setShowCoverageModal] = useState(false);
       
    
      const handleInputChange = (value: any, event: any) => {
        setCoverageResponse(value);
      };
        
        const  getCoverages = () => {
        listRequest("coverageeligibility", authToken).then((resp:any) => {
          setShowComponent(false);
          console.log("cov resp", resp);
          setCoverageEligibilityRequests(
            resp.data.coverageeligibility.map(coverageEligibilityMapper)
          ); 
          setShowComponent(true);
        }).catch((err:any) => {
          console.error("Error while fetching request list", err);
          setCoverageEligibilityRequests([]);
        });
      }
    
      async function getCoverage(id: any): Promise<any> {
        const obj = coverageEligibilityRequests?.find(
          (coverage: any) => coverage.request_id === id
        )
        setRequestId(id)
        setCoverage(obj?.resource);
        dispatch(addAppData({"coverage":obj}));
        setCoverageString(JSON.stringify(obj?.resource, null, 4))
        setCoverageResponse(JSON.stringify(obj?.response_fhir, null, 4))
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
          getCoverages();
        }).catch((error) => {
          toast.error("Something went wrong. Please contact the administrator" || "Internal Server Error", {
            position: toast.POSITION.TOP_RIGHT
          });
        });
        }
      }, []);



      const updateRespFhir = (value: any) => {
        setCoverageResponse(value);
        console.log("value of responseFHIR", value);
        updateResponse({ request_id: requestId, response_fhir: value }, authToken);
        setShowEditor(false);
        getCoverages();
      }

      const onActionClick =(action:string,id:string)=> {
        console.log("action", action, id);
        setRequestId(id);
        if(action == "View"){
          getCoverage(id);
          setShowEditor(true);
        }else if(action == "Approve"){
          approveCoverageEligibilityRequest(id, authToken);
          toast("Coverage Eligibility Request Approved", {
            type: "success",
          });
          setTimeout(() => {
            getCoverages();
          }, 1000);
        }else if(action == "Reject"){
          rejectCoverageEligibilityRequest(id, authToken);
          toast("Coverage Eligibility Request Rejected", {
            type: "error",
          });
          setTimeout(() => {
            getCoverages();
          }, 1000);
        }
      }

      const onCoverageClick = (id:string) => {
        const obj = coverageEligibilityRequests?.find(
          (coverage: any) => coverage.request_id === id
        )
        console.log("selected coverage", id, obj);
        setRequestId(id);
        setCoverageMapped(obj)
        getCoverage(id);
        //setShowCoverageModal(true);
        navigate("/coverageeligibility/details")
      }
    
    
    return(
        <>
         {showEditor ? 
            <ModalEditor title={"Coverage Eligibility"} request={coverageString} response={coverageResponse} onUpdate={(value) => updateRespFhir(value)} onClose={() => setShowEditor(false)}></ModalEditor> 
            : null }
         { showComponent ? 
          <CommonDataTable title="Coverage Eligibility"
                            header={
                                coverageEligibilityRequests
                                ? [
                                    "request_no",
                                    "patient_name",
                                    "provider",
                                    "insurance_no",
                                    "status",
                                ]
                                : []}
                                data={(coverageEligibilityRequests || []).map((coverage) => ({
                                    ...coverage,
                                    id: coverage.request_id,
                                    patient_name: coverage.name,
                                    request_no: coverage.request_no.slice(-8),
                                    enableButtons: coverage.status == "Pending" ? true : false
                                  })) as any}
                                actions={[{text:"Approve",type:"success",svgicon:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              },{text:"Reject",type:"danger", svgicon:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            },{text:"View",type:"normal",svgicon:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            }]}
                                onAction={(action,id)=>onActionClick(action,id)}  
                                onRowClick={(id:string) => onCoverageClick(id)}    
            ></CommonDataTable> : 
            <>
            <Loader></Loader>
            <label className="m-10 p-5 block text-black dark:text-white">
                    Fetching Coverage Eligibility List
            </label></>}
            </>)
}
export default CoverageEligibilityList;