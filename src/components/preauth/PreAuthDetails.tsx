import React, { useEffect } from "react";
import { properText, resoureType } from "../../utils/StringUtils";

import { approvePreauth, listRequest, rejectPreauth } from "../../api/api";
import { toast } from "react-toastify";
import { navigate } from "raviger";

const Tabs = ({ tabs, activeTab, setActiveTab }: any) => {
  return (
    <div className="flex flex-col justify-start w-1/4 space-y-4 mt-8">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          className={`py-2 text-sm ${
            activeTab.id === tab.id
              ? "border-r-2 transform border-blue-500 font-bold"
              : " transform -translate-x-2"
          }`}
          onClick={(e) => {
            setActiveTab(tab);
          }}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

const tabList = [
  { id: "patient_details", name: "Patient Details" },
  { id: "medical", name: "Medical Info" },
  { id: "financial", name: "Financial Info" },
];

export default function PreAuthDetails({ id }: { id: string }) {
  const [activeTab, setActiveTab] = React.useState({
    id: "patient_details",
    name: "Patient Details",
  });
  const [preauth, setPreauth] = React.useState<any>({});
  const [approvedAmount, setApprovedAmount] = React.useState<any>({
    medical: 0,
    financial: 0,
  });
  const [remarks, setRemarks] = React.useState<any>({
    medical: "",
    financial: "",
  });

  useEffect(() => {
    async function fetchData() {
      let allPreAuths = await listRequest({ type: "preauth" });
      if (allPreAuths) {
        let preAuth = allPreAuths.preauth.find(
          (preauth: any) => preauth.request_id === id
        );
        let preAuthPayload = JSON.parse(preAuth.payload);
        const name = preAuthPayload.entry.find(resoureType("Patient"))?.resource
          .name[0].text;
        const insurance_no = preAuthPayload.entry.find(resoureType("Coverage"))
          ?.resource.subscriberId;

        setPreauth({
          id: preAuth.request_id,
          request_no: preAuthPayload.identifier.value,
          name,
          insurance_no,
          available_amount: "₹1000",
          requested_amount: "₹1000",
          expiry: "2023-12-12",
          status: preAuth.status,
        });

        let additionalInfo = preAuth.additional_info;

        if (additionalInfo.medical.status === "Approved") {
          setApprovedAmount({
            ...approvedAmount,
            medical: additionalInfo.medical.approved_amount,
          });
          setRemarks({ ...remarks, medical: additionalInfo.medical.remarks });
        }
        if (additionalInfo.financial.status === "Approved") {
          setApprovedAmount({
            ...approvedAmount,
            financial: additionalInfo.financial.approved_amount,
          });
          setRemarks({
            ...remarks,
            financial: additionalInfo.financial.remarks,
          });
        }
      }
    }
    fetchData();
  }, [id]);

  const handleReject = () => {
    rejectPreauth({ request_id: preauth.request_id, type: activeTab.id });
    toast("Preauth Rejected", {
      type: "error",
    });
    navigate("/preauths");
  };

  const handleApprove = () => {
    approvePreauth({
      request_id: preauth.id,
      type: activeTab.id,
      remarks: remarks[activeTab.id],
      approved_amount: approvedAmount[activeTab.id],
    });
    toast("Preauth Approved", {
      type: "success",
    });
    navigate("/preauths");
  };

  return (
    preauth && (
      <div className="flex flex-col justify-start w-full space-y-4">
        <div className="flex flex-row justify-start w-full">
          <Tabs
            tabs={tabList}
            activeTab={activeTab}
            setActiveTab={(next: any) => setActiveTab(next)}
          />
          <div className="flex flex-col justify-start w-3/4 space-y-4">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg text-left">
              <div className="px-4 py-5 sm:px-6 max-w-4xl w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Pre Auth Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {preauth.request_no}
                </p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {Object.entries(preauth).map(([name, detail]: any) => {
                    return (
                      <div className="sm:col-span-1" key={name}>
                        <dt className="text-sm font-medium text-gray-500">
                          {properText(name)}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{detail}</dd>
                      </div>
                    );
                  })}
                  {activeTab.id !== "patient_details" &&
                    preauth.status === "Pending" && (
                      <>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Approval Amount
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <input
                              type="number"
                              value={approvedAmount[activeTab.id]}
                              onChange={(e) =>
                                setApprovedAmount({
                                  ...approvedAmount,
                                  [activeTab.id]: e.target.value,
                                })
                              }
                              className="w-full h-9 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Remarks
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <textarea
                              value={remarks[activeTab.id]}
                              onChange={(e) =>
                                setRemarks({
                                  ...remarks,
                                  [activeTab.id]: e.target.value,
                                })
                              }
                              className="w-full h-32 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                          </dd>
                        </div>
                      </>
                    )}
                </dl>
              </div>
            </div>
            {/* Action Buttons */}
            {activeTab.id !== "patient_details" &&
              preauth.status === "Pending" && (
                <div className="flex flex-row justify-end w-full space-x-4 p-5">
                  <button
                    onClick={handleReject}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Approve
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    )
  );
}
