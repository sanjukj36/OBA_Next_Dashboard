import React, { ReactNode, Suspense } from "react";
import AmsHeader from "@/components/layout/ams-header";
import PageLoader from "@/components/loader/page-loader";

const AmsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <React.Fragment>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
      <AmsHeader />
    </React.Fragment>
  );
};
export default AmsLayout;
