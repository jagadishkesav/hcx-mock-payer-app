import React, { useEffect } from "react";

import { approvePreauth, listRequest, rejectPreauth } from "../../api/api";
import { toast } from "react-toastify";
import { preAuthMapper } from ".";
import FinancialInfo from "../claims/FinancialInfo";
import MedicalInfo from "../claims/MedicalInfo";
import PatientDetails from "../claims/PatientDetails";
import Loading from "../common/Loading";
import Heading from "../common/Heading";
import Tabs from "../common/Tabs";

import { JsonViewer } from "@textea/json-viewer";

const handleReject = ({ request_id, type }: any) => {
  rejectPreauth({ request_id, type });
  toast("Pre Auth Rejected", {
    type: "success",
  });
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
};

export default function PreAuthDetails({ request_id }: { request_id: string }) {
  const [activeTab, setActiveTab] = React.useState("patient_details");
  const [preauth, setPreauth] = React.useState<any>(undefined);

  async function getPreAuths(): Promise<any> {
    const res: any = await listRequest({ type: "preauth" });
    const preauth = res.preauth.find(
      (preauth: any) => preauth.request_id === request_id
    );
    return setPreauth(preAuthMapper(preauth));
  }

  useEffect(() => {
    getPreAuths();
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
          handleApprove={async (e) => {
            await handleApprove(e);
            getPreAuths();
          }}
          handleReject={async (e) => {
            await handleReject(e);
            getPreAuths();
          }}
        />
      ),
    },
    {
      id: "financial",
      name: "Financial Info",
      children: (
        <FinancialInfo
          claim={preauth}
        />
      ),
    },
  ];

  if (!preauth) return <Loading />;

  return (
    <div>
      <Heading heading="Pre Auth Details" />
      <div className="flex flex-col gap-8">
        <Tabs
          tabs={tabList}
          activeTab={activeTab}
          setActiveTab={(next: any) => setActiveTab(next)}
        />
        <div
          className="whitespace-pre
        "
        >
          <JsonViewer value={preauth.resources.claim} />
        </div>
      </div>
    </div>
  );
}
