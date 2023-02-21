import React from "react";
import {
  approveCoverageEligibilityRequest,
  rejectCoverageEligibilityRequest,
} from "../../api/api";
import { toast } from "react-toastify";
import { formatDate, properText } from "../../utils/StringUtils";
import StatusChip from "../common/StatusChip";

export default function CoverageDetail({ onAction, coverage }: any) {
  const handleReject = () => {
    rejectCoverageEligibilityRequest({ request_id: coverage.request_id });
    toast("Rejected Coverage Eligibility Request", { type: "error" });
    onAction();
  };

  const handleApprove = () => {
    approveCoverageEligibilityRequest({ request_id: coverage.request_id });
    toast("Approved Coverage Eligibility Request", { type: "success" });
    onAction();
  };

  return (
    <div className="flex flex-col justify-start w-full space-y-4">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg text-left">
        <div className="px-4 py-5 sm:px-6 max-w-4xl w-full">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Coverage Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {coverage.name}
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {Object.entries(coverage)
              .filter(([name, _]) => name !== "servicedPeriod")
              .map(([name, detail]: any) => {
                return (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {properText(name)}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {name === "status" ? (
                        <StatusChip status={detail} />
                      ) : (
                        detail
                      )}
                    </dd>
                  </div>
                );
              })}
            {coverage.servicedPeriod?.start && coverage.servicedPeriod.end && (
              <>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Serviced Period Start
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(coverage.servicedPeriod.start)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Serviced Period End
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(coverage.servicedPeriod.end)}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
        {coverage.status === "Pending" && (
          <div className="flex flex-row justify-end space-x-4 p-5 border-t border-gray-200 px-4 py-5 sm:px-6">
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleReject}
            >
              Reject
            </button>
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleApprove}
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
