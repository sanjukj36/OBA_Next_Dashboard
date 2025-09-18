"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import faceDetectionBackToForm from "@/assets/face_detection_back_to_form.png";
import { facialLogin } from "@/lib/api-login";
import { useAuth } from "@/provider/auth-provider";

interface CameraCaptureProps {
  status: boolean;
  faceDetectionEnabled: boolean;
  setStep: (step: number) => void;
  setFaceDetectionEnabled: (enabled: boolean) => void;
  email: string;
}

export default function CameraCapture({
  status,
  setFaceDetectionEnabled,
  faceDetectionEnabled,
  setStep,
  email
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(!status);
  const hasCalledRef = useRef(false);

  const { login } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (status) {
      startCamera();
      setIsCameraOn(true);
    } else {
      stopCamera();
      setIsCameraOn(false);
    }

    return () => {
      stopCamera();
    };
  }, [status]);

  useEffect(() => {
    if (imageData) {
      if (!hasCalledRef.current) {
        checkLogin();
        hasCalledRef.current = true;

        setTimeout(() => {
          hasCalledRef.current = false; // allow future calls if imageData changes
        }, 500); // adjust timing as needed
      }
    }
  }, [imageData]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      intervalRef.current = setInterval(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && videoRef.current) {
          ctx.drawImage(videoRef.current, 0, 0, 300, 200);
          setImageData(canvasRef.current?.toDataURL("image/png") || null);
        }
      }, 1000 * 1);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access was denied or failed");
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setImageData(null);
  };

  const checkLogin = async () => {
    if (!imageData || !email || isChecking) return;
    setIsChecking(true);

    try {
      const res = await fetch(imageData);
      const blob = await res.blob();
      const file = new File([blob], "captured_image.png", {
        type: "image/png"
      });

      const formData = new FormData();
      formData.append("email", email);
      formData.append("image", file);

      const response = await facialLogin(formData);

      if (response.status === 200 && response.data.success) {
        const res = response.data;
        login(
          {
            token: res.token,
            id: res.id,
            company_entity: res.company_entity,
            fleet_entity: res.fleet_entity,
            vessel_entity: res.vessel_entity,
            email: res.email,
            is_superuser: res.is_superuser
          },
          res.token
        );
        router.push("/dashboard/overview");
      } else {
        console.error(
          "Facial login failed:",
          response.data.message || "Login failed"
        );
      }
    } catch (error) {
      console.error("Facial login failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handelGoBackClick = () => {
    stopCamera();
    setFaceDetectionEnabled(!faceDetectionEnabled);
    setStep(2);
  };

  return (
    <div className="flex flex-col items-center font-alexandria text-white">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4">
        <AnimatePresence>
          {isCameraOn && (
            <motion.div
              key="camera"
              className="relative mt-[40px] h-[371px] w-[371px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              {/* Camera Feed */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width={500}
                height={200}
                className="absolute left-1/2 top-1/2 h-[363px] w-[494px] -translate-x-1/2 -translate-y-1/2 rounded-3xl object-cover shadow-md"
              />

              {/* Scanner Beam */}
              {/* {!error && (
                <div className="absolute ms-1 h-[310px] w-[170px]">
                  <motion.div
                    className="z-1 pointer-events-none absolute left-0 h-[60px] w-[362px] rounded-lg bg-[linear-gradient(359deg,rgba(42,123,155,1)_20%,rgba(0,0,0,0)_100%)] mix-blend-screen blur-sm"
                    initial={{ top: 0 }}
                    animate={{ top: "95%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                </div>
              )} */}

              {/* Button and borders stay here */}
              <div className="absolute right-5 top-5 z-10 cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    className="h-auto w-[40px] rounded-sm shadow-[0px_2px_5px_0px_#000000]"
                    src={faceDetectionBackToForm}
                    alt="logo"
                    width={40}
                    height={40}
                    onClick={() => {
                      handelGoBackClick();
                    }}
                  />
                </motion.button>
              </div>

              {/* Corner Borders */}
              <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="absolute left-0 top-0 h-[113px] w-[113px] rounded-tl-3xl border-l-[5px] border-t-[5px] border-white" />
                <div className="absolute right-0 top-0 h-[113px] w-[113px] rounded-tr-3xl border-r-[5px] border-t-[5px] border-white" />
                <div className="absolute bottom-0 left-0 h-[113px] w-[113px] rounded-bl-3xl border-b-[5px] border-l-[5px] border-white" />
                <div className="absolute bottom-0 right-0 h-[113px] w-[113px] rounded-br-3xl border-b-[5px] border-r-[5px] border-white" />

                {/* Hold Still */}
                {!error && (
                  <motion.p
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 font-alexandria text-xl font-light text-white"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Hold Still
                  </motion.p>
                )}
              </motion.div>

              {/* Canvas (hidden) */}
              <canvas
                ref={canvasRef}
                width={300}
                height={200}
                className="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/*
      <AnimatePresence>
        {imageData && (
          <motion.img
            key="captured-image"
            src={imageData}
            alt="Captured"
            className="mt-6 w-[500px] rounded-2xl border shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
}
