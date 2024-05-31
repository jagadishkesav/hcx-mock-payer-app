import { Link, useNavigate } from "react-router-dom";
import { bgcolorPicker, colorPicker } from "../../utils/StringUtil";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import _ from "lodash";
import { ClaimDetail } from "./Claims";
import DetailsBox from "../../components/DetailsBox";
import { formatDate, properText, textOrDash } from "../../utils/StringUtils";
import CommonDataTable from "../../components/CommonDataTable";
import Checklist from "../../components/Checklist";
import FileManager from "../../components/FileManager";
import { toast } from "react-toastify";
import { approveClaim, rejectClaim, sendCommunicationRequest } from "../../api/PayerService";
import EmptyState from "../../components/EmptyState";
import axios from "axios";

export type ChecklistItem = {
    id: string;
    name: string;
    status?: "pass" | "fail" | "na";
  };
  
  interface claimProps{
    claimType : "preauth" | "claim"
  }

const ClaimDetails:React.FC<claimProps> = ({claimType}:claimProps) => {


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const appData: Object = useSelector((state: RootState) => state.appDataReducer.appData);
    const [claim, setClaim] = useState<ClaimDetail | null>(_.get(appData,"claim") || null);
    const [requestID, setRequestId] = useState(_.get(appData,"claim.request_id") || "12345");
    const [claimAmount, setClaimAmount] = useState(_.get(appData,"claim.approved_amount") !== "-" ? _.get(appData,"claim.approved_amount") : _.get(appData,"claim.requested_amount"));
    const authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    const [medSettled, setMedSettled] = useState(claim?.medical_info.status == "Approved" ? true :false)
    const [finSettled, setFinSettled] = useState(claim?.financial_info.status == "Approved" ? true :false)
    const [opdSettled, setOpdSettled] = useState(claim?.status == "Approved" ? true :false);
    const [showFilesList, setShowFilesList] = useState(false);
    const [supportFiles, setSupportFiles] = useState([]);
    const [claimDetailsBox, setClaimDetailsBox] = useState(
    {"resource_created": formatDate(_.get(claim, "resources.claim.created") || "2023-12-18T06:17:07+00:00") , 
    "Insurer":  textOrDash(_.get(claim, "resources.claim.insurer.name") || "Not Available"),
    "Provider":  textOrDash(_.get(claim, "provider") || "Not Available"),
    "Total_Claim_Cost" : textOrDash(_.get(claim, "requested_amount") || "Not Available"),
    "Priority" :  textOrDash(_.get(claim, "resources.claim.priority.coding[0].code") || "Not Available")
    });
    console.log("claim in details", claim);

    
    //console.log("supportingFiles claim selected is here",  supportingFiles);
    const [openTab, setOpenTab] = useState(1);

    const activeClasses = 'text-primary border-primary';
    const inactiveClasses = 'border-transparent';

    const processFile = (url: string) => {
      let data = JSON.stringify({
        "file_locations": [url]
      });
  
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://docxhcxapi.centralindia.cloudapp.azure.com/document/analyse/submit ',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer HCX@12345'
        },
        data: data
      };
      axios.request(config)
        .then((response: { data: any; }) => {
          console.log(JSON.stringify(response.data));
          localStorage.setItem(url, response.data.request_id);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
    
    useEffect(()=>{
      console.log("claim on refresh", claim)
      if(claim){
        const supportingFiles = (claim as any).resources.claim.supportingInfo || [];
        supportingFiles.map((file: any, index: any) => {
          processFile(file.valueAttachment.url);
        });
        setSupportFiles(supportingFiles);
        setShowFilesList(true);
      }else{
        if(claimType == "claim"){
        navigate(`/claims/list`);
        }else{
          navigate(`/preauth/list`);
        }
      }
    },[]);

    const financialDetailsBoxInfo = {
      requested_amount : claim ? claim.requested_amount : "Not Available",
      approved_amount : claim ? claim.approved_amount : "Not Available",
      status : claim ? claim.financial_info.status  : "Not Available",
      bank_account_number : claim ? claim.account_number !== "1234" ? claim.account_number : "Not Available" : "Not Available",
      ifsc_code : claim ? claim.ifsc_code !== "1234"? claim.ifsc_code : "Not Available" : "Not Available"
    }

    const [opddetailsChecklist, setopdDetailsChecklist] = useState<ChecklistItem[]>([
        {
          id: "1",
          name: "All OPD documents Verified",
        },
      ]);
    
      const [detailsChecklist, setDetailsChecklist] = useState<ChecklistItem[]>([
        {
          id: "1",
          name: "Proof of Identity Attached",
        },
        {
          id: "2",
          name: "Policy Active",
        },
      ]);
    
      const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
          id: "1",
          name: "Treatment in line with diagnosis",
        },
        {
          id: "2",
          name: "Discharge summary available",
        },
        {
          id: "3",
          name: "Discharge summary in line with treatment",
        },
      ]);
    
      const [financialCheckList, setFinancialCheckList] = useState<ChecklistItem[]>(
        [
          {
            id: "1",
            name: "Amount within wallet range?",
          },
          {
            id: "2",
            name: "Procedures not in exclusion list? ",
          },
          {
            id: "3",
            name: "Procedures as per approved plan?",
          },
          {
            id: "4",
            name: "Waiting period observed? ",
          },
          {
            id: "5",
            name: "Policy In force force for the treatment period?",
          },
          {
            id: "6",
            name: "Needed supporting documents available?",
          },
        ]
      );
      const handleReject = async (request_id: string, type: string) => {
        await rejectClaim( request_id, type , authToken, "/claim/reject");
        toast("Claim Rejected", { type: "success" });
      };
      
      const handleApprove = async (
        request_id: string,
        type: string,
        remarks: string,
        approved_amount: number) => {
        console.log("camee in approve",type);
        if (type == "medical" || type == "financial") {
           approveClaim(
            request_id,
            type,
            remarks,
            approved_amount,
            authToken,
            "/claim/approve").then(res => {
              toast(`${type} ${claimType} approved`, { type: "success" });
              if(type == "medical") setMedSettled(true);
              if(type == "financial") setFinSettled(true);
            }).catch(err => {
              console.log("error ", err);
              toast.error(err.response? err.response.data.error.message : "Something went wrong. Try contacting the administrator", {
                position: toast.POSITION.TOP_RIGHT
              });
            });
        }else{
          console.log("came in else ", type);
          approveClaim(
            request_id,
            "medical",
            remarks,
            approved_amount,
            authToken,
            "/claim/approve").then(res => {
              toast(`${claimType} approved`, { type: "success" });
              setMedSettled(true);
              approveClaim(
                request_id,
                "financial",
                remarks,
                approved_amount,
                authToken,
                "/claim/approve").then(res => {
                  toast(`${claimType} approved`, { type: "success" });  
                  setFinSettled(true);
                }).catch(err => {
                  toast.error(err.response? err.response.data.error.message : "Something went wrong. Try contacting the administrator", {
                    position: toast.POSITION.TOP_RIGHT
                  });    
                });
            }).catch(err => {
              toast.error(err.response? err.response.data.error.message : "Something went wrong. Try contacting the administrator", {
                position: toast.POSITION.TOP_RIGHT
              });
            });
            
        }
      };

  const sendCommunication = (type: string) => {
  
    {claim? sendCommunicationRequest(claim?.request_id,type,claim?.recipient_code,_.get(appData,"password") || "password",claim?.sender_code, authToken).then((res)=>{
      toast(`${type} requested using communication request`, { type: "success" });
    }): 
     toast.error("Unable to send communication request. Please try again")}
  }

    return (
        <>
            <div className="rounded-sm border border-stroke bg-white p-4 mb-8 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-2.5 text-title-md2 font-bold text-black dark:text-white">
                            {properText(claimType)} Request Details
                        </h2>
                        <div>
                        <div className="group relative inline-block">
                        <p className="font-medium mb-1">Request ID : {claim ? claim.request_id : "Not Available"}</p>
                        <div className="absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-black py-1.5 px-4.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                          <span className="absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm bg-black"></span>
                          API CALL ID for the request
                        </div>
                        </div>
                        </div>
                        <div>
                        <div className="group relative inline-block">
                        <p className="font-medium">Bundle ID : {claim ? claim.request_no : "Not Available"}</p>
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
                        <p className="font-medium mb-1">Status : <span className={"inline-block rounded py-0.5 px-2.5 text-sm font-medium bg-opacity-20 " + (bgcolorPicker(claim ? claim.status : "unknown")) + " " + colorPicker(claim ? claim.status : "unknown")}>
                        {claim ? claim.status : "Not Available"}
                        </span></p>
                    </div>

                </div>
            </div>
            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
                    { claim && claim.sub_type !== "OPD" ?
                    <>
                    <Link
                        to="#"
                        className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 1 ? activeClasses : inactiveClasses
                            }`}
                        onClick={() => setOpenTab(1)}
                    >
                        General Details
                    </Link>
                    <Link
                        to="#"
                        className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 2 ? activeClasses : inactiveClasses
                            }`}
                        onClick={() => setOpenTab(2)}
                    >
                        Medical Details
                    </Link>
                    <Link
                        to="#"
                        className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 3 ? activeClasses : inactiveClasses
                            }`}
                        onClick={() => setOpenTab(3)}
                    >
                        Financial Details
                    </Link>
                    </>:  <><Link
                     to="#"
                     className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 1 ? activeClasses : inactiveClasses
                         }`}
                     onClick={() => setOpenTab(1)}
                  >
                     OPD Claim
                  </Link></>}
                </div>

                <div>
                    <div
                        className={`leading-relaxed ${openTab === 1 ? 'block' : 'hidden'}`}
                    >  
                        {claim && claim.sub_type !== "OPD" ? 
                        <>
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">   
                        <DetailsBox title="Beneficiary Details" claim={claim} fields={["name", "insurance_no", "gender", "address"]}></DetailsBox>
                        <DetailsBox title="Claim Details" claim={claimDetailsBox} fields={Object.keys(claimDetailsBox)}></DetailsBox>
                        </div>
                        <div className="flex flex-col gap-9">
                        <Checklist checklist={detailsChecklist}  settled={opdSettled} title="Checklist" type="general" onApprove={(type,approvedAmount,remarks) => {setOpenTab(2)}}></Checklist>
                        </div>
                        </div>
                        </>
                        : null}

                        {claim && claim.sub_type == "OPD" ? 
                        <>
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">   
                        <DetailsBox title="Beneficiary Details" claim={claim} fields={[ "name", "insurance_no", "gender", "address"]}></DetailsBox>
                        <DetailsBox title="Claim Details" claim={claimDetailsBox} fields={Object.keys(claimDetailsBox)}></DetailsBox>
                        <DetailsBox title="Financial Details" claim={financialDetailsBoxInfo} fields={["requested_amount", "approved_amount", "status", "bank_account_number", "ifsc_code"]}></DetailsBox>
                        {claim.items && claim.items.length > 0 ? ( 
                        <CommonDataTable title="Bill Details" 
                                         header={["display","code","value"]}
                                         data={claim.items.map((item: any) => ({
                                          id: item.productOrService.coding[0].code,
                                          display: item.productOrService.coding[0].display,
                                          code: item.productOrService.coding[0].code,
                                          value: `${item.unitPrice.value} ${item.unitPrice.currency}`,
                                        }))}
                                            ></CommonDataTable> ) : 
                                        <EmptyState
                                            title="No Bill details found"
                                            description="No Bill details have been added to this claim."
                                        />}
                        {showFilesList ? <FileManager files={supportFiles}></FileManager> : null}    
                        </div>
                        <div className="flex flex-col gap-9">
                        <Checklist checklist={opddetailsChecklist} appAmount={claimAmount} settled={opdSettled} type="opd" title="Checklist" sendCommunication={(type) => sendCommunication(type)} onApprove={(type,approvedAmount,remarks) => handleApprove(requestID,type,remarks,approvedAmount) } onReject={(type) => {handleReject(requestID, type)}}></Checklist>
                        </div>
                        </div>
                        </>
                        : null}

                    </div>
                    <div
                        className={`leading-relaxed ${openTab === 2 ? 'block' : 'hidden'}`}
                    >
                        {claim?
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9"> 
                        {claim.diagnosis && claim.diagnosis.length > 0 ? (  
                        <CommonDataTable title="Diagnosis" 
                                         header={["display","code"]}
                                         data={[
                                            ...claim.diagnosis
                                              .filter(
                                                (item: any) => item.diagnosisCodeableConcept !== undefined
                                              )
                                              .map((item) => ({
                                                id: item.diagnosisCodeableConcept.coding[0].code,
                                                display: item.type[0].coding[0].display,
                                                code: item.diagnosisCodeableConcept.coding[0].code,
                                                // text: item.diagnosisCodeableConcept.text,
                                              })),
                                            ...claim.diagnosis
                                              .filter((item: any) => item.diagnosisReference !== undefined)
                                              .map((item: any) => ({
                                                id: item.diagnosisReference.code.coding[0].code,
                                                display: item.diagnosisReference.code.coding[0].display,
                                                code: item.diagnosisReference.code.coding[0].code,
                                              })),
                                          ]}></CommonDataTable>): 
                                          <EmptyState
                                            title="No Daignosis found"
                                            description="No Diagnosis have been added to this claim."
                                          />}
                        {claim.procedure && claim.procedure.length > 0 ? (  
                        <CommonDataTable title="Procedures" 
                                         header={["display","code"]}
                                         data={claim.procedure.map((item: any) => ({
                                            id: item.procedureCodeableConcept.coding[0].code,
                                            display: item.procedureCodeableConcept.coding[0].display ? item.procedureCodeableConcept.coding[0].display : "NA",
                                            code: item.procedureCodeableConcept.coding[0].code,
                                          }))}
                                            ></CommonDataTable>):
                                            <EmptyState
                                            title="No Procedures found"
                                            description="No Procedures have been added to this claim."
                                          /> }     
                                           {showFilesList ? <FileManager files={supportFiles}></FileManager> : null}           
                                          </div>
                                          <div className="flex flex-col gap-9">
                        <Checklist checklist={checklist} settled={medSettled} appAmount={claimAmount} title="Checklist" type="medical" onApprove={(type,approvedAmount,remarks) => handleApprove(requestID,type,remarks,approvedAmount) } onReject={(type) => {handleReject(requestID, type)}}></Checklist>
                        </div>
                        </div>
                         : null}           
                    </div>
                    <div
                        className={`leading-relaxed ${openTab === 3 ? 'block' : 'hidden'}`}
                    >
                        {claim ? 
                        <>
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">   
                        <DetailsBox title="Financial Details" claim={financialDetailsBoxInfo} fields={["requested_amount", "approved_amount", "status", "bank_account_number", "ifsc_code"]}></DetailsBox>
                        {claim.items && claim.items.length > 0 ? (  
                        <CommonDataTable title="Bill Details" 
                                         header={["display","code","value"]}
                                         data={claim.items.map((item: any) => ({
                                          id: item.productOrService.coding[0].code,
                                          display: item.productOrService.coding[0].display,
                                          code: item.productOrService.coding[0].code,
                                          value: `${item.unitPrice.value} ${item.unitPrice.currency}`,
                                        }))}
                                            ></CommonDataTable> ): <EmptyState
                                            title="No Bill details found"
                                            description="No Bill details have been added to this claim."
                                          />}
                          {showFilesList ? <FileManager files={supportFiles}></FileManager> : null}
                        </div>
                        <div className="flex flex-col gap-9">
                        <Checklist checklist={financialCheckList} appAmount={claimAmount} settled={finSettled} type="financial" title="Checklist" onApprove={(type,approvedAmount,remarks) => handleApprove(requestID,type,remarks,approvedAmount) } onReject={(type) => {handleReject(requestID, type)}}></Checklist>
                        </div>
                        </div>
                        </>
                        : null}
                    </div>
                </div>
            </div>
        </>)

}

export default ClaimDetails;