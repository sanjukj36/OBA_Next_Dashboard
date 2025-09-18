"use client";

import React, { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { TrashcanIcon } from "@/components/icons/trashcan-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConformModal } from "@/components/ui/DeleteConformModal";
import { Input } from "@/components/ui/input";
import { deleteUserTypeApi, listUserTypeApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { UserForm } from "./user_form";
import { UserType } from "@/types/user-type";
import { toast } from "sonner";

const UserTable = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tableData, setTableData] = useState<UserType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(false);
  const [search, setsearch] = useState("");
  const [dataEmpty, setDataEmpty] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [rowId, setRowId] = useState<number>();

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
        const response = await listUserTypeApi(page, limit, search, token);
        if (response.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response.data.data.length === 0
          ) {
            setDataEmpty(true);
          }
          if (response.data?.success == false) {
            throw new Error(response.data?.message);
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

  const handleOpenDelete = (username: string, id: number) => {
    setSelectedUser(username);
    setRowId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    const id = rowId;

    if (!token) {
      console.error("Authentication token is missing.");
      toast.warning("Session expired. Please log in again.");
      return;
    }
    if (!id) {
      console.error("Row ID is missing. Cannot proceed with deletion.");
      return;
    }

    try {
      const response = await deleteUserTypeApi(id, token);

      if (response.status === 200) {
        const { success, message } = response.data?.data || {};

        if (success == false) {
          throw new Error(message);
        }
        setResponse(true);
        toast.success("User type delete successfully!");
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (err) {
      toast.error("Failed to deleteing user type. Please try again.");

      if (err instanceof AxiosError) {
        const data = err.response?.data;
        toast.error(data.message);
        return;
      }
      console.log({ err });
    } finally {
      handleCloseDelete();
    }
  };

  return (
    <div className="mt-[4%] flex flex-col font-alexandria">
      <div className="mx-auto flex w-[min(calc(100%-40px),1490px)] flex-1 flex-col sm:pl-10">
        {/* Top Bar */}
        <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="ml-[47.2px] flex items-center gap-3">
            <UserIcon className="h-[34.33px] w-[30.77px]" />
            <span className="font-alexandria text-[30px] font-bold text-input md:text-3xl lg:text-[25px] 3xl:text-[27px]">
              User Type Details
            </span>
          </div>

          <div className="flex items-center gap-[10.94px]">
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
            <UserForm setResponse={setResponse} mode={"add"} />
          </div>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <div className="xxl-text-lg min-sm:text-xs grid h-[40.2px] min-w-[500px] grid-cols-[1fr_2fr_1fr_0.5fr] items-center rounded-[15px] bg-secondary text-center font-alexandria font-normal tracking-widest text-input shadow-md max-md:text-sm max-sm:text-xs sm:text-sm md:text-xs lg:grid-cols-[0.8fr_1fr_1fr_0.7fr] lg:text-[14px] xl:text-lg 3xl:grid-cols-[1fr_2fr_1fr_0.5fr]">
            <div className="ml-[-168px] lg:ml-[-73px] 2xl:ml-[-82px] xl:ml-[-70px]">Name</div>
            <div className="ml-[-240px] lg:ml-[-227px] xl:ml-[-245px]">Pages</div>
            <div className="ml-[56px] lg:ml-[84px] xl:ml-[50px]">Entity Type</div>
            <div className="text-center"></div>
          </div>

          {/* Table Rows */}
          <TableRows
            tableData={tableData}
            loading={loading}
            onDeleteClick={handleOpenDelete}
            setResponse={setResponse}
            dataEmpty={dataEmpty}
          />
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />

        {/* Delete Modal */}
        {selectedUser && (
          <DeleteConformModal
            open={showDeleteModal}
            onClose={handleCloseDelete}
            onDelete={handleDelete}
            title="Delete User Type Details"
            subTitle={selectedUser}
            description="Are you sure you want to delete this User"
          />
        )}
      </div>
    </div>
  );
};

export default UserTable;

type TableRow = {
  id: number;
  name: string;
  pages: string[];
  entity_type: string;
  isDeleted: boolean;
};

const TableRows = ({
  tableData,
  loading,
  onDeleteClick,
  setResponse,
  dataEmpty
}: {
  tableData: TableRow[];
  loading: boolean;
  dataEmpty: boolean;
  onDeleteClick: (username: string, id: number) => void;
  setResponse: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (dataEmpty || !tableData?.length) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
        <span className="ml-2 font-alexandria text-sm text-muted-foreground">
          Data Not Found...
        </span>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {Array.isArray(tableData) &&
        tableData.map((row, index) => (
          <div
            key={index}
            className="mt-[3.89px] grid h-auto min-w-[500px] items-center gap-1 rounded-[15px] bg-card text-left font-alexandria text-xxs tracking-widest text-black shadow-md lg:grid-cols-[0.8fr_1fr_1fr_0.7fr] lg:text-[12px] xl:text-xs 2xl:text-base 3xl:grid-cols-[1fr_2fr_1fr_0.5fr]"
          >
            <div className="text-left ml-[46px] xl:ml-[77px] 2xl:ml-[99px] 3xl:ml-[92px]">{row.name}</div>
            <div className="mt-2 ml-[155px] xl:ml-[10px] lg:ml-[-12px] 2xl:ml-[38px] 3xl:ml-[161px]">
              {row.pages.map((page: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="mb-2 mr-1 rounded-[12px] px-[11px] py-[4px] text-xxs font-normal tracking-widest text-black lg:text-[12px] xl:text-xs 2xl:text-base"
                >
                  {page}
                </Badge>
              ))}
            </div>

            <div className="ml-[132px] xl:ml-[141px] 2xl:ml-[177px] 3xl:ml-[139px]">{row.entity_type}</div>
            <div className="flex justify-center gap-3 max-sm:me-2 max-sm:gap-0">
              <UserForm setResponse={setResponse} mode={"edit"} row={row} />
              <Button
                onClick={() => onDeleteClick(row.name, row.id)}
                // className="sm:min-h-[20px] sm:max-h-[1px] sm:max-W-[1px] rounded-[10px] bg-destructive p-2 hover:bg-destructive/50 max-sm:p-[8px]"
                className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] rounded-[12px] bg-destructive p-2 hover:bg-destructive/50 max-xl:m-2 max-xl:h-[30px] max-xl:w-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px] sm:p-[10px] xl:h-[37px] 3xl:w-[42px]"

              // className="sm:min-p-[1px] sm-max-w-[10px] xl:h-[33px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] rounded-[10px] bg-destructive 3xl:p-3 p-3 xl:p-[10px] hover:bg-destructive/50 max-xl:m-2 max-xl:h-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px]"
              >
                <TrashcanIcon className="h-4 w-4 max-sm:h-4 max-sm:w-4 sm:me-0" />
              </Button>
            </div>
          </div>
        ))}
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
    <div className="ml-[54px] mt-[25.86px] flex flex-col items-center justify-between gap-4 md:flex-row md:justify-between">
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
