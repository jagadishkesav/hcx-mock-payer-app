import React, { useEffect } from "react";
import { properText, resoureType } from "../../utils/StringUtils";
import { approveClaim, listRequest, rejectClaim } from "../../api/api";
import { toast } from "react-toastify";
import { navigate } from "raviger";
import { claimsMapper } from ".";

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

function ItemTable(items: any) {
  return (
    <table>
      <thead>
        <tr>
          <th>Display</th>
          <th>Code</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: any) => (
          <tr key={item.productOrService.coding[0].code}>
            <td>{item.productOrService.coding[0].display}</td>
            <td>{item.productOrService.coding[0].code}</td>
            <td>{item.unitPrice.value} {item.unitPrice.currency}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default function ClaimDetails({ request_id }: { request_id: string }) {
  const [activeTab, setActiveTab] = React.useState({
    id: "patient_details",
    name: "Patient Details",
  });
  const [claim, setClaim] = React.useState<any>({});
  const [approvedAmount, setApprovedAmount] = React.useState(0);
  const [remarks, setRemarks] = React.useState("");

  async function getClaims(): Promise<any> {
    const res: any = await listRequest({ type: "claim" });
    const claim = res.claim.find((claim: any) => claim.request_id === request_id);
    console.log(res,claim);
    return claimsMapper(claim);
  }

  useEffect(() => {
    getClaims().then(setClaim);
  }, [request_id]);

  const handleReject = () => {
    rejectClaim({ request_id: claim.request_id, type: activeTab.id });
    toast("Claim Rejected", {
      type: "success",
    });
    navigate("/claims");
  };

  const handleApprove = () => {
    approveClaim({
      request_id: claim.request_id,
      type: activeTab.id,
      remarks,
      approved_amount: approvedAmount,
    });
    toast("Claim Approved", {
      type: "success",
    });
    navigate("/claims");
  };

  return (
    claim && (
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
                  Claim Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {claim.id}
                </p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {Object.entries(claim).map(([name, detail]: any) => {
                    return (
                      <div className="sm:col-span-1" key={name}>
                        <dt className="text-sm font-medium text-gray-500">
                          {properText(name)}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{detail}</dd>
                      </div>
                    );
                  })}
                  {activeTab.id === "patient_details" && (
                    ItemTable(claim.items)
                  )}
                  {activeTab.id !== "patient_details" && (
                    <>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Approval Amount
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <input
                            onChange={(e) =>
                              setApprovedAmount(parseInt(e.target.value))
                            }
                            value={approvedAmount}
                            disabled={claim.status !== "pending"}
                            type="number"
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
                            onChange={(e) => setRemarks(e.target.value)}
                            value={remarks}
                            disabled={claim.status !== "pending"}
                            className="w-full h-32 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          ></textarea>
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>
            {activeTab.id !== "patient_details" && (
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
