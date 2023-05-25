import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest, updateResponse } from "../../api/api";
import { navigate } from "raviger";
import {
  IAdditionalInfo,
  Item,
  parseAdditionalInfo,
  currencyObjToString,
} from "../claims";
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

type PreAuthDetail = {
  id: string;
  request_id: string;
  request_no: string;
  name: string;
  gender: string;
  provider: string;
  items: Item[];
  insurance_no: string;
  requested_amount: string;
  approved_amount: string;
  status: string;
  medical_info: IAdditionalInfo;
  financial_info: IAdditionalInfo;
  resources: {
    patient: object;
    coverage: object;
    claim: object;
  };
  address: any;
  response_fhir: object;
};

export function preAuthMapper(preauth: any): PreAuthDetail {
  const { identifier } = preauth.payload;

  const resources = {
    patient: unbundleAs(preauth.payload, "Patient").resource,
    coverage: unbundleAs(preauth.payload, "Coverage").resource,
    claim: unbundleAs(preauth.payload, "Claim").resource,
  };

  const items = resources.claim.item as Item[];
  console.log(items);
  const requested_amount = currencyObjToString(
    resources.claim.total ?? {
      currency: "INR",
      value: items?.map((i) => i.unitPrice.value).reduce((a, b) => a + b) || 0,
    }
  );

  console.log("mapping preauth", preauth);

  return {
    id: preauth.request_id,
    request_id: preauth.request_id,
    request_no: identifier?.value,
    name: resources.patient.name[0].text,
    gender: resources.patient.gender,
    provider: resources.claim.provider.name,
    address: resources.patient.address,
    items,
    insurance_no: resources.coverage.subscriberId,
    requested_amount,
    ...parseAdditionalInfo(preauth.additional_info),
    ...(preauth.status === "Pending" && { approved_amount: "-" }),
    status: preauth.status,
    resources,
    response_fhir: preauth.response_fhir,
  };
}

export default function PreAuths() {
  const [preauths, setPreauths] = useState<PreAuthDetail[]>();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showJSON, setShowJSON] = React.useState(false);
  const [preauth, setPreauth] = React.useState("");
  const [preauthResponse, setPreauthResponse] = React.useState("");
  const [requestId, setRequestId] = React.useState("");
  const [showEditor, setShowEditor] = React.useState(false);
  const [isValidJSON, setIsValidJSON] = React.useState(true);

  async function getPreAuths() {
    await listRequest({ type: "preauth" })
    .then((res) => {
      setPreauths(res.preauth.map(preAuthMapper));
    }).catch(() => {
      console.error("Error while fetching request list")
      setPreauths([]);
    });
  }

  async function getPreauth(id: any): Promise<any> {
    const obj = preauths?.find(
      (preauth: any) => preauth.request_id === id
    )
    setRequestId(id)
    setPreauth(JSON.stringify(obj?.resources.claim, null, 4));
    setPreauthResponse(JSON.stringify(obj?.response_fhir, null, 4))
  }

  useEffect(() => {
    getPreAuths();
  }, []);

  useEffect(() => {
    checkResponseJSONValid();
  }, [preauthResponse]);

  const updateRespFhir = () => {
    updateResponse({ request_id: requestId, response_fhir: preauthResponse })
    setShowEditor(false);
    getPreAuths();
  }

  const handleInputChange = (value: any, event: any) => {
    setPreauthResponse(value);
  };

  const checkResponseJSONValid = () => {
    let input: any = '';
    try {
      if (preauthResponse !== 'undefined' && preauthResponse !== '') {
        input = JSON.parse(preauthResponse);
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
            getPreAuths();
          }}
        />
      )}
      <Table
        title="Pre Auth"
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
                    !preauths && "animate-spin"
                  )}
                  aria-hidden="true"
                />
                Refresh
              </>
            ),
            action: () => {
              getPreAuths();
            },
          },
        ]}
        headers={
          preauths
            ? [
              "request_no",
              "patient_name",
              "insurance_no",
              "approved_amount",
              "requested_amount",
              "expiry",
              "provider",
              "status"
            ]
            : []
        }
        onRowClick={(id) => navigate(`/preauths/${id}`)}
        data={
          (preauths || []).map((preauth) => ({
            ...preauth,
            request_no: preauth.request_no?.slice(-8),
            patient_name: preauth.name,
          })) as any
        }
        rowActions={{
          "view request": {
            callback: (id) => {
              getPreauth(id)
              setShowJSON(true)
            },
            actionType: "primary",
          },
        }}
        primaryColumnIndex={1}
      />
      {!preauths && <Loading type="skeleton" length={5} />}

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
              defaultValue={preauth}
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
              defaultValue={preauthResponse}
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

