import React, { useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import ClaimDetails from "./ClaimDetails";

type ClaimDetailProps = {
  id: string;
  details: {
    request_no: string;
    name: string;
    insurance_no: string;
    available_amount: string;
    requested_amount: string;
    expiry: string;
  };
  attachments: {
    name: string;
    url: string;
  }[];
};

const createMockClaim = (id: string) => {
  return {
    id: id,
    details: {
      request_no: "claim-3431",
      name: "John Doe",
      insurance_no: "1234567890",
      available_amount: "₹1000",
      requested_amount: "₹500",
      expiry: "2021-12-31",
    },
    attachments: [
      {
        name: "mri_report_p_13458.pdf",
        url: "https://www.google.com",
      },
    ],
  };
};

export default function Claims() {
  const [selectedRequest, setSelectedRequest] = useState<ClaimDetailProps>();
  return (
    <>
      <Table
        title="Claims"
        headers={[
          "request_no",
          "name",
          "insurance_no",
          "available_amount",
          "requested_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(id) => setSelectedRequest(() => createMockClaim(id))}
        data={[
          {
            id: "1",
            request_no: "claim-3431",
            name: "John Doe",
            insurance_no: "1234567890",
            available_amount: "₹1000",
            requested_amount: "₹500",
            expiry: "2021-12-31",
            status: "Active",
          },
          {
            id: "2",
            request_no: "claim-3432",
            name: "Jane Doe",
            insurance_no: "1234567890",
            available_amount: "₹1000",
            requested_amount: "₹500",
            expiry: "2021-12-31",
            status: "Active",
          },
        ]}
      />
      {selectedRequest && (
        <Modal
          className="max-w-3xl w-full"
          onClose={() => setSelectedRequest(undefined)}
        >
          <div className="max-w-6xl w-full bg-white rounded-xl">
            <ClaimDetails claim={selectedRequest} />
          </div>
        </Modal>
      )}
    </>
  );
}
