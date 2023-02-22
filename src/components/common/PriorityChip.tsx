import { properText } from "../../utils/StringUtils";
import { classNames } from "./AppLayout";

export default function PriorityChip({
  status,
  size = "sm",
}: {
  status: "low" | "normal" | "high";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={classNames(
        "inline-flex items-center border rounded-lg font-medium",
        size === "sm"
          ? "px-2.5 py-0.5 text-xs"
          : size === "md"
          ? "px-3 py-0.5 text-base"
          : size === "lg"
          ? "px-5 py-3 text-lg"
          : "",
        status === "low"
          ? "bg-green-100 text-blue-600 border-blue-500"
          : status === "normal"
          ? "bg-yellow-100 text-yellow-600 border-yellow-500"
          : status === "high"
          ? "bg-red-100 text-red-600 border-red-500"
          : ""
      )}
    >
      {properText(status)}
    </div>
  );
}
