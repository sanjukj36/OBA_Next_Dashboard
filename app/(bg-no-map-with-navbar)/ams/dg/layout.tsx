import { ReactNode, Suspense } from "react";
import TitleNavigationCard from "@/components/ams/ams-dark-them/title-card/title-navigation-card";
import PageLoader from "@/components/loader/page-loader";

export default function DgLayout({ children }: { children: ReactNode }) {
  return (
    <div className="m-1 grid flex-1 grid-cols-[auto,_1fr] grid-rows-[auto,_1fr,_auto] gap-[6px] rounded-[15px] border-black/20 p-[6px] shadow-[0px_0px_3.5999999046325684px_0px_rgba(255,255,255,0.50)] xl:gap-[7px] xl:p-2 3xl:gap-[7px] 3xl:p-[9px]">
      <div className="col-start-1 col-end-1 row-start-1 row-end-2 flex h-[33px] w-[221px] flex-wrap items-center justify-evenly rounded-xl border-8 border-black/20 shadow-[0px_0px_3.5999999046325684px_0px_rgba(255,255,255,0.50)] xl:h-[41px] xl:w-[279px] 3xl:h-[61px] 3xl:w-[423px]">
        <TitleNavigationCard
          title="G/E COMMON"
          href="/ams/dg/ge-common"
          // disable
        />
        <TitleNavigationCard title="GENERATORS" href="/ams/dg/generators" />
      </div>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </div>
  );
}
