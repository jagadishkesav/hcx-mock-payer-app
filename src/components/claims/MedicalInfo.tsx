import { ClaimDetail } from ".";
import StatusChip from "../common/StatusChip";
import Table from "../common/Table";
import { RejectApproveHandlers } from "./ClaimDetails";

export default function MedicalInfo({
  claim,
  ...props
}: { claim: ClaimDetail } & RejectApproveHandlers) {
  const status = claim.medical_info.status;

  return (
    <div className="px-4 py-5 sm:px-6">
      <dl>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {<StatusChip status={status} />}
          </dd>
        </div>
        {claim.diagnosis && claim.diagnosis.length > 0 && (
          <Table
            title=""
            headers={["display", "code", "text"]}
            data={claim.diagnosis.map((item) => ({
              id: item.diagnosisCodeableConcept.coding[0].code,
              display: item.type[0].coding[0].display,
              code: item.diagnosisCodeableConcept.coding[0].code,
              text: item.diagnosisCodeableConcept.text,
            }))}
          />
        )}
      </dl>
    </div>
  );
}
