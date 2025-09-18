import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { AlertsListTableTab } from "./alert-list-table-tab";
import { AlertsListTableTitle } from "./alert-list-table-title";
import { AlertTableDataType, columns } from "./columns";
import { AlertDataTable } from "./data-table";

export const AlertsListTable = () => {
  const data: AlertTableDataType[] = [
    {
      no: 40001,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      status: 0
    },
    {
      no: 40002,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: 0
    },
    {
      no: 40003,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      status: 0
    },
    {
      no: 40004,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's ",
      status: 0
    },
    {
      no: 40005,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      status: 0
    },
    {
      no: 40002,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: 0
    },
    {
      no: 40003,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      status: 0
    },
    {
      no: 40004,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's ",
      status: 0
    },
    {
      no: 40005,
      tagName: "ME FLOWMETER",
      time: new Date().toString(),
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      status: 0
    }
  ];

  return (
    <AlertListBorder>
      <AlertsListTableTitle />
      <AlertsListTableTab />
      <AlertDataTable columns={columns} data={data} />
    </AlertListBorder>
  );
};

function AlertListBorder({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "w-[1480px] rounded-[25px] border-[2px] border-white/20 bg-black p-[5px]",
        className
      )}
    >
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
        <div className="rounded-[21px] border-[2px] border-white/60 bg-black p-[5px]">
          <div className="space-y-6 rounded-[19px] border-[2px] border-white/30 bg-black p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
