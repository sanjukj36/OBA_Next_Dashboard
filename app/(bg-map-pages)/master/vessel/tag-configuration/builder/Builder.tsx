"use client";

import React from "react";
import ImportXML from "./XML/ImportXML";

const Builder: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 font-alexandria">
      <div className="max-w-2xls w-full space-y-6 rounded-2xl bg-primary p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800">
          Vessel Tag Configuration
        </h2>

        <div className="mt-8">
          <ImportXML />
        </div>
      </div>
    </div>
  );
};

export default Builder;
