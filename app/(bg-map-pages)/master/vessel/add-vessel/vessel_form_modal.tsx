"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWindowSize } from "react-use";
import { ArrowLeft, InfoIcon, X } from "lucide-react";
import { PlusIcon } from "@/components/icons/plus-icon";
import { VesselBlackIcon } from "@/components/icons/vessel-icon";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormValues = {
  name: string;
  imo: string;
  email: string;
  vessel_type: string;
  hull_no: string;
  flag: string;
  port_of_regd: string;
  year_built: number;
  vessel_class: string;
  no_of_dg: number;
  dg_capacity_indvidual: number[];
  dg_maker: string;
  dg_model: string;
  me_maker: string;
  me_model: string;
  power: number;
  mcr: number;
  geared_or_gearless: boolean;
  fk_company?: string;
  fk_fleet?: string;
};

type UserTypeRow = {
  id?: number;
  name?: string;
  imo?: string;
  email?: string;
  vessel_type?: string;
  hull_no?: string;
  flag?: string;
  port_of_regd?: string;
  year_built?: string;
  vessel_class: string;
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
  mode: "add" | "edit" | "view";
  row?: UserTypeRow;
};

export function VesselFormModal({ mode, row }: UserFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
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

  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";
  const isSubmitMode = mode === "add";
  const noOfDg = form.watch("no_of_dg");
  const { width } = useWindowSize();

  // Update dg_capacity_indvidual array when no_of_dg changes
  useEffect(() => {
    const currentCapacity = form.getValues("dg_capacity_indvidual") || [];
    const newCapacity = Array(noOfDg)
      .fill(0)
      .map((_, i) => currentCapacity[i] || 0);
    form.setValue("dg_capacity_indvidual", newCapacity);
  }, [noOfDg, form]);

  // Initialize form with row data when in edit mode
  useEffect(() => {
    if ((isEditMode || isViewMode) && row) {
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
  }, [isEditMode, row, isViewMode, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isViewMode ? (
          <Button className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] m-1 rounded-[10px] bg-input p-3 font-alexandria hover:bg-input/50 max-xl:m-2 max-xl:h-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px]">
            <InfoIcon className="h-4 w-4 max-sm:h-4 max-sm:w-4 sm:me-0" />
          </Button>
        ) : (
          <Button
            aria-label="Add new vessel"
            onClick={() => setIsDialogOpen(true)}
            className="rounded-[10px] border border-black bg-secondary text-black 2xl:h-[40.24px] 2xl:w-[46.16px]"
          >
            <PlusIcon className="h-[44.82px] w-[24.86px] text-input" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        fromModel={true}
        onEscapeKeyDown={e => e.preventDefault()}
        className="flex h-[calc(80vh-20px)] max-h-[1021px] w-[calc(100vw-200px)] max-w-[1990px] flex-col rounded-xl bg-primary font-alexandria text-card-foreground sm:min-h-[900px] sm:min-w-[1120px] lg:min-h-[652px] lg:min-w-[925px] min-[1524px]:max-[179px]:w-[160px] [&>button.absolute]:hidden"
      >
        <div className="flex items-center justify-between p-0 px-8 pb-2 pr-[47px]">
          <div className="flex items-center gap-4">
            <DialogClose asChild>
              <ArrowLeft className="h-[26px] w-[31px] cursor-pointer" />
            </DialogClose>
            {/* <DialogHeader>
              <VesselBlackIcon className="h-[29.78px] w-[31px] text-black" />
            </DialogHeader> */}
            <DialogHeader>
              <DialogTitle className="font-alexandria text-2xl font-semibold lg:text-[21px] 3xl:text-2xl">
                {isViewMode ? "View Vessel Details" : "Add Vessel Details"}
              </DialogTitle>
            </DialogHeader>
          </div>
          <DialogClose asChild>
            <X className="h-[26px] w-[26px] cursor-pointer" />
          </DialogClose>
        </div>

        <Form {...form}>
          <form className="flex w-full flex-1 flex-col overflow-hidden font-alexandria">
            <div className="flex-1 overflow-y-auto px-10 pb-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Basic Information Section */}
                <div className="w-auto space-y-2 rounded-lg border border-white/40 bg-white/50 p-6">
                  <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[18px] 3xl:text-xl">
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Name :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                // disabled={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria tracking-widest shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            IMO :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Email :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Vessel Type :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-sm tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] w-1/3 mt-[16px] font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Gear Type :
                          </Label>
                          <div className="flex-1">
                            {isEditMode || isSubmitMode ? (
                              <FormControl>
                                <RadioGroup
                                  onValueChange={value =>
                                    field.onChange(value === "geared")
                                  }
                                  value={field.value ? "geared" : "gearless"}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center">
                                    <RadioGroupItem
                                      value="geared"
                                      id="geared"
                                      className={`h-5 w-5 border-2 ${field.value ? "border-red-600 text-primary" : "border-muted-foreground"}`}
                                    />
                                    <Label
                                      htmlFor="geared"
                                      className="ml-2 cursor-pointer font-alexandria font-normal tracking-widest"
                                    >
                                      Geared
                                    </Label>
                                  </div>
                                  <div className="flex items-center">
                                    <RadioGroupItem
                                      value="gearless"
                                      id="gearless"
                                      className={`h-5 w-5 border-2 font-alexandria ${!field.value ? "border-red-600 text-primary" : "border-muted-foreground"}`}
                                    />
                                    <Label
                                      htmlFor="gearless"
                                      className="ml-2 cursor-pointer font-alexandria font-normal tracking-widest"
                                    >
                                      Gearless
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            ) : (
                              <Input
                                readOnly={isViewMode}
                                value={field.value ? "Geared" : "Gearless"}
                                className="w-full border-transparent mt-[9px] bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            )}
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="w-auto space-y-6 rounded-lg border border-white/40 bg-white/50 p-6">
                  <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[18px] 3xl:text-xl">
                    Technical Specifications
                  </h3>

                  <div className="space-y-4">
                    {["hull_no", "flag", "port_of_regd", "year_built"].map(
                      fieldName => (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={fieldName}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-4">
                              <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                                {fieldName === "port_of_regd"
                                  ? "Port Of Registration :"
                                  : fieldName
                                    .replace("_", " ")
                                    .replace("hull no", "Hull No :")
                                    .replace("flag", "Flag :")
                                    .replace("year built", "Year Built :")}
                              </Label>
                              <div className="flex-1">
                                <FormControl>
                                  <Input
                                    readOnly={isViewMode}
                                    {...field}
                                    type={
                                      fieldName === "year_built"
                                        ? "number"
                                        : "text"
                                    }
                                    className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                    style={{
                                      fontSize: width <= 1280 ? "14px" : "16px"
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      )
                    )}

                    <FormField
                      control={form.control}
                      name="vessel_class"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Vessel Class :
                          </Label>
                          <div className="flex-1">
                            {isViewMode ? (
                              <Input
                                readOnly
                                value={field?.value || "_"}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            ) : (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0">
                                  <SelectValue placeholder="Select vessel class" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="F">F</SelectItem>
                                  <SelectItem value="H">H</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* DG Information Section */}
              <div className="bg-white/2 mt-4 rounded-lg border border-white/40 bg-white/50 p-6">
                <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[18px] 3xl:text-xl">
                  DG Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
                    <FormField
                      control={form.control}
                      name="no_of_dg"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="2xl:w-3/3 xl:w-3/3 xs:text-[15px] mt-2 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Number of DGs :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                type="number"
                                min={0}
                                onChange={e => {
                                  const value = parseInt(e.target.value) || 0;
                                  field.onChange(value);
                                }}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {Array.from({ length: noOfDg || 0 }).map((_, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={`dg_capacity_indvidual.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <Label className="2xl:w-3/3 xl:w-3/3 xs:text-[15px] mt-2 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                                DG {index + 1} (kW) :
                              </Label>
                              <div className="flex-1">
                                <FormControl>
                                  <Input
                                    readOnly={isViewMode}
                                    {...field}
                                    type="number"
                                    min={0}
                                    onChange={e => {
                                      const value =
                                        parseFloat(e.target.value) || 0;
                                      field.onChange(value);
                                    }}
                                    className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                    style={{
                                      fontSize: width <= 1280 ? "14px" : "16px"
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dg_maker"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            DG Maker :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            DG Model :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Ownership*/}
              <div className="bg-white/2 mt-4 rounded-lg border border-white/40 bg-white/50 p-6">
                <h3 className="m-0 font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[18px] 3xl:text-xl">
                  Ownership
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Fleet Dropdown */}
                  <FormField
                    control={form.control}
                    name="fk_fleet"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <Label className="xs:text-[15px] mt-2 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Fleet :
                        </Label>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={isViewMode}
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
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
                        <Label className="xs:text-[15px] mt-2 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                          Company :
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={isViewMode}
                              className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                              style={{
                                fontSize: width <= 1280 ? "14px" : "16px"
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Engine Information Section */}
              <div className="bg-white/2 mt-4 rounded-lg border border-white/40 bg-white/50 p-6">
                <h3 className="font-alexandria text-xl font-semibold tracking-widest text-gray-800 lg:text-[18px] 3xl:text-xl">
                  Engine Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="me_maker"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            ME Maker :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            ME Model :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="power"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <Label className="xs:text-[15px] w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            Power (kW) :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                type="number"
                                min={0}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
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
                          <Label className="xs:text-[15px] mt-2 w-1/3 font-alexandria text-[18px] font-medium tracking-widest text-black sm:text-[16px] md:text-[18px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[18px]">
                            MCR (kW) :
                          </Label>
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                readOnly={isViewMode}
                                {...field}
                                type="number"
                                min={0}
                                className="w-full border-transparent bg-transparent p-0 font-alexandria text-[20px] tracking-widest text-black shadow-none focus-visible:ring-0"
                                style={{
                                  fontSize: width <= 1280 ? "14px" : "16px"
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
