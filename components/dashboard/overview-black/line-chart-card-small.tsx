import * as React from "react";
import { format, subDays } from "date-fns";
import { IconExpand } from "@/components/icons/expand";
import { TagAssignComponent } from "@/components/tag-assign";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { App } from "@/lib/constants";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { useTrend } from "@/queries/use-trend";
import { useShowTrend } from "../trends/trend-context";
import { ErrorComponent } from "./error-display";
import { LineChartSmall } from "./line-chart-small";

type LineChartCardSmallTagAssignProps = {
  label: string;
  title?: string;
};

export function LineChartCardSmallTagAssign({
  label,
  title
}: LineChartCardSmallTagAssignProps) {
  const {
    data: latestData,
    error,
    refetch,
    isLoading
  } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [item1, item2, item3, item4] = dataArray || [];

  const from_date = format(
    subDays(new Date(), App.SmallLineChartDefaultDuration),
    "dd-MM-yyyy"
  );
  const to_date = format(new Date(), "dd-MM-yyyy");
  const {
    data: chartData,
    error: chartDataError,
    isLoading: chartDataIsLoading
  } = useTrend({
    tag1: item1?.tag_from_vessel,
    from_date,
    to_date,
    tag2: item2?.tag_from_vessel,
    tag3: item3?.tag_from_vessel,
    tag4: item4?.tag_from_vessel
  });

  return (
    <Card className="relative h-[180px] w-full rounded-[15px] border border-[#0C0C0C] bg-black p-[7px] shadow-[0px_0px_2px_0px_#E8E8E8] sm:h-[190px] sm:w-[250px] md:h-[220px] md:w-[270px] lg:left-[-13px] lg:h-auto lg:w-[250px] xl:left-[-13px] xl:h-auto xl:w-[358px] 2xl:h-[247px] 2xl:w-[419px] 3xl:left-0 3xl:h-full 3xl:w-[558px]">
      <div className="flex h-full w-full flex-col rounded-[18px] bg-linear-black-overview-card p-0.5">
        <div className="relative isolate flex h-full w-full flex-col rounded-[14px] bg-black">
          {chartData && (
            <React.Fragment>
              <LineChartCardHeader
                title={title ?? item1?.description ?? "__"}
                tag1={item1.tag_from_vessel}
                tag2={item2?.tag_from_vessel}
                tag3={item3?.tag_from_vessel}
                tag4={item4?.tag_from_vessel}
                label1={item1?.description}
                label2={item2?.description}
                label3={item3?.description}
                label4={item4?.description}
              />
              <CardContent className="relative p-0 px-0 py-0">
                <LineChartSmall
                  label1={item1.description}
                  label2={item2?.description}
                  label3={item3?.description}
                  label4={item4?.description}
                  data={chartData.trend}
                />
              </CardContent>
            </React.Fragment>
          )}
          {(isLoading || chartDataIsLoading) && (
            <Skeleton className="absolute inset-0 h-full w-full" />
          )}
          <LineChartBgCartesianGrid />
        </div>
      </div>
      {(chartDataError || error) && (
        <ErrorComponent
          key={label} error={
            chartDataError
              ? chartDataError.message
              : error
                ? error.message
                : "Unkown error occured"
          }
          refetch={refetch}
        />
      )}
      <TagAssignComponent type="multiple" tag={label} side="top" />
    </Card>
  );
}

type LineChartCardSmallProps = {
  title: string;
  tag1: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  label1: string;
  label2?: string;
  label3?: string;
  label4?: string;
};

export function LineChartCardSmall({
  title,
  tag1,
  tag2,
  tag3,
  tag4,
  label1,
  label2,
  label3,
  label4
}: LineChartCardSmallProps) {
  const from_date = format(subDays(new Date(), 1), "dd-MM-yyyy");
  const to_date = format(new Date(), "dd-MM-yyyy");
  const { data, error, refetch } = useTrend({
    tag1,
    from_date,
    to_date,
    tag2,
    tag3,
    tag4
  });

  return (
    <Card className="relative h-[180px] w-full rounded-[15px] border border-[#0C0C0C] bg-black p-[7px] shadow-[0px_0px_2px_0px_#E8E8E8] sm:h-[190px] sm:w-[250px] md:h-[200px] md:w-[270px] lg:left-[-13px] lg:h-auto lg:w-[291px] xl:left-[-13px] xl:h-auto xl:w-[372px] 2xl:h-[240px] 2xl:w-[450px] 3xl:left-0 3xl:h-full 3xl:w-[558px]">
      <div className="flex h-full w-full flex-col rounded-[13px] bg-linear-black-overview-card p-0.5">
        <div className="relative isolate flex h-full w-full flex-col rounded-[16px] bg-black">
          <LineChartCardHeader
            title={title}
            tag1={tag1}
            tag2={tag2}
            tag3={tag3}
            tag4={tag4}
            label1={label1}
            label2={label2}
            label3={label3}
            label4={label4}
          />
          <LineChartBgCartesianGrid />
          <CardContent className="relative p-0 px-0 py-0">
            <LineChartSmall
              label1={label1}
              label2={label2}
              label3={label3}
              label4={label4}
              data={data?.trend}
            />
          </CardContent>
        </div>
      </div>
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </Card>
  );
}

function LineChartCardHeader({
  title,
  tag1,
  tag2,
  tag3,
  tag4,
  label1,
  label2,
  label3,
  label4
}: {
  title: string;
  tag1: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  label1?: string;
  label2?: string;
  label3?: string;
  label4?: string;
}) {
  const { setShowTrendModal, setTrendTagName } = useShowTrend();
  const handleClick = () => {
    setShowTrendModal(true);
    setTrendTagName({
      tag1,
      tag2,
      tag3,
      tag4,
      tag1Label: label1,
      tag2Label: label2,
      tag3Label: label3,
      tag4Label: label4
    });
  };
  return (
    <CardHeader className="flex flex-row items-center justify-between px-5 pb-0 pt-5">
      <h3 className="font-russo font-normal uppercase text-foreground lg:text-[15px] xl:text-[18px] 2xl:text-[14px] 3xl:text-xl">
        {" "}
        {title}{" "}
      </h3>
      <button
        onClick={handleClick}
        className="rounded border border-primary p-1"
      >
        <IconExpand className="h-5 w-5" />
      </button>
    </CardHeader>
  );
}

export function LineChartBgCartesianGrid() {
  return (
    <div className="pointer-events-none absolute inset-[10px] z-0 overflow-hidden rounded-lg">
      <svg width="100%" height="100%">
        {[...Array(100)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${i * 8}`}
            y1="0"
            x2={`${i * 8}`}
            y2="100%"
            stroke="white"
            strokeWidth="0.1"
          />
        ))}
        {[...Array(100)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${i * 8}`}
            x2="100%"
            y2={`${i * 8}`}
            stroke="white"
            strokeWidth="0.1"
          />
        ))}
      </svg>
    </div>
  );
}
