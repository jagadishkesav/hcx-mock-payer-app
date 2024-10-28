import React, { useState } from 'react';
import ModalFileViewer from './ModalFileViewer';
import EmptyState from './EmptyState';
import axios from 'axios';
import { toast } from 'react-toastify';
import _ from 'lodash';
import CommonDataTable from './CommonDataTable';

interface FileManagerProps {
  files:string[];
}

const FileManager:React.FC<FileManagerProps> = ({files}:FileManagerProps) => {

  const [showFile, setShowFile] =useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  const onFileView = (file:string) => {
    setSelectedFile(file);
    setShowFile(true);
  }
  return (
    <>
    {showFile ? 
    <ModalFileViewer file={selectedFile} onClose={() => setShowFile(false)}></ModalFileViewer> :null }
    <div className="col-span-12">
    {files.length !== 0 ?
      // <div className="rounded-sm border border-stroke bg-white py-3 shadow-default dark:border-strokedark dark:bg-boxdark">
        
      //   <>
      //   {files.map((file:any) => {
      //     return(        
      //     <div className="flex justify-between gap-2.5 py-3 px-6 hover:bg-gray-2 dark:hover:bg-meta-4 sm:items-center sm:justify-start">
      //     <div className="flex items-center gap-5.5">
      //       <div className="hidden h-14 w-full max-w-14 items-center justify-center rounded-full border border-stroke bg-gray text-black-2 dark:border-strokedark dark:bg-graydark dark:text-white sm:flex">
      //         <svg
      //           className="fill-current"
      //           width="28"
      //           height="29"
      //           viewBox="0 0 28 29"
      //           fill="none"
      //           xmlns="http://www.w3.org/2000/svg"
      //         >
      //           <path
      //             fillRule="evenodd"
      //             clipRule="evenodd"
      //             d="M4.72659 3.36759C5.32314 2.77105 6.13222 2.43591 6.97585 2.43591H16.2295L16.2299 2.43591L16.2303 2.43591C16.4817 2.43591 16.7081 2.54281 16.8665 2.71363L23.7604 9.6075C23.9312 9.76594 24.0381 9.99231 24.0381 10.2437C24.0381 10.2568 24.0378 10.2699 24.0372 10.2828V24.1241C24.0372 24.9677 23.7021 25.7768 23.1055 26.3733C22.509 26.9699 21.6999 27.305 20.8563 27.305H6.97585C6.13222 27.305 5.32313 26.9699 4.72659 26.3733C4.13005 25.7768 3.79492 24.9677 3.79492 24.1241V5.61684C3.79492 4.77321 4.13005 3.96413 4.72659 3.36759ZM6.97585 4.17097H15.3628V10.2437C15.3628 10.7228 15.7512 11.1112 16.2303 11.1112H22.3022V24.1241C22.3022 24.5075 22.1498 24.8753 21.8787 25.1465C21.6075 25.4176 21.2397 25.57 20.8563 25.57H6.97585C6.59238 25.57 6.22462 25.4176 5.95346 25.1465C5.68231 24.8753 5.52997 24.5075 5.52997 24.1241V5.61684C5.52997 5.23337 5.68231 4.86561 5.95346 4.59445C6.22462 4.3233 6.59238 4.17097 6.97585 4.17097ZM17.0979 5.3987L21.0753 9.37613H17.0979V5.3987ZM9.2896 15.1596C8.81048 15.1596 8.42208 15.548 8.42208 16.0271C8.42208 16.5062 8.81048 16.8946 9.2896 16.8946H18.5432C19.0223 16.8946 19.4107 16.5062 19.4107 16.0271C19.4107 15.548 19.0223 15.1596 18.5432 15.1596H9.2896ZM8.42208 20.654C8.42208 20.1749 8.81048 19.7865 9.2896 19.7865H18.5432C19.0223 19.7865 19.4107 20.1749 19.4107 20.654C19.4107 21.1332 19.0223 21.5216 18.5432 21.5216H9.2896C8.81048 21.5216 8.42208 21.1332 8.42208 20.654ZM9.2896 10.5328C8.81048 10.5328 8.42208 10.9212 8.42208 11.4003C8.42208 11.8795 8.81048 12.2679 9.2896 12.2679H11.603C12.0821 12.2679 12.4705 11.8795 12.4705 11.4003C12.4705 10.9212 12.0821 10.5328 11.603 10.5328H9.2896Z"
      //             fill=""
      //           />
      //         </svg>
      //       </div>

      //       <p className="font-medium text-black dark:text-white">
      //        {decodeURIComponent(file.valueAttachment.url).split("/").at(-1) || "Document"}
      //       </p>
      //     </div>

      //     <div className="text-right">
      //       <button className="font-medium pr-4 underline text-meta-5"
      //         onClick={() => onFileView(file.valueAttachment.url)}>
      //         View
      //       </button>
      //     </div>
      //   </div>)
      //   })}

      //   </>   
      // </div> 
      
      <CommonDataTable title="Attachments"
                            header={  files? 
                                [
                                    "file_name",
                                    "category"
                                ] : []
                                }
                                data={(files || []).map((file:any) => ({
                                    id: file.valueAttachment.url,
                                    file_name: decodeURIComponent(file.valueAttachment.url).split("/").at(-1) || "Document",
                                    category: _.get(file,"category.coding[0].code")
                                  })) as any}
                                actions={[{text:"View",type:"normal",svgicon:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            }]}
                                onAction={(action,id)=>onFileView(id)}                                   
            ></CommonDataTable>
      : 
      <EmptyState
        title="No Documents Found"
        description="No documents have been added to this claim."
      />
      }
    </div>
    </>
  );
};

export default FileManager;
