import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import _ from "lodash";
import { useEffect, useState } from "react";
import { ChecklistItem } from "../Claims/ClaimDetails";
import { CoverageDetail } from "./CoverageEligibilityList";
import { Link, useNavigate } from "react-router-dom";
import DetailsBox from "../../components/DetailsBox";
import Checklist from "../../components/Checklist";
import { bgcolorPicker, colorPicker } from "../../utils/StringUtil";
import { approveCoverageEligibilityRequest, rejectCoverageEligibilityRequest } from "../../api/PayerService";
import { toast } from "react-toastify";

const CoverageEligibilityDetails = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeClasses = 'text-primary border-primary';
    const inactiveClasses = 'border-transparent';
    const appData: Object = useSelector((state: RootState) => state.appDataReducer.appData);
    const [coverage, setCoverage] = useState<CoverageDetail | null>(_.get(appData,"coverage") || null);
    const [requestID, setRequestId] = useState(_.get(appData,"coverage.request_id") || "12345");
    const [openTab, setOpenTab] = useState(1);
    const authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    const [coverageChecklist, setCoverageChecklist] = useState<ChecklistItem[]>([
        {
          id: "1",
          name: "Coverage is active and within expiry",
        },
      ]);
    const [coverageSettled, setCoverageSettled] = useState(coverage?.status == "Approved" ? true :false);  

    const handleReject = async (request_id: string) => {
        rejectCoverageEligibilityRequest(request_id, authToken).then(() => {
            toast("Coverage Eligibility Request Rejected", {
                type: "success",
              });
        }).catch(err => {
            toast("Coverage Eligibility Request could not be rejected", {
                type: "error",
              });
        });
      };
      
      const handleApprove = async (
        request_id: string) => {
        approveCoverageEligibilityRequest(request_id, authToken).then(() => {
            toast("Coverage Eligibility Request Approved", {
                type: "success",
              });
        }).catch(err => {
            toast("Coverage Eligibility Request could not be approved", {
                type: "error",
              });
        });
          
      };

      useEffect(()=>{
        
        if(!coverage){
            navigate(`/coverageeligibility/list`);
        }
      },[]);

    
    return (
        <>
            <div className="rounded-sm border border-stroke bg-white p-4 mb-8 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-2.5 text-title-md2 font-bold text-black dark:text-white">
                        Coverage Eligibility Request Details
                        </h2>
                        <div>
                        <div className="group relative inline-block">
                        <p className="font-medium mb-1">Request ID : {coverage? coverage.request_id : "Not Available"}</p>
                        <div className="absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-black py-1.5 px-4.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                          <span className="absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm bg-black"></span>
                          API CALL ID for the request
                        </div>
                        </div>
                        </div>
                        <div>
                        <div className="group relative inline-block">
                        <p className="font-medium">Bundle ID : {coverage ? coverage.request_no : "Not Available"}</p>
                        <div className="absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-black py-1.5 px-4.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                          <span className="absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm bg-black"></span>
                          ID of the Bundle submitted for the request
                        </div>
                        </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-2.5 text-title-md2 font-bold text-black dark:text-white">
                            &nbsp;
                        </h2>
                        <p className="font-medium mb-1">Status : <span className={"inline-block rounded py-0.5 px-2.5 text-sm font-medium bg-opacity-20 " + (bgcolorPicker(coverage ? coverage.status : "unknown")) + " " + colorPicker(coverage ? coverage.status : "unknown")}>
                        {coverage ? coverage.status : "Not Available"}
                        </span></p>
                    </div>

                </div>
            </div>
            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
                   <Link
                     to="#"
                     className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 1 ? activeClasses : inactiveClasses
                         }`}
                     onClick={() => setOpenTab(1)}
                  >
                     Coverage Eligiblity
                  </Link>
                </div>

                <div>
                    <div
                        className={`leading-relaxed ${openTab === 1 ? 'block' : 'hidden'}`}
                    >  
                        {coverage ? 
                        <>
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">   
                        <DetailsBox title="Beneficiary Details" claim={coverage} fields={["provider", "name", "insurance_no", "status"]}></DetailsBox>
                        </div>
                        <div className="flex flex-col gap-9">
                        <Checklist checklist={coverageChecklist}  settled={coverageSettled} title="Checklist" type="coverage" onApprove={(type,approvedAmount,remarks) => handleApprove(requestID) } onReject={(type) => {handleReject(requestID)}}></Checklist>
                        </div>
                        </div>
                        </> : null}
                    </div>
                </div>
            </div>
        </>)
}

export default CoverageEligibilityDetails;