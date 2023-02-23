import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function EmptyState(props: {
  title?: string;
  description?: string;
}) {
  const { title, description } = props;
  return (
    <div className="text-center border-2 p-4 mt-2 border-dashed">
      <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {title || "No data"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {description || "No data available"}
      </p>
    </div>
  );
}
