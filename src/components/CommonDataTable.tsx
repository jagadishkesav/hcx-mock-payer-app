import React, { ReactElement, useEffect, useState } from 'react';
import DropdownDefault from './DropdownDefault'
import Pagination from './Pagination';
import { lowerCase } from 'lodash';
import { properText } from '../utils/StringUtils';
import { bgcolorPicker, colorPicker } from '../utils/StringUtil';
import { ChevronUp, ChevronDown } from 'react-feather';

interface ActionProps {
  text: string;
  type: "success" | "danger" | "neutral" | "normal";
  svgicon?: ReactElement<any, any>
}



interface DataTableProps{
  title: string;
  header: Array<string>;
  data:Array<object>;
  actions?:ActionProps[];
  onAction?:(action:string, id:string) => void;
  onRowClick?:(id:string) => void;
}



const CommonDataTable: React.FC<DataTableProps> = ({title, header, data, actions,onAction,onRowClick}:DataTableProps) => {
  const [tableTitle, setTableTitle] = useState(title);
  const [tableHeader, setTableHeader] = useState(header);
  const [tableData, setTableData] = useState(data);
  const [tableActions, setTableActions] = useState(actions);
  const [pageSelected, setPageSelected]  = useState(Number(1));

  console.log("headers", tableHeader);
  console.log("data", tableData)
    
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-title-sm2 font-bold text-black dark:text-white">
                {tableTitle}
              </h2>
            </div>
            {/* <DropdownDefault /> */}
          </div>
        </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto" id="dataTableTwo">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {tableHeader.map((value,index) => {
              return(
                <th className={" py-4 px-4 font-medium text-black dark:text-white " + (index == 0 ? "xl:pl-11" : "")}>
                  {properText(value)} 
                </th>
              )
            })}
            {tableActions ? 
                <th className=" py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>  : null
            }
            
            </tr>
          </thead>
          <tbody>
          {tableData.map((value:any)=> {
                return( 
                <tr onClick={() =>onRowClick && onRowClick(value.id)}>
                {tableHeader.map((header, index) => {
                  if(lowerCase(header) == "status"){
                    return(
                    <td className={"border-b border-[#eee] py-5 px-4 dark:border-strokedark " + (index == 0 ? "xl:pl-11" : "")}>
                      <p className={"inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium " + (bgcolorPicker(value[header])) + " " + colorPicker(value[header])}>
                      {value[header]}
                    </p>
                    </td>
                    )
                  }else{
                  return(
                  <td className={"border-b border-[#eee] py-5 px-4 dark:border-strokedark " + (index == 0 ? "xl:pl-11" : "")}>
                    <p className="text-black dark:text-white">{value[header]}</p>
                  </td> 
                  )}
                })}
                {tableActions ? 
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                        {tableActions.map((action) => {
                     return(   
                    <button onClick={(event) => {event.stopPropagation(); onAction && onAction(action.text, value.id)}} 
                    disabled={!value["enableButtons"] && action.text !== "View"}
                    className={"font-medium pr-4 underline "+ (colorPicker(action.type)) + (value["enableButtons"] == undefined || value["enableButtons"] || action.text == "View" ? "" : "opacity-50 cursor-not-allowed")}>
                    {action.svgicon? action.svgicon : action.text}
                    </button>
                     )     
                  })} </div>
                  </td>: null
                }
                </tr>)
              })}
          </tbody>
        </table>
      </div>
      {/* <Pagination numRows='200' selectedPage={(page: React.SetStateAction<number>) => setPageSelected(page)}></Pagination> */}
    </div>
  );
};

export default CommonDataTable;
