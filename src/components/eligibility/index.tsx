import { useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";

export default function CoverageEligibilityHome() {
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  return (
    <>
      <Table
        title="Coverage Eligibility"
        headers={["name", "email", "phone", "status"]}
        onRowClick={(id) => setSelectedRequest(id)}
        data={[
          {
            id: "1",
            name: "John Doe",
            email: "johndoe@swasthapp.com",
            phone: "1234567890",
            status: "Active",
          },
          {
            id: "2",
            name: "Jane Doe",
            email: "janedoe@swasthapp.com",
            phone: "1234567890",
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
