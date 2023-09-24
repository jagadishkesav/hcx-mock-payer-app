import React from "react";
import { properText, textOrDash } from "../../utils/StringUtils";
import Heading from "./Heading";
import StatusChip from "./StatusChip";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Dictionary with ReactNodes as values and one required key "id" of type string and one optional key "status" of type string
interface TableRowData {
  id: string;
  showActions?: boolean;
  [key: string]: React.ReactNode;
}

type ActionType = {
  element: React.ReactNode;
  action: () => void;
};

export default function Table({
  title,
  subtext,
  actions,
  headers,
  data,
  rowActions,
  onRowClick,
  showBorder = false,
  primaryColumnIndex = 0,
}: {
  title: string;
  subtext?: string;
  actions?: ActionType[];
  headers: string[];
  data: TableRowData[];
  rowActions?: {
    [key: string]: {
      callback: (id: string) => void;
      actionType: "danger" | "primary" | "secondary";
      hideCondition? : string;
    };
  };
  onRowClick?: (id: string) => void;
  showBorder?: boolean;
  primaryColumnIndex?: number;
}) {
  return (
    <div className="px-6 lg:px-8">
      <div className="">
        <Heading
          heading={title}
          actions={
            <div className="flex gap-4">
              {(actions &&
                actions.map((action, index) => {
                  const { element, action: onClickAction } = action;

                  return (
                    <button
                      key={index}
                      type="button"
                      className="flex items-center gap-2 justify-center rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={onClickAction}
                    >
                      {element}
                    </button>
                  );
                })) || <></>}
            </div>
          }
        />
        <p className="mt-2 text-sm text-gray-700">{subtext}</p>
      </div>
      <div className="mt-4 flow-root">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300 relative overflow-hidden rounded-lg">
              {headers.length > 0 && (
                <thead className="bg-gray-200">
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={classNames(
                          `${
                            index === 0
                              ? "py-3.5 pl-6 pr-3 lg:pl-8"
                              : "px-3 py-3.5"
                          }`,
                          "text-left text-sm font-semibold text-gray-900"
                        )}
                      >
                        {properText(header)}
                      </th>
                    ))}
                    {rowActions && (
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
              )}
              <tbody className="bg-gray-300">
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      onRowClick
                        ? `hover:bg-gray-50 hover:text-gray-900 cursor-pointer ${
                            index % 2 === 0 ? "bg-white/80" : "bg-white"
                          }`
                        : "bg-white"
                    }
                    onClick={() => onRowClick && onRowClick(item.id)}
                  >
                    {headers.map((header, index) => (
                      <td
                        key={index}
                        className={classNames(
                          index === 0
                            ? "pl-6 pr-3 text-gray-900 lg:pl-8"
                            : "px-3 text-gray-500",
                          index === primaryColumnIndex && "font-medium",
                          "whitespace-nowrap py-4 text-sm ",
                          showBorder && "border-b-[1px] border-gray-300"
                        )}
                      >
                        {header === "status" || header == "otp_verification" ? (
                          <StatusChip status={item[header] as any} />
                        ) : (
                          item[header]
                        )}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium lg:pr-8">
                        <div className="inline-flex space-x-2">
                          {Object.entries(rowActions).map(
                            ([name, action], index) => (
                              <button
                                key={index}
                                className={classNames(
                                  item.showActions !== false &&
                                    action.actionType === "primary" &&
                                    "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
                                  item.showActions !== false &&
                                    action.actionType === "secondary" &&
                                    "bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 ",
                                  item.showActions !== false &&
                                    action.actionType === "danger" &&
                                    "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                                  // showActions === false ? disabled
                                  item.showActions === false &&
                                    "bg-gray-300 hover:bg-gray-400 focus:ring-gray-500 pointer-events-none cursor-not-allowed",
                                  "inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                                  action.hideCondition !== undefined && eval(`item.${action.hideCondition}`) ? 'invisible' : ''
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.callback(item.id);
                                }}
                              >
                                {properText(name)}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
