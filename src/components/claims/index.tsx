import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import ClaimDetails from "./ClaimDetails";
import { listRequest } from "../../api/api";

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

type ClaimDetail = {
  id: string;
  request_no: string;
  name: string;
  insurance_no: string;
  available_amount: string;
  requested_amount: string;
  expiry: string;
  status: string;
};

function makeClaimDetailProps(claim: ClaimDetail) : ClaimDetailProps {
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

async function getClaims(): Promise<ClaimDetail[]> {
  const res: any = listRequest({ type: "claim" });

  return res.claim.map((claim: any) => {
    const name = claim.entry.find(resoureType("Patient"))?.resource.name[0]
      .text;
    const insurance_no = claim.entry.find(resoureType("Coverage"))?.resource
      .subscriberId;
    // const available_amount = claim.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const requested_amount = claim.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const expiry = claim.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const status = claim.entry.find(resoureType("Coverage"))?.resource.subscriberId;
    // const showActions = status === "pending"

    return {
      id: claim.id,
      request_no: claim.id,
      name,
      insurance_no,
      available_amount: "",
      requested_amount: "",
      expiry: "",
      status: "",
    };
  });
}

export default function Claims() {
  const [selectedRequest, setSelectedRequest] = useState<ClaimDetailProps>();
  const [claims, setClaims] = useState<ClaimDetail[]>([]);

  useEffect(() => {
    getClaims().then(setClaims);
  }, []);

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
        onRowClick={(id) =>
          setSelectedRequest(
            () => makeClaimDetailProps(claims?.find((claim) => claim.id === id) as any)
          )
        }
        data={claims}
        primaryColumnIndex={1}
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
