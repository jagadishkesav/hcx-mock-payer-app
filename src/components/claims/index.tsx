import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { listRequest } from "../../api/api";
import { navigate } from "raviger";
import Loading from "../common/Loading";
import { unbundleAs } from "../../utils/fhirUtils";
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { classNames } from "../common/AppLayout";
import SetTokenModal from "../common/SetTokenModal";
import Modal from "../common/Modal";
import { JsonViewer } from "@textea/json-viewer";

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
  gender: string;
  provider: string;
  address: string;
  items: Item[];
  diagnosis: Diagnosis[];
  insurance_no: string;
  requested_amount: string;
  approved_amount: string;
  status: string;
  medical_info: IAdditionalInfo;
  financial_info: IAdditionalInfo;
  resources: {
    patient: object;
    coverage: object;
    claim: object;
  };
};

export function currencyObjToString({
  currency,
  value,
}: {
  currency: string;
  value: number;
}) {
  if (typeof value === "string") {
    value = parseFloat((value as any).split(" ")[1]);
  }
  return currency + " " + value.toFixed(2);
}

export function parseAdditionalInfo(additional_info: any) {
  const { medical, financial } = additional_info;
  const approved_amount = (financial as IAdditionalInfo).approved_amount ?? 0;

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
  const { identifier } = claim.payload;

  const resources = {
    patient: unbundleAs(claim.payload, "Patient").resource,
    coverage: unbundleAs(claim.payload, "Coverage").resource,
    claim: unbundleAs(claim.payload, "Claim").resource,
  };

  const insurance_no = resources.coverage.subscriberId;
  const diagnosis = resources.claim.diagnosis as Diagnosis[];
  const items = resources.claim.item as Item[];
  const requested_amount = currencyObjToString(
    resources.claim.total ?? {
      currency: "INR",
      value: items?.map((i) => i.unitPrice.value).reduce((a, b) => a + b) ?? 0,
    }
  );

  return {
    id: claim.request_id,
    request_id: claim.request_id,
    request_no: identifier?.value,
    name: resources.patient.name[0].text,
    gender: resources.patient.gender,
    items,
    address: resources.patient.address,
    provider: resources.claim.provider.name,
    diagnosis: diagnosis,
    insurance_no,
    requested_amount,
    ...parseAdditionalInfo(claim.additional_info),
    ...(claim.status === "Pending" && { approved_amount: "-" }),
    status: claim.status,
    resources,
  };
}

export default function Claims() {
  const [claims, setClaims] = useState<ClaimDetail[]>();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showJSON, setShowJSON] = React.useState(false);
  const [claim, setClaim] = React.useState<{}>();

  async function getClaims() {
    setClaims(undefined);
    const res: any = await listRequest({ type: "claim" });
    setClaims(res.claim.map(claimsMapper));
  }

  async function getClaim(id: any): Promise<any> {
    const obj = claims?.find(
      (claim: any) => claim.request_id === id
    )
    setClaim(obj?.resources.claim);
    console.log('claim', claim)
  }

  useEffect(() => {
    getClaims();
  }, []);

  return (
    <>
      {showFilter && (
        <SetTokenModal
          onClose={() => {
            setShowFilter(false);
            getClaims();
          }}
        />
      )}
      <Table
        title="Claims"
        actions={[
          {
            element: (
              <>
                <FunnelIcon
                  className={classNames(
                    "h-5 w-5 flex-shrink-0 text-white hover:text-gray-200"
                  )}
                  aria-hidden="true"
                />
                Filter
              </>
            ),
            action: () => {
              setShowFilter(true);
            },
          },
          {
            element: (
              <>
                {" "}
                <ArrowPathIcon
                  className={classNames(
                    "h-5 w-5 flex-shrink-0 text-white",
                    !claims && "animate-spin"
                  )}
                  aria-hidden="true"
                />
                Refresh
              </>
            ),
            action: () => {
              getClaims();
            },
          },
        ]}
        headers={
          claims
            ? [
                "request_no", // last 8 digits of request_id
                "patient_name", // actually name
                "insurance_no",
                "requested_amount",
                "approved_amount",
                "provider",
                "status",
              ]
            : []
        }
        onRowClick={(request_id) => navigate(`/claims/${request_id}`)}
        data={
          (claims || []).map((claim) => ({
            ...claim,
            request_no: claim.request_no?.slice(-8),
            patient_name: claim.name,
          })) as any
        }
        rowActions={{
          "view payload" : {
            callback: (id) => {
              getClaim(id)
              setShowJSON(true)
            },
            actionType: "primary",
          },
        }}
        primaryColumnIndex={1}
      />
      {!claims && <Loading type="skeleton" length={5} />}

      {showJSON && (
        <Modal
          onClose={() => setShowJSON(false)}
          className="max-w-3xl w-full"
        >
          <div
            className={`mt-3 bg-slate-100 rounded-lg shadow-lg px-4 py-2 text-left ${
              !showJSON && "hidden"
            }`}
          >
            <JsonViewer value={claim} />
          </div>
        </Modal>
      )}
    </>
  );
}
