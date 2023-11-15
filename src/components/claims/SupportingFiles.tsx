import { ArrowDownTrayIcon, EyeIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import Modal from "../common/Modal";
import Table from "../common/Table";
import _ from "lodash";
import { toast } from "react-toastify";



export default function SupportingFiles(props: {
    supportingFiles: any
}) {
    console.log("page is reloaded again again");
    const { supportingFiles } = props;
    const [showFile, setShowFile] = useState(false);
    //const claim:any[] = [];
    const [claim, setClaim] = useState([{"Attribute":"","Value":""}]);
    
    const showProcessedFileModal = (url:string) => {
        console.log("url is here", url);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://staging-hcx.swasth.app/hcx-mock-service/document/analysis/${localStorage.getItem(url)}`,
            headers: { 
              'Content-Type': 'application/json'
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log("this api was called ",JSON.stringify(response.data));
            const result:any = response.data;
            let items:any;
            for(items in result){
                const obj = result[items].attribute_results;
                const objectKeys = Object.keys(obj);
                {objectKeys.map((key) => (
                    claim.push({"Attribute": key , "Value": obj[key]})
                ))}
                setClaim([...claim]);
                setShowFile(true);
            }
          })
          .catch((error) => {
            toast.error("File is still under processing. Please try after sometime");
            console.log(error);
          });
        
    }

    return (
        <dd>
            {supportingFiles ? (
                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                    {supportingFiles.map((file: any) => {
                        return (
                            <li
                                className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                                key={file.sequence}
                            >
                                <div className="flex w-0 flex-1 items-center">
                                    <PaperClipIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <a
                                        className="ml-2 w-0 flex-1 font-medium truncate text-indigo-700 hover:text-indigo-800"
                                        href={file.valueAttachment.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {file.valueAttachment.title || "File"}
                                    </a>
                                </div>
                                <a
                                    href="#"
                                    className="flex ml-4 shadow-sm border border-gray-300 hover:border-gray-400 rounded-md px-3 py-1 font-medium text-gray-700 hover:text-black"
                                    onClick={(event) => {event.preventDefault(); showProcessedFileModal(file.valueAttachment.url);}}
                                >
                                    <EyeIcon className="h-5 w-5 flex-shrink-0 mr-2 text-indigo-400" />
                                    <span>View Processed File</span>
                                </a>
                                <a
                                    href={file.valueAttachment.url}
                                    download
                                    className="flex ml-4 shadow-sm border border-gray-300 hover:border-gray-400 rounded-md px-3 py-1 font-medium text-gray-700 hover:text-black"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5 flex-shrink-0 mr-2 text-indigo-400" />
                                    <span>Download</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 text-sm">No supporting files</p>
            )}
        {showFile && (
        <Modal
          onClose={() => setShowFile(false)}
          className="max-w-3xl w-full"
        >
          <div
            className={`mt-3 bg-slate-100 rounded-lg shadow-lg px-4 py-2 text-left ${!showFile && "hidden"
              }`}
          >
          <Table
            title="Document Table"
            headers={["Attribute","Value"]}
            showBorder={true}
            data={
                (claim || []).map((item) => ({
                  ...item,
                })) as any
              }
          />
          </div>
        </Modal>
      )}
        </dd>
    )
}