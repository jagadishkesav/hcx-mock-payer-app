import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import {
  approveCoverageEligibilityRequest,
  listRequest,
  rejectCoverageEligibilityRequest,
} from "../../api/api";
import CoverageDetail from "./CoverageDetail";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/StringUtils";
import Loading from "../common/Loading";
import { unbundleAs } from "../../utils/fhirUtils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { classNames } from "../common/AppLayout";

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
  };
}

export default function CoverageEligibilityHome() {
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  const [coverageEligibilityRequests, setCoverageEligibilityRequests] =
    useState<
      {
        request_id: string;
        request_no: string;
        name: string;
        insurance_no: string;
        expiry: string;
        status: string;
      }[]
    >();

  async function getCoverages() {
    setCoverageEligibilityRequests(undefined);
    const res: any = await listRequest({ type: "coverageeligibility" });
    setCoverageEligibilityRequests(
      res.coverageeligibility.map(coverageEligibilityMapper)
    );
  }

  useEffect(() => {
    getCoverages();
  }, []);

  return (
    <>
      <Table
        title="Coverage Eligibility"
        action={getCoverages}
        actionIcon={
          <ArrowPathIcon
            className={classNames(
              "h-5 w-5 flex-shrink-0 text-white",
              !coverageEligibilityRequests && "animate-spin"
            )}
            aria-hidden="true"
          />
        }
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
        }))}
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
    </>
  );
}
