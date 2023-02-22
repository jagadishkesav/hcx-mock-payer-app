import { PaperClipIcon } from "@heroicons/react/24/outline";
import { properText } from "../../utils/StringUtils";
import StatusChip from "../common/StatusChip";

export default function PatientDetails({ claim }: { claim: any }) {
  const includeFields = [
    "request_id",
    "request_no",
    "provider",
    "name",
    "insurance_no",
    "gender",
    "status",
    "address",
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
                  {name === "status" ? (
                    <StatusChip status={detail} />
                  ) : name === "address" ? (
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
                        );
                      }) || "--"}
                    </div>
                  ) : (
                    detail
                  )}
                </dd>
              </div>
            );
          })}
      </dl>
      <dl className="mt-8">
        <dt className="font-semibold mb-4">Supporting Files</dt>
        <dd>
          {supportingFiles ? (
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {supportingFiles.map((file: any) => {
                console.log(file);
                return (
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <a
                        className="ml-2 w-0 flex-1 truncate hover:text-indigo-500"
                        href={file.valueAttachment.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.valueAttachment.title || "File"}
                      </a>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={file.valueAttachment.url}
                        download
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No supporting files</p>
          )}
        </dd>
      </dl>
    </div>
  );
}
