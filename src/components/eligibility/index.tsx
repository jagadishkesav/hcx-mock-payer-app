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
import { resoureType } from "../../utils/StringUtils";
import Loading from "../common/Loading";

function coverageEligibilityMapper(coverage: any) {
  const { entry, identifier } = coverage.payload;

  const name = entry.find(resoureType("Patient"))?.resource.name[0].text;
  const insurance_no = entry.find(resoureType("Coverage"))?.resource
    .subscriberId;
  const servicedPeriod = entry.find(resoureType("CoverageEligibilityRequest"))
    ?.resource.servicedPeriod;

  return {
    id: coverage.request_id,
    request_id: coverage.request_id,
    request_no: identifier.value,
    name,
    insurance_no,
    expiry: "2023-12-31",
    status: coverage.status,
    servicedPeriod,
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

  async function getCoverage() {
    setCoverageEligibilityRequests(undefined);
    const res: any = await listRequest({ type: "coverageeligibility" });
    return res.coverageeligibility.map(coverageEligibilityMapper);
  }

  useEffect(() => {
    getCoverage().then(setCoverageEligibilityRequests);
  }, []);

  if (!coverageEligibilityRequests) return <Loading />;

  return (
    <>
      <Table
        title="Coverage Eligibility"
        headers={["request_no", "name", "insurance_no", "expiry", "status"]}
        onRowClick={setSelectedRequest}
        data={coverageEligibilityRequests.map((coverage) => ({
          ...coverage,
          id: coverage.request_id,
        }))}
        rowActions={{
          approve: {
            callback: (request_id: any) => {
              approveCoverageEligibilityRequest({ request_id });
              toast("Coverage Eligibility Request Approved", {
                type: "success",
              });
              getCoverage().then(setCoverageEligibilityRequests);
            },
            actionType: "primary",
          },
          reject: {
            callback: (request_id: any) => {
              rejectCoverageEligibilityRequest({ request_id });
              toast("Coverage Eligibility Request Rejected", {
                type: "error",
              });
              getCoverage().then(setCoverageEligibilityRequests);
            },
            actionType: "danger",
          },
        }}
        showRowActions={(id) => {
          return (
            coverageEligibilityRequests.find(
              (request) => request.request_id === id
            )?.status === "Pending"
          );
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
              getCoverage().then(setCoverageEligibilityRequests);
            }}
            coverage={coverageEligibilityRequests.find(
              (request) => request.request_id === selectedRequest
            )}
          />
        </Modal>
      )}
    </>
  );
}
