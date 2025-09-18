"use client"

import { Search } from "lucide-react";
import { ButtonWrapper } from "./tag-selection";
import { Input } from "@/components/ui/input";
import { useDebouncedQueryState } from "./use-debounce-query";

export function SearchFilter() {
  const [search, setSearch] = useDebouncedQueryState("q");

  return (
    <ButtonWrapper as="button" className="ml-auto max-w-[200px] flex items-center px-2 font-alexandria">
      <Search className="ml-[10px]" />
      <Input
        value={search || ""}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search"
        type="text"
        className="bg-transparent text-[15px] ring-transparent border-none outline-transparent focus:ring-0 focus:ring-transparent focus:border-none focus:outline-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-none focus-visible:outline-transparent"
      />
    </ButtonWrapper>
  )
}
