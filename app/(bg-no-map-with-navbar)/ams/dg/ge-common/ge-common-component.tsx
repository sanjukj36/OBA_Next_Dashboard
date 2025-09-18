import { twMerge } from "tailwind-merge";
import {
  AmsAlertStatusButton,
  TripConditionStatusButton
} from "@/components/ams/g-e-common/ams-g-e-common-card";
import { ErrorComponent } from "@/components/dashboard/overview-black/error-display";
import { TagAssignComponent } from "@/components/tag-assign";
import {
  BoolResponseStatusKeys,
  BoolResponseType
} from "@/components/tag-assign/single-tag-form";
import { Separator } from "@/components/ui/separator";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { TagDataType } from "@/types/tag-assign";
import { GE } from "./ge-taglist";
import { DynamicTextComponent } from "@/app/(bg-no-map)/dashboard/overview/components/dynamic-text-component";
import { useAuth } from "@/provider/auth-provider";

export default function GECommonComponent() {
  return (
    <div className="col-span-2 col-start-1">
      <div className="flex h-full">
        <div className="flex h-[885px] w-[48.83%] rounded-lg xl:h-[885px] 3xl:h-[888px]">
          <div className="grid flex-1 grid-cols-[3fr,1fr,1fr,1fr,1fr] grid-rows-[24px,min-content,auto] gap-x-4 gap-y-2 rounded-lg border border-neutral-400 bg-gradient-to-b from-black to-neutral-900 px-[20px] xl:px-[30px] 3xl:px-[63px]">
            <div className="col-span-5 grid grid-cols-subgrid py-2 font-alexandria text-[10px] font-semibold uppercase text-white xl:text-[10px] 3xl:text-[14px]">
              <div>ITEMS</div>
              <DynamicTextComponent label={GE.Tag284} defaultTitle="NO 1" hideForUser />
              <DynamicTextComponent label={GE.Tag285} defaultTitle="NO 2" hideForUser />
              <DynamicTextComponent label={GE.Tag286} defaultTitle="NO 3" hideForUser />
              <DynamicTextComponent label={GE.Tag287} defaultTitle="NO 4" hideForUser />
            </div>

            <div className="col-span-5">
              <div className="w-full pe-[30px]">
                <Separator
                  orientation="horizontal"
                  className="bg-muted-foreground"
                />
              </div>
            </div>

            <div className="scrollbar-none col-span-5 grid auto-rows-[min-content] grid-cols-subgrid items-center gap-y-2 overflow-auto">
              <TableRowItems
                label={GE.Tag1}
                label1={GE.Tag2}
                label2={GE.Tag3}
                label3={GE.Tag4}
                label4={GE.Tag5}
              />
              <TableRowItems
                label={GE.Tag6}
                label1={GE.Tag7}
                label2={GE.Tag8}
                label3={GE.Tag9}
                label4={GE.Tag10}
              />
              <TableRowItems
                label={GE.Tag11}
                label1={GE.Tag12}
                label2={GE.Tag13}
                label3={GE.Tag14}
                label4={GE.Tag15}
              />
              <TableRowItems
                label={GE.Tag16}
                label1={GE.Tag17}
                label2={GE.Tag18}
                label3={GE.Tag19}
                label4={GE.Tag20}
              />
              <TableRowItems
                label={GE.Tag21}
                label1={GE.Tag22}
                label2={GE.Tag23}
                label3={GE.Tag24}
                label4={GE.Tag25}
              />
              <TableRowItems
                label={GE.Tag26}
                label1={GE.Tag27}
                label2={GE.Tag28}
                label3={GE.Tag29}
                label4={GE.Tag30}
              />
              <TableRowItems
                label={GE.Tag31}
                label1={GE.Tag32}
                label2={GE.Tag33}
                label3={GE.Tag34}
                label4={GE.Tag35}
              />
              <TableRowItems
                label={GE.Tag36}
                label1={GE.Tag37}
                label2={GE.Tag38}
                label3={GE.Tag39}
                label4={GE.Tag40}
              />
              <TableRowItems
                label={GE.Tag41}
                label1={GE.Tag42}
                label2={GE.Tag43}
                label3={GE.Tag44}
                label4={GE.Tag45}
              />
              <TableRowItems
                label={GE.Tag46}
                label1={GE.Tag47}
                label2={GE.Tag48}
                label3={GE.Tag49}
                label4={GE.Tag50}
              />
              <TableRowItems
                label={GE.Tag51}
                label1={GE.Tag52}
                label2={GE.Tag53}
                label3={GE.Tag54}
                label4={GE.Tag55}
              />
              <TableRowItems
                label={GE.Tag56}
                label1={GE.Tag57}
                label2={GE.Tag58}
                label3={GE.Tag59}
                label4={GE.Tag60}
              />
              <TableRowItems
                label={GE.Tag61}
                label1={GE.Tag62}
                label2={GE.Tag63}
                label3={GE.Tag64}
                label4={GE.Tag65}
              />
              <TableRowItems
                label={GE.Tag66}
                label1={GE.Tag67}
                label2={GE.Tag68}
                label3={GE.Tag69}
                label4={GE.Tag70}
              />
              <TableRowItems
                label={GE.Tag71}
                label1={GE.Tag72}
                label2={GE.Tag73}
                label3={GE.Tag74}
                label4={GE.Tag75}
              />
              <TableRowItems
                label={GE.Tag76}
                label1={GE.Tag77}
                label2={GE.Tag78}
                label3={GE.Tag79}
                label4={GE.Tag80}
              />
              <TableRowItems
                label={GE.Tag81}
                label1={GE.Tag82}
                label2={GE.Tag83}
                label3={GE.Tag84}
                label4={GE.Tag85}
              />
              <TableRowItems
                label={GE.Tag86}
                label1={GE.Tag87}
                label2={GE.Tag88}
                label3={GE.Tag89}
                label4={GE.Tag90}
              />
              <TableRowItems
                label={GE.Tag91}
                label1={GE.Tag92}
                label2={GE.Tag93}
                label3={GE.Tag94}
                label4={GE.Tag95}
              />
              <TableRowItems
                label={GE.Tag96}
                label1={GE.Tag97}
                label2={GE.Tag98}
                label3={GE.Tag99}
                label4={GE.Tag100}
              />
              <TableRowItems
                label={GE.Tag101}
                label1={GE.Tag102}
                label2={GE.Tag103}
                label3={GE.Tag104}
                label4={GE.Tag105}
              />
              <TableRowItems
                label={GE.Tag106}
                label1={GE.Tag107}
                label2={GE.Tag108}
                label3={GE.Tag109}
                label4={GE.Tag110}
              />
              <TableRowItems
                label={GE.Tag111}
                label1={GE.Tag112}
                label2={GE.Tag113}
                label3={GE.Tag114}
                label4={GE.Tag115}
              />
              <TableRowItems
                label={GE.Tag116}
                label1={GE.Tag117}
                label2={GE.Tag118}
                label3={GE.Tag119}
                label4={GE.Tag120}
              />
              <TableRowItems
                label={GE.Tag121}
                label1={GE.Tag122}
                label2={GE.Tag123}
                label3={GE.Tag124}
                label4={GE.Tag125}
              />
              <TableRowItems
                label={GE.Tag126}
                label1={GE.Tag127}
                label2={GE.Tag128}
                label3={GE.Tag129}
                label4={GE.Tag130}
              />
              <TableRowItems
                label={GE.Tag131}
                label1={GE.Tag132}
                label2={GE.Tag133}
                label3={GE.Tag134}
                label4={GE.Tag135}
              />
              <TableRowItems
                label={GE.Tag136}
                label1={GE.Tag137}
                label2={GE.Tag138}
                label3={GE.Tag139}
                label4={GE.Tag140}
              />
              <TableRowItems
                label={GE.Tag141}
                label1={GE.Tag142}
                label2={GE.Tag143}
                label3={GE.Tag144}
                label4={GE.Tag145}
              />
              <TableRowItems
                label={GE.Tag146}
                label1={GE.Tag147}
                label2={GE.Tag148}
                label3={GE.Tag149}
                label4={GE.Tag150}
              />
              <TableRowItems
                label={GE.Tag151}
                label1={GE.Tag152}
                label2={GE.Tag153}
                label3={GE.Tag154}
                label4={GE.Tag155}
              />
              <TableRowItems
                label={GE.Tag156}
                label1={GE.Tag157}
                label2={GE.Tag158}
                label3={GE.Tag159}
                label4={GE.Tag160}
              />
              <TableRowItems
                label={GE.Tag161}
                label1={GE.Tag162}
                label2={GE.Tag163}
                label3={GE.Tag164}
                label4={GE.Tag165}
              />
              <TableRowItems
                label={GE.Tag166}
                label1={GE.Tag167}
                label2={GE.Tag168}
                label3={GE.Tag169}
                label4={GE.Tag170}
              />
              <TableRowItems
                label={GE.Tag171}
                label1={GE.Tag172}
                label2={GE.Tag173}
                label3={GE.Tag174}
                label4={GE.Tag175}
              />
            </div>
          </div>
        </div>

        <div className="mx-[4px] w-[51.19%]">
          {/* generator 1 */}
          <GeneratorItemComponent heading={{ l: GE.Tag288, defaultTitle: "GENERATOR 1"}}
            l1={GE.Tag176}
            l2={GE.Tag177}
            l3={GE.Tag178}
            l4={GE.Tag179}
            l5={GE.Tag180}
            l6={GE.Tag181}
            l7={GE.Tag182}
            l8={GE.Tag183}
            l9={GE.Tag184}
           l10={GE.Tag185}
           l11={GE.Tag186}
           l12={GE.Tag187}
           l13={GE.Tag188}
           l14={GE.Tag189}
           l15={GE.Tag190}
           l16={GE.Tag191}
           l17={GE.Tag192}
           l18={GE.Tag193}
           l19={GE.Tag194}
           l20={GE.Tag195}
           l21={GE.Tag196}
           l22={GE.Tag197}
           l23={GE.Tag198}
           l24={GE.Tag199}
           l25={GE.Tag200}
           l26={GE.Tag201}
           l27={GE.Tag202}
          />
          {/* end generator 1 */}

          {/* generator 2 */}
          <GeneratorItemComponent heading={{ l: GE.Tag289, defaultTitle: "GENERATOR 2"}}
            l1={GE.Tag203}
            l2={GE.Tag204}
            l3={GE.Tag205}
            l4={GE.Tag206}
            l5={GE.Tag207}
            l6={GE.Tag208}
            l7={GE.Tag209}
            l8={GE.Tag210}
            l9={GE.Tag211}
           l10={GE.Tag212}
           l11={GE.Tag213}
           l12={GE.Tag214}
           l13={GE.Tag215}
           l14={GE.Tag216}
           l15={GE.Tag217}
           l16={GE.Tag218}
           l17={GE.Tag219}
           l18={GE.Tag220}
           l19={GE.Tag221}
           l20={GE.Tag222}
           l21={GE.Tag223}
           l22={GE.Tag224}
           l23={GE.Tag225}
           l24={GE.Tag226}
           l25={GE.Tag227}
           l26={GE.Tag228}
           l27={GE.Tag229}
          />
          {/* end generator 2 */}

          <GeneratorItemComponent heading={{ l: GE.Tag290, defaultTitle: "GENERATOR 3"}}
            l1={GE.Tag230}
            l2={GE.Tag231}
            l3={GE.Tag232}
            l4={GE.Tag233}
            l5={GE.Tag234}
            l6={GE.Tag235}
            l7={GE.Tag236}
            l8={GE.Tag237}
            l9={GE.Tag238}
           l10={GE.Tag239}
           l11={GE.Tag240}
           l12={GE.Tag241}
           l13={GE.Tag242}
           l14={GE.Tag243}
           l15={GE.Tag244}
           l16={GE.Tag245}
           l17={GE.Tag246}
           l18={GE.Tag247}
           l19={GE.Tag248}
           l20={GE.Tag249}
           l21={GE.Tag250}
           l22={GE.Tag251}
           l23={GE.Tag252}
           l24={GE.Tag253}
           l25={GE.Tag254}
           l26={GE.Tag255}
           l27={GE.Tag256}
          />
          {/* generator 3 */}
          {/* end generator 3 */}

          {/* generator 4 */}
          <GeneratorItemComponent heading={{ l: GE.Tag291, defaultTitle: "GENERATOR 4"}}
            l1={GE.Tag257}
            l2={GE.Tag258}
            l3={GE.Tag259}
            l4={GE.Tag260}
            l5={GE.Tag261}
            l6={GE.Tag262}
            l7={GE.Tag263}
            l8={GE.Tag264}
            l9={GE.Tag265}
           l10={GE.Tag266}
           l11={GE.Tag267}
           l12={GE.Tag268}
           l13={GE.Tag269}
           l14={GE.Tag270}
           l15={GE.Tag271}
           l16={GE.Tag272}
           l17={GE.Tag273}
           l18={GE.Tag274}
           l19={GE.Tag275}
           l20={GE.Tag276}
           l21={GE.Tag277}
           l22={GE.Tag278}
           l23={GE.Tag279}
           l24={GE.Tag280}
           l25={GE.Tag281}
           l26={GE.Tag282}
           l27={GE.Tag283}
          />
          {/* end generator 4 */}
        </div>
      </div>
    </div>
  );
}

type GeneratorItemComponentProps  = {
  heading: { l: string; defaultTitle: string };
  l1: string; l2: string; l3: string; l4: string; l5: string; l6: string; l7: string; l8: string; l9: string; l10: string; l11: string; l12: string; l13: string; l14: string; l15: string; l16: string; l17: string; l18: string; l19: string; l20: string; l21: string; l22: string; l23: string; l24: string; l25: string; l26: string; l27: string;
}
function GeneratorItemComponent({
  heading,
  l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17, l18, l19, l20, l21, l22, l23, l24, l25, l26, l27,
}: GeneratorItemComponentProps) {

  const { data: latestData, isError } = useLatestDataByLabel(heading.l);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  const { user } = useAuth()

  if (
    !user?.is_superuser &&
      (isError || !description)
  ) {
    return null;
  }

  return (
    <div className="mb-[9px] h-[215px] w-full rounded-lg border border-neutral-400 bg-gradient-to-b from-black to-neutral-900 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="me-[20px] ms-[12px] mt-3 grid grid-cols-[1fr,auto,1fr,1fr] xl:ms-[20px] 3xl:ms-[29px]">
        <div className="relative flex h-[19.56px] w-[87.01px] items-center justify-center rounded-[10px] border border-neutral-700 shadow-[0px_0px_6.3px_0.5px_rgba(232,232,232,1.00)] xl:h-[24.56px] xl:w-[109.22px] 3xl:h-[32px] 3xl:w-[165px]">
          <DynamicTextComponent label={heading.l} defaultTitle={heading.defaultTitle} className="font-alexandria text-[9px] xl:text-[10px] 3xl:text-[15px]" />
        </div>

        <div className="col-span-3">
          <div className="gacp-x-4 gapc-y-2 grid h-[14.06px] flex-1 grid-cols-[1.3fr,4.5fr] grid-rows-[24px,min-content,auto] rounded-md bg-[#D9D9D933]/20 xl:h-[17.65px] 3xl:h-[23px]">
            <div className="pdy-2 col-span-2 grid grid-cols-subgrid font-alexandria text-[10px] font-semibold uppercase text-white xl:text-[10px] 3xl:text-[14px]">
              <div className="ms-4">ITEMS</div>
              <div className="grid h-[14.06px] grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] rounded-md bg-[#D9D9D933]/20 ps-4 xl:h-[17.65px] 3xl:h-[23px]">
                <div className="col-span-9 grid grid-cols-subgrid text-[9px] xl:text-[10px] 3xl:gap-[22px] 3xl:text-[15px]">
                  <div>NO 1</div>
                  <div>NO 2</div>
                  <div>NO 3</div>
                  <div>NO 4</div>
                  <div>NO 5</div>
                  <div>NO 6</div>
                  <div>NO 7</div>
                  <div>NO 8</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[23px]">
          <span className="font-alexandria text-[9px] xl:text-[10px] 3xl:text-[15px]">
            TRIP CONDITION
          </span>
        </div>

        <div className="row-span-2 mt-[1px]">
          <TableCardTitle
            label={l1}
            className="col-start-1 col-end-2 row-start-2 row-end-3 w-[69px] min-w-[10px] font-alexandria text-[9px] xl:w-[110px] xl:text-[10px] 3xl:w-[163px] 3xl:text-[15px]"
          />
          <TableCardTitle
            label={l2}
            className="col-start-1 col-end-2 row-start-3 row-end-4 mt-3 w-[69px] font-alexandria text-[9px] xl:w-[110px] xl:text-[10px] 3xl:mt-1 3xl:w-[163px] 3xl:text-[15px]"
          />
        </div>

        <div className="col-span-2 row-span-1">
          <div className="grid grid-cols-8 place-items-center gap-[10.55px] px-2 text-[8px] xl:gap-[13.24px] xl:text-[10px] 3xl:gap-[26px] 3xl:text-[15px]">
            <TableCardValue
              label={l3}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l4}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l5}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l6}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l7}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l8}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l9}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l10}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
          </div>
          <div className="mt-[10px] grid grid-cols-8 place-items-center gap-[10.55px] px-2 text-[8px] xl:gap-[13.24px] xl:text-[10px] 3xl:gap-[26px] 3xl:text-[15px]">
            <TableCardValue
              label={l11}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l12}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l13}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l14}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l15}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l16}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l17}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
            <TableCardValue
              label={l18}
              className="w-[25px] xl:w-[32.43px] 3xl:w-[49px]"
            />
          </div>
        </div>

        <div className="row-span-2 font-alexandria text-[9px] xl:text-[10px] 3xl:text-[15px]">
          <TripConditionValue label={l19} />
          <TripConditionValue label={l20} />
        </div>

        <div className="bg-yelslow-400 col-span-2 col-start-3 row-span-3 mt-[18px]">
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <ExhGasMeanItem label={l21} />
              <div className="relative mt-[8px] w-[155px] rounded-md bg-[#D9D9D933]/20 pb-[2px] xl:w-[208.1px] 3xl:w-[328px]">
                <div className="ms-2 grid grid-cols-1 gap-[11px] pt-[5px] 3xl:ms-[20px]">
                  <div className="flex-1">
                    <EngineSpeedItems label={l22} />
                    <EngineSpeedItems label={l23} />
                  </div>
                </div>
              </div>
            </div>

            <div className="ms-1 h-[73px] w-[86.48px] rounded-md bg-neutral-900 shadow-[2px_2px_4px_0px_rgba(0,0,0,1.00)] xl:h-[88.3px] xl:w-[104.55px] 3xl:me-[32px] 3xl:h-[89px] 3xl:w-[164px]">
              <div className="flex-1 items-center text-center">
                <span className="items-center font-alexandria text-[7px] text-input xl:text-[9px] 3xl:ms-2 3xl:text-[13px]">
                  WINDING TEMP [°C]{" "}
                </span>
                <WindingTempItem label={l24} />
                <WindingTempItem label={l25} />
                <WindingTempItem label={l26} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <ExhGasMeanItem label={l27} />
        </div>
      </div>
    </div>
  )
}

const TableCardTitle = ({
  label,
  className
}: {
  label: string;
  className: string;
}) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  return (
    <div className={twMerge("relative", className)}>
      {description ?? "__"}
      <TagAssignComponent tag={label} type="single" side={"bottom"} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

const TableCardValue = ({
  label,
  className
}: {
  label: string;
  className?: string;
}) => {
  const {
    data: latestData,
    isError
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value, response_type } = data || {};

  const { user } = useAuth()

  const { description } = data || {};

  if ( !user?.is_superuser && (isError || dataArray?.length === 0)) {
    return null;
  }

  const valueClassNames =
    datatype === TagDataType.Float &&
    minimum !== null &&
    maximum !== null &&
    (Number(value) < minimum || Number(value) > maximum)
      ? "bg-[#AF0000]/60 text-white"
      : "bg-black text-white";

  const alertStatusType = response_type && response_type[value];

  return (
    <>
      {datatype === TagDataType.Bool ? (
        <div className={twMerge("relative", className)}>
          <AmsAlertStatusButton
            type={alertStatusType}
            className=""
            description={description}
          />

          <TagAssignComponent tag={label} type="single" side={"bottom"} />
        </div>
      ) : (
        <div
          className={twMerge(
            "relative flex min-h-4 min-w-[22px] max-w-[68px] items-center justify-center rounded-[5px] border border-neutral-400 bg-black text-[8px] shadow-[0px_0px_2px_1px_rgba(148,148,148,1.00)] xl:text-[10px] 3xl:text-[12px]",
            valueClassNames,
            className
          )}
        >
          <span>{value}</span>

          <TagAssignComponent tag={label} type="single" side={"bottom"} />
        </div>
      )}
    </>
  );
};

const TripConditionValue = ({ label }: { label: string }) => {
  const {
    data: latestData,
    error,
    refetch
  } = useLatestDataByLabel<BoolResponseType, BoolResponseStatusKeys>(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { datatype, minimum, maximum, value, response_type } = data || {};

  const { description } = data || {};

  const valueClassNames =
    datatype === TagDataType.Float &&
    minimum !== null &&
    maximum !== null &&
    (Number(value) < minimum || Number(value) > maximum)
      ? "bg-[#AF0000]/60 text-white"
      : "bg-black text-white";

  const alertStatusType = response_type && response_type[value];
  return (
    <>
      {datatype === TagDataType.Bool ? (
        <div className="relative my-2 min-h-[23px] min-w-[148px]">
          <TripConditionStatusButton
            type={alertStatusType}
            description={description}
          />

          <TagAssignComponent tag={label} type="single" side={"bottom"} />
          {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
        </div>
      ) : (
        <div
          className={twMerge(
            "relative flex min-h-[23px] min-w-[148px] rounded-[5px] border border-neutral-400 bg-black text-[12px] shadow-[0px_0px_2px_1px_rgba(148,148,148,1.00)]",
            valueClassNames
          )}
        >
          <span>{value ? value : "__"}</span>

          <TagAssignComponent tag={label} type="single" side={"left"} />
          {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
        </div>
      )}
    </>
  );
};

const WindingTempItem = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description } = data || {};

  return (
    <div className="relative mt-[1px] flex items-center justify-evenly font-alexandria 3xl:space-x-1">
      <span className="max-w-max truncate text-[7px] text-input xl:text-[9px] 3xl:ms-2 3xl:text-[10px]">
        {description ?? "__"}
      </span>
      <div className="flex items-center justify-center rounded-sm border-[0.2px] border-black/80 bg-[#515151] px-[4px] py-[1px]">
        <span className="text-[7px] text-input xl:text-[9px] 3xl:ms-2 3xl:text-[10px]">
          {value ?? "__"}
        </span>
      </div>
      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

const ExhGasMeanItem = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description, unit } = data || {};

  return (
    <div className="relative h-[15px] w-[156px] rounded-md font-alexandria text-[9px] xl:h-[17.64px] xl:w-[207.11px] xl:text-[10px] 3xl:h-[23px] 3xl:w-[328px] 3xl:text-[14px]">
      <div className="absolute left-0 top-0 h-full w-full rounded-md bg-zinc-300/20 shadow-[2px_2px_4px_0px_rgba(0,0,0,1.00)]">
        <span className="absolute left-[8.87px] top-1/2 -translate-y-1/2 xl:left-[19.87px] 3xl:left-[19.87px]">
          {description ?? "__"}
        </span>

        <div className="absolute left-[99px] top-0 flex h-full w-[58px] items-center justify-center rounded-md bg-zinc-300/20 xl:left-[119px] xl:w-[88.16px] 3xl:left-[190.84px] 3xl:w-[137.16px]">
          <div className="text-[9px] xl:text-[10px] 3xl:text-[15px]">
            {value ?? "__"} {unit ?? "__"}
          </div>
        </div>
      </div>

      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

const EngineSpeedItems = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value, description, unit } = data || {};

  return (
    <div className="relative mb-[3px] flex font-alexandria text-[9px] xl:text-[10px] 3xl:text-[11px]">
      <div className="w-[172px]">{description ?? "__"}</div>
      <div className="flex items-center justify-center">
        <div className="me-[1px] ml-auto flex h-[22px] w-[32px] items-center justify-center rounded-[5px] bg-[#D9D9D933] p-0.5 text-center xl:me-[4px] xl:w-[32px] 3xl:me-[15px] 3xl:w-[61px]">
          <p className="text-[9px] leading-[100%] xl:text-[10px] 3xl:text-[14px]">
            {value ?? "__"}
          </p>
        </div>
        <span className="flex h-[22px] w-[60px] items-center justify-center">
          {unit ?? "__"}
        </span>
      </div>

      <TagAssignComponent type="single" tag={label} />
      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
    </div>
  );
};

type TableRowItemsProps = {
  label: string;
  label1: string;
  label2: string;
  label3: string;
  label4: string;
  className?: string;
};

const TableRowItems = ({
  label,
  label1,
  label2,
  label3,
  label4,
  className
}: TableRowItemsProps) => {
  const { data: latestData } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description, unit, datatype } = data || {};

  return (
    <div className="col-span-5 grid min-h-6 grid-cols-subgrid items-center justify-start font-alexandria text-[10px] xl:text-[10px] 3xl:text-[14px]">
      <div className={twMerge("relative flex", className)}>
        {description ?? " "}
        <TagAssignComponent tag={label} type="single" side={"bottom"} />
        {datatype === TagDataType.Float && (
          <span className="ml-auto">{unit && `[${unit}]`}</span>
        )}
      </div>
      {description ? (
        <>
          <TableCardValue
            label={label1}
            className="font-alexandria text-[10px] xl:text-[10px] 3xl:text-[14px]"
          />
          <TableCardValue
            label={label2}
            className="font-alexandria text-[10px] xl:text-[10px] 3xl:text-[14px]"
          />
          <TableCardValue
            label={label3}
            className="font-alexandria text-[10px] xl:text-[10px] 3xl:text-[14px]"
          />
          <TableCardValue
            label={label4}
            className="font-alexandria text-[10px] xl:text-[10px] 3xl:text-[14px]"
          />
        </>
      ) : null}
    </div>
  );
};
