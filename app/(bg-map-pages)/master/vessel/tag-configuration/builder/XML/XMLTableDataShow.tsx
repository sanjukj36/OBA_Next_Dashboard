import React, { useState } from "react";

interface XMLTableDataShowProps {
  selectedVesselId: string;
  handleCancel: () => void;
}

type TableData = {
  [key: string]: string[][];
};

const XMLTableDataShow: React.FC<XMLTableDataShowProps> = ({}) => {
  const data: TableData = {
    vessel1: [
      [
        "tag_form_vessel",
        "description",
        "actual_tag",
        "unit",
        "min",
        "max",
        "dataType",
        "alarm_priority",
        "AMS(1 or 0)"
      ],
      ["", "", "", "", "", "", "", "", ""]
    ]
  };

  const tableNames = Object.keys(data);
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [editedData, setEditedData] = useState<TableData>(data);

  const handleInputChange = (
    tableName: string,
    rowIndex: number,
    cellIndex: number,
    value: string
  ) => {
    setEditedData(prevData => {
      const updatedData = { ...prevData };
      updatedData[tableName] = updatedData[tableName].map((row, i) =>
        i === rowIndex + 1
          ? row.map((cell, j) => (j === cellIndex ? value : cell))
          : row
      );
      return updatedData;
    });
  };

  const handleAddRow = (tableName: string) => {
    setEditedData(prevData => {
      const updatedData = { ...prevData };
      const headerLength = prevData[tableName][0]?.length || 0;
      const newRow = new Array(headerLength).fill("");
      updatedData[tableName] = [...updatedData[tableName], newRow];
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("Updated Data:", editedData);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const renderTable = (tableName: string) => {
    const tableData = editedData[tableName];
    const tableHeaders = tableData[0];
    const tableRows = tableData.slice(1);

    return (
      <div className="mb-4 max-h-96 overflow-x-auto overflow-y-auto rounded-lg border border-gray-300">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
              {tableHeaders.map((header, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-600">
            {tableRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-300 hover:bg-gray-100"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-3 text-left">
                    <input
                      type="text"
                      value={cell}
                      onChange={e =>
                        handleInputChange(
                          currentTable,
                          rowIndex,
                          cellIndex,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-start px-2 py-2">
          <button
            onClick={() => handleAddRow(currentTable)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-green-600 text-xl text-green-600 hover:bg-green-100"
            title="Add Row"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Vessel Name</h1>

      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-4">
          {tableNames.map(tableName => (
            <button
              key={tableName}
              onClick={() => setCurrentTable(tableName)}
              className={`text-nowrap rounded-2xl border-2 px-4 py-2 text-white ${
                currentTable === tableName
                  ? "bg-slate-900"
                  : "bg-slate-400 hover:bg-slate-500"
              }`}
            >
              {tableName}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">{renderTable(currentTable)}</div>

      <button
        onClick={handleSubmit}
        // className="min-w-24 "
        className="rounded-2xl border-2 border-dashed border-black bg-secondary px-6 py-3 uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:bg-secondary/80 hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
      >
        Submit
      </button>
    </div>
  );
};

export default XMLTableDataShow;
