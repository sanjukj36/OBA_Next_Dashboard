import Image from "next/image";
import { twMerge } from "tailwind-merge";
import imageAmsMainEngine from "@/assets/ams/ams-main-engine-without-pp.png";
import { PropellerView } from "@/components/ams/ams-dark-them/main-engine/propellar-view";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { DataCard } from "@/components/data-card";
import { TagAssignComponent } from "@/components/tag-assign";
import {
  BoolResponseStatusKeys,
  BoolResponseType
} from "@/components/tag-assign/single-tag-form";
import { AmsAlertStatusButton } from "@/components/ui/ams-card";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { TagDataType } from "@/types/tag-assign";
import { ME } from "./me-taglist";

const RPM_TAG = ME.Tag13

const MEDiagramValue = ({ label }: { label: string }) => {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value, response_type } = data || {};

  if (data && data.datatype === TagDataType.Float) {
    const valueClassNames =
      datatype === TagDataType.Float &&
        minimum !== null &&
        maximum !== null &&
        (Number(value) < minimum || Number(value) > maximum)
        ? "bg-[#AF0000]/60 text-white"
        : "bg-[#D9D9D9]/60 text-black";
    return (
      <div
        className={twMerge(
          "relative min-w-[58px] rounded-[9px] p-1.5 text-center font-alexandria text-sm font-semibold text-black lg:min-w-[54px] lg:text-[9px] xl:min-w-[54px] xl:text-[9px] 2xl:min-w-[54px] 2xl:text-[12px] 3xl:min-w-[58px] 3xl:text-sm",
          valueClassNames
        )}
      >
        <span>{data.value}</span>
        <TagAssignComponent type="single" tag={label} />
        {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      </div>
    );
  }

  if (data && data.datatype === TagDataType.Bool) {
    const alertStatusType = response_type && response_type[value];
    return (
      <div className="ml[10px]- relative grid min-w-[58px] place-items-center rounded-[9px] bg-[#D9D9D9]/60 p-1.5 text-center font-alexandria text-sm font-semibold text-black lg:min-w-[49px] lg:p-[9px] lg:text-[9px] xl:min-w-[53px] xl:p-[6px] xl:text-[9px] 2xl:min-w-[47px] 2xl:p-[2px] 2xl:text-[9px] 3xl:min-w-[58px] 3xl:p-1.5 3xl:text-sm">
        <AmsAlertStatusButton type={alertStatusType} />
        <TagAssignComponent type="single" tag={label} />
        {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      </div>
    );
  }

  return (
    <div className="relative">
      <TagAssignComponent type="single" tag={label} />
    </div>
  );
};

const MEDiagramLabel = ({
  title,
  label,
  className
}: {
  title: string;
  label: string;
  className?: string;
}) => {
  const { data: latestData } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  return (
    <div
      className={twMerge(
        "relative w-full rounded-[8px] bg-[#050505] p-2 text-center uppercase shadow-[0px_0px_4px_1px_#FFFFFF] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 3xl:w-[178px] 3xl:text-sm",
        className
      )}
    >
      <span>{data?.description ?? title}</span>
      <TagAssignComponent type="single" tag={label} />
    </div>
  );
};

const METitleValueCard = ({
  label,
  className,
  valueBox = "light"
}: {
  label: string;
  className?: string;
  valueBox?: "dark" | "light";
}) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value } = data || {};

  const lightValueClassNames =
    datatype === TagDataType.Float &&
      minimum !== null &&
      maximum !== null &&
      (value < minimum || value > maximum)
      ? "border-white bg-[#AF0000]"
      : "border-white bg-black";

  const darkValueClassNames =
    datatype === TagDataType.Float &&
      minimum !== null &&
      maximum !== null &&
      (value < minimum || value > maximum)
      ? "border-black bg-[#AF0000]"
      : "border-black bg-[#595959]";

  return (
    <div
      className={twMerge(
        "relative flex flex-col gap-[10px] font-alexandria uppercase",
        className
      )}
    >
      <p
        className={twMerge(
          "mt-0 flex-1 text-center text-sm leading-[100%] lg:mt-[2px] lg:text-[8px] xl:mt-0 xl:text-[12px] 2xl:mt-0 2xl:text-[12px] 3xl:mt-[6px] 3xl:text-[14px]",
          valueBox === "light" && "text-white",
          valueBox === "dark" && "text-white opacity-75"
        )}
      >
        {data?.description ?? "__"}
      </p>
      <div
        className={twMerge(
          "px-5 mx-auto  rounded-[5px] border text-center pb-[6px] shadow-[0px_0px_2px_1px_#949494]",
          valueBox === "light" && lightValueClassNames,
          valueBox === "dark" && darkValueClassNames
        )}
      >
        <p
          className={twMerge(
            "text-[16px] leading-[100%] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 3xl:text-[16px] mt-[6px] whitespace-nowrap",
            valueBox === "light" && "text-white",
            valueBox === "dark" && "text-white opacity-75  min-w-[51px]"
          )}
        >
          {data?.value ?? "__"}
          {data?.unit && data.unit}
        </p>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

const MainEngine = () => {
  return (
    <div className="flex flex-1 flex-col p-1">
      <div className="grid flex-1 grid-cols-[330px_1fr_1fr_1fr_1fr] gap-2 rounded-[12px] p-2.5 shadow-[0px_0px_3.6px_0px_#FFFFFF80] lg:grid-cols-[236px_1fr_1fr_1fr_1fr] 3xl:grid-cols-[330px_1fr_1fr_1fr_1fr]">
        <div className="__first-row col-start-1 col-end-2 flex flex-col gap-2">
          <DataCard
            label={ME.Tag1}
            className="max-h-[228px] min-h-[237px] 3xl:max-h-[244px]"
          />
          <DataCard
            label={ME.Tag2}
            className="max-h-[228px] min-h-[237px] 3xl:max-h-[244px]"
          />
          <DataCard
            label={ME.Tag3}
            className="max-h-[228px] min-h-[237px] 3xl:max-h-[244px]"
          />
          <DataCard
            label={ME.Tag4}
            className="max-h-[228px] min-h-[237px] 3xl:max-h-[244px]"
          />
        </div>
        <div className="col-start-2 col-end-6 grid grid-cols-subgrid grid-rows-[1fr_auto]">
          <div className="col-span-4 flex flex-col gap-8 self-stretch p-10">
            <div className="flex w-full justify-center gap-20">
              <METitleValueCard label={ME.Tag5} />
              <METitleValueCard label={ME.Tag6} />
              <METitleValueCard label={ME.Tag7} />
            </div>
            <div className="grid w-full flex-1 grid-cols-12 gap-2 lg:grid-rows-12 xl:grid-rows-9 3xl:grid-rows-6">
              <div className="col-span-2 row-span-6 grid h-full grid-rows-subgrid items-center">
                <MEDiagramLabel
                  label={ME.Tag8}
                  title="ME Cylinder Exh Gas Out Temp [°C]"
                />
                <MEDiagramLabel
                  label={ME.Tag9}
                  title="ME cyl J.C.F.W Out Temp [°C]"
                />
                <MEDiagramLabel
                  label={ME.Tag10}
                  title="me scav air fire oft temp [°C]"
                />
                <MEDiagramLabel
                  label={ME.Tag11}
                  title="me cyl piston c.o out temp [°C]"
                />
                <MEDiagramLabel
                  label={ME.Tag12}
                  title="ME p.c.o non flow diff press high"
                />
              </div>

              <div className="col-span-10 row-span-6 grid grid-rows-subgrid">
                <div className="col-start-1 col-end-2 row-span-6 row-start-1 row-end-7 flex items-start">
                  <div className="relative w-full">
                    <Image
                      src={imageAmsMainEngine}
                      alt="main engine image"
                      className="ml-[11px] w-full lg:h-[385px] xl:h-[494px] 2xl:h-[494px] 3xl:h-full"
                    />
                    <METitleValueCard
                      label={RPM_TAG}
                      className="absolute bottom-[25%] right-[12%] translate-x-1/2 translate-y-1/2"
                      valueBox="dark"
                    />
                    <div className="absolute bottom-[25%] right-[4.3%] flex h-[220px] w-[60px] translate-x-1/2 translate-y-1/2">
                      <PropellerView
                        label={RPM_TAG}
                      />
                    </div>
                    {/*
                    <div className="fixed inset-0 z-100 w-screen h-screen flex">
                      <PropellerView />
                    </div>
                    */}
                  </div>
                </div>
                <div className="col-start-1 col-end-2 row-start-1 row-end-7 grid w-[75.21%] grid-rows-subgrid px-[1.6%]">
                  <div className="row-start-1 row-end-7 grid h-full w-full grid-cols-6 grid-rows-subgrid gap-x-[5.96%] px-[5.96%]">
                    <div className="col-span-6 grid grid-cols-subgrid place-items-center">
                      <MEDiagramValue label={ME.Tag14} />
                      <MEDiagramValue label={ME.Tag15} />
                      <MEDiagramValue label={ME.Tag16} />
                      <MEDiagramValue label={ME.Tag17} />
                      <MEDiagramValue label={ME.Tag18} />
                      <MEDiagramValue label={ME.Tag19} />
                    </div>
                    <div className="col-span-6 grid grid-cols-subgrid place-items-center">
                      <MEDiagramValue label={ME.Tag20} />
                      <MEDiagramValue label={ME.Tag21} />
                      <MEDiagramValue label={ME.Tag22} />
                      <MEDiagramValue label={ME.Tag23} />
                      <MEDiagramValue label={ME.Tag24} />
                      <MEDiagramValue label={ME.Tag25} />
                    </div>
                    <div className="col-span-6 grid grid-cols-subgrid place-items-center">
                      <MEDiagramValue label={ME.Tag26} />
                      <MEDiagramValue label={ME.Tag27} />
                      <MEDiagramValue label={ME.Tag28} />
                      <MEDiagramValue label={ME.Tag29} />
                      <MEDiagramValue label={ME.Tag30} />
                      <MEDiagramValue label={ME.Tag31} />
                    </div>
                    <div className="col-span-6 grid grid-cols-subgrid place-items-center">
                      <MEDiagramValue label={ME.Tag32} />
                      <MEDiagramValue label={ME.Tag33} />
                      <MEDiagramValue label={ME.Tag34} />
                      <MEDiagramValue label={ME.Tag35} />
                      <MEDiagramValue label={ME.Tag36} />
                      <MEDiagramValue label={ME.Tag37} />
                    </div>
                    <div className="col-span-6 grid grid-cols-subgrid place-items-center">
                      <MEDiagramValue label={ME.Tag38} />
                      <MEDiagramValue label={ME.Tag39} />
                      <MEDiagramValue label={ME.Tag40} />
                      <MEDiagramValue label={ME.Tag41} />
                      <MEDiagramValue label={ME.Tag42} />
                      <MEDiagramValue label={ME.Tag43} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="__last-row 2xl:mt[-234px] col-span-4 grid grid-cols-subgrid lg:mt-[-230px] xl:mt-[-110px] 3xl:mt-0">
            <DataCard label={ME.Tag47} />
            <DataCard label={ME.Tag44} />
            <DataCard label={ME.Tag45} />
            <DataCard label={ME.Tag46} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainEngine;
