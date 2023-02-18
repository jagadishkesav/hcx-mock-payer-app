import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest } from "../../api/api";
import { resoureType } from "../../utils/StringUtils";
import { navigate } from "raviger";

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

async function getPreAuths() : Promise<PreAuthDetail[]> {
  const res: any = await listRequest({ type: "preauth" });

  return res.preauth.map((preauth: any) => {
    const name = preauth.entry.find(resoureType("Patient"))?.resource.name[0].text;
    const insurance_no = preauth.entry.find(resoureType("Coverage"))?.resource.subscriberId;

    return {
      id: preauth.id,
      request_no: preauth.identifier.value,
      name,
      insurance_no,
      available_amount: "₹1000",
      requested_amount: "₹1000",
      expiry: "2023-12-12",
      status: "pending",
    }
  });
}

export default function PreAuths() {
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
            navigate(`/preauths/${id}`)
          }
        data={preauths}
        primaryColumnIndex={1}
      />
    </>
  );
}
