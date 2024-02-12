import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

interface PaginationProps {
    numRows:string;
    selectedPage: (page:number) => void;
}

const Pagination: React.FC<PaginationProps> = ({numRows, selectedPage}:PaginationProps) => {
  const [numberOfRows, setNumberOfRows] = useState(numRows);  
  const [maxPageNums, setMaxPageNums] = useState(Math.ceil(Number(numRows)/10) > 1 ?  Math.ceil(Number(numRows)/10) : 1);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(maxPageNums > 5 ? 5 : maxPageNums);
  const [pageSelected,setPageSelected] = useState(1);

  const clickNext = () => {
    console.log("i came in next", start);
    if(end < Number(maxPageNums)){
    setStart(start+1)
    setEnd(end+1)
    }
   }
   
   const clickPrev = () => {
    if(start > 1){
    setStart(start-1)
    setEnd(end-1)
   }
  }

  const clickPage = (pageNum:any) => {
    setPageSelected(pageNum);
    console.log("page selected", pageNum);
    selectedPage(pageNum);
  }
  
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-4 sm:p-6 xl:p-7.5">
        <nav className="flex justify-center">
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                to="#"
                onClick={clickPrev}
              >
                Previous
              </Link>
            </li>
            {_.times(maxPageNums <= 5 ? maxPageNums : 5  , (index:any) => {
            return(
                <li>
              <Link
                className={"flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white" + (index+start == pageSelected ? " bg-primary text-white" : "")}
                to="#"
                onClick={() => clickPage(index+start)}
              >
                {index+start}
              </Link>
                </li>
            )
            })}
            <li>
              <Link
                className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                to="#"
                onClick={clickNext}
              >
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
