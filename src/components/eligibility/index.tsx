import React, { useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";

export default function CoverageEligibilityHome() {
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  return (
    <>
      <Table
        title="Coverage Eligibility"
        headers={[
          "name",
          "insurance_no",
          "available_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(id) => setSelectedRequest(id)}
        data={[
          {
            id: "1",
            name: "John Doe",
            insurance_no: "1234567890",
            available_amount: "₹1000",
            expiry: "2021-12-31",
            status: "pending",
          },
          {
            id: "2",
            name: "Jane Doe",
            insurance_no: "1234567890",
            available_amount: "₹1000",
            expiry: "2021-12-31",
            status: "pending",
          },
        ]}
        rowActions={{
          approve: () => {},
          reject: () => {},
        }}
      />
      {selectedRequest && (
        <Modal onClose={() => setSelectedRequest("")}>
          <div className="bg-white p-12 rounded-xl">{selectedRequest}</div>
        </Modal>
      )}
    </>
  );
}
