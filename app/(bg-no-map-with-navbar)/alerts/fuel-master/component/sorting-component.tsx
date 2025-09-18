"use client"

import { useMemo } from "react";
import { ButtonWrapper } from "./tag-selection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFuelmasterAlertsStore } from "@/store/fulemaster-alerts-store";

export enum SortOption {
  Asc = "asc",
  Des = "desc"
}

const sortOptions = [
  { label: "Decending", value: SortOption.Des , icon: ChevronDown },
  { label: "Ascending", value: SortOption.Asc , icon: ChevronUp },
]

type SortType = typeof sortOptions[number]

export const SortingComponent = () => {
  const { sort: sortValue, setSort: setSortValue } = useFuelmasterAlertsStore()

  const sort = useMemo<SortType>(
    () => sortOptions.find(opt => opt.value === sortValue) ?? sortOptions[0],
    [sortValue]
  )

  return (
    <Select
      value={sort?.value}
      onValueChange={(value) => setSortValue(value as SortOption)}
    >
      <SelectTrigger showArrow={false} className="w-min p-0 ring-transparent outline-transparent border-none focus:ring-transparent font-alexandria">
        <ButtonWrapper className="w-[40px] flex items-center justify-center">
          <sort.icon />
        </ButtonWrapper>
      </SelectTrigger>
      <SelectContent align="center">
        {
          sortOptions.map(option => {
            return (
              <SelectItem value={option.value} key={option.value}>
                <div className="flex gap-1 items-center font-alexandria">
                  <option.icon size={16} />
                  <p>{option.label}</p>
                </div>
              </SelectItem>
            )
          })
        }
      </SelectContent>
    </Select>
  )
};

/*
const SortIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={21}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_3590_15534)">
      <path
        d="M14.2902 11.2899L10.0002 15.5899L5.71019 11.2899C5.52188 11.1016 5.26649 10.9958 5.00019 10.9958C4.73388 10.9958 4.47849 11.1016 4.29019 11.2899C4.10188 11.4782 3.99609 11.7336 3.99609 11.9999C3.99609 12.2662 4.10188 12.5216 4.29019 12.7099L9.29019 17.7099C9.38315 17.8037 9.49375 17.8781 9.61561 17.9288C9.73747 17.9796 9.86817 18.0057 10.0002 18.0057C10.1322 18.0057 10.2629 17.9796 10.3848 17.9288C10.5066 17.8781 10.6172 17.8037 10.7102 17.7099L15.7102 12.7099C15.8034 12.6167 15.8774 12.506 15.9278 12.3842C15.9783 12.2624 16.0043 12.1318 16.0043 11.9999C16.0043 11.8681 15.9783 11.7375 15.9278 11.6157C15.8774 11.4939 15.8034 11.3832 15.7102 11.2899C15.6169 11.1967 15.5063 11.1227 15.3844 11.0723C15.2626 11.0218 15.132 10.9958 15.0002 10.9958C14.8683 10.9958 14.7378 11.0218 14.6159 11.0723C14.4941 11.1227 14.3834 11.1967 14.2902 11.2899ZM5.71019 6.70994L10.0002 2.40994L14.2902 6.70994C14.3831 6.80367 14.4937 6.87806 14.6156 6.92883C14.7375 6.9796 14.8682 7.00574 15.0002 7.00574C15.1322 7.00574 15.2629 6.9796 15.3848 6.92883C15.5066 6.87806 15.6172 6.80367 15.7102 6.70994C15.8039 6.61698 15.8783 6.50637 15.9291 6.38452C15.9798 6.26266 16.006 6.13195 16.006 5.99994C16.006 5.86793 15.9798 5.73722 15.9291 5.61536C15.8783 5.4935 15.8039 5.3829 15.7102 5.28994L10.7102 0.289939C10.6172 0.196211 10.5066 0.121816 10.3848 0.0710475C10.2629 0.0202789 10.1322 -0.00585938 10.0002 -0.00585938C9.86817 -0.00585938 9.73747 0.0202789 9.61561 0.0710475C9.49375 0.121816 9.38315 0.196211 9.29019 0.289939L4.29019 5.28994C4.19695 5.38318 4.12299 5.49387 4.07253 5.61569C4.02207 5.73751 3.99609 5.86808 3.99609 5.99994C3.99609 6.26624 4.10188 6.52164 4.29019 6.70994C4.47849 6.89824 4.73388 7.00403 5.00019 7.00403C5.26649 7.00403 5.52188 6.89824 5.71019 6.70994Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_3590_15534"
        x={-0.00390625}
        y={-0.00585938}
        width={20.0117}
        height={26.0117}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3590_15534"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3590_15534"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
*/
