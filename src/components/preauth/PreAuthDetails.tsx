import React, { useEffect } from "react";

import { approvePreauth, listRequest, rejectPreauth } from "../../api/api";
import { toast } from "react-toastify";
import { navigate } from "raviger";
import { preAuthMapper } from ".";
import { FinancialInfo, MedicalInfo, PatientDetails, Tabs } from "../claims/ClaimDetails";
import Loading from "../common/Loading";

const handleReject = ({ request_id, type }: any) => {
  rejectPreauth({ request_id, type });
  toast("Pre Auth Rejected", {
    type: "success",
  });
  navigate("/preauths");
};

const handleApprove = ({ request_id, type, remarks, approved_amount }: any) => {
  approvePreauth({
    request_id,
    type,
    remarks,
    approved_amount,
  });
  toast("Pre Auth Approved", {
    type: "success",
  });
  navigate("/preauths");
};

export default function PreAuthDetails({ request_id }: { request_id: string }) {
  const [activeTab, setActiveTab] = React.useState("patient_details");
  const [preauth, setPreauth] = React.useState<any>({});

  async function getPreAuths(): Promise<any> {
    const res: any = await listRequest({ type: "preauth" });
    const preauth = res.preauth.find(
      (preauth: any) => preauth.request_id === request_id
    );
    return preAuthMapper(preauth);
  }

  useEffect(() => {
    getPreAuths().then(setPreauth);
  }, [request_id]);

  const tabList = [
    {
      id: "patient_details",
      name: "Patient Details",
      children: <PatientDetails claim={preauth} />,
    },
    {
      id: "medical",
      name: "Medical Info",
      children: (
        <MedicalInfo
          claim={preauth}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      ),
    },
    {
      id: "financial",
      name: "Financial Info",
      children: (
        <FinancialInfo
          claim={preauth}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      ),
    },
  ];

  if (!preauth) return <Loading />;

  return (
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
                  {preauth.id}
                </p>
              </div>
              {tabList.find(
                (tab: any) => tab.id === activeTab
              )?.children}
            </div>
          </div>
        </div>
      </div>
  );
}
