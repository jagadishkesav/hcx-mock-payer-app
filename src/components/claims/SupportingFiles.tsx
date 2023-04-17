import { ArrowDownTrayIcon, EyeIcon, PaperClipIcon } from "@heroicons/react/24/outline";

export default function SupportingFiles(props: {
    supportingFiles: any
}) {

    const { supportingFiles } = props;

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
                                    href={file.valueAttachment.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex ml-4 shadow-sm border border-gray-300 hover:border-gray-400 rounded-md px-3 py-1 font-medium text-gray-700 hover:text-black"
                                >
                                    <EyeIcon className="h-5 w-5 flex-shrink-0 mr-2 text-indigo-400" />
                                    <span>View</span>
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
        </dd>
    )
}