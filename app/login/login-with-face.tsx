"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import BackIcon from "@/assets/back-icon-login.png";
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
import { loginCheckUserNameApi } from "@/lib/api-login";
import { useLoginMutation } from "@/mutations/use-login-mutation";
import CameraCapture from "./CameraCapture";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(2).max(50)
});

export function LoginWithFace({ className }: { className: string }) {
  const [passwordType, setPasswordType] = useState<"text" | "password">(
    "password"
  );
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const [step, setStep] = useState(1);
  const [checkEmailLoader, setCheckEmailLoader] = useState(false);

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

  useEffect(() => {
    if (checkEmailLoader) {
      handleCheckUserNameApi();
    }
  }, [checkEmailLoader]);

  const handleCheckUserNameApi = async () => {
    const email = form.getValues("email");

    const body = {
      email: email
    };
    setCheckEmailLoader(true);
    try {
      const response = await loginCheckUserNameApi(body);

      if (response.status === 200) {
        const { success, message } = response?.data || {};
        if (success == false) {
          throw new Error(message);
        }
        setStep(2);
        // setResponse(true);
        // window.alert("Welcome User successfully!");
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (err) {
      console.error("Error while Check UserName:", err);
      // window.alert("Failed to  Check UserName. Please try again.");
      toast.error("Failed to  Check UserName. Please try again.");

      if (err instanceof AxiosError) {
        const data = err.response?.data;
        console.error("Axios", { data, msg: err.message });
        toast.error(data.message);
        return;
      }
      console.error({ err });
    } finally {
      setCheckEmailLoader(false);
    }
  };

  return (
    <div
      className={twMerge(
        "mx-auto mt-[40%] flex h-min max-w-[367px] flex-col md:mx-0 lg:mt-[10%] lg:space-y-4 2xl:mt-[20%] 2xl:space-y-5",
        className
      )}
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ms-8 flex items-center gap-6"
      >
        <div className="mb-5 w-[80px] lg:w-[90px] 2xl:w-[130px]">
          <Image className="w-full object-cover" src={logo} alt="logo" />
        </div>
      </motion.div>
      <h1 className="font-alexandria text-2xl text-white lg:text-3xl 2xl:text-[36px]">
        Welcome
      </h1>

      <div className="mt-[10%]">
        <AnimatePresence mode="wait">
          {(step === 1 || step === 2) && (
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid w-full md:grid-cols-[2fr_1.5fr_2fr]"
            >
              <motion.hr
                className="my-8 mt-[11px] h-px w-full border-0 bg-gray-200"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <span className="text-center font-alexandria text-[14px]">
                Step {step} of 2
              </span>
              <motion.hr
                className="my-8 mt-[11px] h-px w-full border-0 bg-gray-200"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "right" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {faceDetectionEnabled ? (
        <>
          <CameraCapture
            status={faceDetectionEnabled}
            setFaceDetectionEnabled={setFaceDetectionEnabled}
            faceDetectionEnabled={faceDetectionEnabled}
            setStep={setStep}
            email={form?.getValues("email")}
          />
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 lg:space-y-4 2xl:space-y-8"
          >
            {step == 1 && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Mail-ID"
                        {...field}
                        type="email"
                        className="h-10 rounded-lg border-none bg-white/60 p-5 font-alexandria text-[#413f3f] focus-visible:ring-0 lg:h-11 lg:rounded-lg 2xl:h-[54px] 2xl:w-[367px] 2xl:rounded-[15px] 2xl:text-[18px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step == 2 && (
              <>
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="ms-8 flex items-center gap-6"
                >
                  {/* <motion.div
                  initial={{ x: 100, opacity: 0 }} // Start from the right
                  animate={{ x: 0, opacity: 1 }} // Animate to center
                  exit={{ x: 100, opacity: 0 }} // Exit to the right
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="ms-8 flex items-center gap-6"
                > */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      className="h-auto w-6 items-end rounded-sm shadow-[0px_2px_5px_0px_#000000] lg:w-[29.19px]"
                      src={BackIcon}
                      alt="Back-icon"
                      onClick={() => setStep(1)}
                    />
                  </motion.button>

                  <div className="font-alexandria text-[18px]">
                    {form.getValues("email")?.length > 25
                      ? form.getValues("email").slice(0, 25) + "..."
                      : form.getValues("email")}
                  </div>
                </motion.div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex h-10 items-center rounded-lg border-none bg-white/60 font-bold text-[#626262] focus-visible:ring-0 lg:h-11 lg:rounded-lg 2xl:h-[54px] 2xl:rounded-[15px] 2xl:text-[18px]">
                          <Input
                            placeholder="Password"
                            {...field}
                            type={passwordType}
                            className="border-none bg-none p-5 font-alexandria text-[#626262] focus-visible:ring-0 lg:h-11 lg:rounded-l-lg 2xl:h-[54px] 2xl:rounded-l-[12px] 2xl:rounded-r-[1px] 2xl:text-[18px]"
                          />
                          <button
                            className="p-3"
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
              </>
            )}

            {step == 1 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    onClick={() => {
                      setCheckEmailLoader(true);
                    }}
                    className="hover:bg-[#1BB0FE]/56 mt-[20px] w-full bg-[#1BB0FE]/50 font-alexandria text-xl text-white lg:h-11 lg:rounded-lg lg:text-[24px] 2xl:h-[54px] 2xl:rounded-[15px] 2xl:text-[22px]"
                    loading={checkEmailLoader}
                  >
                    <span>Continue </span>
                  </Button>
                </motion.div>
              </>
            )}

            {step == 2 && (
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    onClick={() => {
                      setStep(2);
                    }}
                    className="hover:bg-[#1BB0FE]/56 w-full bg-[#1BB0FE]/50 font-alexandria text-xl text-white lg:h-11 lg:rounded-lg lg:text-[24px] 2xl:h-[54px] 2xl:rounded-[15px] 2xl:text-[25px]"
                    loading={mutation.isPending}
                  >
                    Login{" "}
                  </Button>
                </motion.div>
                <div className="my-[20px] text-center font-alexandria text-[18px]">
                  or
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    onClick={() => {
                      setFaceDetectionEnabled(!faceDetectionEnabled);
                      setStep(3);
                    }}
                    className="hover:bg-[#1BB0FE]/56 w-full bg-[#1BB0FE]/50 font-alexandria text-xl text-white lg:h-11 lg:rounded-lg lg:text-[24px] 2xl:h-[54px] 2xl:rounded-[15px] 2xl:text-[18px]"
                  >
                    <div className="flex w-full items-center justify-center gap-3">
                      <motion.div
                        animate={{ x: 1 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5,
                          ease: [0, 0.71, 0.2, 1.01]
                        }}
                      >
                        <Image
                          className="h-auto w-[19.25px] items-end"
                          src={faceDetection}
                          alt="Face detection logo"
                        />
                      </motion.div>
                      <span>Log in with face Id</span>
                    </div>
                  </Button>
                </motion.div>
              </div>
            )}
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
      width="18.24"
      height="13.13"
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
