"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAllVesselList } from "@/queries/use-all-vessel-list";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import ReactCountryFlag from "react-country-flag"
import { App } from "@/lib/constants";

function DropDownListItemNew({
  label,
  preview,
  className,
  imo,
  company,
  flag
}: {
  value: string;
  label: string;
  imo?: string;
  fleet?: string;
  company?: string;
  preview?: boolean;
  className?: string;
  flag?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-1 items-start gap-0.5 font-alexandria uppercase leading-[100%] tracking-[0%] xl:gap-2 3xl:gap-3",
        className
      )}
    >
      <div className="min-w-[1em]">
        <ReactCountryFlag countryCode={flag ?? ""} svg />
      </div>
      <div className="flex flex-col justify-start gap-0.5 xl:gap-1 3xl:gap-1.5">
        <p
          title={label}
          className={twMerge(
            "text-start text-[8px] font-[500] xl:text-[10px] 3xl:text-[15px]",
            preview && "w-[14ch] truncate"
          )}
        >
          {label}
        </p>
        <div className="flex gap-0.5 text-[6px] font-[400] xl:text-[8px] 3xl:gap-1 3xl:text-[12px]">
          <p>IMO {imo}</p>
          <Separator
            orientation="vertical"
            className="h-auto bg-secondary/40"
          />
          <p>{company}</p>
          {preview && <ChevronDown className="ml-auto" />}
        </div>
      </div>
    </div>
  );
}
function DropDownListItem({
  label,
  preview,
  className,
  imo,
  fleet,
  company
}: {
  value: string;
  label: string;
  imo?: string;
  fleet?: string;
  company?: string;
  preview?: boolean;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-1 flex-col items-start gap-1.5 px-2 tracking-widest",
        className
      )}
    >
      <p className="max-w-full truncate text-xs font-semibold uppercase xl:text-sm 2xl:text-base">
        {label}
      </p>
      <div className="flex gap-1 text-xs text-muted-foreground">
        <p className="w-max truncate">IMO {imo}</p>
        <Separator orientation="vertical" className="h-auto bg-secondary/40" />
        <p className="w-max truncate">{fleet}</p>
        <Separator orientation="vertical" className="h-auto bg-secondary/40" />
        <p className={twMerge(preview ? "max-w-[17ch] truncate" : "min-w-max")}>
          {company}
        </p>
      </div>
    </div>
  );
}

type Option = {
  label: string;
  value: string;
  imo: string;
  fleet: string;
  company: string;
  flag: string;
};

type VirtualizedCommandProps = {
  height: string;
  options: Option[];
  selectedOption: string;
  onSelectOption?: (options: string) => void;
};
function VirtualCommand({
  height,
  options,
  selectedOption,
  onSelectOption
}: VirtualizedCommandProps) {
  const [filterOptions, setFilterOptions] = useState(options);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: filterOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: "start"
    });
  };

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    setFilterOptions(
      options.filter(options =>
        options.value.toLowerCase().includes(search.toLowerCase() ?? [])
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex(prev => {
          const newIndex =
            prev === -1 ? 0 : Math.min(prev + 1, filterOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex(prev => {
          const newIndex =
            prev === -1 ? filterOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (filterOptions[focusedIndex]) {
          onSelectOption?.(filterOptions[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedOption) {
      const option = filterOptions.find(
        option => option.value === selectedOption
      );
      if (option) {
        const index = filterOptions.indexOf(option);
        virtualizer.scrollToIndex(index, {
          align: "start"
        });
        setFocusedIndex(index);
      }
    }
  }, [selectedOption, filterOptions, virtualizer]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown} className="w-full">
      <CommandInput
        placeholder="Search Vessel..."
        className="h-9"
        icon={false}
        onValueChange={handleSearch}
      />
      <CommandList
        ref={parentRef}
        className="w-full overflow-x-auto"
        onPointerDown={() => setIsKeyboardNavActive(false)}
        onPointerMove={() => setIsKeyboardNavActive(false)}
        style={{
          height: "100%",
          maxHeight: height,
          width: "100%",
          overflow: "auto"
        }}
      >
        <CommandEmpty>No Item Found.</CommandEmpty>
        <CommandGroup className="w-full overflow-auto">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative"
            }}
          >
            {virtualOptions.map(virtualOption => (
              <CommandItem
                key={filterOptions[virtualOption.index].value}
                disabled={isKeyboardNavActive}
                className={cn(
                  "absolute left-0 top-0 w-full min-w-full max-w-full",
                  focusedIndex === virtualOption.index &&
                    "border border-secondary/40 bg-accent",
                  isKeyboardNavActive &&
                    focusedIndex !== virtualOption.index &&
                    "aria-selected:bg-transparent aria-selected:text-primary"
                )}
                style={{
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`
                }}
                value={filterOptions[virtualOption.index].value}
                onPointerEnter={() =>
                  !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                }
                onPointerLeave={() =>
                  !isKeyboardNavActive && setFocusedIndex(-1)
                }
                onSelect={onSelectOption}
              >
                <DropDownListItem
                  label={filterOptions[virtualOption.index].label}
                  value={filterOptions[virtualOption.index].value}
                  imo={filterOptions[virtualOption.index].imo}
                  fleet={filterOptions[virtualOption.index].fleet}
                  company={filterOptions[virtualOption.index].company}
                />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function VirtualCommandNew({
  height,
  options,
  selectedOption,
  onSelectOption
}: VirtualizedCommandProps) {
  const [filterOptions, setFilterOptions] = useState(options);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: filterOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: "start"
    });
  };

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    setFilterOptions(
      options.filter(options =>
        options.value.toLowerCase().includes(search.toLowerCase() ?? [])
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex(prev => {
          const newIndex =
            prev === -1 ? 0 : Math.min(prev + 1, filterOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex(prev => {
          const newIndex =
            prev === -1 ? filterOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (filterOptions[focusedIndex]) {
          onSelectOption?.(filterOptions[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedOption) {
      const option = filterOptions.find(
        option => option.value === selectedOption
      );
      if (option) {
        const index = filterOptions.indexOf(option);
        virtualizer.scrollToIndex(index, {
          align: "start"
        });
        setFocusedIndex(index);
      }
    }
  }, [selectedOption, filterOptions, virtualizer]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown} className="w-full">
      <CommandInput
        placeholder="Search Vessel..."
        className="h-9"
        icon={false}
        onValueChange={handleSearch}
      />
      <CommandList
        ref={parentRef}
        className="w-full overflow-x-auto"
        onPointerDown={() => setIsKeyboardNavActive(false)}
        onPointerMove={() => setIsKeyboardNavActive(false)}
        style={{
          height: "100%",
          maxHeight: height,
          width: "100%",
          overflow: "auto"
        }}
      >
        <CommandEmpty>No Item Found.</CommandEmpty>
        <CommandGroup className="w-full overflow-auto">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative"
            }}
          >
            {virtualOptions.map(virtualOption => (
              <CommandItem
                key={filterOptions[virtualOption.index].value}
                disabled={isKeyboardNavActive}
                className={cn(
                  "absolute left-0 top-0 w-full min-w-full max-w-full",
                  focusedIndex === virtualOption.index &&
                    "border border-secondary/40 bg-accent",
                  isKeyboardNavActive &&
                    focusedIndex !== virtualOption.index &&
                    "aria-selected:bg-transparent aria-selected:text-primary"
                )}
                style={{
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`
                }}
                value={filterOptions[virtualOption.index].value}
                onPointerEnter={() =>
                  !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                }
                onPointerLeave={() =>
                  !isKeyboardNavActive && setFocusedIndex(-1)
                }
                onSelect={onSelectOption}
              >
                <DropDownListItemNew
                  label={filterOptions[virtualOption.index].label}
                  value={filterOptions[virtualOption.index].value}
                  imo={filterOptions[virtualOption.index].imo}
                  fleet={filterOptions[virtualOption.index].fleet}
                  company={filterOptions[virtualOption.index].company}
                  flag={filterOptions[virtualOption.index].flag}
                />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export const VesselSelection = () => {
  const [open, setOpen] = React.useState(false);
  const width = "250px";
  const height = "400px";
  const firstMount = useRef(true);

  const { data, error, isLoading } = useAllVesselList();
  const { setVessel, vessel } = useVesselSelectionStore();

  const [selectedOption, setSelectedOption] = useState("");
  const selectedItem = data?.find(
    (item: { value: string }) => item.value === selectedOption
  );

  useEffect(() => {
    if (data && firstMount.current) {
      if (vessel) {
        const existingVessel = data.find(item => item.value === vessel.value);
        if (existingVessel) {
          setSelectedOption(existingVessel.value);
          firstMount.current = false;
        } else {
          setSelectedOption(data[0].value);
          firstMount.current = false;
        }
      } else {
        setSelectedOption(data[0].value);
        firstMount.current = false;
      }
    }
  }, [data, vessel]);

  useEffect(() => {
    if (selectedOption && data) {
      const selectedItem = data.find(
        (item: { value: string }) => item.value === selectedOption
      );
      if (selectedItem) {
        setVessel(selectedItem);
      }
    }
  }, [selectedOption, data, setVessel]);

  return (
    <div className="flex items-center px-1 2xl:px-2">
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            disabled={isLoading || !!error}
            className={twMerge(
              "flex h-auto w-[225px] justify-between p-1 2xl:w-[250px]",
              error ? "border-red-500/50" : "border-secondary/40"
            )}
            variant="outline"
          >
            {selectedItem ? (
              <DropDownListItem
                label={selectedItem.label}
                value={selectedItem.value}
                imo={selectedItem.imo}
                fleet={selectedItem.fleet}
                company={selectedItem.company}
                preview
              />
            ) : (
              <div
                className={twMerge(
                  "flex h-[50px] flex-1 items-center gap-1.5 p-2"
                )}
              >
                {/* <div className="aspect-square w-9 rounded bg-blue-500/50"></div> */}
                <div className="flex w-auto flex-col items-start">
                  Select Vessel
                </div>
              </div>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          style={{ maxWidth: width }}
          className="border border-secondary/20 p-1"
        >
          <VirtualCommand
            height={height}
            options={isLoading ? [] : (data as Option[])}
            selectedOption={selectedOption}
            onSelectOption={currentValue => {
              setSelectedOption(currentValue);
              setOpen(false);
              sessionStorage.removeItem(App.PayloadCordsSessionKey)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const VesselSelectionNew = () => {
  const [open, setOpen] = React.useState(false);
  const width = "250px";
  const height = "400px";
  const firstMount = useRef(true);

  const { data, error, isLoading } = useAllVesselList();
  const { setVessel, vessel } = useVesselSelectionStore();

  const [selectedOption, setSelectedOption] = useState("");
  const selectedItem = data?.find(
    (item: { value: string }) => item.value === selectedOption
  );

  useEffect(() => {
    if (data && firstMount.current) {
      if (vessel) {
        const existingVessel = data.find(item => item.value === vessel.value);
        if (existingVessel) {
          setSelectedOption(existingVessel.value);
          firstMount.current = false;
        } else {
          setSelectedOption(data[0].value);
          firstMount.current = false;
        }
      } else {
        setSelectedOption(data[0].value);
        firstMount.current = false;
      }
    }
  }, [data, vessel]);

  useEffect(() => {
    if (selectedOption && data) {
      const selectedItem = data.find(
        (item: { value: string }) => item.value === selectedOption
      );
      if (selectedItem) {
        setVessel(selectedItem);
      }
    }
  }, [selectedOption, data, setVessel]);

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            disabled={isLoading || !!error}
            className={twMerge(
              "flex h-auto justify-between bg-transparent px-0 py-1 hover:bg-transparent",
              error ? "border-red-500/50" : "border-transparent"
            )}
            variant="outline"
          >
            {selectedItem ? (
              <DropDownListItemNew
                label={selectedItem.label}
                value={selectedItem.value}
                imo={selectedItem.imo}
                fleet={selectedItem.fleet}
                company={selectedItem.company}
                flag={selectedItem.flag}
                preview
              />
            ) : (
              <div
                className={twMerge(
                  "flex h-[50px] flex-1 items-center gap-1.5 p-2"
                )}
              >
                {/* <div className="aspect-square w-9 rounded bg-blue-500/50"></div> */}
                <div className="flex w-auto flex-col items-start">
                  Select Vessel
                </div>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          style={{ maxWidth: width }}
          className="border border-secondary/20 p-1"
        >
          <VirtualCommandNew
            height={height}
            options={isLoading ? [] : (data as Option[])}
            selectedOption={selectedOption}
            onSelectOption={currentValue => {
              setSelectedOption(currentValue);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
