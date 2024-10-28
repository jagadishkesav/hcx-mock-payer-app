import { useEffect, useState } from "react";
import { forwardRequest, listForwardResponse } from "../api/PayerService";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../store";
import { toast } from "react-toastify";
import ModalForwardResponse from "./ModalForwardResponse";
import _ from "lodash";
import SingleSelectSearch from "./SingleSelectSearch";


interface ForwardProps {
    correlation_id:string;
    sender_code:string;
    recipient_code:string;
    request_fhir:string;
    claim_type:string;
}

const ForwardRequest:React.FC<ForwardProps> = ({correlation_id, sender_code, recipient_code,request_fhir,claim_type}:ForwardProps) => {
    const [correlationId, setCorrelationId] = useState(correlation_id);
    const [settled, setSettled] = useState(false);
    const [senderCode, setSenderCode] = useState(sender_code);
    const [recipientCode, setRecipientCode] = useState(recipient_code);
    const [requestFhir, setRequestFhir] = useState(request_fhir);
    const [claimType, setClaimType] = useState(claim_type);
    const [fhir, setFhir] = useState("");
    const [text, setText] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const [forwardParticipantCode, setForwardParticipantCode] = useState("");
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    let participant_code = _.get(store.getState().participantDetailsReducer.participantDetails, "participant_code") || "";
    const dispatch = useDispatch();

    useEffect(() => {
        listForwardResponse("claimonsubmit",correlationId,authToken).then(res => {
            if(res.data.claimonsubmit.length){
            setFhir(JSON.stringify(res.data.claimonsubmit[0].payload, null, 4));
            const supportingFiles = res.data.claimonsubmit[0].payload.entry[1].resource.supportingInfo || [];
            supportingFiles.map((file: any, index: any) => {
                    localStorage.setItem(file.valueAttachment.url, file.valueString);
            });
            setSettled(true);
                setText("Request was already forwarded. Please click View Response button to show the response");
            }else{
                setSettled(false);
                setText("Request has not been forwarded yet. Please forward the request to view response");
            }
        }).catch(err => {
            toast.error(err.response? err.response.data.error.message : "Something went wrong. Try contacting the administrator", {
                position: toast.POSITION.TOP_RIGHT
              }); 
        });
    }, []);

    const forwardReq = () => {
        forwardRequest(forwardParticipantCode, participant_code ,correlation_id,"claimonsubmit",request_fhir,authToken).then((res) => {
            toast("Request forwarded successfully.", {
                type: "success",
              });
        }).catch(err => {
            toast.error(err.response? err.response.data.error.message : "Something went wrong. Try contacting the administrator", {
                position: toast.POSITION.TOP_RIGHT
              }); 
        })
    }
    return(    <div

        className="w-full max-w-203 rounded-lg border-2 border-gray bg-white py-12 px-8 dark:bg-boxdark md:py-5 md:px-5 mb-3 "
      >
  
        <p className="pb-2 text-xl font-bold text-black dark:text-white sm:">
          {"Request Forwarding"}
        </p>
        <span className="mx-auto mb-6 inline-block h-1 w-25 rounded bg-primary"></span>
        {showEditor ? 
            <ModalForwardResponse title={"Claim"} request={fhir} onClose={() => setShowEditor(false)}></ModalForwardResponse> 
            : null }
        <SingleSelectSearch onSelectChange={(option) => setForwardParticipantCode(option.value)}></SingleSelectSearch>
        <div className="flex gap-5 mt-5">
          
          <button className={"inline-flex rounded-full bg-primary py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 " + (settled ? "opacity-50 cursor-not-allowed" : "")}
            disabled={settled}
            onClick={() => forwardReq()}
           >

            Forward Request
          </button>
          <button className={"inline-flex rounded-full bg-primary py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 " + (!settled ? "opacity-50 cursor-not-allowed" : "")}
            disabled={!settled}
            onClick={() => setShowEditor(true)}
           >
            View received Response
          </button>
        </div>
        <p className={"mt-5"}>{text}</p>
        </div>
    );
}

export default ForwardRequest;