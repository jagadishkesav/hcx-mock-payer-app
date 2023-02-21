import React, { useEffect } from "react";
import { properText, resoureType } from "../../utils/StringUtils";
import { approveClaim, listRequest, rejectClaim } from "../../api/api";
import { toast } from "react-toastify";
import { navigate } from "raviger";
import { ClaimDetail, claimsMapper } from ".";
import Table from "../common/Table";
import Loading from "../common/Loading";
import StatusChip from "../common/StatusChip";
import Heading from "../common/Heading";
import Tabs from "../common/Tabs";
import { ArrowTopRightOnSquareIcon, DocumentIcon, PaperClipIcon } from "@heroicons/react/24/outline";

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

interface RejectApproveHandlers {
  handleReject: typeof handleReject;
  handleApprove: typeof handleApprove;
}

export function FinancialInfo({
  claim,
  ...props
}: { claim: ClaimDetail } & RejectApproveHandlers) {
  const financial_info = claim.financial_info;
  const [approvedAmount, setApprovedAmount] = React.useState(
    financial_info.approved_amount ||
    claim.medical_info.approved_amount ||
    claim.requested_amount
  );
  const [remarks, setRemarks] = React.useState(financial_info.remarks);
  const status = financial_info.status;

  return (
    <div className="px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">
            Requested Amount
          </dt>
          <dd className="mt-1 text-sm text-gray-900">
            {claim.requested_amount || "-"}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Approved Amount</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {financial_info.approved_amount || "-"}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {<StatusChip status={status} />}
          </dd>
        </div>
        {claim.items && claim.items.length > 0 && (
          <Table
            title=""
            headers={["display", "code", "value"]}
            data={claim.items.map((item: any) => ({
              id: item.productOrService.coding[0].code,
              display: item.productOrService.coding[0].display,
              code: item.productOrService.coding[0].code,
              value: `${item.unitPrice.value} ${item.unitPrice.currency}`,
            }))}
          />
        )}
        <div className="sm:col-span-2 mt-2">
          <dt className="text-sm font-medium text-gray-500">Approval Amount</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <input
              onChange={(e) => setApprovedAmount(parseInt(e.target.value))}
              min={0}
              value={approvedAmount}
              disabled={status !== "Pending"}
              type="number"
              className="w-full h-9 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">Remarks</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <textarea
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
              disabled={claim.financial_info.status !== "Pending"}
              className="w-full h-32 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </dd>
        </div>
      </dl>

      {claim.financial_info.status === "Pending" && (
        <div className="flex flex-row justify-end w-full space-x-4 p-5">
          <button
            onClick={() =>
              props.handleReject({
                request_id: claim.request_id,
                type: "financial",
              })
            }
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reject
          </button>
          <button
            onClick={() =>
              props.handleApprove({
                request_id: claim.request_id,
                type: "financial",
                approved_amount: approvedAmount,
                remarks,
              })
            }
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

export function MedicalInfo({
  claim,
  ...props
}: { claim: ClaimDetail } & RejectApproveHandlers) {
  const [approvedAmount, setApprovedAmount] = React.useState(
    claim.medical_info.approved_amount || claim.requested_amount
  );
  const [remarks, setRemarks] = React.useState(claim.medical_info.remarks);
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
        <div className="sm:col-span-2 mt-4">
          <dt className="text-sm font-medium text-gray-500">Approval Amount</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <input
              onChange={(e) => setApprovedAmount(parseInt(e.target.value))}
              min={0}
              value={approvedAmount}
              disabled={status !== "Pending"}
              type="number"
              className="w-full h-9 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </dd>
        </div>
        <div className="sm:col-span-2 mt-4">
          <dt className="text-sm font-medium text-gray-500">Remarks</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <textarea
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
              disabled={status !== "Pending"}
              className="w-full h-32 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </dd>
        </div>
      </dl>
      {claim.medical_info.status === "Pending" && (
        <div className="flex flex-row justify-end w-full space-x-4 p-5">
          <button
            onClick={() =>
              props.handleReject({
                request_id: claim.request_id,
                type: "medical",
              })
            }
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reject
          </button>
          <button
            onClick={() =>
              props.handleApprove({
                request_id: claim.request_id,
                type: "medical",
                approved_amount: approvedAmount,
                remarks,
              })
            }
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

export function PatientDetails({ claim }: { claim: any }) {
  const includeFields = [
    "request_id",
    "request_no",
    "provider",
    "name",
    "insurance_no",
    "gender",
    "status",
    "address"
  ];

  const supportingFiles = claim.resources.claim.supportingInfo;

  return (
    <div className="px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {Object.entries(claim)
          .filter(([name, _]) => includeFields.includes(name))
          .map(([name, detail]: any) => {
            return (
              <div className="sm:col-span-1" key={name}>
                <dt className="text-sm italic text-gray-500">
                  {properText(name)}
                </dt>
                <dd className="text-sm text-black">
                  {name === "status" ? <StatusChip status={detail} /> : (
                    name === "address" ? (
                      <div className="">
                        {detail?.map((a: any, i: number) => {
                          return (
                            <div key={i}>
                              {a.text},
                              <br />
                              {a.city}, {a.state}, {a.postalCode},
                              <br />
                              {a.country}
                            </div>
                          )
                        }) || "--"}
                      </div>
                    ) :
                      detail
                  )}
                </dd>
              </div>
            );
          })}
      </dl>
      <dl className="mt-8">
        <dt className="font-semibold mb-4">
          Supporting Files
        </dt>
        <dd>
          {supportingFiles ?
            <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {supportingFiles.map((file: any) => {
                console.log(file)
                return (
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <a className="ml-2 w-0 flex-1 truncate hover:text-indigo-500" href={file.valueAttachment.url} target="_blank" >{file.valueAttachment.title || "File"}</a>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href={file.valueAttachment.url} download className="font-medium text-indigo-600 hover:text-indigo-500">
                        Download
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
            : <p className="text-gray-500 text-sm">No supporting files</p>}
        </dd>
      </dl>
    </div>
  );
}

const handleReject = ({ request_id, type }: any) => {
  rejectClaim({ request_id, type });
  toast("Claim Rejected", {
    type: "success",
  });
  navigate("/claims");
};

const handleApprove = ({ request_id, type, remarks, approved_amount }: any) => {
  approveClaim({
    request_id,
    type,
    remarks,
    approved_amount,
  });
  toast("Claim Approved", {
    type: "success",
  });
  navigate("/claims");
};

export default function ClaimDetails({ request_id }: { request_id: string }) {
  const [activeTab, setActiveTab] = React.useState("patient_details");
  const [claim, setClaim] = React.useState<any>(undefined);

  async function getClaims(): Promise<any> {
    const res: any = await listRequest({ type: "claim" });
    const claim = res.claim.find(
      (claim: any) => claim.request_id === request_id
    );
    return claimsMapper(claim);
  }

  useEffect(() => {
    getClaims().then(setClaim);
  }, [request_id]);

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
          claim={claim}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      ),
    },
  ];

  if (!claim) return <Loading />;

  return (
    <div>
      <Heading
        heading="Claim Details"
      />
      <p className="text-sm italic text-gray-500 mb-8">
        Claim Id: {claim.id}
      </p>
      <div className="flex gap-8">
        <Tabs
          tabs={tabList}
          activeTab={activeTab}
          setActiveTab={(next: any) => setActiveTab(next)}
        />
        <div>

        </div>
      </div>

    </div>
  )
}