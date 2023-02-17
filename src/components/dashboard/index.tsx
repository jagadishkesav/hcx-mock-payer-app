import React from "react";
import { Link } from "raviger";

export default function Dashboard() {
  // Dashboard Page, with Title and Welcome Message to HCX Payer App
  // 2 Large White Cards to navigate to Claims and Coverage Eligibility
  // Styled with TailwindCSS
  return (
    <div className="h-3/4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <h2 className="text-2xl font-bold">Welcome to HCX Payer App</h2>
      <div className="flex flex-row items-center justify-center w-full h-full">
        {[
          {
            title: "Claims",
            href: "/claims",
          },
          {
            title: "Coverage Eligibility",
            href: "/coverage",
          },
          {
            title: "Pre Auth",
            href: "/preauths",
          }
        ].map((item, index) => {
          return (
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center w-3/4 md:w-1/2 lg:w-1/3 py-10 bg-slate-50 m-2 border-gray-800 border rounded-xl"
            >
              <h1 className="text-4xl font-bold">{item.title}</h1>
              <h2 className="text-md">Navigate to {item.title}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
