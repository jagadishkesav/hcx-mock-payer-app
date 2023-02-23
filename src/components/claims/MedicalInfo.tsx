import { ClaimDetail } from ".";
import EmptyState from "../common/EmptyState";
import StatusChip from "../common/StatusChip";
import Table from "../common/Table";
import { RejectApproveHandlers } from "./ClaimDetails";
import SupportingFiles from "./SupportingFiles";

export default function MedicalInfo({
  claim,
  ...props
}: {
  claim: ClaimDetail;
}) {
  const status = claim.medical_info.status;
  const supportingFiles = (claim as any).resources.claim.supportingInfo;
  return (
    <>
      <div className="p-6 bg-white rounded-lg">
        <div className="text-gray-500 text-base font-bold">Diagnosis</div>
        {claim.diagnosis && claim.diagnosis.length > 0 ? (
          <Table
            title=""
            showBorder={true}
            headers={["display", "code"]}
            data={[
              ...claim.diagnosis
                .filter(
                  (item: any) => item.diagnosisCodeableConcept !== undefined
                )
                .map((item) => ({
                  id: item.diagnosisCodeableConcept.coding[0].code,
                  display: item.type[0].coding[0].display,
                  code: item.diagnosisCodeableConcept.coding[0].code,
                  // text: item.diagnosisCodeableConcept.text,
                })),
              ...claim.diagnosis
                .filter((item: any) => item.diagnosisReference !== undefined)
                .map((item: any) => ({
                  id: item.diagnosisReference.code.coding[0].code,
                  display: item.diagnosisReference.code.coding[0].display,
                  code: item.diagnosisReference.code.coding[0].code,
                })),
            ]}
          />
        ):(
          <EmptyState
          title="No Diagnosis found"
          description="No Diagnosis have been added to this claim."
        />
        )}
      </div>
      <div className="p-6 bg-white rounded-lg mt-6">
        <div className="text-gray-500 text-base font-bold">Procedures</div>
        {/* using bill items temporarily */}
        {claim.items && claim.items.length > 0 ? (
          <Table
            title=""
            showBorder={true}
            headers={["display", "code", "value"]}
            data={claim.items.map((item: any) => ({
              id: item.productOrService.coding[0].code,
              display: item.productOrService.coding[0].display,
              code: item.productOrService.coding[0].code,
              value: `${item.unitPrice.value} ${item.unitPrice.currency}`,
            }))}
          />
        ) : (
          <EmptyState
            title="No Procedures found"
            description="No Procedures have been added to this claim."
          />
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
