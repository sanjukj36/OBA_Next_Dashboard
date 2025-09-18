import Image from "next/image";
import shipImage from "@/assets/login-ship.png";
// import { Login } from "./login";
import { LoginWithFace } from "./login-with-face";

export default function LoginPage() {
  return (
    <div className="relative grid h-screen w-screen gap-7 md:grid-cols-10 lg:grid-cols-11">
      <video
        className="absolute left-0 top-0 -z-20 h-full w-full object-cover object-left-top"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/login-bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Image
        className="pointer-events-none absolute bottom-0 -z-10 h-[100vh] w-auto object-cover lg:bottom-0 lg:right-0 lg:h-[95vh] lg:object-contain 2xl:bottom-0 2xl:right-[2%] 2xl:h-[95vh]"
        alt="login ship"
        src={shipImage}
      />
      {/* <Login className="md:col-start-2 md:col-end-5 lg:col-start-2 lg:col-end-5" /> */}
      <LoginWithFace className="md:col-start-2 md:col-end-5 lg:col-start-2 lg:col-end-5" />
    </div>
  );
}
