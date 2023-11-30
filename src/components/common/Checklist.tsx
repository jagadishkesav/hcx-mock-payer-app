import { CheckIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ClaimDetail } from "../claims";
import ApprovalForm, { ApprovalValueType } from "./ApprovalForm";
import { properText } from "../../utils/StringUtils";
import { sendCommunicationRequest } from "../../api/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import _ from "lodash";

export type ChecklistItem = {
  id: string;
  name: string;
  status?: "pass" | "fail" | "na";
};

export default function Checklist(props: {
  scores: {
    pass: number;
    fail: number;
    na: number;
  };
  items: ChecklistItem[];
  setItems: (items: ChecklistItem[]) => void;
  className?: string;
  approval?: ApprovalValueType;
  setApproval?: (approval: ApprovalValueType) => void;
  onApprove: any;
  onReject: any;
  nextTab?: () => void;
  claim: ClaimDetail;
  type: "medical" | "financial" | "general_details";
  enableButtons? : true | false;
}) {
  const {
    scores,
    items,
    setItems,
    className,
    approval,
    setApproval,
    onApprove,
    onReject,
    nextTab,
    claim,
    type,
    enableButtons = true,
  } = props;

  const [sticky, setSticky] = useState(true);
  const appData: Object = useSelector((state: RootState) => state.appDataReducer.appData);
  const [parCode, setParCode] = useState(_.get(appData,"username") || "");
  const [pass, setPass] = useState(_.get(appData,"password") || "");
  

  const score = items?.filter((item) => item.status === "pass").length || 0;
  const settledValue =
    claim.status === "Approved" || claim.status === "Rejected"
      ? claim.status
      : type === "medical"
      ? claim.medical_info.status
      : claim.financial_info.status;
  const settled = settledValue === "Approved" || settledValue === "Rejected";
  const progressColor =
    score >= scores.pass
      ? "bg-green-500"
      : score >= scores.na
      ? "bg-yellow-500"
      : "bg-red-500";

  useEffect(() => {
    const handleScroll = () => {
      const offset = 20;
      const element = document.getElementById("checklist");
      if (element) {
        const { top } = element.getBoundingClientRect();
        setSticky(top <= offset);
      }
    };
    window.addEventListener("scroll", handleScroll);
    console.log(settled);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [, claim]);

  return (
    <div className={`mt-24 relative ${className ?? ""}`} id="checklist">
      <div
        className={`rounded-lg p-4 bg-white z-10 w-full max-w-md absolute`}
      >
        {!settled && enableButtons && (
          <>
            <div className="text-gray-800 text-lg mt-[20px] text-center font-bold pb-4">
              Checklist
            </div>
            <div className="my-2 text-sm text-gray-600">
              <div className="mb-1 text-right">
                Score {score} / {scores.pass}
              </div>
              <div className="flex gap-1 items-stretch h-[5px]">
                {Array(scores.pass)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 ${
                        index === 0 ? "rounded-l-full" : ""
                      } ${index === scores.pass - 1 ? "rounded-r-full" : ""} ${
                        score > index ? progressColor : "bg-gray-300"
                      }`}
                    />
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              {items &&
                items.map((item, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <div>{item.name}</div>
                    <div className="shrink-0">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded overflow-hidden p-1">
                        {[
                          { status: "pass", color: "green", icon: CheckIcon },
                          { status: "na", color: "yellow", icon: MinusIcon },
                          { status: "fail", color: "red", icon: XMarkIcon },
                        ].map((status, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setItems(
                                items.map((it) => {
                                  return item.id === it.id
                                    ? { ...it, status: status.status as any }
                                    : it;
                                })
                              )
                            }
                            className={`p-1 rounded ${
                              item.status === status.status
                                ? `bg-${status.color}-500 text-white`
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <status.icon
                              className={`h-4 w-4 ${
                                item.status === status.status
                                  ? "text-white"
                                  : `text-${status.color}-500`
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        <div className={`${!settled && "mt-8"}`}>
          {approval && setApproval && enableButtons &&(
            <ApprovalForm
              approval={approval}
              setApproval={setApproval}
              claimType= {claim.sub_type}
              onApprove={() => {
                onApprove({
                  request_id: claim.request_id,
                  type,
                  approved_amount: approval.amount,
                  remarks: approval.remarks
                });
                nextTab && nextTab();
              }}
              onReject={() => {
                onReject({
                  request_id: claim.request_id,
                  type,
                });
                nextTab && nextTab();
              }}
              disabled={score < scores.pass || settled}
              settled={settled}
            />
          )}
        </div>
        {(settled || !approval) && enableButtons && nextTab && (
          <button
            onClick={nextTab}
            className="my-4 inline-flex gap-2 items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 disabled:opacity-60 disabled:grayscale disabled:hover:bg-green-100 bg-green-100 hover:bg-green-200 border-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckIcon className="h-5" />
            Next
          </button>
        )}
      {enableButtons == false ? <> 
        <div className="text-gray-800 text-lg mt-[20px] text-left font-bold pb-4">
              Additional Verification Steps
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {sendCommunicationRequest({"request_id":claim.request_id, type:"bank_details", recipientCode:claim.sender_code, participantCode:claim.recipient_code, password:pass}); toast.success("Bank Details requested");}}
            className="my-4 inline-flex gap-2 items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 disabled:opacity-60 disabled:grayscale disabled:hover:bg-green-100 bg-green-100 hover:bg-green-200 border-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Request Bank Details
          </button>
          <button
            onClick={() => {sendCommunicationRequest({"request_id":claim.request_id, type:"otp", recipientCode:claim.sender_code, participantCode:claim.recipient_code, password:pass}); toast.success("OTP Verification requested");}}
            className="my-4 inline-flex gap-2 items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 disabled:opacity-60 disabled:grayscale disabled:hover:bg-green-100 bg-green-100 hover:bg-green-200 border-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Request OTP Verification
          </button>
        </div>
      <p className="text-sm italic text-gray-500">
      <span className="font-mono">{"Claim is for an OPD and it can only be approved once the OTP verification is complete and bank details are provided"}</span></p>
      </>
      : null}
      </div>
    </div>
  );
}
