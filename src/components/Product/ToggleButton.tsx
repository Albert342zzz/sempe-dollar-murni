"use client";

import { useState } from "react";

export default function ToggleButton() {
  const tabs = ["3kg", "1/2kg", "500gr", "250gr"];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4">
        {tabs.map((tab, index) => {
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-75 border border-black
                ${isFirst ? "rounded-l-full" : ""}
              ${isLast ? "rounded-r-full" : ""}
            ${activeTab === index ? "bg-orange-200 shadow-md" : "hover:bg-orange-100"}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
