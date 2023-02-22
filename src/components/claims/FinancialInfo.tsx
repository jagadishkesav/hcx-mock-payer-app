import { useState } from "react";
import { ClaimDetail } from ".";
import StatusChip from "../common/StatusChip";
import Table from "../common/Table";
import { RejectApproveHandlers } from "./ClaimDetails";

export default function FinancialInfo({
  claim,
  ...props
}: { claim: ClaimDetail }) {
  const medical_info = claim.medical_info;
  const financial_info = claim.financial_info;
  const [approvedAmount, setApprovedAmount] = useState(
    parseFloat(
      (
        financial_info.approved_amount ||
        claim.medical_info.approved_amount ||
        claim.requested_amount
      )
        .toString()
        .replace("INR ", "")
    )
  );
  const [remarks, setRemarks] = useState(financial_info.remarks);
  const status = financial_info.status;

  return (
    <div className="px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">
            Requested Amount
          </dt>
          <dd className="mt-1 text-sm text-gray-900">
            {claim.requested_amount || "-"}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Approved Amount</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {financial_info.approved_amount || "-"}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {<StatusChip status={status} />}
          </dd>
        </div>
        {claim.items && claim.items.length > 0 && (
          <Table
            title=""
            headers={["display", "code", "value"]}
            data={claim.items.map((item: any) => ({
              id: item.productOrService.coding[0].code,
              display: item.productOrService.coding[0].display,
              code: item.productOrService.coding[0].code,
              value: `${item.unitPrice.value} ${item.unitPrice.currency}`,
            }))}
          />
        )}
      </dl>
    </div>
  );
}
