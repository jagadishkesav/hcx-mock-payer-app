import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest } from "../../api/api";
import { navigate } from "raviger";
import { resoureType } from "../../utils/StringUtils";
import Loading from "../common/Loading";

export interface IAdditionalInfo {
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  approved_amount?: number;
}
export interface Item {
  unitPrice: {
    currency: string;
    value: number;
  };
  sequence: number;
  productOrService: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
}

export interface DiagnosisCoding {
  system: string;
  code: string;
  display: string;
}

export interface Diagnosis {
  sequence: number;
  type: { coding: DiagnosisCoding[] }[];
  diagnosisCodeableConcept: {
    coding: DiagnosisCoding[];
    text: string;
  };
}

export type ClaimDetail = {
  id: string;
  request_id: string;
  request_no: string;
  name: string;
  items: Item[];
  diagnosis: Diagnosis[];
  insurance_no: string;
  requested_amount: string;
  approved_amount: string;
  expiry: string;
  status: string;
  medical_info: IAdditionalInfo;
  financial_info: IAdditionalInfo;
};

export function currencyObjToString({
  currency,
  value,
}: {
  currency: string;
  value: number;
}) {
  return currency + " " + value.toFixed(2);
}

export function parseAdditionalInfo(additional_info: any) {
  const { medical, financial } = additional_info;
  const approved_amount =
    ((medical as IAdditionalInfo).approved_amount ?? 0) +
    ((financial as IAdditionalInfo).approved_amount ?? 0);

  return {
    approved_amount: currencyObjToString({
      currency: "INR",
      value: approved_amount,
    }),
    medical_info: medical,
    financial_info: financial,
  };
}

export function claimsMapper(claim: any): ClaimDetail {
  const { entry, identifier } = claim.payload;

  const name = entry.find(resoureType("Patient"))?.resource.name[0].text;
  const insurance_no = entry.find(resoureType("Coverage"))?.resource
    .subscriberId;
  const { total, items, diagnosis } = entry.find(
    resoureType("Claim")
  )?.resource;

  return {
    id: claim.request_id,
    request_id: claim.request_id,
    request_no: identifier.value,
    name,
    items,
    diagnosis: diagnosis,
    insurance_no,
    requested_amount: total && currencyObjToString(total),
    ...parseAdditionalInfo(claim.additional_info),
    expiry: "2023-12-12",
    status: claim.status,
  };
}

export async function getClaims(): Promise<ClaimDetail[]> {
  const res: any = await listRequest({ type: "claim" });
  return res.claim.map(claimsMapper);
}

export default function Claims() {
  const [claims, setClaims] = useState<ClaimDetail[]>();

  useEffect(() => {
    getClaims().then(setClaims);
  }, []);

  if (!claims) return <Loading />;

  return (
    <>
      <Table
        title="Claims"
        headers={[
          "request_no",
          "name",
          "insurance_no",
          "requested_amount",
          "approved_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(request_id) => navigate(`/claims/${request_id}`)}
        data={claims as any}
        primaryColumnIndex={1}
      />
    </>
  );
}
