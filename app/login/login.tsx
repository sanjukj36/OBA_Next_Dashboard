"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import faceDetectionBackToForm from "@/assets/face_detection_back_to_form.png";
import faceDetection from "@/assets/face_detection.png";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/mutations/use-login-mutation";
import CameraCapture from "./CameraCapture";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(2).max(50)
});

export function Login({ className }: { className: string }) {
  const [passwordType, setPasswordType] = useState<"text" | "password">(
    "password"
  );
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);

  useEffect(() => {
    if (passwordType === "text") {
      const id = setTimeout(() => {
        setPasswordType("password");
      }, 1000);

      return () => {
        clearTimeout(id);
      };
    }
  }, [passwordType]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? "user10@mail.com" : "",
      password: process.env.NODE_ENV === "development" ? "memphis@123!" : ""
    }
  });

  const mutation = useLoginMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values, {});
  };

  return (
    <div
      className={twMerge(
        "mx-auto mt-[40%] flex h-min max-w-96 flex-col md:mx-0 lg:mt-[50%] lg:space-y-8 2xl:mt-[20%] 2xl:space-y-8",
        className
      )}
    >
      <div className="w-[80px] lg:w-[90px] 2xl:w-[130px]">
        <Image className="w-full object-cover" src={logo} alt="logo" />
      </div>

      <h1 className="text-2xl font-bold text-white lg:text-3xl 2xl:text-4xl">
        Welcome
      </h1>

      {faceDetectionEnabled ? (
        <>
          <div className="flex justify-end">
            <Image
              className="w-40px h-auto items-end"
              src={faceDetectionBackToForm}
              alt="logo"
              onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
            />
          </div>
          {/* <CameraCapture status={faceDetectionEnabled} /> */}
          <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <CameraCapture status={true} />
          </div>
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 lg:space-y-4 2xl:space-y-8"
          >
            <div className="flex justify-end">
              <Image
                className="w-40px h-auto items-end"
                src={faceDetection}
                alt="logo"
                onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      type="email"
                      className="h-10 rounded-lg border-none bg-white/60 p-5 font-bold text-[#626262] focus-visible:ring-0 lg:h-11 lg:rounded-lg 2xl:h-[73px] 2xl:rounded-[15px] 2xl:text-[23px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex h-10 items-center rounded-lg border-none bg-white/60 p-5 font-bold text-[#626262] focus-visible:ring-0 lg:h-11 lg:rounded-lg 2xl:h-[73px] 2xl:rounded-[15px] 2xl:text-[23px]">
                      <Input
                        placeholder="Password"
                        {...field}
                        type={passwordType}
                        className="border-none bg-none p-0 font-bold text-[#626262] focus-visible:ring-0 lg:h-11 lg:rounded-lg 2xl:h-[73px] 2xl:rounded-[15px] 2xl:text-[23px]"
                      />
                      <button
                        onClick={() => {
                          if (passwordType === "password") {
                            setPasswordType("text");
                          } else {
                            setPasswordType("password");
                          }
                        }}
                        type="button"
                      >
                        <EyeIcon />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#1BB0FE]/80 text-xl font-bold text-white hover:bg-[#1BB0FE]/50 lg:h-11 lg:rounded-lg lg:text-[24px] 2xl:h-[73px] 2xl:rounded-[15px] 2xl:text-[40px]"
              loading={mutation.isPending}
            >
              Login
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

function EyeIcon(props: React.ComponentProps<"svg">): JSX.Element {
  return (
    <svg
      {...props}
      width="22"
      height="15"
      viewBox="0 0 22 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 4.5C11.7956 4.5 12.5587 4.81607 13.1213 5.37868C13.6839 5.94129 14 6.70435 14 7.5C14 8.29565 13.6839 9.05871 13.1213 9.62132C12.5587 10.1839 11.7956 10.5 11 10.5C10.2044 10.5 9.44129 10.1839 8.87868 9.62132C8.31607 9.05871 8 8.29565 8 7.5C8 6.70435 8.31607 5.94129 8.87868 5.37868C9.44129 4.81607 10.2044 4.5 11 4.5ZM11 0C16 0 20.27 3.11 22 7.5C20.27 11.89 16 15 11 15C6 15 1.73 11.89 0 7.5C1.73 3.11 6 0 11 0ZM2.18 7.5C2.98825 9.15031 4.24331 10.5407 5.80248 11.5133C7.36165 12.4858 9.1624 13.0013 11 13.0013C12.8376 13.0013 14.6383 12.4858 16.1975 11.5133C17.7567 10.5407 19.0117 9.15031 19.82 7.5C19.0117 5.84969 17.7567 4.45925 16.1975 3.48675C14.6383 2.51424 12.8376 1.99868 11 1.99868C9.1624 1.99868 7.36165 2.51424 5.80248 3.48675C4.24331 4.45925 2.98825 5.84969 2.18 7.5Z"
        fill="#626262"
      />
    </svg>
  );
}
