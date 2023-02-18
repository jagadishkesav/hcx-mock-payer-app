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

async function getCoverage() {
  const res: any = await listRequest({ type: "coverageeligibility" });

  return res.coverageeligibility.map((coverage: any) => {
    let id = coverage.id;
    let name = coverage.entry?.find(resoureType("Patient"))?.resource?.name[0]
      .text;
    let insurance_no = coverage.entry?.find(resoureType("Coverage"))?.resource
      ?.subscriberId;

    return {
      id,
      request_no: id,
      name,
      insurance_no,
      available_amount: "₹1000",
      expiry: "2023-12-31",
      status: "pending",
    };
  });
}

export default function CoverageEligibilityHome() {
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  const [coverageEligibilityRequests, setCoverageEligibilityRequests] =
    useState<
      {
        id: string;
        request_no: string;
        name: string;
        insurance_no: string;
        avail_amount: string;
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
          "available_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(id) => {
          setSelectedRequest(id);
          console.log(
            coverageEligibilityRequests.find((request) => request.id === id)
          );
        }}
        data={coverageEligibilityRequests}
        rowActions={{
          approve: (identifier) => {
            approveCoverageEligibilityRequest({ identifier });
            toast("Coverage Eligibility Request Approved", {
              type: "success",
            });
          },
          reject: (identifier) => {
            rejectCoverageEligibilityRequest({ identifier });
            toast("Coverage Eligibility Request Rejected", {
              type: "error",
            });
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
            onAction={() => setSelectedRequest("")}
            coverage={coverageEligibilityRequests.find(
              (request) => request.id === selectedRequest
            )}
          />
        </Modal>
      )}
    </>
  );
}
