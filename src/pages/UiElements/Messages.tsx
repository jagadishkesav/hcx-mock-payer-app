import React, { useEffect, useRef, useState } from 'react';
import { listCommunication } from '../../api/PayerService';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../store';
import _ from 'lodash';

interface MessageProps {
  correlation_id:string;
  sendCommunication?: (type: string, text:string) => void;
}
 type CommunicationType = {
  message: string;
  sender_code: string;
  recipient_code:string;
  request_id: string;
  correlation_id:string;
  created_on:string;

}

const Messages: React.FC<MessageProps> = ({correlation_id, sendCommunication}:MessageProps) => {

    const [active, setActive] = useState<number | null>(null);
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
   const [communications, setCommunications] = useState<CommunicationType[]>([]);
   const recipient_code = _.get( store.getState().participantDetailsReducer.participantDetails, "participant_code");
   const [text, setText] = useState("");

    const handleToggle = (index: number) => {
      if (active === index) {
        setActive(null);
      } else {
        setActive(1);
      }
    };

    const CommunicationMapper = ( communication:any) : CommunicationType => {
      return {
        request_id: communication.requst_id,
        sender_code:communication.sender_code,
        recipient_code:communication.recipient_code,
        message:communication.message,
        correlation_id:communication.correlation_id,
        created_on:communication.created_on
      }
    }

    useEffect(() => {
      listCommunication(correlation_id,authToken).then((res:any) => {
        console.log("Communication is here", res);
        setCommunications(res.data.communication.map((comm:any) =>{
          return CommunicationMapper(comm);
        }));
      })
  },[]);


  return (
    <>
        <div className="rounded-md border border-stroke p-4 shadow-9 dark:border-strokedark dark:shadow-none sm:p-6">
      <button
        className={`flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6 ${
          active === 1 ? 'active' : ''
        }`}
        onClick={() => handleToggle(Number(1))}
      >
        <div className="flex h-10.5 w-full max-w-10.5 items-center justify-center rounded-md bg-[#F3F5FC] dark:bg-meta-4">
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out dark:fill-white dark:stroke-white ${
              active === 1 ? 'rotate-180' : ''
            }`}
            width="18"
            height="10"
            viewBox="0 0 18 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.28882 8.43257L8.28874 8.43265L8.29692 8.43985C8.62771 8.73124 9.02659 8.86001 9.41667 8.86001C9.83287 8.86001 10.2257 8.69083 10.5364 8.41713L10.5365 8.41721L10.5438 8.41052L16.765 2.70784L16.771 2.70231L16.7769 2.69659C17.1001 2.38028 17.2005 1.80579 16.8001 1.41393C16.4822 1.1028 15.9186 1.00854 15.5268 1.38489L9.41667 7.00806L3.3019 1.38063L3.29346 1.37286L3.28467 1.36548C2.93287 1.07036 2.38665 1.06804 2.03324 1.41393L2.0195 1.42738L2.00683 1.44184C1.69882 1.79355 1.69773 2.34549 2.05646 2.69659L2.06195 2.70196L2.0676 2.70717L8.28882 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>

        <div>
          <h4 className="text-left text-title-xsm font-medium text-black dark:text-white">
            Communication Cycle
          </h4>
        </div>
      </button>

      <div
        className={`mt-5 duration-200 ease-in-out ${
          active === 1 ? 'block' : 'hidden'
        }`}
      >
        <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

          <div className="flex h-full flex-col border-stroke dark:border-strokedark">
            {/* <!-- ====== Chat Box Start --> */}
            <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5">
            {communications.map((comm,index) => {
              if(comm.sender_code == recipient_code){
                return(<div className="max-w-125">
                  <p className="mb-2.5 text-sm font-medium">{comm.sender_code}</p>
                  <div className="mb-2.5 rounded-2xl rounded-tl-none bg-gray py-3 px-5 dark:bg-boxdark-2">
                    <p>
                      {comm.message}
                    </p>
                  </div>
                  <p className="text-xs">{new Date(parseInt(comm.created_on)).toLocaleString()}</p>
                </div>)  
              }else{
              return(
              <div className="ml-auto max-w-125">
                <p className="mb-2.5 text-sm font-medium">{comm.sender_code}</p>
                <div className="mb-2.5 rounded-2xl rounded-br-none bg-primary py-3 px-5">
                  <p className="text-white">
                    {comm.message}
                  </p>
                </div>
                <p className="text-right text-xs">{new Date(parseInt(comm.created_on)).toLocaleString()}</p>
              </div>
              )}})}
              </div>
            <div className="sticky bottom-0 border-t border-stroke bg-white py-5 px-6 dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center justify-between space-x-4.5">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Type communication query here"
                    className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <button className="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90"
                   onClick={() => { sendCommunication && sendCommunication("text",text); 
                    listCommunication(correlation_id,authToken).then((res:any) => {
                      console.log("Communication is here", res);
                      setCommunications(res.data.communication.map((comm:any) =>{
                        return CommunicationMapper(comm);
                      }));
                    })
                   }}>
                   <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* <!-- ====== Chat Box End --> */}
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default Messages;
