// import { PopoverContentProps } from "@radix-ui/react-popover";
// import { twMerge } from "tailwind-merge";
// import { TagAssignComponent } from "@/components/tag-assign";
// // import {
// //   // AmsCard,
// //   AmsCardContent,
// //   // AmsCardHeader,
// //   p,
// //   AmsCardValue
// // } from "@/components/ui/ams-card";
// import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
// import { ErrorComponent } from "../../dashboard/overview-black/error-display";
// import {
//   AmsCard,
//   AmsCardContent,
//   AmsCardDescription,
//   AmsCardHeader,
//   AmsCardRowAlert,
//   AmsCardValue
// } from "./ams-card";

// export const DataCard = ({
//   label,
//   title,
//   className,
//   side = "left"
// }: {
//   label: string;
//   title?: string;
//   className?: string;
//   side?: PopoverContentProps["side"];
// }) => {
//   const { data: latestData, error, refetch } = useLatestDataByLabel(label);
//   const { data } = latestData || {};

//   return (
//     <AmsCard
//       className={twMerge("relative isolate max-h-[224px] w-full", className)}
//     >
//       <AmsCardHeader />
//       {data && data.length > 0 ? (
//         <AmsCardContent className="scrollbar-none max-h-[inherit] overflow-y-auto py-0.5">
//           {data.map((item, index) => {
//             return (
//               // <div className="me-[120px] flex flex-col gap-1.5 font-alexandria text-sm font-normal leading-none tracking-tight text-white">
//               <div className="col-span-3 grid grid-cols-subgrid items-start gap-2 font-alexandria text-sm font-normal leading-[100%] text-white">
//                 {/* <AmsCardValue key={index} {...item} /> */}
//                 <div className="flex items-center justify-between">
//                   <AmsCardDescription key={index} {...item} />
//                   <div className="flex gap-[70px]">
//                     {/* <AmsCardDescription key={index} {...item} /> */}
//                     <AmsCardRowAlert key={index} {...item} />
//                     <p>NO 1</p>
//                     <p>NO 2</p>
//                     <p>NO 3</p>
//                     <p>NO 4</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </AmsCardContent>
//       ) : (
//         <AmsCardContent className="scrollbar-none max-h-[inherit] overflow-y-auto text-white">
//           No data found.
//         </AmsCardContent>
//       )}
//       <TagAssignComponent tag={label} type="multiple" side={side} />
//       {error && <ErrorComponent error={error.message} refetch={refetch} />}
//     </AmsCard>
//   );
// };
