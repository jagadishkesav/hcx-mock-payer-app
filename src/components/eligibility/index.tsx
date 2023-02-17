import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import {
  approveCoverageEligibilityRequest,
  listRequest,
  rejectCoverageEligibilityRequest,
} from "../../api/api";

export function resoureType(type: string) {
  return (entry: any) => entry.resource.resourceType === type;
}

async function getCoverage() {
  const res: any = listRequest({ type: "coverageeligibility" });

  return res.coverageeligibility.map((coverage: any) => {
    let id = coverage.id;
    let name = coverage.entry?.find(resoureType("Patient"))?.resource?.name[0]
      .text;
    let insurance_no = coverage.entry?.find(resoureType("Coverage"))?.resource
      ?.subscriberId;

    return {
      id,
      request_no: id,
      name,
      insurance_no,
      available_amount: "₹1000",
      expiry: "2023-12-31",
      status: "pending",
    };
  });
}

export default function CoverageEligibilityHome() {
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  const [coverageEligibilityRequests, setCoverageEligibilityRequests] =
    useState<
      {
        id: string;
        request_no: string;
        name: string;
        insurance_no: string;
        avail_amount: string;
        expiry: string;
        status: string;
      }[]
    >([]);

  useEffect(() => {
    getCoverage().then(setCoverageEligibilityRequests);
  }, []);

  return (
    <>
      <Table
        title="Coverage Eligibility"
        headers={[
          "request_no",
          "name",
          "insurance_no",
          "available_amount",
          "expiry",
          "status",
        ]}
        onRowClick={(id) => {
          setSelectedRequest(id);
          console.log(
            coverageEligibilityRequests.find((request) => request.id === id)
          );
        }}
        data={coverageEligibilityRequests}
        rowActions={{
          approve: (identifier) => {
            approveCoverageEligibilityRequest({ identifier });
          },
          reject: (identifier) => {
            rejectCoverageEligibilityRequest({ identifier });
          },
        }}
        primaryColumnIndex={1}
      />
      {selectedRequest && (
        <Modal
          onClose={() => setSelectedRequest("")}
          className="max-w-3xl w-full"
        >
          <div className="flex flex-col justify-start w-full space-y-4">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg text-left">
              <div className="px-4 py-5 sm:px-6 max-w-4xl w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Coverage Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Name</p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {Object.entries({
                    ...coverageEligibilityRequests.find(
                      (request) => request.id === selectedRequest
                    ),
                  }).map(([name, detail]: any) => {
                    return (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          {name}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{detail}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
              <div className="flex flex-row justify-end space-x-4 p-5 border-t border-gray-200 px-4 py-5 sm:px-6">
                <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Reject
                </button>
                <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Approve
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
