"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { addFleetApi, updateFleetApi } from "@/lib/api";
import { toast } from "sonner";

// Schema
const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),

  fleet_director: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  fleet_dir_email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),

  no_of_vessels: z.coerce
    .number()
    .min(1, "Number of vessels must be at least 1")
});

type FormValues = z.infer<typeof formSchema>;

type UserTypeRow = {
  id?: number;
  name?: string;
  email?: string;
  fleet_director?: string;
  fleet_dir_email?: string;
  no_of_vessels?: number;
};

type UserFormProps = {
  setResponse: (value: boolean) => void;
  mode: "add" | "edit";
  row: UserTypeRow;
};

export function FleetForm({ setResponse, mode, row }: UserFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      fleet_director: "",
      fleet_dir_email: "",
      no_of_vessels: 0
    }
  });

  const isEditMode = mode === "edit";

  // Initialize form with row data when in edit mode
  useEffect(() => {
    if (isDialogOpen && isEditMode && row) {
      form.reset({
        name: row.name || "",
        email: row.email || "",
        fleet_director: row.fleet_director || "",
        fleet_dir_email: row.fleet_dir_email || "",
        no_of_vessels: row.no_of_vessels || 0
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

  const handleSubmit = async (values: FormValues) => {
    if (!token) {
      toast.warning("Authentication token is missing. Please log in again.");
      return;
    }

    const formData = {
      name: values.name.trim(),
      email: values.email,
      fleet_director: values.fleet_director,
      fleet_dir_email: values.fleet_dir_email,
      no_of_vessels: values.no_of_vessels
    };

    try {
      const apiCall =
        isEditMode && row?.id
          ? updateFleetApi(formData, row.id, token)
          : addFleetApi(formData, token);

      const response = await apiCall;

      if (response.status === 200) {
        if (response.data?.data?.success === false) {
          throw new Error(response.data?.data?.message);
        }

        form.reset();
        setResponse(true);
        setIsDialogOpen(false);
        toast.success(`Fleet ${isEditMode ? "updated" : "added"} successfully!`);
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
      email: "",
      fleet_director: "",
      fleet_dir_email: "",
      no_of_vessels: 0
    });
    form.clearErrors();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            aria-label="Edit user type"
            className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[6px] m-1 rounded-[10px] bg-[#213B4C] p-2 hover:bg-[#234155]/50 max-xl:m-2 max-xl:h-[30px] max-xl:w-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px] sm:p-[10px]"
          >
            <EditIcon className="h-4 w-4 max-sm:h-4 max-sm:w-4 sm:me-0" />
          </Button>
        ) : (
          <Button
            aria-label="Add new user type"
            onClick={() => setIsDialogOpen(true)}
            className="rounded-[10px] border border-black bg-secondary 2xl:h-[40.24px] 2xl:w-[46.16px]"
          >
            <PlusIcon className="h-[24.86px] w-[24.86px] text-input" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        fromModel={true}
        onEscapeKeyDown={e => e.preventDefault()}
        className="w-[95vw] max-w-[866px] rounded-[15px] bg-primary font-alexandria text-card-foreground sm:h-auto sm:min-w-[400px] md:min-w-[600px] lg:min-w-[750px] xl:min-w-[866px] [&>button.absolute]:hidden"
      >
        <div className="mb-4 flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <DialogHeader>
              <DialogTitle className="ml-[40px] mt-4 flex gap-4 text-[28px] font-bold text-black">
                <DialogClose asChild>
                  <ArrowLeft className="h-[26px] w-[31px] cursor-pointer" />
                </DialogClose>
                {/* <DialogHeader>
                  <FleetBlackIcon className="h-[29.78px] w-[31px] text-black" />
                </DialogHeader> */}

                {isEditMode ? "Update Fleet Details" : "Add Fleet Details"}
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
            className="w-full space-y-3 font-alexandria lg:space-y-4 2xl:space-y-8"
          >
            <div className="mx-auto mt-8 h-auto w-full max-w-2xl px-1 py-1">
              <div className="flex flex-col space-y-8 text-xxs xl:text-xs 2xl:text-base">
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
                              {...field}
                              type="text"
                              placeholder="Enter Name"
                              className="flex w-full border-transparent bg-transparent py-0 text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base"
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
                      Fleet Director<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="fleet_director"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Fleet Director"
                              className="flex w-full border-transparent bg-transparent py-0 text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base"
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
                <div className="grid grid-cols-2 gap-20 md:grid-cols-2">
                  <div>
                    <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                      Email<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Email"
                              className="flex w-full border-transparent bg-transparent py-0 text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base"
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                      Director Email<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="fleet_dir_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter Director Email"
                              className="flex w-full border-transparent bg-transparent py-0 text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base"
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
                  <div>
                    <label className="mb-[20px] block text-lg font-medium tracking-widest text-black">
                      No of Vessels<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="no_of_vessels"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="flex w-full border-transparent bg-transparent py-0 text-xxs tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm xl:text-xs 2xl:text-base"
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
            <div className="mt-1 flex justify-end gap-[6px] p-5">
              <div className="flex flex-col items-end self-stretch">
                <div className="mr-[50px] flex items-start">
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
      </DialogContent>
    </Dialog>
  );
}
