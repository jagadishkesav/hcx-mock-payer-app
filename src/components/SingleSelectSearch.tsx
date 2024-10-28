import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getParticipantByRoles } from '../api/RegistryService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { set } from 'lodash';
import _ from 'lodash';

// Example options for the dropdown
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];
const customStyles = {
    control: (provided: any) => ({
      ...provided,
      padding: '0.5rem',
      borderColor: '#d1d5db', // Tailwind's gray-300
      borderRadius: '0.5rem', // Tailwind's rounded-lg
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // Tailwind's shadow-sm
      '&:hover': {
        borderColor: '#3b82f6', // Tailwind's blue-500
      },
      '&:focus-within': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)', // Tailwind's ring focus
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#ebf8ff' : '#ffffff', // Tailwind's blue-100 for focus
      color: state.isFocused ? '#1e40af' : '#1f2937', // Tailwind's blue-800 and gray-800
      cursor: 'pointer',
      padding: '0.5rem',
      '&:hover': {
        backgroundColor: '#dbeafe', // Tailwind's blue-50
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#1f2937', // Tailwind's gray-800
    }),
  };

export interface Option {
    value:string;
    label:string;
  }

const SingleSelectSearch = ({ onSelectChange }: { onSelectChange: (option: any) => void })  => {
  const handleChange = (selectedOption: any) => {
     onSelectChange(selectedOption);
  };

  const [payerList, setPayerList] = useState<Option[]>([]);
  let authToken = useSelector((state: RootState) => state.tokenReducer.participantToken);

  useEffect(() =>{
    getParticipantByRoles("payor",authToken).then((res:any)=>{
            console.log("payer list", res.data.participants);
            setPayerList([]);
            res.data.participants? res.data.participants.map((value: any, index: any) => {
                payerList.push({ "value":value.participant_code, "label":value.participant_code})
              }) : null;
            setPayerList(_.uniqBy(payerList, 'value'));
          });
  },[])

  return (
    <div>
    <label className="mb-2.5 mt-3 block text-left text-black dark:text-white">
      {"Search Payors"}
    </label>
    <Select
      options={payerList}
      styles={customStyles}
      isClearable={true}
      onChange={handleChange}
      placeholder="Select a payor to forward request..."
      isSearchable
    />
    </div>
  );
};

export default SingleSelectSearch;
