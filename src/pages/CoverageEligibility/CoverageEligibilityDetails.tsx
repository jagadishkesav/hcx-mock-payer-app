import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import _ from "lodash";
import { useState } from "react";
import { ChecklistItem } from "../Claims/ClaimDetails";
import { CoverageDetail } from "./CoverageEligibilityList";
import { Link } from "react-router-dom";
import DetailsBox from "../../components/DetailsBox";
import Checklist from "../../components/Checklist";
import { bgcolorPicker, colorPicker } from "../../utils/StringUtil";

const CoverageEligibilityDetails = () => {


    const dispatch = useDispatch();
    const activeClasses = 'text-primary border-primary';
    const inactiveClasses = 'border-transparent';
    const appData: Object = useSelector((state: RootState) => state.appDataReducer.appData);
    const [coverage, setCoverage] = useState<CoverageDetail | null>(_.get(appData,"coverage") || null);
    const [openTab, setOpenTab] = useState(1);
    const [coverageChecklist, setCoverageChecklist] = useState<ChecklistItem[]>([
        {
          id: "1",
          name: "Coverage is active and within expiry",
        },
      ]);
      const [coverageSettled, setCoverageSettled] = useState(coverage?.status == "Approved" ? true :false);  
    
    return (
        <>
            <div className="rounded-sm border border-stroke bg-white p-4 mb-8 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-2.5 text-title-md2 font-bold text-black dark:text-white">
                            Coverage Eligibility
                        </h2>
                        <p className="font-medium mb-1">Coverage ID : {coverage? coverage.request_id : "Not Available"}</p>
                        <p className="font-medium">Coverage No : {coverage ? coverage.request_no : "Not Available"}</p>
                    </div>
                    <div>
                        <h2 className="mb-2.5 text-title-md2 font-bold text-black dark:text-white">
                            &nbsp;
                        </h2>
                        <p className="font-medium mb-1">Status : <span className={"inline-block rounded py-0.5 px-2.5 text-sm font-medium bg-opacity-20 " + (bgcolorPicker(coverage ? coverage.status : "unknown")) + " " + colorPicker(coverage ? coverage.status : "unknown")}>
                        {coverage ? coverage.status : "Not Available"}
                        </span></p>
                    </div>

                </div>
            </div>
            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
                   <Link
                     to="#"
                     className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 1 ? activeClasses : inactiveClasses
                         }`}
                     onClick={() => setOpenTab(1)}
                  >
                     Coverage Eligiblity
                  </Link>
                </div>

                <div>
                    <div
                        className={`leading-relaxed ${openTab === 1 ? 'block' : 'hidden'}`}
                    >  
                        {coverage ? 
                        <>
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">   
                        <DetailsBox title="Coverage Details" claim={coverage} fields={["provider", "name", "insurance_no", "status", "expiry"]}></DetailsBox>
                        </div>
                        <div className="flex flex-col gap-9">
                        <Checklist checklist={coverageChecklist}  settled={coverageSettled} title="Checklist" type="coverage"></Checklist>
                        </div>
                        </div>
                        </> : null}
                    </div>
                </div>
            </div>
        </>)
}

export default CoverageEligibilityDetails;