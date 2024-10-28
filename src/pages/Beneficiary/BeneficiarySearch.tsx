import { useEffect, useState } from "react";
import { listBeneficiary, listRequestById } from "../../api/PayerService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { addAppData } from "../../reducers/app_data";
import { addParticipantToken } from "../../reducers/token_reducer";
import { getParticipantByCode } from "../../api/RegistryService";
import { addParticipantDetails } from "../../reducers/participant_details_reducer";
import { toast } from "react-toastify";
import CommonDataTable from "../../components/CommonDataTable";
import EmptyState from "../../components/EmptyState";
import { claimsMapper } from "../Claims/Claims";

export type BeneficiaryDetails = {
    request_id:string;
    patient_name:string;
    phone_number:string;
    insurance_id:string;
    created_on:string;
    action:string;
    recipeint_code:string;
    sender_code:string;
}

const BeneficiarySearch = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchField, setSearchField] = useState("patient_name");
    const [searchValue, setSearchValue] = useState("");
    const [beneficiary, setBeneficiary] = useState<BeneficiaryDetails[]>();
    const [showBeneficiaryTable,setShowBeneficiaryTable] = useState(false);
    let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);
    const [emptyHeader, setEmptyHeader] = useState("Search a Beneficiary");
    const [emptyHeaderText, setEmptyHeaderText] = useState("No Beneficiary Search Initiated");    

    useEffect(() => {    
        if( sessionStorage.getItem('hcx_user_token') as string == "abcd"  || sessionStorage.getItem('hcx_user_token') == null){
          navigate("/login");
        }else{
          authToken = sessionStorage.getItem('hcx_user_token') as string;
          dispatch(addAppData({ "username": sessionStorage.getItem('hcx_user_name') as string }));
          dispatch(addAppData({ "password": sessionStorage.getItem('hcx_password') as string }));
          dispatch(addParticipantToken(sessionStorage.getItem('hcx_user_token') as string));
          getParticipantByCode(sessionStorage.getItem('hcx_user_name') as string, authToken).then((res: any) => {
          dispatch(addParticipantDetails(res["data"]["participants"][0]));
        }).catch((error) => {
          toast.error("Something went wrong. Please contact the administrator" || "Internal Server Error", {
            position: toast.POSITION.TOP_RIGHT
          });
        });
        }
      }, []);

    const getBeneficiarylist = (searchField: string, searchValue: string) => {
        if(searchValue == ""){
            toast.error("Please enter a search text and continue", {
                position: toast.POSITION.TOP_RIGHT
              });
        }else{
        setShowBeneficiaryTable(false);
        listBeneficiary(searchField, searchValue, authToken).then((res:any) => {
            setBeneficiary(res.data.payload);
            setShowBeneficiaryTable(true);
            if(res.data.payload.length == 0){
                setShowBeneficiaryTable(false);
                setEmptyHeader("No Beneficiary Found");
                setEmptyHeaderText("Unable to find a beneficiary with the search parameters.")
            }
        }).catch((err:any) => {
            console.log("errr ", err);
            toast.error(err.response.data.error.message, {
                position: toast.POSITION.TOP_RIGHT
              });
            setShowBeneficiaryTable(false);
            setEmptyHeader("Search a Beneficiary");
            setEmptyHeaderText("No Beneficiary Search Initiated")
        });
        }
    }

    const onRowClick = (id:string) => {
        listRequestById("claim",id,authToken).then(res => {
            if(res.data.claim){
                dispatch(addAppData({"claim":claimsMapper(res.data.claim[0])}));
            navigate(`/claims/detail`);
            }else if(res.data.coverageeligibility){
                dispatch(addAppData({"coverage":res.data.coverageeligibility[0]}));
                navigate("/coverageeligibility/details");
            }
        }).catch(err => {
            toast.error(err.response.data.error.message, {
                position: toast.POSITION.TOP_RIGHT
              });
        });
    }
    

    return (
        <>
        <div className="rounded-sm border border-stroke bg-white p-4 mb-8 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
            <div className="flex items-center">
                <div className="w-1/3 flex flex-col gap-5.5 p-2.5">
                    <label className="block font-medium text-black dark:text-white">
                        Select Search Field
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={searchField}
                        onChange={(event) => { setSearchField(event.target.value)}}
                        >
                            <option value="patient_name">Beneficiary Name</option>
                            <option value="phone_number">Phone Number</option>
                            <option value="insurance_id">Insurance ID</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                            <svg
                                className="fill-current"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g opacity="0.8">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                        fill=""
                                    ></path>
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="w-1/2 flex flex-col gap-5.5 p-2.5">
                    <label className="block font-medium text-black dark:text-white">
                        Enter Search Value
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Search Text"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={searchValue}
                            onChange={(event) => { setSearchValue(event.target.value)}}
                        />
                        <span className="absolute right-4 top-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />

                            </svg>
                        </span>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col gap-5.5 p-2.5">
                <label className="block font-medium text-black dark:text-white">
                        &nbsp;
                    </label>
                <input
                    type="submit"
                    value="Submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    onClick={(event) => { event.preventDefault(); getBeneficiarylist(searchField, searchValue)}}
                />
                </div>
            </div>
        </div>
        {showBeneficiaryTable ? 
        <CommonDataTable title={"Beneficiary Details"}
                           header={
                            beneficiary
                              ? [
                                "request_id", // last 8 digits of request_id
                                "patient_name", // actually name
                                "phone_number",
                                "insurance_id",
                                "provider",
                                "date",
                                "action",
                              ]
                              : []
                          }
                               data={
                                (beneficiary || []).map((ben) => ({
                                  ...ben,
                                  id:ben.request_id,
                                  request_id: ben.request_id?.slice(-8),
                                  provider: ben.sender_code,
                                  date: new Date(parseInt(ben.created_on)).toLocaleString(),
                                  enableButtons: true
                                })) as any
                              }  
                              onRowClick={(id:string) => onRowClick(id)} 
           ></CommonDataTable> : 
           <EmptyState
                                            title={emptyHeader}
                                            description={emptyHeaderText}
                                          />}
        </>
    )
}

export default BeneficiarySearch;