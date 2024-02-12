import { useState } from "react";
import { bgcolorPicker, colorPicker } from "../utils/StringUtil";
import { properText, textOrDash } from "../utils/StringUtils";
import { ClaimDetail } from "../pages/Claims/Claims";

interface DetailsProps{
    title:string;
    claim: Object;
    fields:String[]
}


const DetailsBox:React.FC<DetailsProps> = ({title,claim,fields}:DetailsProps) => {
    console.log("fields", fields, claim, fields.includes("addresss"), Object.entries(claim));

    const componentMap: { [key: string]: (detail: any) => JSX.Element } = {
        status: (detail: any) => (
            <span className={"inline-block rounded py-0.5 px-2.5 text-sm font-medium bg-opacity-20 " + (bgcolorPicker(detail)) + " " + colorPicker(detail)}>
            {detail}
        </span>
        ),
        address: (detail: any) => (
          <div className="col-span-2 md:col-span-1 w-3/12 md:w-auto">
            {textOrDash(
              detail?.map((a: any, i: number) => (
                <div key={i}>
                  {a.text},
                  <br />
                  {a.city}, {a.state}, {a.postalCode},
                  <br />
                  {a.country}
                </div>
              ))
            )}
          </div>
        ),
      };
    
    return(
        <div
        // ref={modal}
        // onFocus={() => onClose(true)}
        // onBlur={() => onClose(false)}
        className="w-full max-w-203 rounded-lg bg-gray py-12 px-8 dark:bg-boxdark md:py-5 md:px-5 mb-3"
    >
        <p className="pb-2 text-xl font-bold text-black dark:text-white sm:">
            {title}
        </p>
        <span className="mx-auto mb-6 inline-block h-1 w-25 rounded bg-primary"></span>
        <div className="flex flex-col-reverse gap-5 xl:flex-row xl:justify-between mb-2">
            <div className="flex flex-col gap-4 sm:flex-row xl:gap-9">
                <div>
                {Object.entries(claim).filter(([name, _]) => fields.includes(name)).map(([name, detail], index) => {
                    return(<span className="mt-2 block">
                        <span className="font-medium">{properText(name)} :</span>
                        {componentMap[name]
                          ? (componentMap[name](detail) as any)
                          : detail}
                    </span>)
                })}
                
                </div>
            </div>
        </div>
    </div>
    )



}

export default DetailsBox;