"use client";

import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import { CompanyIcon } from "@/components/icons/company-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { TrashcanIcon } from "@/components/icons/trashcan-icon";
import { Button } from "@/components/ui/button";
import { DeleteConformModal } from "@/components/ui/DeleteConformModal";
import { Input } from "@/components/ui/input";
import { deleteCompanyApi, listCompanyApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { CompanyForm } from "./company_form";
import { toast } from "sonner";

interface Company {
  id: number;
  name: string;
  email: string;
  isDeleted: boolean;
}

const CompanyTable = () => {
  const [tableData, setTableData] =  useState<Company[]>([]);;
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
      toast.warning("Token is missing. Please login again.");
      return;
    }
    try {
      if (page && limit && token) {
        setLoading(true);
        const response = await listCompanyApi(page, limit, search, token);
        if (response.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response.data.data.length === 0
          ) {
            setLoading(false);
            setDataEmpty(true);
            return;
          }
          if (response.data?.success === false) {
            throw new Error(response.data?.message || "Request failed");
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
      const response = await deleteCompanyApi(id, token);

      if (response.status === 200) {
        const { success, message } = response.data?.data || {};

        if (success == false) {
          throw new Error(message);
        }
        setResponse(true);
        toast.success("Company delete successfully!");
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (err) {
      toast.error("Failed to deleteing company. Please try again.");
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        toast.error(data.message);
        return;
      }
    } finally {
      handleCloseDelete();
    }
  };

  return (
    <div className="mt-[4%] flex flex-col font-alexandria">
      <div className="lg:w-min[(calc(100%-100px),1382px)] mx-auto flex w-[min(calc(100%-16px),1382px)] flex-1 flex-col font-alexandria sm:pl-10 3xl:w-[min(calc(100%-16px),1382px)]">
        {/* Top Bar */}
        <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="ml-[47.2px] flex items-center gap-3">
            <CompanyIcon className="h-[34.33px] w-[30.77px]" />
            <span className="font-alexandria text-xl font-semibold text-input md:text-3xl lg:text-[23px] 3xl:text-[27px]">
              Company Details
            </span>
          </div>

          <div className="flex items-center gap-[10.94px] font-alexandria">
            <div className="flex items-center gap-2 rounded-lg border border-card-foreground bg-secondary px-4 py-2 shadow-md">
              <SearchIcon className="h-5 w-5 text-input" />
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
            <CompanyForm setResponse={setResponse} mode={"add"} />
          </div>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto font-alexandria">
          <div className="3xl:text-[18px] text-[18px] min-sm:text-xs grid h-[40.2px] min-w-[500px] grid-cols-[0.5fr_3fr_0.4fr] items-center rounded-[15px] bg-secondary text-center font-normal tracking-widest text-input shadow-md lg:text-[14px] 2xl:text-[18px] xl:text-[15px]">
            <div className="ml-[12px]">Name</div>
            <div className="ml-[-81px]">Email</div>
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
            title="Delete Company Details"
            subTitle={selectedUser}
            description="Are you sure you want to delete this User!"
          />
        )}
      </div>
    </div>
  );
};

export default CompanyTable;

type TableRow = {
  id: number;
  name: string;
  email: string;
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
      <div className="flex h-40 w-full items-center justify-center">
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
            className="mt-[3.89px] grid h-auto min-w-[500px] grid-cols-[0.5fr_3fr_0.4fr] items-center gap-1 rounded-[15px] bg-card text-left font-alexandria text-xxs tracking-widest text-black shadow-md lg:text-[10px] xl:text-xs 2xl:text-base 3xl:text-[16px]"
          >
            <div className="ml-[63px] 3xl:ml-[63px] 2xl:ml-[63px] xl:ml-[63px] lg:ml-[48px]">{row.name}</div>
            <div className="ml-[446px] 3xl:ml-[446px] xl:ml-[394px] 2xl:ml-[445px] lg:ml-[304px]">{row.email}</div>
            <div className="flex justify-center gap-3 max-sm:me-2 max-sm:gap-0 lg:ml-[-89px] ml-0 3xl:ml-[-53px] 2xl:ml-[-51px] xl:ml-[-65px]">
              <CompanyForm setResponse={setResponse} mode={"edit"} row={row} />
              <Button
                onClick={() => onDeleteClick(row.name, row.id)}
                className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] m-1 rounded-[10px] bg-destructive p-3 hover:bg-destructive/50 max-xl:m-2 max-xl:h-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px] lg:pl-[8px] lg:pr-[8px]"
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
    <div className="ml-[54px] mt-[25.86px] flex flex-col items-center justify-between gap-4 font-alexandria md:flex-row md:justify-between">
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
