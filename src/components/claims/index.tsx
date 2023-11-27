import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest, sendCommunicationRequest, updateResponse } from "../../api/api";
import { navigate } from "raviger";
import Loading from "../common/Loading";
import { unbundleAs } from "../../utils/fhirUtils";
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { classNames } from "../common/AppLayout";
import SetTokenModal from "../common/SetTokenModal";
import Modal from "../common/Modal";
import { JsonViewer } from "@textea/json-viewer";
import { Editor } from "@monaco-editor/react";
import { options } from "../common/JSONEditorOptions";
import { toast } from "react-toastify";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export interface IAdditionalInfo {
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  approved_amount?: number;
  account_number? : number;
  ifsc_code? : string;
}
export interface Item {
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

export interface DiagnosisCoding {
  system: string;
  code: string;
  display: string;
}

export interface Diagnosis {
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

export function currencyObjToString({
  currency,
  value,
}: {
  currency: string;
  value: number;
}) {
  if (typeof value === "string") {
    value = parseFloat((value as any).split(" ")[1]);
  }
  return currency + " " + value;
}

export function parseAdditionalInfo(additional_info: any) {
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

export function claimsMapper(claim: any): ClaimDetail {
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

export default function Claims() {
  const [claims, setClaims] = useState<ClaimDetail[]>();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showJSON, setShowJSON] = React.useState(false);
  const [claim, setClaim] = React.useState("");
  const [claimResponse, setClaimResponse] = React.useState("");
  const [requestId, setRequestId] = React.useState("");
  const [showEditor, setShowEditor] = React.useState(false);
  const [isValidJSON, setIsValidJSON] = React.useState(true);
  const appData: Object = useSelector((state: RootState) => state.appDataReducer.appData);
  const [parCode, setParCode] = useState(_.get(appData,"username") || "");
  const [pass, setPass] = useState(_.get(appData,"password") || "");

  async function getClaims() {
    setClaims(undefined);
    await listRequest({ type: "claim" })
    .then((res) => {
      console.log("claim list", res);
      const result = _.filter(res.claim, (claim) => claim.payload.entry[0].resource.resourceType === 'Claim');
      setClaims(result.map(claimsMapper));
      
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
    getClaims();
  }, []);

  useEffect(() => {
    checkResponseJSONValid();
  }, [claimResponse]);

  const updateRespFhir = () => {
    updateResponse({ request_id: requestId, response_fhir: claimResponse })
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


  return (
    <>
      {showFilter && (
        <SetTokenModal
          onClose={() => {
            setShowFilter(false);
            getClaims();
          }}
        />
      )}
      <Table
        title="Claims"
        actions={[
          {
            element: (
              <>
                <FunnelIcon
                  className={classNames(
                    "h-5 w-5 flex-shrink-0 text-white hover:text-gray-200"
                  )}
                  aria-hidden="true"
                />
                Filter
              </>
            ),
            action: () => {
              setShowFilter(true);
            },
          },
          {
            element: (
              <>
                {" "}
                <ArrowPathIcon
                  className={classNames(
                    "h-5 w-5 flex-shrink-0 text-white",
                    !claims && "animate-spin"
                  )}
                  aria-hidden="true"
                />
                Refresh
              </>
            ),
            action: () => {
              getClaims();
            },
          },
        ]}
        headers={
          claims
            ? [
              "request_no", // last 8 digits of request_id
              "patient_name", // actually name
              "insurance_no",
              "sub_type",
              "requested_amount",
              "approved_amount",
              "provider",
              "status",
              "otp_verification"
            ]
            : []
        }
        onRowClick={(request_id) => navigate(`/claims/${request_id}`)}
        data={
          (claims || []).map((claim) => ({
            ...claim,
            request_no: claim.request_no?.slice(-8),
            patient_name: claim.name,
          })) as any
        }
        rowActions={{
          "view request": {
            callback: (id) => {
              getClaim(id)
              setShowJSON(true)
            },
            actionType: "primary",
          },
          "view response": {
            callback: (id) => {
              getClaim(id)
              setShowEditor(true)
            },
            actionType: "primary",
          },
          "verify claim": {
            callback: (id) => {
              getClaim(id);
              setShowEditor(false);
              sendCommunicationRequest({"request_id":id, type:"otp", participantCode: parCode, password:pass, recipientCode: getClaimFields(id, "sender_code")});
              toast.success("OTP verification communication request has been raised")

            },
            actionType: "primary",    
            hideCondition : 'sub_type !== "OPD"'
            
          }        
        }}
        primaryColumnIndex={1}
      />
      {!claims && <Loading type="skeleton" length={5} />}

      {showJSON && (
        <Modal
          onClose={() => setShowJSON(false)}
          className="max-w-3xl w-full"
        >
          <div
            className={`mt-3 bg-slate-100 rounded-lg shadow-lg px-4 py-2 text-left ${!showJSON && "hidden"
              }`}
          >
            <Editor
              height="82vh"
              language="json"
              theme="clouds"
              defaultValue={claim}
              options={options}
            />
          </div>
        </Modal>
      )}
      {showEditor && (
        <Modal
          onClose={() => setShowEditor(false)}
          className="max-w-3xl w-full"
        >
          <div
            className={`mt-3 bg-slate-100 rounded-lg shadow-lg px-4 py-2 text-left ${!showEditor && "hidden"
              }`}
          >
            <Editor
              height="82vh"
              language="json"
              theme="clouds"
              defaultValue={claimResponse}
              onChange={handleInputChange}
              options={options}
            />

            {isValidJSON ?
              <button
                type="button"
                className="flex items-center gap-2 justify-center rounded-md bg-indigo-600 py-1.5 px-3 mt-4 mx-auto text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => updateRespFhir()}
              >
                Update
              </button>
              : null}
          </div>

        </Modal>

      )
      }
    </>
  );
}
