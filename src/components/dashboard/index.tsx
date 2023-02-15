import React from "react";

export default function Dashboard() {
  // Dashboard Page, with Title and Welcome Message to HCX Payer App
  // 2 Large White Cards to navigate to Claims and Coverage Eligibility
  // Styled with TailwindCSS
  return (
    <div className="h-3/4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <h2 className="text-2xl font-bold">Welcome to HCX Payer App</h2>
      <div className="flex flex-row items-center justify-center w-full h-full">
        {["Claims", "Coverage Eligibility"].map((item, index) => {
          return (
            <div className="flex flex-col items-center justify-center w-3/4 md:w-1/2 lg:w-1/3 py-10 bg-slate-50 m-2 border-gray-800 border rounded-xl">
              <h1 className="text-4xl font-bold">{item}</h1>
              <h2 className="text-md">Navigate to {item}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
