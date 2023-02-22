import {
  PaperClipIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { formatDate, properText, textOrDash } from "../../utils/StringUtils";
import PriorityChip from "../common/PriorityChip";
import StatusChip from "../common/StatusChip";
import SupportingFiles from "./SupportingFiles";

const componentMap: { [key: string]: (detail: any) => JSX.Element } = {
  status: (detail: any) => (
    <div className="w-24">
      <StatusChip status={detail} />
    </div>
  ),
  address: (detail: any) => (
    <div className="col-span-2 md:col-span-1 w-3/12 md:w-auto">
      {textOrDash(
        detail?.map((a: any, i: number) => (
          <div key={i}>
            {a.text},
            <br />
            {a.city}, {a.state}, {a.postalCode},
            <br />
            {a.country}
          </div>
        ))
      )}
    </div>
  ),
};

export default function PatientDetails({ claim }: { claim: any }) {
  const includeFields = [
    "provider",
    "name",
    "insurance_no",
    "gender",
    "status",
    "address",
  ];

  const supportingFiles = claim.resources.claim.supportingInfo;
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="h-full w-full p-6 bg-white rounded-lg">
            <div className="text-gray-500 text-base font-bold pb-4">
              Patient Details
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(claim)
                .filter(([name, _]) => includeFields.includes(name))
                .map(([name, detail], index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className="font-semibold col-span-1">
                        {properText(name)}
                      </div>
                      <div>
                        {componentMap[name] ? componentMap[name](detail) as any : detail}
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-full p-6 bg-white rounded-lg">
            <div className="text-gray-500 text-base font-bold pb-4">
              Claim Details
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="font-semibold col-span-1">Billable Period</div>
              2023-01-01 - 2023-12-31
              <div className="font-semibold col-span-1">Resource Created</div>
              {claim.resources.claim.created
                ? formatDate(claim.resources.claim.created)
                : "--"}
              <div className="font-semibold col-span-1">Insurer</div>
              {textOrDash(claim.resources.claim.insurer.name)}
              <div className="font-semibold col-span-1">Provider</div>
              {textOrDash(claim.provider)}
              <div className="font-semibold col-span-1">Total Claim Cost</div>
              {claim.resources.claim.created
                ? formatDate(claim.resources.claim.created)
                : "--"}
              <div className="font-semibold col-span-1">Priority</div>
              <div className="w-24">
                <PriorityChip
                  status={claim.resources?.claim?.priority?.coding[0]?.code}
                />
              </div>
            </div>
          </div>
        </div>
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
