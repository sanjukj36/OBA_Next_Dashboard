import { X } from "lucide-react";
import { AlarmTableDataType, columns } from "./columns";
import { AlarmDataTable } from "./data-table";

export const AlarmMonitoringTable = () => {
  const data: AlarmTableDataType[] = [
    {
      registers: 41001,
      parmeters: "Mode_anchor_Lost",
      value: 0
    },
    {
      registers: 41002,
      parmeters: "Mode_anchor_Lost",
      value: 0
    },
    {
      registers: 41003,
      parmeters: "Mode_anchor_Lost",
      value: 0
    },
    {
      registers: 41004,
      parmeters: "Mode_anchor_Lost",
      value: 0
    },
    {
      registers: 41005,
      parmeters: "Mode_anchor_Lost",
      value: 0
    }
  ];

  return (
    <>
      <div className="flex min-h-screen items-start justify-center px-4 py-6">
        <div className="mx-auto w-[1480px] rounded-[25px] border-[2px] border-white/20 bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C] p-[5px]">
          {/* Middle layer: gradient background */}
          <div
            className="rounded-[23px] p-[1px]"
            style={{
              backgroundImage: `linear-gradient(
                                to bottom,
                                rgba(204, 204, 204, 0.8) 0%,
                                #515151 25%,
                                #CCCCCC 50%,
                                #515151 75%,
                                #CCCCCC 100%
                              )`
            }}
          >
            {/* White/60 border with spacing- */}
            <div className="rounded-[14px] border-[1px] border-white/60 bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C] p-[5px]">
              {/* Inner Content */}
              <div className="rounded-[14px] border-[1px] border-white/30 bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C] p-10">
                <div className="relative mb-8 text-center">
                  <div className="mb-8 flex items-center justify-start gap-x-[388px] font-russo text-3xl text-input">
                    <h2 className="ms-2 font-russo text-3xl text-input">
                      ALARM MONITORING SYSTEM DATA
                    </h2>
                    <div>
                      <X className="absolute right-4 top-0 h-8 w-8 cursor-pointer text-input" />
                    </div>
                  </div>
                </div>
                {/* Table */}
                <div className="mt-2">
                  <AlarmDataTable columns={columns} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
