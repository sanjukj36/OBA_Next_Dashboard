import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, Upload, X } from "lucide-react";
import { z } from "zod";
import { EditIcon } from "@/components/icons/edit-icon";
import { PasswordEditIcon } from "@/components/icons/password-edit-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { Button } from "@/components/ui/button";
import { DatePickerForm } from "@/components/ui/DatePickerForm";
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
import { SelectDropdown } from "@/components/ui/select-dropdown";
import {
  addUserApi,
  getUserByIdApi,
  listUserTypeApi,
  updateUserAddApi
} from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { ChangePasswordForm } from "./changePasswordForm";
import { toast } from "sonner";

// Schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Username is required!" }),
  email: z.string().email().min(5).max(100),
  password: z
    .string()
    .min(6, { message: "Password must contain atleast 6 characters!" })
    .max(100),
  userType: z
    .object({ label: z.string(), value: z.string() })
    .refine(val => val.value && val.label, {
      message: "User type is required!"
    }),
  expiry: z.coerce
    .date()
    .refine(date => date > new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Expiry date must be in the future!"
    }),
  profilePicture: z
    .union([
      z
        .instanceof(File)
        .refine(
          file => file.size <= 5_000_000,
          "File size must be less than 5MB"
        )
        .refine(
          file => ["image/jpeg", "image/png"].includes(file.type),
          "Only JPEG and PNG images are allowed"
        ),
      z.string().min(1, "Profile picture is required")
    ])
    .refine(val => !!val, { message: "Profile picture is required" })
});

type FormValues = z.infer<typeof formSchema>;

export type UserTypeRow = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  userType?: string;
  expiry?: string;
  profilePicture?: string;
};

type UserFormProps = {
  setResponse: (value: boolean) => void;
  user?: FormValues;
  row?: UserTypeRow;
};

type Option = {
  label: string;
  value: string;
};

export function UserForm({ setResponse, row }: UserFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [optionUserType, setOptionUserType] = useState<Option[]>([]);
  const [search] = useState("");
  const [page] = useState(1);
  const [existingProfilePic, setExistingProfilePic] = useState<string | null>(
    null
  );
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedUserForPasswordChange, setSelectedUserForPasswordChange] =
    useState<UserTypeRow | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const { token } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: {},
      expiry: new Date(),
      profilePicture: undefined
    }
  });

  const resetForm = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      userType: { value: "", label: "" },
      expiry: new Date(),
      profilePicture: undefined
    });
    form.clearErrors();
    setExistingProfilePic(null);
  };

  const isEditMode = !!row;
  function formatLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Initialize form with row data when in edit mode
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token || !row?.id) return;

      try {
        const res = await getUserByIdApi(row.id, token);
        const data = res.data.data;
        const matchedUserType = optionUserType.find(
          opt => opt.value === data.usertype?.toString()
        );

        // Set existing profile picture URL if available
        if (data.profilePicture) {
          setExistingProfilePic(data.profilePicture);
          setShowUpload(false); // Hide upload by default in edit mode
        }

        form.reset({
          name: data.name || "",
          email: data.email || "",
          password: data.password || "",
          userType: matchedUserType || { value: "", label: "" },
          expiry: row.expiry ? new Date(row.expiry) : new Date(),
          profilePicture: data.profilePicture || undefined
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to fetch user details. Please try again.");
      }
    };

    if (isEditMode && isDialogOpen && optionUserType.length > 0) {
      fetchUserDetails();
    }
  }, [isDialogOpen, isEditMode, row?.id, token, optionUserType]);

  const fetchUserTypes = async () => {
    const limit = 5;
    if (!token) {
      toast.warning("Token is missing. Please login again.");
      return;
    }
    if (page && limit && token) {
      try {
        const response = await listUserTypeApi(page, limit, search, token);
        const data = response.data.data;

        const options = data.map((type: { name: string; id: number }) => ({
          label: type.name,
          value: type.id.toString()
        }));

        setOptionUserType(options);

        if (response.status !== 200) {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
      }
    } else {
      const missingFields = [];
      if (!page) missingFields.push("page");
      if (!limit) missingFields.push("limit");
      if (!token) missingFields.push("token");
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, [token]);

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

    const usertype = values?.userType?.value;

    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("email", values.email.trim());
    formData.append("password", values.password);
    formData.append("user_type_id", Number(usertype).toString());
    formData.append("expiry", formatLocalDate(values.expiry));
    formData.append("entity", JSON.stringify([]));

    // Append image file if it exists and is a File object
    if (values.profilePicture instanceof File) {
      formData.append("profilePicture", values.profilePicture);
    } else if (
      typeof values.profilePicture === "string" &&
      values.profilePicture
    ) {
      // For edit case where we might have a URL string
      formData.append("profilePicture", values.profilePicture);
    }

    try {
      const response = await (isEditMode && row?.id
        ? updateUserAddApi(formData, row.id, token)
        : addUserApi(formData, token));

      if (response.status === 200 && response.data?.data?.success !== false) {
        form.reset();
        setResponse(true);
        setIsDialogOpen(false);
        toast.success(`User ${isEditMode ? "updated" : "added"} successfully!`);
      } else {
        throw new Error(
          response.data?.data?.message || "Unexpected server response"
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("profilePicture", "");
    setExistingProfilePic(null);
    setShowUpload(true); // Show upload section after removal
  };

  const handleChangePasswordClick = (user: UserTypeRow) => {
    setSelectedUserForPasswordChange(user);
    setShowChangePassword(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            aria-label="Edit User Details"
            className="sm:min-p-[1px] sm-max-w-[10px] max-xs:px-[6px] min-sm:px-[6px] min-xl:px-[4px] m-1 items-center justify-evenly rounded-[10px] bg-[#213B4C] p-0 hover:bg-[#234155]/50 max-xl:m-2 max-xl:h-[30px] max-xl:w-[30px] max-xl:items-center max-xl:px-[6px] max-sm:m-2 max-sm:h-[30px] max-sm:items-center max-sm:px-[6px] sm:p-[10px] lg:p-0 lg:text-[24px] xl:p-[11px]"
            onClick={() => setIsDialogOpen(true)}
          >
            <EditIcon className="h-4 w-4 max-sm:h-4 max-sm:w-4 sm:me-0" />
          </Button>
        ) : (
          <Button
            aria-label="Add User Details "
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
        className="w-[95vw] max-w-[746px] rounded-[15px] bg-primary font-alexandria text-card-foreground sm:h-auto sm:min-w-[400px] md:min-w-[600px] lg:min-w-[777px] xl:min-w-[866px] [&>button.absolute]:hidden"
      >
        <div className="mb-4 flex items-center justify-between p-4 font-alexandria lg:p-[-31px] 3xl:p-4">
          <div className="flex items-center gap-2 text-2xl text-foreground">
            <DialogHeader>
              <DialogTitle className="ml-[40px] mt-4 flex gap-4 text-[28px] text-black lg:text-[25px] 3xl:text-[28px]">
                <DialogClose asChild>
                  <ArrowLeft className="h-[26px] w-[31px] cursor-pointer" />
                </DialogClose>
                {isEditMode ? "Update User Details" : "Add User Details"}
              </DialogTitle>
            </DialogHeader>
          </div>
          <DialogClose asChild>
            <X className="h-[26px] w-[26px] cursor-pointer" />
          </DialogClose>
        </div>

        {/* UserForm   */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full space-y-3 lg:space-y-4 2xl:space-y-8"
          >
            <div className="mx-auto mt-8 h-auto w-full max-w-2xl px-1 py-1 lg:mt-[8px] 3xl:mt-8">
              <div className="flex flex-col space-y-8 text-xxs xl:text-xs 2xl:text-base">
                <div className="sm:gap-gap-20 grid grid-cols-1 max-md:gap-10 max-sm:gap-10 md:grid-cols-2 md:gap-20">
                  <div>
                    <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                      Name<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="User Name"
                              {...field}
                              className="flex w-full border-transparent bg-transparent py-0 font-alexandria text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isEditMode ? (
                    <div>
                      <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                        Password<span className="text-red-600">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                readOnly
                                {...field}
                                placeholder="***************"
                                className="flex w-full border-transparent bg-transparent py-0 font-alexandria text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                              />
                            </FormControl>
                            <div className="h-[1px] flex-1 bg-[#000000]" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                        Password<span className="text-red-600">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                placeholder="***************"
                                className="flex w-full border-transparent bg-transparent py-0 font-alexandria text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                              />
                            </FormControl>
                            <div className="h-[1px] flex-1 bg-[#000000]" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-20 md:grid-cols-2">
                  <div>
                    <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                      Email<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="User Email"
                              {...field}
                              className="flex min-w-[270px] border-transparent bg-transparent py-0 font-alexandria text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                      User Type<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectDropdown
                              options={optionUserType}
                              placeholder="Select User Type"
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex w-full border-transparent bg-transparent py-0 font-alexandria text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                            />
                          </FormControl>
                          <div className="h-[1px] flex-1 bg-[#000000]" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
                  <div>
                    <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                      Expiry<span className="text-red-600">*</span>
                    </label>
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <DatePickerForm
                              control={form.control}
                              name="expiry"
                              minDate={
                                new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </FormControl>
                          <div className="h-[1px] w-[270px] flex-1 bg-[#000000]" />
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="profilePicture"
                      render={({ field }) => (
                        <FormItem>
                          <label className="mb-[10px] block font-alexandria text-lg tracking-widest text-black lg:text-[16px] 3xl:text-lg">
                            Profile Picture
                            <span className="text-red-600">*</span>
                          </label>
                          <FormControl>
                            <div className="flex flex-col gap-2 font-alexandria">
                              {/* Show existing image preview or file upload */}
                              {(existingProfilePic ||
                                (field.value &&
                                  typeof field.value === "string")) &&
                                !showUpload ? (
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={
                                        existingProfilePic ||
                                        (typeof field.value === 'string'
                                          ? field.value
                                          : field.value instanceof File
                                            ? URL.createObjectURL(field.value)
                                            : ''
                                        )
                                      }
                                      alt="Profile Preview"
                                      className="h-16 w-16 rounded object-cover"
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-sm text-gray-600">
                                        Current image:
                                      </span>
                                      <a
                                        href={existingProfilePic || (typeof field.value === 'string' ? field.value : '')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                      >
                                        {existingProfilePic || (typeof field.value === 'string' ? field.value : 'View Image')}
                                      </a>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleRemoveImage}
                                      className="font-alexandria text-sm text-red-500 hover:text-red-700"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : field.value instanceof File ? (
                                <div className="flex flex-col gap-2 font-alexandria">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={URL.createObjectURL(field.value)}
                                      alt="New Profile Preview"
                                      className="h-16 w-16 rounded object-cover"
                                    />
                                    <span className="text-sm text-gray-600">
                                      {field.value.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        field.onChange(undefined);
                                        setShowUpload(true);
                                      }}
                                      className="font-alexandria text-sm text-red-500 hover:text-red-700"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <label className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 px-4 py-2 font-alexandria hover:bg-gray-100">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Upload className="h-4 w-4" />
                                    Choose File (JPEG/PNG)
                                  </div>
                                  <Input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                    onChange={e => {
                                      if (
                                        e.target.files &&
                                        e.target.files.length > 0
                                      ) {
                                        field.onChange(e.target.files[0]);
                                        setShowUpload(false);
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Modal */}
            {selectedUserForPasswordChange && (
              <ChangePasswordForm
                open={showChangePassword}
                onClose={() => {
                  setShowChangePassword(false);
                  setSelectedUserForPasswordChange(null);
                }}
                email={selectedUserForPasswordChange.email || ""}
              />
            )}
            <div className="mt-1 flex justify-between p-5 font-alexandria">
              <div className="flex items-start">
                {isEditMode && (
                  <Button
                    variant="outline"
                    onClick={() => handleChangePasswordClick(row)}
                    className="ms-[50px] flex h-[49px] w-[241px] shrink-0 items-center rounded-[10px] border-0 bg-[#213B4C] px-[32px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#213B4C]/90"
                  >
                    <PasswordEditIcon className="mr-1 !size-[25px]" />
                    <span className="text-[18px] font-normal text-white">
                      Change Password
                    </span>
                  </Button>
                )}
              </div>

              <div className="ml-[20px] flex items-start">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="mr-[26px] flex h-[49px] w-auto shrink-0 items-center rounded-[10px] border-0 bg-input px-[32px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-input/50"
                >
                  <span className="text-[20px] font-semibold text-[#000000]">
                    Clear
                  </span>
                </Button>

                <Button
                  type="submit"
                  className="flex h-[49px] w-auto shrink-0 items-center rounded-[10px] border-0 bg-secondary px-[32px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-secondary/50"
                >
                  <span className="text-[20px] font-semibold text-[#FFFFFF]">
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
