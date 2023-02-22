import React, { useEffect, useState } from "react";
import { properText } from "../../utils/StringUtils";
import { approveClaim, listRequest, rejectClaim } from "../../api/api";
import { toast } from "react-toastify";
import { ClaimDetail, claimsMapper } from ".";
import Table from "../common/Table";
import Loading from "../common/Loading";
import StatusChip from "../common/StatusChip";
import Heading from "../common/Heading";
import Tabs from "../common/Tabs";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import Checklist, { ChecklistItem } from "../common/Checklist";

import { JsonViewer } from "@textea/json-viewer";
import FinancialInfo from "./FinancialInfo";
import PatientDetails from "./PatientDetails";
import MedicalInfo from "./MedicalInfo";

export const Tabss = ({ tabs, activeTab, setActiveTab }: any) => {
  return (
    <div className="flex flex-col justify-start w-1/4 space-y-4 mt-8">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          className={`py-3 text-sm bg-white rounded-lg ${activeTab === tab.id
            ? "border-r-2 transform border-blue-500 font-bold"
            : " transform -translate-x-2"
            }`}
          onClick={(e) => {
            setActiveTab(tab.id);
          }}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export interface RejectApproveHandlers {
  handleReject: typeof handleReject;
  handleApprove: typeof handleApprove;
}

const handleReject = async ({ request_id, type }: any) => {
  await rejectClaim({ request_id, type });
  toast("Claim Rejected", { type: "success" });
};

const handleApprove = async ({
  request_id,
  type,
  remarks,
  approved_amount,
}: any) => {
  await approveClaim({
    request_id,
    type,
    remarks,
    approved_amount,
  });
  toast("Claim Approved", { type: "success" });
};

export default function ClaimDetails({ request_id }: { request_id: string }) {

  const [activeTab, setActiveTab] = React.useState("patient_details");
  const [claim, setClaim] = React.useState<ClaimDetail | null>(null);

  const [medicineApproval, setMedicineApproval] = useState<{ remarks: string | undefined, amount: number }>({
    remarks: "",
    amount: 0,
  });

  const [financialApproval, setFinancialApproval] = useState<{ remarks: string | undefined, amount: number }>({
    remarks: "",
    amount: 0,
  });

  async function getClaims(): Promise<any> {
    const res: any = await listRequest({ type: "claim" }, true);
    const claim = res.claim.find(
      (claim: any) => claim.request_id === request_id
    );
    setClaim(claimsMapper(claim));
  }

  useEffect(() => {
    if (!claim) return;
    setMedicineApproval({
      amount: parseFloat(
        (claim.medical_info.approved_amount || claim.requested_amount)
          .toString()
          .replace("INR ", "")
      ),
      remarks: claim.medical_info.remarks,
    });
  }, [claim]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      name: "Treatment in line with diagnosis",
    },
    {
      id: "2",
      name: "Discharge summary available",
    },
    {
      id: "3",
      name: "Discharge summary in line with treatment",
    },
  ])

  const [financialCheckList, setFinancialCheckList] = useState<ChecklistItem[]>([
    {
      id: "1",
      name: "Amount within wallet range?",
    },
    {
      id: "2",
      name: "Procedures not in exclusion list? "
    },
    {
      id: "3",
      name: "Procedures as per approved plan?"
    },
    {
      id: "4",
      name: "Waiting period observed? "
    },
    {
      id: "5",
      name: "Policy In force force for the treatment period?"
    },
    {
      id: "6",
      name: "Needed supporting documents available?"
    }
  ])

  useEffect(() => {
    getClaims();
  }, [request_id]);


  if (!claim) return <Loading />;

  const tabList = [
    {
      id: "patient_details",
      name: "Patient Details",
      children: <PatientDetails claim={claim} />,
    },
    {
      id: "medical",
      name: "Medical Info",
      children: (
        <MedicalInfo
          claim={claim}
          handleApprove={async (e) => {
            await handleApprove(e);
            getClaims();
          }}
          handleReject={async (e) => {
            await handleReject(e);
            getClaims();
          }}
        />
      ),
      checklist:
        claim?.medical_info.status === "Pending" ? checklist : undefined,
      setChecklist:
        claim?.medical_info.status === "Pending" ? setChecklist : undefined,
      approval: medicineApproval,
      setApproval: setMedicineApproval,
    },
    {
      id: "financial",
      name: "Financial Info",
      children: (
        <FinancialInfo
          claim={claim}
        />
      ),
      checklist:
        claim?.medical_info.status === "Pending"
          ? financialCheckList
          : undefined,
      setChecklist:
        claim?.medical_info.status === "Pending"
          ? setFinancialCheckList
          : undefined,
      approval: financialApproval,
      setApproval: setFinancialApproval,
    },
  ];
  const currentTab = tabList.find((tab) => tab.id === activeTab);

  return (
    <div>
      <Heading
        heading={
          <div className="flex items-center gap-2">
            Claim Details
            <StatusChip status={claim.status as any} size={"md"} />
          </div>
        }
      />
      <p className="text-sm italic text-gray-500 mb-8">Claim Id: {claim.id}</p>
      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <Tabs
            tabs={tabList}
            activeTab={activeTab}
            setActiveTab={(next: any) => setActiveTab(next)}
          />
          {(activeTab === "medical" || activeTab === "financial") && (
            <Checklist
              className={`${currentTab?.checklist ? "w-1/3 " : "w-0"
                } transition-all overflow-hidden`}
              scores={{
                pass: currentTab?.checklist?.length || 0,
                fail: 1,
                na: 2,
              }}
              items={currentTab?.checklist as any}
              setItems={currentTab?.setChecklist as any}
              approval={currentTab?.approval}
              setApproval={currentTab?.setApproval as any}
            />
          )}
        </div>
        <div>
          <JsonViewer value={claim.resources.claim} />
        </div>
      </div>
    </div>
  );
}
