import { GaugeCard } from "./gauge-card";

type TagType = {
  title: string;
  tag: string;
};

type GaugeCardListProps = {
  data1: TagType;
  data2: TagType;
  data3: TagType;
};

export const GaugeCardList = (props: GaugeCardListProps) => {
  return (
    <div className="relative isolate flex justify-around p-0">
      <GaugeCard title={props.data1.title} tag={props.data1.tag} />
      <GaugeCard title={props.data2.title} tag={props.data2.tag} />
      <GaugeCard title={props.data3.title} tag={props.data3.tag} />
    </div>
  );
};
