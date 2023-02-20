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

function coverageEligibilityMapper(coverage: any) {
  const { entry, identifier } = coverage.payload;

  const name = entry.find(resoureType("Patient"))?.resource.name[0].text;
  const insurance_no = entry.find(resoureType("Coverage"))?.resource
    .subscriberId;

  return {
    id: coverage.request_id,
    request_id: coverage.request_id,
    request_no: identifier.value,
    name,
    insurance_no,
    expiry: "2023-12-31",
    status: coverage.status,
  };
}

async function getCoverage() {
  const res: any = await listRequest({ type: "coverageeligibility" });

  return res.coverageeligibility.map(coverageEligibilityMapper);
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
    >([]);

  useEffect(() => {
    getCoverage().then(setCoverageEligibilityRequests);
  }, []);

  return (
    <>
      <Table
        title="Coverage Eligibility"
        headers={[
          "request_no",
          "name",
          "insurance_no",
          "expiry",
          "status",
        ]}
        onRowClick={(id) => {
          setSelectedRequest(id);
          console.log(
            coverageEligibilityRequests.find(
              (request) => request.request_id === id
            )
          );
        }}
        data={coverageEligibilityRequests}
        rowActions={{
          approve: (request_id) => {
            approveCoverageEligibilityRequest({ request_id });
            toast("Coverage Eligibility Request Approved", {
              type: "success",
            });
          },
          reject: (request_id) => {
            rejectCoverageEligibilityRequest({ request_id });
            toast("Coverage Eligibility Request Rejected", {
              type: "error",
            });
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
            onAction={() => setSelectedRequest("")}
            coverage={coverageEligibilityRequests.find(
              (request) => request.request_id === selectedRequest
            )}
          />
        </Modal>
      )}
    </>
  );
}
