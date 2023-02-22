import { classNames } from "./AppLayout";

export default function StatusChip({ status, size = "sm" }: { status: "Pending" | "Approved" | "Rejected", size?: "sm" | "md" | "lg" }) {
    return <div className={classNames(
        "inline-flex items-center border rounded-lg font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" :
            size === "md" ? "px-3 py-0.5 text-base" :
                size === "lg" ? "px-5 py-3 text-lg" : "",
        status === "Pending" ? "bg-yellow-100 text-yellow-600 border-yellow-500" :
            status === "Approved" ? "bg-green-100 text-green-600 border-green-500" :
                status === "Rejected" ? "bg-red-100 text-red-600 border-red-500" : ""
    )}>
        {status}
    </div>
}