import React from "react";
import { properText } from "../../utils/StringUtils";

import { PaperClipIcon } from "@heroicons/react/20/solid";

const Tabs = ({ tabs, activeTab, setActiveTab }: any) => {
  return (
    <div className="flex flex-col justify-start w-1/4 space-y-4 mt-8">
      {tabs.map((tab: any) => (
        <button
          className={`py-2 text-sm ${
            activeTab === tab
              ? "border-r-2 transform border-blue-500 font-bold"
              : " transform -translate-x-2"
          }`}
          onClick={(e) => {
            setActiveTab(tab);
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default function ClaimDetails({ claim }: any) {
  const [activeTab, setActiveTab] = React.useState("Patient Details");
  return (
    <div className="flex flex-col justify-start w-full space-y-4">
      <div className="flex flex-row justify-start w-full">
        <Tabs
          tabs={["Patient Details", "Medical Info", "Financial Info"]}
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
                {claim.details.request_no}
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                {Object.entries(claim.details).map(([name, detail]: any) => {
                  return (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        {properText(name)}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{detail}</dd>
                    </div>
                  );
                })}
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Attachments
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                      {claim.attachments.map((_attachment: any) => (
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              {_attachment.name}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="font-medium text-indigo-600 hover:text-indigo-500">
                              Download
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Comments
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <textarea className="w-full h-32 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-row justify-end w-full space-x-4 p-5">
            <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Reject
            </button>
            <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
