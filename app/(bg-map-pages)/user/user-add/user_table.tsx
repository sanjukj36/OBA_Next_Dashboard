"use client";

import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { listUserAddApi, userAddDisableApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { EnableDisableUserModal } from "./enableDisableUserModal";
import { UserForm, UserTypeRow } from "./user_form";
import { toast } from "sonner";

const UserTable = () => {
  const [search, setsearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [response, setResponse] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dataEmpty, setDataEmpty] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    getTableData();
  }, [page, search]);

  useEffect(() => {
    if (response) {
      getTableData();
      setResponse(false);
    }
  }, [response]);

  const getTableData = async () => {
    const limit = 5;
    if (!token) {
      toast.error("Token is missing. Please login again.");
      return;
    }
    try {
      if (page && limit && token) {
        const response = await listUserAddApi(page, limit, search, token);
        if (response.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response.data.data.length === 0
          ) {
            setDataEmpty(true);
          }
          if (response.data?.data?.success == false) {
            throw new Error(response.data?.data?.message);
          }
          if (page > response?.data?.meta?.totalPages) {
            setPage(page - 1);
            setLoading(true);
            return;
          }
          setTableData(response?.data?.data);
          setTotalPages(response?.data?.meta?.totalPages);
          setPage(response?.data?.meta?.page);
          setLoading(false);
          setDataEmpty(false);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } else {
        const missingFields = [];
        if (!page) missingFields.push("page");
        if (!limit) missingFields.push("limit");
        if (!token) missingFields.push("token");
      }
    } catch (err) {
      console.error("Error while getting user type:", err);
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        toast.error(data.message);
        return;
      }
    }
  };

  return (
    <div className="mt-[4%] flex flex-col">
      <div className="mx-auto flex w-[min(calc(100%-16px),1490px)] flex-1 flex-col lg:w-[min(calc(85%-16px),1490px)] xl:w-[min(calc(88%-16px),1490px)]">
        {/* Top Bar */}
        <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="ml-[47.2px] flex items-center gap-3">
            <UserIcon className="h-[34.33px] w-[30.77px]" />
            <span className="font-alexandria text-[30px] font-semibold text-input md:text-[26px] lg:text-[23px] xl:text-[30px] 3xl:text-[27px]">
              User Details
            </span>
          </div>

          <div className="flex items-center gap-[10.94px] font-alexandria">
            <div className="flex items-center gap-2 rounded-lg border border-card-foreground bg-secondary px-4 py-2 shadow-md">
              <SearchIcon className="h-6 w-6 text-input" />
              <Input
                type="text"
                value={search}
                onChange={e => {
                  setsearch(e.target.value);
                  setPage(1);
                  setTotalPages(1);
                }}
                placeholder="Search"
                className="mt-1 flex h-5 w-[200px] border-transparent bg-transparent px-2 py-0 text-input shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[17px] placeholder:text-input focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm"
              />
            </div>
            <UserForm setResponse={setResponse} />
          </div>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <div className="min-sm:text-xs grid h-[40.2px] min-w-[600px] grid-cols-[1fr_2.5fr_0.5fr_4fr] items-center rounded-[15px] bg-secondary py-[10px] text-center font-alexandria text-[18px] font-normal tracking-widest text-input shadow-md max-md:text-sm max-sm:text-xs sm:text-sm md:text-xs lg:grid-cols-[1fr_1.6fr_0.9fr_3.4fr] lg:text-[13px] xl:text-[13px] 3xl:grid-cols-[0.9fr_1.5fr_1fr_1.8fr] 3xl:text-[18px]">
            {/* <div>Name</div> */}
            <div className="ml-[-101px] lg:ml-[15px] xl:ml-[-21px] 2xl:ml-[-47px] 3xl:ml-[-101px]">
              Email
            </div>
            <div className="ml-[11px] 3xl:ml-[11px] xl:ml-[-8px] 2xl:ml-[86px] lg:ml-[-13px]">User Type</div>
            <div className="ml-[-16px] lg:ml-[-25px] xl:ml-[84px] 2xl:ml-[210px] 3xl:ml-[-16px]">
              Expiry
            </div>
            <div className="ms-[1px] lg:ms-[-49px] xl:ms-[-15px] 2xl:ms-[-36px] 3xl:ms-[1px]">
              Edit
            </div>
            <div className="text-center"></div>
          </div>

          {/* Table Rows */}
          <TableRows
            tableData={tableData}
            loading={loading}
            setResponse={setResponse}
            dataEmpty={dataEmpty}
          />
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default UserTable;

type TableRow = {
  id: number;
  name: string;
  email: string;
  userType: { name: string };
  expiry: string;
  password: string;
  isActive: boolean;
};

const TableRows = ({
  tableData,
  loading,
  setResponse,
  dataEmpty
}: {
  tableData: TableRow[];
  loading: boolean;
  dataEmpty: boolean;
  setResponse: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedToggleUser, setSelectedToggleUser] = useState<TableRow | null>(
    null
  );
  const [showToggleModal, setShowToggleModal] = useState(false);

  const { token } = useAuth();

  const convertToUserTypeRow = (tableRow: TableRow): UserTypeRow => ({
    ...tableRow,
    userType: tableRow.userType?.name || "" // Extract just the name string
  });

  const handleToggleClick = (user: TableRow) => {
    setSelectedToggleUser(user);
    setShowToggleModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedToggleUser || !token) return;
    try {
      await userAddDisableApi(selectedToggleUser.id, token, {
        id: selectedToggleUser.id
      });
      setShowToggleModal(false);
      setSelectedToggleUser(null);
      setResponse(true); // refresh data
    } catch (error) {
      console.error("Failed to toggle user status", error);
      toast.error("Failed to update user status.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }
  if (dataEmpty || !tableData?.length) {
    return (
      <div className="flex h-40 w-full items-center justify-center font-alexandria">
        <span className="ml-2 font-alexandria text-sm text-muted-foreground">
          Data Not Found...
        </span>
      </div>
    );
  }

  return (
    <>
      {Array.isArray(tableData) &&
        tableData.map((row, index) => (
          <div
            key={index}
            className="mt-[3.89px] grid h-auto min-w-[500px] grid-cols-[0.8fr_1fr_1.8fr_1fr] items-center gap-1 rounded-[15px] bg-card text-left font-alexandria text-xxs tracking-widest text-black shadow-md max-sm:grid-cols-[1fr_1.8fr_0.1fr_2.1fr_0.2fr] lg:grid-cols-[0.8fr_1fr_1.9fr_2fr] lg:text-[11px] xl:text-[11px] 2xl:text-[11px] 3xl:grid-cols-[0.8fr_1fr_1.8fr_1fr] 3xl:text-[16px]"
          >
            {/* <div>{row.name}</div> */}
            <div className="ms-[49px] 3xl:ms-[49px] xl:ms-[45px] max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
              {row?.email || ""}
            </div>

            <div className="ms-[165px] 3xl:ms-[165px] xl:ms-[89px] 2xl:ms-[137px] lg:ms-[54px]">{row?.userType?.name || ""}</div>
            <div className="ms-[205px] 3xl:ms-[205px] 2xl:ms-[250px] xl:ms-[152px] lg:ms-[66px]">{row?.expiry || ""}</div>

            <div className="flex justify-center gap-20 max-sm:me-2 max-sm:gap-0">
              <UserForm
                setResponse={setResponse}
                row={row ? convertToUserTypeRow(row) : undefined}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id={`user-switch-${row.id}`}
                  checked={row.isActive}
                  onCheckedChange={() => handleToggleClick(row)} // Open modal to confirm toggle
                />
                <Label
                  htmlFor={`user-switch-${row.id}`}
                  className={`${row.isActive ? "text-black" : "text-black"} xxl-text-lg min-sm:text-xs text-[16px] lg:text-[11px] xl:text-[12px] 2xl:text-[12px] 3xl:text-[16px]`}
                >
                  {row.isActive ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </div>
        ))}

      {/* Enable/Disable Modal */}
      {selectedToggleUser && (
        <EnableDisableUserModal
          open={showToggleModal}
          onClose={() => {
            setShowToggleModal(false);
            setSelectedToggleUser(null);
          }}
          onConfirm={handleConfirmToggle}
          isActive={selectedToggleUser.isActive}
        />
      )}
    </>
  );
};

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages
}) => {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="ml-[54px] mt-[25.86px] flex flex-col items-center justify-between gap-4 font-alexandria text-[18px] md:flex-row md:justify-between xl:text-[16px] 3xl:text-[18px]">
      <span className="text-lg font-semibold text-input">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-3">
        <Button
          onClick={handlePrev}
          disabled={page === 1}
          className="h-[40.24px] w-[46.16px] rounded-[10px] border border-card-foreground bg-secondary p-2"
        >
          <ArrowLeftIcon className="h-[23px] w-[13px] object-fill" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={page === totalPages}
          className="h-[40.24px] w-[46.16px] rounded-[10px] border border-card-foreground bg-secondary p-2"
        >
          <ArrowRightIcon className="h-[23px] w-[14px] object-fill" />
        </Button>
      </div>
    </div>
  );
};
