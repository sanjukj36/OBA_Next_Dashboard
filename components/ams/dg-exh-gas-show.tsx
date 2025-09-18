import React from "react";

function DgEXHGasMesurment() {
  return (
    <div className="mt-14 flex w-[818.5px]">
      <div className="flex-1">
        <div className="relative mt-2 h-[19.92px] w-[114.99px] rounded-md">
          <div className="absolute left-0 top-0 flex h-[19.92px] w-[170px] items-center rounded-md bg-zinc-300/20">
            <span className="ms-4 items-center font-alexandria text-[12px]">
              EXH. GAS MEAN
            </span>
          </div>
          <div className="absolute left-[159.98px] top-0 flex h-full w-[114.99px] items-center justify-center rounded-md bg-[#515151]">
            <span className="items-center font-alexandria text-[12px]">
              63 °C
            </span>
          </div>
        </div>

        <div className="relative mt-2 h-[50.24px] w-[274.98px] rounded-md bg-zinc-300/20">
          <div className="grid w-full grid-cols-4 justify-between rounded-md ps-4 pt-1">
            <span className="col-span-2 items-center font-alexandria text-[11px]">
              ENGINE SPEED
            </span>
            <span className="h-[19.06px] w-[51.14px] items-center rounded-md bg-[#515151] text-center font-alexandria text-[11px]">
              1800
            </span>
            <span className="items-center font-alexandria text-[11px]">
              RPM
            </span>

            <span className="col-span-2 mt-1 items-center font-alexandria text-[11px]">
              T/C SPEED
            </span>
            <span className="mt-1 h-[19.06px] w-[51.14px] items-center rounded-md bg-[#515151] text-center font-alexandria text-[11px]">
              1000
            </span>
            <span className="mt-1 items-center font-alexandria text-[11px]">
              RPM
            </span>
          </div>
        </div>
      </div>

      <div className="mx-2 flex h-auto min-w-max flex-1 flex-col">
        <div className="mt-auto font-alexandria text-[14px]">
          EXH. GAS TEMP [°C]
        </div>
        <div className="font-alexandria text-[14px]">EXH. GAS DEVIATION</div>
      </div>

      <div className="flex-1">
        <div className="relative mt-2 h-[19.92px] w-[370px] rounded-md bg-[#D9D9D933]">
          <div className="flex-col-6 ms-3 flex gap-5 text-[14px]">
            <div className="w-[41.08px] rounded-md text-center">NO.1</div>
            <div className="w-[41.08px] rounded-md text-center">NO.2</div>
            <div className="w-[41.08px] rounded-md text-center">NO.3</div>
            <div className="w-[41.08px] rounded-md text-center">NO.4</div>
            <div className="w-[41.08px] rounded-md text-center">NO.5</div>
            <div className="w-[41.08px] rounded-md text-center">NO.6</div>
          </div>
          <div className="flex-col-6 ms-3 mt-[12px] flex gap-5 text-[14px]">
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
          </div>
          <div className="flex-col-6 ms-3 mt-1 flex gap-5 text-[14px]">
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
            <div className="w-[41.08px] rounded-md bg-[#AF0000] text-center">
              461
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DgEXHGasMesurment;
