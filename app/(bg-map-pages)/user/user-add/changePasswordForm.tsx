"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { PasswordCloseEye, PasswordEye } from "@/components/icons/password-eye";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changeUserPasswordApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters")
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

interface ChangePasswordFormProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

export const ChangePasswordForm = ({
  open,
  onClose,
  email
}: ChangePasswordFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token, logout } = useAuth();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setLoading(true);
      const response = await changeUserPasswordApi(
        {
          email,
          current_password: values.currentPassword,
          new_password: values.newPassword
        },
        token || ""
      );

      onClose();
      toast.success("Password changed successfully");
      form.reset();
    } catch (err) {
      console.error("Error changing password:", err);
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || err.message;
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full !max-w-[44rem] rounded-xl bg-primary !p-[72px] pb-7 pt-10 text-center shadow-lg [&>button.absolute]:hidden">
        <div className="mb-[39px] flex items-center justify-between">
          <div className="text-xm flex items-center gap-2 font-bold text-foreground">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer text-black"
              onClick={onClose}
            />
            <p className="font-alexandria text-[25px] font-semibold text-black">
              {" "}
              Update password
            </p>
          </div>
          <X
            className="h-[26px] w-[26px] cursor-pointer text-black"
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col space-y-8 text-xxs xl:text-xs 3xl:text-base">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3 lg:space-y-4 3xl:space-y-8"
            >
              <div className="mx-auto mt-[1px] h-auto w-full px-1 py-1">
                <div className="flex flex-col space-y-8 text-xxs xl:text-xs 3xl:text-sm">
                  <div className="sm:gap-gap-20 grid grid-cols-1 max-md:gap-10 max-sm:gap-10 md:grid-cols-2 md:gap-20">
                    <div>
                      <label className="mb-[10px] block text-left font-alexandria text-[18px] tracking-widest text-black lg:text-[15px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                        Email<span className="text-red-600">*</span>
                      </label>
                      <Input
                        type="email"
                        value={email}
                        disabled
                        className="flex w-full border-transparent bg-transparent py-0 text-left font-alexandria text-[15px] text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                      />
                      <div className="h-[1px] flex-1 bg-[#000000]" />
                    </div>

                    {/* Current Password Field */}
                    <div className="relative">
                      <label className="mb-[10px] block text-left font-alexandria text-[18px] tracking-widest text-black lg:text-[15px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                        Current Password<span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          {...form.register("currentPassword")}
                          className="flex w-full border-transparent bg-transparent py-0 text-left font-alexandria text-[15px] text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-0 flex h-full items-center pr-3 text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <PasswordCloseEye />
                          ) : (
                            <PasswordEye />
                          )}
                        </button>
                      </div>
                      <div className="h-[1px] flex-1 bg-[#000000]" />
                      {form.formState.errors.currentPassword && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    {/* New Password Field */}
                    <div className="relative">
                      <label className="mb-[10px] block text-left font-alexandria text-[18px] tracking-widest text-black lg:text-[15px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                        New Password<span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          {...form.register("newPassword")}
                          className="flex w-full border-transparent bg-transparent py-0 text-left font-alexandria text-[15px] text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-0 flex h-full items-center pr-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <PasswordCloseEye />
                          ) : (
                            <PasswordEye />
                          )}
                        </button>
                      </div>
                      <div className="h-[1px] flex-1 bg-[#000000]" />
                      {form.formState.errors.newPassword && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <label className="mb-[10px] block text-left font-alexandria text-[18px] tracking-widest text-black lg:text-[15px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                        Confirm Password<span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...form.register("confirmPassword")}
                          className="flex w-full border-transparent bg-transparent py-0 text-left font-alexandria text-[15px] text-sm tracking-widest text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none"
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-0 flex h-full items-center pr-3 text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <PasswordCloseEye />
                          ) : (
                            <PasswordEye />
                          )}
                        </button>
                      </div>
                      <div className="h-[1px] flex-1 bg-[#000000]" />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.reset}
                  className="mr-[26px] mt-[15px] flex h-[40px] w-auto shrink-0 items-center rounded-[10px] border-0 bg-input px-[32px] font-alexandria shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-input/50"
                >
                  <span className="text-[15px] font-normal text-[#000000]">
                    Clear
                  </span>
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-[15px] flex h-[40px] w-[160px] shrink-0 items-center rounded-[10px] border-0 bg-secondary px-[32px] font-alexandria shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-secondary/50"
                >
                  <span className="text-[15px] font-normal text-[#FFFFFF]">
                    {loading ? "Changing..." : "Change Password"}
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
