"use client";

import * as React from "react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, AlertCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useGetAllTagDetailsQuery } from "@/queries/use-all-taglist";

function DropDownListItemNew({
  label,
  preview,
  className,
}: {
    label: string;
    preview?: boolean;
    className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-1 items-start gap-0.5 font-alexandria leading-[100%] tracking-[0%] xl:gap-2 3xl:gap-3 font-[500]",
        className
      )}
    >
        <p
          title={label}
          className={twMerge(
            "text-start ",
            preview && "max-w-[17ch] truncate"
          )}
        >
          {label}
        </p>
        {preview && <ChevronDown className="ml-auto" />}
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
  onSelectOption?: (value: string) => void;
};

const VirtualCommandNew = React.memo(function VirtualCommandNew({
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

  const scrollToIndex = useCallback((index: number) => {
    virtualizer.scrollToIndex(index, {
      align: "start"
    });
  }, [virtualizer]);

  const handleSearch = useCallback((search: string) => {
    setIsKeyboardNavActive(false);
    setFilterOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [options]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
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
  }, [filterOptions, focusedIndex, onSelectOption, scrollToIndex]);

  // Update filterOptions when options change
  useEffect(() => {
    setFilterOptions(options);
  }, [options]);

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
        placeholder="Search Tags..."
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
        <CommandEmpty>No tags found.</CommandEmpty>
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
                />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
});

// Updated types to match your main component
type Selection = { label: string; value: string } | null;

type VirtualizedDropDownSelectionProps = {
  selection: Selection;
  setSelection: (selection: Selection) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  width?: string;
  height?: string;
};

export const VirtualizedDropDownSelection = React.memo(function VirtualizedDropDownSelection({
  selection,
  setSelection,
  disabled = false,
  placeholder = "Select Tag",
  className,
  width = "350px",
  height = "400px"
}: VirtualizedDropDownSelectionProps) {
  const [open, setOpen] = React.useState(false);

  const { data: allTagList, error: allTagError, isLoading: allTagIsLoading } =
    useGetAllTagDetailsQuery();

  // Memoize the selected item lookup
  const selectedItem = useMemo(() => {
    if (!allTagList || !selection?.value) return null;
    return allTagList.find((item) => item.value === selection.value) || null;
  }, [allTagList, selection?.value]);

  // Memoize the select handler
  const handleSelectOption = useCallback((currentValue: string) => {
    if (!allTagList) return;

    const selectedItem = allTagList.find(
      (item) => item.value === currentValue
    );

    if (selectedItem) {
      setSelection({
        label: selectedItem.label,
        value: selectedItem.value
      });
    }
    setOpen(false);
  }, [allTagList, setSelection]);

  // Handle error state
  if (allTagError) {
    return (
      <div className={twMerge("flex items-center gap-2 text-red-500", className)}>
        <AlertCircle size={16} />
        <span className="text-sm">Failed to load tags</span>
      </div>
    );
  }

  return (
    <div className={twMerge("flex items-center w-full", className)}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            disabled={disabled || allTagIsLoading}
            className={twMerge(
              "w-full px-0 bg-transparent hover:bg-transparent inline-flex justify-between items-center text-left font-normal font-alexandria text-[22px] tracking-[0%] leading-[100%] border-none relative isolate text-[#C9C9C9]",
              allTagError ? "border-red-500/50" : "border-transparent",
              allTagIsLoading && "opacity-50 cursor-not-allowed"
            )}
            variant="outline"
          >
            {selectedItem ? (
              <DropDownListItemNew
                label={selectedItem.label}
                preview
                className="text-[22px]"
              />
            ) : (
              <div className="flex h-[50px] flex-1 items-center gap-1.5 p-2">
                <div className="flex w-auto flex-col items-start">
                  {allTagIsLoading ? "Loading..." : placeholder}
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
            options={allTagIsLoading ? [] : (allTagList as Option[])}
            selectedOption={selection?.value ?? ""}
            onSelectOption={handleSelectOption}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});
