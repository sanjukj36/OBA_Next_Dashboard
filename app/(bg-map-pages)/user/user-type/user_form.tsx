"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, X } from "lucide-react";
import { z } from "zod";
import { EditIcon } from "@/components/icons/edit-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multi-selector";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import {
  addUserTypeApi,
  listCompanyApi,
  listFleetApi,
  listVesselApi,
  updateUserTypeApi
} from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { toast } from "sonner";


// Constants
const ENTITY_TYPE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "company", label: "Company" },
  { value: "vessel", label: "Vessel" },
  { value: "fleet", label: "Fleet" }
] as const;

const PAGE_OPTIONS = [
  { value: "Dashboard", label: "Dashboard" },
  { value: "AMS", label: "AMS" },
  { value: "alert", label: "Alert" },
  { value: "alarms", label: "Alarms" },
  { value: "voyage", label: "Voyage" },
  { value: "CCTV", label: "CCTV" },
  { value: "device Status", label: "Device Status" },
  { value: "master", label: "Master" },
  { value: "user", label: "User" }
] as const;

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters"),
    pages: z
      .array(
        z.object({
          value: z.string(),
          label: z.string()
        })
      )
      .min(1, "Select at least one page"),
    entityType: z
      .object({
        value: z.string(),
        label: z.string()
      })
      .refine(val => val.value && val.label, {
        message: "Please select entity type"
      }),
    // Make all optional by default
    fk_company: z
      .object({
        value: z.number(),
        label: z.string(),
        id: z.number()
      })
      .optional(),
    fk_vessel: z
      .object({
        value: z.number(),
        label: z.string(),
        id: z.number()
      })
      .optional(),
    fk_fleet: z
      .object({
        value: z.number(),
        label: z.string(),
        id: z.number()
      })
      .optional()
  })
  .superRefine((data, ctx) => {
    // Only validate dependent fields if entityType is not admin
    if (data.entityType.value !== "admin") {
      if (data.entityType.value === "company" && !data.fk_company) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fk_company"],
          message: "Please select a company"
        });
      }
      if (data.entityType.value === "vessel" && !data.fk_vessel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fk_vessel"],
          message: "Please select a vessel"
        });
      }
      if (data.entityType.value === "fleet" && !data.fk_fleet) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fk_fleet"],
          message: "Please select a fleet"
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

type UserTypeRow = {
  id?: number;
  name?: string;
  entity_type?: string;
  pages?: string[];
  fk_company?: number;
  fk_vessel?: number;
  fk_fleet?: number;
};

type UserFormProps = {
  setResponse: (value: boolean) => void;
  user?: FormValues;
  row?: UserTypeRow;
};

export function UserForm({ setResponse, row }: UserFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [responseComapny, setResponseComapny] = useState(false);
  const [responseFleet, setResponseFleet] = useState(false);
  const [responseVessel, setResponseVessel] = useState(false);

  const { token } = useAuth();
  const [companyList, setCompanyList] = useState<
    { value: number; label: string; id: number }[]
  >([]);
  const [vesselList, setVesselList] = useState<
    { value: number; label: string; id: number }[]
  >([]);
  const [fleetList, setFleetList] = useState<
    { value: number; label: string; id: number }[]
  >([]);

  const getCompanyList = async () => {
    const limit = 50;
    const page = 1;
    const search = "";
    if (!token) {
      console.error("Token is not available");
      toast.warning("Token is missing. Please login again.");
      return;
    }
    try {
      if (page && limit && token) {
        const response = await listCompanyApi(page, limit, search, token);
        if (response.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response.data.data.length === 0
          ) {
            return;
          }
          if (response.data?.success == false) {
            throw new Error(response.data?.message);
          }
          const dataList = response?.data?.data.map(item => ({
            value: item.id,
            label: item.name,
            id: item.id
          }));
          setCompanyList(dataList);
          setResponseComapny(true);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } else {
        const missingFields = [];
        if (!page) missingFields.push("page");
        if (!limit) missingFields.push("limit");
        if (!token) missingFields.push("token");

        console.error("Missing fields In CompanyListApi Call:", missingFields);
      }
    } catch (err) {
      console.error("Error while getting company list:", err);
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        console.error("Axios", { data, msg: err.message });
        toast.error(data.message);
        if (data.message == "Invalid token") {
        }
        return;
      }
      console.error({ err });
    }
  };

  const getVesselList = async () => {
    const limit = 50;
    const page = 1;
    const search = "";
    if (!token) {
      console.error("Token is not available");
      toast.warning("Token is missing. Please login again.");
      return;
    }
    try {
      if (page && limit && token) {
        const response = await listVesselApi(page, limit, search, token);
        if (response.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response.data.data.length === 0
          ) {
            return;
          }
          if (response.data?.success == false) {
            throw new Error(response.data?.message);
          }

          setVesselList(
            response?.data?.data.map(item => ({
              value: item.id,
              label: item.name,
              id: item.id
            }))
          );
          setResponseVessel(true);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } else {
        const missingFields = [];
        if (!page) missingFields.push("page");
        if (!limit) missingFields.push("limit");
        if (!token) missingFields.push("token");

        console.error("Missing fields:", missingFields);
      }
    } catch (err) {
      console.error("Error while getting user type:", err);
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        console.error("Axios", { data, msg: err.message });
        toast.error(data.message);
        if (data.message == "Invalid token") {
        }
        return;
      }
      console.error({ err });
    }
  };
  const getFleetList = async () => {
    const limit = 50;
    const page = 1;
    const search = "";
    if (!token) {
      toast.warning("Token is missing. Please login again.");
      return;
    }
    try {
      if (page && limit && token) {
        // setLoading(true);
        const response = await listFleetApi(page, limit, search, token);
        if (response.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response.data.data.length === 0
          ) {
            return;
          }
          if (response.data?.success == false) {
            throw new Error(response.data?.message);
          }

          // setFleetList(response?.data?.data);
          setFleetList(
            response?.data?.data.map(item => ({
              value: item.id,
              label: item.name,
              id: item.id
            }))
          );
          setResponseFleet(true);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } else {
        const missingFields = [];
        if (!page) missingFields.push("page");
        if (!limit) missingFields.push("limit");
        if (!token) missingFields.push("token");

        console.error("Missing fields:", missingFields);
      }
    } catch (err) {
      console.error("Error while getting user type:", err);
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        console.error("Axios", { data, msg: err.message });
        toast.error(data.message);
        if (data.message == "Invalid token") {
        }
        return;
      }
      console.error({ err });
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pages: [],
      entityType: { value: "", label: "" },
      fk_company: undefined,
      fk_vessel: undefined,
      fk_fleet: undefined
    }
  });

  // const entityTypeValue = form.watch("entityType.value"); // Watch the entityType value

  const entityTypeValue = useWatch({
    control: form.control,
    name: "entityType.value"
  });

  const isEditMode = !!row;

  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
    if (isDialogOpen) {
      getCompanyList();
      getVesselList();
      getFleetList();
      if (isEditMode) {
        setIsLoading(true);
        if (responseFleet && responseVessel && responseComapny) {
          editModeAssinToForm();
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [isDialogOpen, responseFleet, responseVessel, responseComapny]);

  const editModeAssinToForm = () => {
    if (isDialogOpen && isEditMode && row) {
      // Map row data to form fields

      const selectedCompany = companyList.find(
        item => item.id === row.fk_company
      );
      const selectedFleet = fleetList.find(item => item.id === row.fk_fleet);
      const selectedVessel = vesselList.find(item => item.id === row.fk_vessel);

      form.reset({
        name: row.name || "",
        entityType: {
          value: row.entity_type || "",
          label: row.entity_type || ""
        },
        fk_company: selectedCompany
          ? {
              value: selectedCompany.id,
              label: selectedCompany.label,
              id: selectedCompany.id
            }
          : undefined,
        fk_fleet: selectedFleet
          ? {
              value: selectedFleet.id,
              label: selectedFleet.label,
              id: selectedFleet.id
            }
          : undefined,
        fk_vessel: selectedVessel
          ? {
              value: selectedVessel.id,
              label: selectedVessel.label,
              id: selectedVessel.id
            }
          : undefined,
        pages: (row.pages || []).map(page => ({
          value: page,
          label: page
        }))
      });
    }
  };

  // Clear dependent fields when entityType changes

  const handleApiError = (error: unknown) => {
    console.error("API error:", error);
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
  };

  const handleSubmit = async (values: FormValues) => {
    if (!token) {
      toast.warning("Authentication token is missing. Please log in again.");
      return;
    }

    const formData = {
      name: values.name.trim(),
      pages: values.pages.map(page => page.value),
      entity_type: values.entityType.value,
      ...(values.entityType.value === "company" && {
        fk_company: values.fk_company?.value
      }),
      ...(values.entityType.value === "vessel" && {
        fk_vessel: values.fk_vessel?.value
      }),
      ...(values.entityType.value === "fleet" && {
        fk_fleet: values.fk_fleet?.value
      })
    };

    try {
      const apiCall =
        isEditMode && row?.id
          ? updateUserTypeApi(formData, row.id, token)
          : addUserTypeApi(formData, token);

      const response = await apiCall;

      if (response.status === 200) {
        if (response.data?.data?.success === false) {
          throw new Error(response.data?.data?.message);
        }

        form.reset();
        setResponse(true);
        setIsDialogOpen(false);
        toast.success(
          `User type ${isEditMode ? "updated" : "added"} successfully!`
        );
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      pages: [],
      entityType: { value: "", label: "" },
      fk_company: undefined,
      fk_vessel: undefined,
      fk_fleet: undefined
    });
    form.clearErrors();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            aria-label="Edit user type"
            className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] rounded-[10px] bg-[#213B4C] p-2 hover:bg-[#234155]/50 max-xl:m-2 max-xl:h-[30px] max-xl:w-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px] sm:p-[10px] xl:h-[37px] 3xl:w-[42px]"
          >
            <EditIcon className="h-9 w-9 max-sm:h-4 max-sm:w-4 sm:me-0" />
          </Button>
        ) : (
          <Button
            aria-label="Add new user type"
            onClick={() => setIsDialogOpen(true)}
            className="rounded-[10px] border border-black bg-secondary 2xl:h-[40.24px] 2xl:w-[46.16px]"
          >
            <PlusIcon className="h-[44.82px] w-[24.86px] text-input" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        fromModel={true}
        onEscapeKeyDown={e => e.preventDefault()}
        className="w-[95vw] max-w-[866px] rounded-[15px] bg-primary text-card-foreground sm:h-auto sm:min-w-[400px] md:min-w-[600px] lg:min-w-[750px] lg:max-w-[744px] xl:min-w-[866px] 3xl:max-w-[833px] [&>button.absolute]:hidden"
      >
        <div className="mb-4 flex items-center justify-between p-4 font-alexandria">
          <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <DialogHeader>
              <DialogTitle className="ml-[40px] mt-4 flex gap-4 font-semibold text-black lg:text-[25px] 3xl:text-[28px]">
                <DialogClose asChild>
                  <ArrowLeft className="h-[26px] w-[31px] cursor-pointer" />
                </DialogClose>
                {/* <DialogHeader>
                  <UserTypeBlackIcon className="h-[29.78px] w-[31px] text-black" />
                </DialogHeader> */}
                {isEditMode ? "Update User Type" : "Add User Type"}
              </DialogTitle>
            </DialogHeader>
          </div>
          <DialogClose asChild>
            <X className="h-[26px] w-[26px] cursor-pointer" />
          </DialogClose>
        </div>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            <span className="ml-2 text-gray-700">Loading...</span>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              // onSubmit={form.handleSubmit(handleSubmit, errors => {
              //   console.log("Form validation errors:", errors);
              // })}
              className="w-full space-y-3 font-alexandria lg:space-y-4 2xl:space-y-8"
            >
              <div className="mx-auto mt-8 h-auto w-full max-w-2xl px-1 py-1 lg:px-0 lg:pl-[46px] lg:pr-[21px] xl:px-1 2xl:px-1 3xl:px-1">
                <div className="flex flex-col space-y-8 text-xxs xl:text-xs 2xl:text-base 3xl:text-[18px]">
                  {/* Name Field */}
                  <div className="sm:gap-gap-20 grid grid-cols-1 max-md:gap-10 max-sm:gap-10 md:grid-cols-2 md:gap-20">
                    <div>
                      <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                        Name<span className="text-red-600">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="User Type"
                                {...field}
                                type="text"
                                className="flex w-full border-transparent bg-transparent py-0 text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base 3xl:text-[16px]"
                              />
                            </FormControl>
                            <div className="h-[1px] flex-1 bg-[#000000]" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Entity Type Field */}
                    <div>
                      <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                        Entity Type<span className="text-red-600">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="entityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectDropdown
                                className="flex min-w-[270px] border-transparent bg-transparent py-0 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base 3xl:text-[16px]"
                                options={[...ENTITY_TYPE_OPTIONS]}
                                placeholder="Select Entity Type"
                                value={field.value}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                            <div className="h-[1px] flex-1 bg-[#000000]" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Pages Field */}
                  <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
                    {entityTypeValue === "company" && (
                      <div>
                        <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                          Company List<span className="text-red-600">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="fk_company"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectDropdown
                                  className="flex min-w-[270px] border-transparent bg-transparent py-0 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base 3xl:text-[16px]"
                                  options={[...companyList]}
                                  placeholder="Select Company"
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <div className="h-[1px] flex-1 bg-[#000000]" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {entityTypeValue === "vessel" && (
                      <div>
                        <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                          Vessel List<span className="text-red-600">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="fk_vessel"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectDropdown
                                  className="flex min-w-[270px] border-transparent bg-transparent py-0 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base 3xl:text-[16px]"
                                  options={[...vesselList]}
                                  placeholder="Select vessel"
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <div className="h-[1px] flex-1 bg-[#000000]" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {entityTypeValue === "fleet" && (
                      <div>
                        <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                          Fleet List<span className="text-red-600">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="fk_fleet"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectDropdown
                                  className="flex min-w-[270px] border-transparent bg-transparent py-0 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base 3xl:text-[16px]"
                                  options={[...fleetList]}
                                  placeholder="Select fleet"
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <div className="h-[1px] flex-1 bg-[#000000]" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div>
                      <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                        Pages<span className="text-red-600">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="pages"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultipleSelector
                                defaultOptions={[...PAGE_OPTIONS]}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select Pages"
                                className="border border-gray-300 tracking-widest text-black disabled:font-semibold 3xl:text-[16px]"
                              />
                            </FormControl>
                            <div className="h-[1px] flex-1 bg-[#000000]" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-1 flex justify-end gap-[6px] p-5 font-alexandria">
                <div className="flex flex-col items-end self-stretch">
                  <div className="mr-[5px] flex items-start lg:mr-[-40px] 3xl:mr-[5px]">
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="mr-[26px] flex h-[49px] w-auto shrink-0 flex-col items-start rounded-[10px] border-0 bg-input pl-[32px] pr-[32px] text-left shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-input/50"
                    >
                      <span className="text-[20px] font-bold text-[#000000]">
                        Clear
                      </span>
                    </Button>

                    <Button
                      type="submit"
                      className="mr-[26px] flex h-[49px] w-auto shrink-0 flex-col items-start rounded-[10px] border-0 bg-secondary pl-[32px] pr-[32px] text-left shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-secondary/50"
                    >
                      <span className="text-[20px] font-bold text-[#FFFFFF]">
                        {isEditMode ? "Update" : "Save"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
