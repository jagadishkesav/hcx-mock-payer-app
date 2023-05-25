import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import {
  approveCoverageEligibilityRequest,
  listRequest,
  rejectCoverageEligibilityRequest,
  updateResponse,
} from "../../api/api";
import CoverageDetail from "./CoverageDetail";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/StringUtils";
import Loading from "../common/Loading";
import { unbundleAs } from "../../utils/fhirUtils";
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { classNames } from "../common/AppLayout";
import SetTokenModal from "../common/SetTokenModal";
import { JsonViewer } from "@textea/json-viewer";
import Editor from '@monaco-editor/react';
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
import { options } from "../common/JSONEditorOptions";
import { time } from "console";

function coverageEligibilityMapper(coverage: any) {
  const { resource } = unbundleAs(
    coverage.payload,
    "CoverageEligibilityRequest"
  );

  return {
    id: coverage.request_id,
    request_id: coverage.request_id,
    request_no: resource.id,
    name: resource.patient?.name[0].text,
    provider: resource.provider.name,
    insurance_no: resource.insurance[0].coverage.subscriberId,
    status: coverage.status,
    servicedPeriod: resource.servicedPeriod,
    expiry: resource.servicedPeriod?.end
      ? formatDate(resource.servicedPeriod.end)
      : "",
    resource,
    response_fhir: coverage.response_fhir,
  };
}

export default function CoverageEligibilityHome() {
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
  const [showJSON, setShowJSON] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [coverage, setCoverage] = React.useState<{}>();
  const [coverageResponse, setCoverageResponse] = React.useState("");
  const [requestId, setRequestId] = React.useState("");
  const [isValidJSON, setIsValidJSON] = React.useState(true);

  console.log('coverages', coverageEligibilityRequests)

  const handleInputChange = (value: any, event: any) => {
    setCoverageResponse(value);
  };

  const checkResponseJSONValid = () => {
    let input: any = '';
    try {
      if (coverageResponse !== 'undefined' && coverageResponse !== '') {
        input = JSON.parse(coverageResponse);
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

  async function getCoverages() {
    await listRequest({ type: "coverageeligibility" })
    .then((resp) => {
      setCoverageEligibilityRequests(
        resp.coverageeligibility.map(coverageEligibilityMapper)
      );
    }).catch(() => {
      console.error("Error while fetching request list")
      setCoverageEligibilityRequests([]);
    });
  }

  async function getCoverage(id: any): Promise<any> {
    const obj = coverageEligibilityRequests?.find(
      (coverage: any) => coverage.request_id === id
    )
    setRequestId(id)
    setCoverage(obj?.resource);
    setCoverageResponse(JSON.stringify(obj?.response_fhir, null, 4))
  }

  useEffect(() => {
    getCoverages();
  }, []);

  useEffect(() => {
    checkResponseJSONValid();
  }, [coverageResponse]);


  const updateRespFhir = () => {
    updateResponse({ request_id: requestId, response_fhir: coverageResponse })
    setShowEditor(false);
    getCoverages();
  }

  return (
    <>
      {showFilter && (
        <SetTokenModal
          onClose={() => {
            setShowFilter(false);
            getCoverages();
          }}
        />
      )}
      <Table
        title="Coverage Eligibility"
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
                    !coverageEligibilityRequests && "animate-spin"
                  )}
                  aria-hidden="true"
                />
                Refresh
              </>
            ),
            action: () => {
              getCoverages();
            },
          },
        ]}
        headers={
          coverageEligibilityRequests
            ? [
              "request_no",
              "patient_name",
              "provider",
              "insurance_no",
              "expiry",
              "status",
            ]
            : []
        }
        onRowClick={setSelectedRequest}
        data={(coverageEligibilityRequests || []).map((coverage) => ({
          ...coverage,
          id: coverage.request_id,
          showActions: coverage.status === "Pending",
          patient_name: coverage.name,
          request_no: coverage.request_no.slice(-8),
        })) as any}
        rowActions={{
          approve: {
            callback: (request_id: any) => {
              approveCoverageEligibilityRequest({ request_id });
              toast("Coverage Eligibility Request Approved", {
                type: "success",
              });
              setTimeout(() => {
                getCoverages();
              }, 1000);
            },
            actionType: "primary",
          },
          reject: {
            callback: (request_id: any) => {
              rejectCoverageEligibilityRequest({ request_id });
              toast("Coverage Eligibility Request Rejected", {
                type: "error",
              });
              setTimeout(() => {
                getCoverages();
              }, 1000);
            },
            actionType: "danger",
          },
          "view request": {
            callback: (id) => {
              getCoverage(id)
              setShowJSON(true)
            },
            actionType: "primary",
          },
          "view response": {
            callback: (id) => {
              getCoverage(id)
              setShowEditor(true)
            },
            actionType: "primary",
          }
        }}
        primaryColumnIndex={1}
      />
      {selectedRequest && (
        <Modal
          onClose={() => setSelectedRequest("")}
          className="max-w-3xl w-full"
        >
          <CoverageDetail
            onAction={() => {
              setSelectedRequest("");
              setTimeout(() => {
                getCoverages();
              }, 1000);
            }}
            coverage={(coverageEligibilityRequests || []).find(
              (request) => request.request_id === selectedRequest
            )}
          />
        </Modal>
      )}
      {!coverageEligibilityRequests && <Loading type="skeleton" length={5} />}

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
              defaultValue={JSON.stringify(coverage, null, 4)}
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
              defaultValue={coverageResponse}
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
