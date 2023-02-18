import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest } from "../../api/api";
import { navigate } from "raviger";
import { resoureType } from "../../utils/StringUtils";

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

async function getClaims(): Promise<ClaimDetail[]> {
  const res: any = await listRequest({ type: "claim" });

  return res.claim.map((claim: any) => {
    const name = claim.entry.find(resoureType("Patient"))?.resource.name[0]
      .text;
    const insurance_no = claim.entry.find(resoureType("Coverage"))?.resource
      .subscriberId;
    return {
      id: claim.id,
      request_no: claim.identifier.value,
      name,
      insurance_no,
      available_amount: "₹1000",
      requested_amount: "₹1000",
      expiry: "2023-12-12",
      status: "pending",
    };
  });
}

export default function Claims() {
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
          navigate(`/claims/${id}`)
        }
        data={claims}
        primaryColumnIndex={1}
      />
    </>
  );
}
