import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest } from "../../api/api";
import { resoureType } from "../../utils/StringUtils";
import { navigate } from "raviger";
import { IAdditionalInfo, Item, parseAdditionalInfo, currencyObjToString } from "../claims";
import Loading from "../common/Loading";

type PreAuthDetail = {
  id: string;
  request_id: string;
  request_no: string;
  name: string;
  items: Item[];
  insurance_no: string;
  requested_amount: string;
  approved_amount: string;
  expiry: string;
  status: string;
  medical_info: IAdditionalInfo;
  financial_info: IAdditionalInfo;
};

export function preAuthMapper(preauth: any) : PreAuthDetail {
  const { entry, identifier } = preauth.payload;

  const name = entry.find(resoureType("Patient"))?.resource.name[0].text;
  const insurance_no = entry.find(resoureType("Coverage"))?.resource.subscriberId;
  const items = entry.find(resoureType("Claim"))?.resource.item as Item[];
  const requested_amount = entry.find(resoureType("Claim"))?.resource.total ?? currencyObjToString({ currency: "INR", value: items.map(i => i.unitPrice.value).reduce((a, b) => a + b) });

  return {
    id: preauth.request_id,
    request_id: preauth.request_id,
    request_no: identifier.value,
    name,
    items,
    insurance_no,
    requested_amount,
    ...parseAdditionalInfo(preauth.additional_info),
    expiry: "2023-12-12",
    status: preauth.status,
  };  
}

export async function getPreAuths(): Promise<PreAuthDetail[]> {
  const res: any = await listRequest({ type: "preauth" });
  return res.preauth.map(preAuthMapper);
}

export default function PreAuths() {
  const [preauths, setPreauths] = useState<PreAuthDetail[]>();

  useEffect(() => {
    getPreAuths().then(setPreauths);
  }, []);

  if (!preauths) return <Loading />;

  return (
    <>
      <Table
        title="Pre Auth"
        headers={[
          "request_no",
          "name",
          "insurance_no",
          "approved_amount",
          "requested_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(id) => navigate(`/preauths/${id}`)}
        data={preauths as any}
        primaryColumnIndex={1}
      />
    </>
  );
}
