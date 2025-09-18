"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWindowSize } from "react-use";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, Check, ChevronDown, X } from "lucide-react";
import { z } from "zod";
import { EditIcon } from "@/components/icons/edit-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import {
  addVesselApi,
  listCompanyApi,
  listFlagApi,
  listFleetApi,
  updateVesselApi
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-provider";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  imo: z.string().min(6, "IMO must be at least 6 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),
  vessel_type: z.string().min(1, { message: "Vessel Type is required!" }),
  hull_no: z.string().min(1, { message: "Hull no is required!" }),
  flag: z.string().min(1, "Flag is required"),
  port_of_regd: z
    .string()
    .min(1, { message: "port of registration is required!" }),
  year_built: z.coerce
    .number()
    .int()
    .gte(1800, "Year must be valid")
    .lte(new Date().getFullYear(), "Year cannot be in the future"),
  vessel_class: z.string().min(1, { message: "Vessel Class is required!" }),
  no_of_dg: z.coerce
    .number()
    .int()
    .nonnegative("Number of DGs cannot be negative"),
  dg_capacity_indvidual: z
    .array(z.number().nonnegative("DG capacity must be non-negative"))
    .nonempty("At least one DG capacity must be provided"),
  dg_maker: z.string().min(1, { message: "Dg maker is required" }),
  dg_model: z.string().min(1, "Dg model is required!"),
  me_maker: z.string().min(1, { message: "Me maker is required!" }),
  me_model: z.string().min(1, { message: "Me model is required!" }),
  power: z.coerce.number().nonnegative("Power must be non-negative"),
  mcr: z.coerce.number().nonnegative("MCR must be non-negative"),
  fk_fleet: z.string().min(1, "Fleet is required"),
  fk_company: z.string().min(1, "Company is required"),
  geared_or_gearless: z.boolean()
});

type FormValues = z.infer<typeof formSchema>;

type UserTypeRow = {
  id?: number;
  name?: string;
  imo?: string;
  email?: string;
  vessel_type?: string;
  hull_no?: string;
  flag?: string;
  port_of_regd?: string;
  year_built?: number;
  vessel_class?: string;
  no_of_dg?: string;
  dg_capacity_indvidual?: number[];
  dg_maker?: string;
  dg_model?: string;
  me_maker?: string;
  me_model?: string;
  power?: string;
  mcr?: number;
  geared_or_gearless?: boolean;
  fk_company?: string;
  fk_fleet?: string;
};

type UserFormProps = {
  setResponse: (value: boolean) => void;
  user?: FormValues;
  row?: UserTypeRow;
};

export function VesselForm({ setResponse, row }: UserFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search,] = useState("");
  const [open, setOpen] = useState(false);
  const [page, ] = useState(1);
  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [fleetOptions, setFleetOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [flagOptions, setFlagOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { token } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imo: "",
      email: "",
      vessel_type: "",
      hull_no: "",
      flag: "",
      port_of_regd: "",
      year_built: 0,
      vessel_class: "",
      no_of_dg: 1,
      dg_capacity_indvidual: [],
      dg_maker: "",
      dg_model: "",
      me_maker: "",
      me_model: "",
      power: 0,
      mcr: 0,
      fk_company: "",
      fk_fleet: "",
      geared_or_gearless: false
    }
  });

  const isEditMode = !!row;
  const noOfDg = form.watch("no_of_dg");
  const { width } = useWindowSize();

  useEffect(() => {
    const currentCapacity = form.getValues("dg_capacity_indvidual") || [];
    const newCapacity = Array(noOfDg)
      .fill(0)
      .map((_, i) => currentCapacity[i] || 0);
    form.setValue(
      "dg_capacity_indvidual",
      newCapacity as [number, ...number[]]
    );
  }, [noOfDg, form]);

  useEffect(() => {
    if (isDialogOpen && isEditMode && row) {
      form.reset({
        name: row.name || "",
        imo: row.imo || "",
        email: row.email || "",
        vessel_type: row.vessel_type || "",
        hull_no: row.hull_no || "",
        flag: row.flag || "",
        port_of_regd: row.port_of_regd || "",
        year_built: Number(row.year_built) || 0,
        vessel_class: row.vessel_class || "",
        no_of_dg: Number(row.no_of_dg) || 0,
        dg_capacity_indvidual:
          row.dg_capacity_indvidual || Array(Number(row.no_of_dg) || 0).fill(0),
        dg_maker: row.dg_maker || "",
        dg_model: row.dg_model || "",
        me_maker: row.me_maker || "",
        me_model: row.me_model || "",
        power: Number(row.power) || 0,
        mcr: row.mcr || 0,
        fk_fleet: row.fk_fleet?.toString() || "",
        fk_company: row.fk_company?.toString() || "",
        geared_or_gearless: row.geared_or_gearless || false
      });
    }
  }, [isEditMode, isDialogOpen, row, form]);

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

  const fetchFlagDropdown = async () => {
    const limit = 5;
    if (!token) {
      toast.warning("Token is missing. Please login again.");
      return;
    }
    try {
      const response = await listFlagApi(page, limit, search, token);
      if (response.status === 200 && response.data.success) {
        const rawFlags = response.data.data;
        const formattedFlags = Object.entries(rawFlags).map(([code]) => ({
          label: `${code}`,
          value: code
        }));
        setFlagOptions(formattedFlags);
      }
    } catch (error) {
      console.error("Error fetching flags:", error);
    }
  };

  const fetchFleetDropdownData = async () => {
    const limit = 5;
    if (!token) {
      toast.warning("Token is missing. Please login again.");
      return;
    }

    try {
      const response = await listFleetApi(page, limit, search, token);
      if (response.status === 200 && response.data.success) {
        const fleetsData = response.data.data;

        // Use Map to ensure unique fleet IDs
        const fleetMap = new Map();
        fleetsData.forEach((fleet: { id: any; name: any }) => {
          if (fleet.id && !fleetMap.has(fleet.id)) {
            fleetMap.set(fleet.id, {
              label: fleet.name || "Unknown",
              value: String(fleet.id)
            });
          }
        });

        const fleets = Array.from(fleetMap.values());
        setFleetOptions(fleets);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const fetchCompanyDropdownData = async () => {
    const limit = 5;
    if (!token) {
      toast.warning("Token is missing. Please login again.");
      return;
    }

    try {
      const response = await listCompanyApi(page, limit, search, token);
      if (response.status === 200 && response.data.success) {
        const companiesData = response.data.data;

        const companyMap = new Map();
        companiesData.forEach((c: { id: any; name: any }) => {
          if (c.id && !companyMap.has(c.id)) {
            companyMap.set(c.id, {
              label: c.name || "Unknown",
              value: String(c.id)
            });
          }
        });

        const companies = Array.from(companyMap.values());
        setCompanyOptions(companies);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchFlagDropdown();
    fetchFleetDropdownData();
    fetchCompanyDropdownData();
  }, [page, search]);

  const handleSubmit = async (values: FormValues) => {
    if (!token) {
      toast.warning("Authentication token is missing. Please log in again.");
      return;
    }

    const formData = {
      name: values.name.trim(),
      imo: values.imo,
      email: values.email,
      vessel_type: values.vessel_type,
      hull_no: values.hull_no,
      flag: values.flag,
      port_of_regd: values.port_of_regd || "",
      year_built: values.year_built || 0,
      vessel_class: values.vessel_class || "",
      no_of_dg: values.no_of_dg || 0,
      dg_capacity_indvidual: values.dg_capacity_indvidual || [],
      dg_maker: values.dg_maker || "",
      dg_model: values.dg_model || "",
      me_maker: values.me_maker || "",
      me_model: values.me_model || "",
      power: values.power || 0,
      mcr: values.mcr || 0,
      fk_company: Number(values.fk_company),
      fk_fleet: Number(values.fk_fleet),
      geared_or_gearless: values.geared_or_gearless || false
    };

    try {
      const apiCall =
        isEditMode && row?.id
          ? updateVesselApi(formData, row.id, token)
          : addVesselApi(formData, token);

      const response = await apiCall;

      if (response.status === 200) {
        if (response.data?.data?.success === false) {
          throw new Error(response.data?.data?.message);
        }

        form.reset();
        setResponse(true);
        setIsDialogOpen(false);
        toast.success(
          `Vessel ${isEditMode ? "updated" : "added"} successfully!`
        );
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (err) {
      handleApiError(err);

      if (err instanceof AxiosError) {
        const data = err.response?.data;
        toast.error(data.message);
        return;
      }
      console.error({ err });
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      imo: "",
      email: "",
      vessel_type: "",
      hull_no: "",
      flag: "",
      port_of_regd: "",
      year_built: 0,
      vessel_class: "",
      no_of_dg: 0,
      dg_capacity_indvidual: [],
      dg_maker: "",
      dg_model: "",
      me_maker: "",
      me_model: "",
      power: 0,
      mcr: 0,
      fk_fleet: "",
      fk_company: "",
      geared_or_gearless: false
    });
    form.clearErrors();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            aria-label="Edit vessel"
            className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] m-1 rounded-[10px] bg-[#213B4C] p-2 font-alexandria hover:bg-[#234155]/50 max-xl:m-2 max-xl:h-[30px] max-xl:w-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px] sm:p-[10px]"
            size="icon"
          >
            <EditIcon className="h-4 w-4 max-sm:h-4 max-sm:w-4 sm:me-0" />
          </Button>
        ) : (
          <Button
            aria-label="Add new vessel"
            onClick={() => setIsDialogOpen(true)}
            className="rounded-[10px] border border-black bg-secondary text-black 2xl:h-[40.24px] 2xl:w-[46.16px]"
          >
            <PlusIcon className="h-[24.86px] w-[24.86px] text-input" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        fromModel={true}
        onEscapeKeyDown={e => e.preventDefault()}
        className="flex h-[calc(80vh-99px)] max-h-[1276px] w-[calc(80vw-200px)] max-w-[1990px] flex-col rounded-xl bg-primary font-alexandria text-card-foreground min-[124px]:max-[179px]:w-[160px] sm:min-h-[900px] sm:min-w-[1459px] lg:h-[calc(80vh-74px)] lg:min-h-[673px] lg:min-w-[932px] xl:min-h-[757px] xl:min-w-[1166px] 3xl:h-[calc(80vh-99px)] 3xl:min-h-[900px] 3xl:min-w-[1459px] [&>button.absolute]:hidden"
      >
        <div className="flex items-center justify-between p-0 px-8 pb-2 pr-[47px]">
          <div className="flex items-center gap-4">
            <DialogClose asChild>
              <ArrowLeft className="h-[26px] w-[31px] cursor-pointer" />
            </DialogClose>
            <DialogHeader>
              <DialogTitle className="py-4 font-alexandria text-2xl font-semibold lg:text-[22px] 3xl:text-2xl">
                {isEditMode ? "Update Vessel Details" : "Add Vessel Details"}
              </DialogTitle>
            </DialogHeader>
          </div>
          <DialogClose asChild>
            <X className="h-[26px] w-[26px] cursor-pointer" />
          </DialogClose>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-1 flex-col overflow-hidden font-alexandria"
          >
            <div className="flex-1 overflow-y-auto px-10 pb-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Basic Information Section */}
                <div className="w-auto space-y-2 rounded-lg border border-white/40 bg-white/50 p-6">
                  <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[16px] 3xl:text-[22px] 3xl:text-xl">
                    Basic Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Name <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Name"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria tracking-widest shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imo"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          IMO <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter IMO"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Email <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter Email"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vessel_type"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Vessel Type <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Vessel Type"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="geared_or_gearless"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Gear Type <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <RadioGroup
                              onValueChange={value =>
                                field.onChange(value === "geared")
                              }
                              value={field.value ? "geared" : "gearless"}
                              className="mt-6 flex gap-4"
                            >
                              <div className="flex items-center">
                                <RadioGroupItem
                                  value="geared"
                                  id="geared"
                                  className={`h-5 w-5 border-2 font-alexandria ${field?.value ? "border-red-600 text-primary" : "border-muted-foreground"}`}
                                />
                                <Label
                                  htmlFor="geared"
                                  className="ml-2 cursor-pointer font-alexandria font-normal tracking-widest sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]"
                                >
                                  Geared
                                </Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem
                                  value="gearless"
                                  id="gearless"
                                  className={`h-5 w-5 border-2 font-alexandria ${!field?.value ? "border-red-600 text-primary" : "border-muted-foreground"}`}
                                />
                                <Label
                                  htmlFor="gearless"
                                  className="ml-2 cursor-pointer font-alexandria font-normal tracking-widest sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]"
                                >
                                  Gearless
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Technical Specifications Section */}
                <div className="w-auto space-y-6 rounded-lg border border-white/40 bg-white/50 p-6">
                  <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[16px] 3xl:text-[22px] 3xl:text-xl">
                    Technical Specifications
                  </h3>

                  <FormField
                    control={form.control}
                    name="hull_no"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-6 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Hull No <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Hull No"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="-mt-2 h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flag"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 font-alexandria">
                        <Label className="xs:text-[15px] mt-4 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Flag <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between border-transparent bg-transparent px-0 py-0 text-left font-alexandria text-xxs tracking-widest text-black shadow-none hover:bg-transparent hover:text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px]",
                                    !field?.value && "text-black"
                                  )}
                                >
                                  {field?.value
                                    ? flagOptions.find(
                                      opt => opt.value === field?.value
                                    )?.label
                                    : "Select Flag"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-black opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search flag..."
                                    className="h-9 font-alexandria"
                                    icon={false}
                                  />
                                  <CommandList
                                    className="max-h-[250px] overflow-y-auto"
                                    onWheel={e => {
                                      e.stopPropagation();
                                      const element = e.currentTarget;
                                      if (
                                        e.deltaY < 0 &&
                                        element.scrollTop === 0
                                      ) {
                                        e.preventDefault();
                                      } else if (
                                        e.deltaY > 0 &&
                                        element.scrollHeight -
                                        element.scrollTop ===
                                        element.clientHeight
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                  >
                                    <CommandEmpty className="text-center font-alexandria text-sm">
                                      No flag found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {flagOptions.map(option => (
                                        <CommandItem
                                          key={option?.value}
                                          value={option?.value}
                                          onSelect={() => {
                                            field?.onChange(option?.value);
                                            setOpen(false);
                                          }}
                                        >
                                          {option.label}
                                          <Check
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              option.value === field?.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="port_of_regd"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Port Of Registration{" "}
                          <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Port Of Registration"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="-mt-1 h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year_built"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-4 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Year Built <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter Year Built"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="-mt-2 h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vessel_class"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-4 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Vessel Class <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <SelectDropdown
                              className="flex w-full border-transparent bg-transparent px-0 py-4 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none sm:text-[16px] md:text-[18px] md:text-sm lg:text-[12px] xl:text-[15px] xl:text-xs 2xl:text-[18px] 2xl:text-base 3xl:text-[18px]"
                              options={[
                                { label: "C", value: "c" },
                                { label: "F", value: "f" },
                                { label: "H", value: "h" }
                              ]}
                              value={
                                field?.value
                                  ? {
                                    value: field?.value,
                                    label: field?.value.toUpperCase()
                                  }
                                  : undefined
                              }
                              onValueChange={selected =>
                                field?.onChange(selected?.value || "")
                              }
                              placeholder="Select Vessel Class"
                            />
                          </FormControl>
                          <div className="-mt-1 h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                </div>
              </div>

              {/* DG Information Section */}
              <div className="bg-white/2 mt-4 rounded-lg border border-white/40 bg-white/50 p-6">
                <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[16px] 3xl:text-[22px] 3xl:text-xl">
                  DG Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="no_of_dg"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Number of DGs <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter Number Of DGs"
                              min={0}
                              onChange={e => {
                                const value = parseInt(e.target.value) || 0;
                                field?.onChange(value);
                              }}
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {Array.from({ length: noOfDg || 0 }).map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`dg_capacity_indvidual.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            DG {index + 1} Capacity (kW){" "}
                            <span className="text-red-600">*</span>
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Enter No Of DGs"
                                min={0}
                                onChange={e => {
                                  const value = parseFloat(e.target.value) || 0;
                                  field?.onChange(value);
                                }}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
                            <div className="h-[1px] flex-1 bg-[#000000]" />
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name="dg_maker"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-8 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          DG Maker <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter DG Maker"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dg_model"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-7 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          DG Model <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter DG Model"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Ownership*/}
              <div className="bg-white/2 mt-4 rounded-lg border border-white/40 bg-white/50 p-6">
                <h3 className="m-0 font-alexandria font-semibold tracking-widest text-gray-800 lg:text-[16px] 3xl:text-xl">
                  Ownership
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Fleet Dropdown */}
                  <FormField
                    control={form.control}
                    name="fk_fleet"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-6 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Fleet <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <SelectDropdown
                              className="flex w-full border-transparent bg-transparent px-0 py-0 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none sm:text-[16px] md:text-[18px] md:text-sm lg:text-[12px] xl:text-[15px] xl:text-xs 2xl:text-[18px] 2xl:text-base"
                              options={fleetOptions}
                              value={
                                fleetOptions?.find(
                                  opt => opt.value === field?.value
                                ) || undefined
                              }
                              onValueChange={selected =>
                                field?.onChange(selected?.value || "")
                              }
                              placeholder="Select Fleet"
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fk_company"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-6 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Company <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <SelectDropdown
                              options={companyOptions}
                              value={
                                companyOptions.find(
                                  opt => opt?.value === field?.value
                                ) || undefined
                              }
                              onValueChange={selected =>
                                field?.onChange(selected?.value || "")
                              }
                              placeholder="Select Company"
                              className="flex w-full border-transparent bg-transparent px-0 py-0 font-alexandria text-xxs tracking-widest text-black shadow-none transition-colors placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none sm:text-[16px] md:text-[18px] md:text-sm lg:text-[12px] xl:text-[15px] xl:text-xs 2xl:text-[18px] 2xl:text-base"
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Engine Information Section */}
              <div className="bg-white/2 mt-4 rounded-lg border border-white/40 bg-white/50 p-6">
                <h3 className="font-alexandria font-semibold tracking-widest text-gray-800 3xl:text-[22px]">
                  Engine Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="me_maker"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-9 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          ME Maker <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter ME Maker"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="me_model"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-9 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          ME Model <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter ME Model"
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="power"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-9 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Power (kW) <span className="text-red-600">*</span>
                        </Label>

                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter Power"
                              min={0}
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mcr"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-9 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[12px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          MCR (kW) <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter MCR (kW)"
                              min={0}
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions - Fixed at bottom */}
            <div className="sticky bottom-0 bg-primary/95 p-4 backdrop-blur-sm">
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="mr-[26px] flex h-[49px] w-auto shrink-0 flex-col items-start rounded-[10px] border-0 bg-input pl-[32px] pr-[32px] text-left shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-input/50"
                >
                  <span className="text-[20px] font-bold text-[#000000] lg:text-[16px] 3xl:text-[20px]">
                    Clear
                  </span>
                </Button>
                <Button
                  type="submit"
                  className="mr-[26px] flex h-[49px] w-auto shrink-0 flex-col items-start rounded-[10px] border-0 bg-secondary pl-[32px] pr-[32px] text-left shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-secondary/50"
                >
                  <span className="text-[20px] font-bold text-[#FFFFFF] lg:text-[16px] 3xl:text-[20px]">
                    {isEditMode ? "Update" : "Save"}
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
