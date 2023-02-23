import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ClaimDetail } from "../claims";

export type ApprovalValueType = {
    amount: number,
    remarks?: string
}

export default function ApprovalForm(props: {
    approval: ApprovalValueType,
    setApproval: (approval: ApprovalValueType) => void,
    onApprove: any,
    onReject: any,
    disabled?: boolean,
    settled?: boolean
}) {

    const { approval, setApproval, onApprove, onReject, disabled, settled } = props;

    return (
        <div>
            <div className="sm:col-span-2 mt-4">
                <dt className="text-sm font-medium text-gray-500">
                    Approval Amount
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                    <input
                        onChange={(e) => setApproval({ ...approval, amount: parseFloat(e.target.value) })}
                        min={0}
                        value={approval.amount}
                        disabled={disabled}
                        type="number"
                        className="w-full h-9 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/*<h1 className={`text-3xl font-black ${disabled ? "text-gray-300 line-through" : ""}`}>
                        {approval.amount}
                    </h1>*/}
                </dd>
            </div>
            <div className="sm:col-span-2 mt-4">
                <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    <textarea
                        onChange={(e) => setApproval({ ...approval, remarks: e.target.value })}
                        value={approval.remarks}
                        disabled={disabled}
                        className="w-full h-16 border p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </dd>
            </div>
            {settled || <div className="flex items-center justify-end gap-2 mt-2">
                <button
                    onClick={onReject}
                    className="inline-flex gap-2 items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 border-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <XMarkIcon className="h-5" />
                    Reject
                </button>
                <button
                    onClick={onApprove}
                    className="inline-flex gap-2 items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 disabled:opacity-60 disabled:grayscale disabled:hover:bg-green-100 bg-green-100 hover:bg-green-200 border-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={disabled}
                >
                    <CheckIcon className="h-5" />
                    Approve
                </button>
            </div>}
        </div>
    )
}