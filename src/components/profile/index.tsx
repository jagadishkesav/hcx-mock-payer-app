import React from "react";
import { Link } from "raviger";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import _ from "lodash";

export default function Profile() {
    const participantDetails: Object = useSelector((state: RootState) => state.participantDetailsReducer.participantDetails);

    return (
        <div className="h-3/4">

            <div className="flex-1">
                <div className="w-full h-full p-6 bg-white rounded-lg pb-4">
                    <div className="text-gray-500 text-base font-bold pb-4 pt-4">
                        <div>
                            <div className="px-4 sm:px-0 ">
                                <h1 className="text-base font-semibold leading-7 text-gray-900">Participant Information</h1>
                            </div>
                            <div className="mt-6 border-t border-gray-100">
                                <dl className="divide-y divide-gray-100">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Participant code</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{_.get(participantDetails, "participant_code")}</dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Participant name</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{_.get(participantDetails, "participant_name")}</dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Primary email</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{_.get(participantDetails, "primary_email")}</dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Role</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{_.get(participantDetails, "roles")}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}
