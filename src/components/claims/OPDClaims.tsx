import {
    PaperClipIcon,
    ArrowDownTrayIcon,
    EyeIcon,
  } from "@heroicons/react/24/outline";
  import React, { useEffect, useState } from "react";
  import { formatDate, properText, textOrDash } from "../../utils/StringUtils";
  import PriorityChip from "../common/PriorityChip";
  import StatusChip from "../common/StatusChip";
  import SupportingFiles from "./SupportingFiles";
  import axios from "axios";
import EmptyState from "../common/EmptyState";
import Table from "../common/Table";
  
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
  
  export default function OPDClaims({ claim }: { claim: any }) {
    const includeFields = [
      "provider",
      "name",
      "insurance_no",
      "gender",
      "status",
      "address",
    ];
  
    const medical_info = claim.medical_info;
    const financial_info = claim.financial_info;
    const [approvedAmount, setApprovedAmount] = useState(
      parseFloat(
        (
          financial_info.approved_amount ||
          claim.medical_info.approved_amount ||
          claim.requested_amount
        )
          .toString()
          .replace("INR ", "")
      )
    );
    const [remarks, setRemarks] = useState(financial_info.remarks);
    const [accountNumber, setAccountNumber] = useState(claim.account_number || "*********************");
    const [ifscCode, setIfscCode] = useState(claim.ifsc_code || "**********");
    const status = financial_info.status;

    const processFile = (url: string) => {
      let data = JSON.stringify({
        "file_locations": [url]
      });
  
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://docxhcxapi.centralindia.cloudapp.azure.com/document/analyse/submit ',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer HCX@12345'
        },
        data: data
      };
      axios.request(config)
        .then((response: { data: any; }) => {
          console.log(JSON.stringify(response.data));
          localStorage.setItem(url, response.data.request_id);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
    const supportingFiles = claim.resources.claim.supportingInfo || [];
    useEffect(()=>{
      supportingFiles.map((file: any, index: any) => {
        processFile(file.valueAttachment.url);
      });
    },[])
    
    return (
      <>
        <div className="flex flex-col gap-4">
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
                          {componentMap[name]
                            ? (componentMap[name](detail) as any)
                            : detail}
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
                <div className="font-semibold col-span-1">Resource Created</div>
                {claim.resources.claim.created
                  ? formatDate(claim.resources.claim.created)
                  : "--"}
                <div className="font-semibold col-span-1">Insurer</div>
                {textOrDash(claim.resources.claim.insurer.name)}
                <div className="font-semibold col-span-1">Provider</div>
                {textOrDash(claim.provider)}
                <div className="font-semibold col-span-1">Total Claim Cost</div>
                {textOrDash(claim.requested_amount)}
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
        <>
        <div className="mt-6 bg-white rounded-lg">
        <div className="w-full h-full p-6 bg-white rounded-lg">
        <div className="text-gray-500 text-base font-bold pb-4">
          Financial Details
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="font-semibold col-span-1">Requested Amount</div>
          {textOrDash(claim.requested_amount)}
          <div className="font-semibold col-span-1">Approved Amount</div>
          {textOrDash(claim.approved_amount)}
          <div className="font-semibold col-span-1">Status</div>
          <div className="w-24">{<StatusChip status={status} />}</div>
          {claim.sub_type == "OPD" ? 
          <>
          <div className="font-semibold col-span-1">Bank Account Number</div>
          {accountNumber == "1234" ? "Not Available" : accountNumber}
          <div className="font-semibold col-span-1">IFSC Code</div>
          {ifscCode == "1234" ? "Not Available" : textOrDash(ifscCode)}
          </> : null}
        </div>
      </div>
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg">
        <div className="text-gray-500 text-base font-bold">Bill</div>
        {claim.items && claim.items.length > 0 ? (
          <Table
            title=""
            headers={["display", "code", "value"]}
            showBorder={true}
            data={claim.items.map((item: any) => ({
              id: item.productOrService.coding[0].code,
              display: item.productOrService.coding[0].display,
              code: item.productOrService.coding[0].code,
              value: `${item.unitPrice.value} ${item.unitPrice.currency}`,
            }))}
          />
        ) : (
          <EmptyState
            title="No Bills found"
            description="No Bills have been added to this claim."
          />
        )}
      </div>
    </>
        <dl className="mt-8 rounded-lg bg-white p-6">
          <div className="text-gray-500 text-base font-bold pb-4">
            Supporting Files
          </div>
          <SupportingFiles supportingFiles={supportingFiles} />
        </dl>
      </>
    );
  }
  