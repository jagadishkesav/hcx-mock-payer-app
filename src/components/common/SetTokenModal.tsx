import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-toastify";
import { SenderCode } from "../../api/token";
import Modal from "./Modal";

export default function SetTokenModal(props: { onClose: () => void }) {
  const [senderCode, setSenderCode] = useState<string>(
    SenderCode.getSenderCode()
  );
  return (
    <Modal
      onClose={props.onClose}
      className="max-w-3xl w-full bg-white p-12 rounded-lg"
    >
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Enter your sender code
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This code will be used to identify requests relevant to you.
        </p>

        <div className="mt-4">
          <label htmlFor="sender-code" className="sr-only">
            Sender code
          </label>
          <div className="flex gap-1">
            <input
              autoCorrect="off"
              spellCheck="false"
              type="text"
              value={senderCode}
              onChange={(e) => {
                setSenderCode(e.target.value);
              }}
              className="ml-10 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md border-2 border-gray-200"
              placeholder="Sender code"
            />
            <button
              className={`border-2 bg-gray-200 rounded-lg px-2  ${senderCode === "" && "opacity-0"}`}
              onClick={() => {
                setSenderCode("");
              }}
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                SenderCode.setSenderCode(senderCode);
                toast.success("Sender code updated", {
                  autoClose: 1000,
                });
                setTimeout(() => {
                  props.onClose();
                }, 500);
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => {
                props.onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
