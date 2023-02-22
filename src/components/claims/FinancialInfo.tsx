import { useState } from "react";
import { ClaimDetail } from ".";
import { textOrDash } from "../../utils/StringUtils";
import Heading from "../common/Heading";
import StatusChip from "../common/StatusChip";
import Table from "../common/Table";
import { RejectApproveHandlers } from "./ClaimDetails";
import SupportingFiles from "./SupportingFiles";

export default function FinancialInfo({
  claim,
  ...props
}: {
  claim: ClaimDetail;
}) {
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
  const supportingFiles = (claim as any).resources.claim.supportingInfo;
  return (
    <>
      <div className="p-6 bg-white rounded-lg">
        <div className="text-gray-500 text-base font-bold pb-4">
          Financial Details
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="font-semibold col-span-1">Requested Amount</div>
          {textOrDash(claim.requested_amount)}
          <div className="font-semibold col-span-1">Approved Amount</div>
          {textOrDash(claim.approved_amount)}
          <div className="font-semibold col-span-1">Status</div>
          <div className="w-24">{<StatusChip status={status} />}</div>
        </div>
      </div>
      <div className=" mt-8 p-6 bg-white rounded-lg">
        <h1 className="font-bold mt-2 mb-2">Bill</h1>
        {claim.items && claim.items.length > 0 ? (
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
        ) : (
          "-"
        )}
      </div>
      <dl className="mt-8 rounded-lg bg-white p-6">
        <div className="text-gray-500 text-base font-bold pb-4">
          Supporting Files
        </div>
        <SupportingFiles supportingFiles={supportingFiles} />
      </dl>
    </>
  );
}
