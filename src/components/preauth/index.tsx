import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import { listRequest } from "../../api/api";
import PreAuthDetails from "./PreAuthDetails";

type PreAuthDetailProps = {
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

type PreAuthDetail = {
  id: string;
  request_no: string;
  name: string;
  insurance_no: string;
  available_amount: string;
  requested_amount: string;
  expiry: string;
  status: string;
}

function makePreAuthDetailProps(claim: PreAuthDetail) : PreAuthDetailProps {
    return {
      id: claim.id,
      details: claim,
      attachments: [
        {
          name: "Photo",
          url: "google.com",
        },
        {
          name: "Photo",
          url: "google.com",
        }
      ]
    }
  }

export function resoureType(type: string) {
  return (entry: any) => entry.resource.resourceType === type;
}

async function getPreAuths() : Promise<PreAuthDetail[]> {
  const res: any = listRequest({ type: "preauth" });

  return res.preauth.map((preauth: any) => {
    const name = preauth.entry.find(resoureType("Patient"))?.resource.name[0].text;
    const insurance_no = preauth.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const available_amount = preauth.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const requested_amount = preauth.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const expiry = preauth.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const status = preauth.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    

    return {
      id: preauth.id,
      request_no: preauth.id,
      name,
      insurance_no,
      available_amount: "",
      requested_amount: "",
      expiry: "",
      status: "",
    }
  });
}

export default function PreAuths() {
  const [selectedRequest, setSelectedRequest] = useState<PreAuthDetailProps>();
  const [preauths, setPreauths] = useState<PreAuthDetail[]>([]);

  useEffect(() => {
    getPreAuths().then(setPreauths);
  }, []);

  return (
    <>
      <Table
        title="Pre Auth"
        headers={[
          "request_no",
          "name",
          "insurance_no",
          "available_amount",
          "requested_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(id) =>
            setSelectedRequest(
              () => makePreAuthDetailProps(preauths?.find((preauth) => preauth.id === id) as any)
            )
          }
        data={preauths}
        primaryColumnIndex={1}
      />
      {selectedRequest && (
        <Modal
          className="max-w-3xl w-full"
          onClose={() => setSelectedRequest(undefined)}
        >
          <div className="max-w-6xl w-full bg-white rounded-xl">
            <PreAuthDetails preauth={selectedRequest} />
          </div>
        </Modal>
      )}
    </>
  );
}
