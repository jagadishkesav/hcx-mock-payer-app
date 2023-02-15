import { useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";

export default function Claims() {
  const [selectedRequest, setSelectedRequest] = useState<string>("");
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
        onRowClick={(id) => setSelectedRequest(id)}
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
        rowActions={{
          edit: () => {},
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
