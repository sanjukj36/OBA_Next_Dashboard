"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Command,
    CommandInput,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";

interface SearchWithFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    status: "online" | "offline" | null;
    setStatus: (status: "online" | "offline" | null) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const SearchWithFilter = ({
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    isOpen,
    setIsOpen
}: SearchWithFilterProps) => {

    const toggleStatus = (newStatus: "online" | "offline") => {
        const updatedStatus = status === newStatus ? null : newStatus;
        setStatus(updatedStatus);
        setIsOpen(false);
    };

    const resetStatus = () => {
        setStatus(null);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-[20px] ml-[299px] font-alexandria">
            <div className="relative w-[164px]">
                <Command>
                    <button
                        className={cn(
                            "h-8 w-auto justify-between rounded-md border border-gray-600 bg-gray-800 px-[8px] py-1 text-sm text-white hover:bg-gray-700 font-alexandria",
                            "flex items-center bg-gradient-to-b from-[#1B1B1B] to-[#2F2F2F]"
                        )}
                    >
                        <CommandInput
                            placeholder="Search..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            className="text-white font-alexandria"
                            icon={false}
                        />
                    </button>
                </Command>
            </div>

            {/* Status filter button */}
            <div className="relative ms-[6px] font-alexandria" style={{ overflow: 'visible' }}>
                <motion.button
                    className={`flex items-center justify-center h-8 w-8 rounded-lg border ${status === "online"
                        ? "border-green-600 bg-green-900/20"
                        : status === "offline"
                            ? "border-red-600 bg-red-900/20"
                            : "border-gray-400 bg-gray-800"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <AnimatePresence mode="wait">
                        {status === "online" ? (
                            <motion.div
                                key="online"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetStatus();
                                }}
                            >
                                <OnlineIcon />
                            </motion.div>
                        ) : status === "offline" ? (
                            <motion.div
                                key="offline"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetStatus();
                                }}
                            >
                                <OfflineIcon />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="filter"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FilterIcon />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Status filter dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="absolute right-0 mt-2 w-40 bg-gradient-to-b from-[#1B1B1B] to-[#2F2F2F] rounded-md shadow-lg z-50 border border-gray-600 font-alexandria"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="py-1">
                                <motion.button
                                    className={`flex items-center px-4 py-2 text-sm w-full hover:bg-white/10 ${status === "offline" ? "text-gray-500" : "text-gray-300"
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleStatus("online")}
                                    disabled={status === "offline"}
                                >
                                    <div className="mr-2">
                                        <OnlineIconSmall />
                                    </div>
                                    <span>Online</span>
                                </motion.button>
                                <motion.button
                                    className={`flex items-center px-4 py-2 text-sm w-full hover:bg-white/10 ${status === "online" ? "text-gray-500" : "text-gray-300"
                                        }`}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleStatus("offline")}
                                    disabled={status === "online"}
                                >
                                    <div className="mr-2">
                                        <OfflineIconSmall />
                                    </div>
                                    <span>Offline</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Updated Icons with Morph Animation Capabilities
const FilterIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.rect width="32" height="32" rx="8" fill="url(#paint0_linear_5_66)" />
        <motion.rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#979797" strokeOpacity="0.5" />
        <motion.path
            d="M18.5 22.5667C18.5333 22.8167 18.45 23.0833 18.2583 23.2583C18.1812 23.3356 18.0897 23.3969 17.9888 23.4387C17.888 23.4805 17.78 23.502 17.6708 23.502C17.5617 23.502 17.4536 23.4805 17.3528 23.4387C17.252 23.3969 17.1604 23.3356 17.0833 23.2583L13.7417 19.9167C13.6508 19.8278 13.5817 19.7191 13.5398 19.5991C13.4979 19.4792 13.4843 19.3511 13.5 19.225V14.9583L9.50832 9.85C9.37299 9.67628 9.31193 9.45605 9.33848 9.23744C9.36502 9.01883 9.47702 9.81962 9.64999 8.68333C9.80832 8.56667 9.98332 8.5 10.1667 8.5H21.8333C22.0167 8.5 22.1917 8.56667 22.35 8.68333C22.523 8.81962 22.635 9.01883 22.6615 9.23744C22.688 9.45605 22.627 9.67628 22.4917 9.85L18.5 14.9583V22.5667ZM11.8667 10.1667L15.1667 14.3833V18.9833L16.8333 20.65V14.375L20.1333 10.1667H11.8667Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
        />
        <defs>
            <linearGradient id="paint0_linear_5_66" x1="0" y1="16" x2="32" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B1B1B" />
                <stop offset="1" stopColor="#2F2F2F" />
            </linearGradient>
        </defs>
    </svg>
);

const OnlineIcon = () => (
    <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.rect
            x="0.5"
            y="0.5"
            width="49"
            height="31"
            rx="7.5"
            fill="url(#paint0_linear_13_9)"
            stroke="#15803D"
            initial={{ strokeWidth: 0 }}
            animate={{ strokeWidth: 1 }}
            transition={{ duration: 0.3 }}
        />
        <motion.path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5 12.4226C13.6971 12.4186 11.0027 13.5062 8.98799 15.4549L8 14.4306C10.2801 12.2262 13.3286 10.9958 16.5 11C19.6714 10.9958 22.7199 12.2262 25 14.4306L24.012 15.4549C21.9973 13.5062 19.3029 12.4186 16.5 12.4226Z"
            fill="#15803D"
            initial={{ opacity: 1, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5 15.9976C14.6298 15.9949 12.8316 16.7181 11.4839 18.0148L10.4988 16.9877C12.1116 15.4373 14.2628 14.5726 16.5 14.5757C18.7374 14.573 20.8886 15.4382 22.5012 16.9891L21.5161 18.0155C20.1685 16.7186 18.3703 15.9951 16.5 15.9976ZM16.5142 19.5512C15.5569 19.5497 14.6368 19.9215 13.9493 20.5876L12.9606 19.564C13.9135 18.6417 15.1881 18.1269 16.5142 18.1286C17.8778 18.1286 19.1176 18.6635 20.0344 19.532L19.0557 20.5648C18.3704 19.9126 17.4602 19.5496 16.5142 19.5512Z"
            fill="#15803D"
            initial={{ opacity: 1, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.path
            d="M40.2917 17.0406H32.7083V15.9573H40.2917V17.0406Z"
            fill="white"
            transition={{ duration: 0.3, delay: 0.6 }}
        />
        <defs>
            <linearGradient id="paint0_linear_13_9" x1="0" y1="16" x2="50" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B1B1B" />
                <stop offset="1" stopColor="#2F2F2F" />
            </linearGradient>
        </defs>
    </svg>
);

const OfflineIcon = () => (
    <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.rect
            x="0.5"
            y="0.5"
            width="49"
            height="31"
            rx="7.5"
            fill="url(#paint0_linear_5_79)"
            stroke="#B91C1C"
            initial={{ strokeWidth: 0 }}
            animate={{ strokeWidth: 1 }}
            transition={{ duration: 0.3 }}
        />
        <motion.path
            d="M18.2828 23.08L12.1694 9H13.6415L14.5968 11.2007C15.0624 11.1408 15.531 11.1111 16 11.112C18.9849 11.1079 21.8541 12.3256 24 14.5074L23.0701 15.5212C21.1739 13.5925 18.6381 12.5161 16 12.52C15.7255 12.52 15.4537 12.5313 15.1846 12.5538L16.0951 14.6517C18.1677 14.6741 20.1539 15.5278 21.6482 17.0383L20.721 18.0548C19.6325 16.9533 18.226 16.2647 16.7237 16.0977L17.7734 18.5167C18.3499 18.7553 18.8772 19.1086 19.3265 19.5572L18.5834 20.3809L19.7543 23.08H18.2828ZM12.6695 19.5882C13.2552 18.9932 13.9747 18.564 14.7608 18.3407L15.3279 19.6466C14.6769 19.7849 14.0771 20.1161 13.5993 20.6012L12.6695 19.5882ZM13.3583 15.1107C12.2347 15.5159 11.2087 16.174 10.3518 17.039L11.279 18.0548C12.0274 17.2993 12.9297 16.733 13.9173 16.399L13.3583 15.1107ZM8 14.5074C9.13347 13.356 10.4796 12.4615 11.9551 11.8794L12.5128 13.1642C11.1748 13.6775 9.95417 14.4805 8.92987 15.5212L8 14.5074Z"
            fill="#B91C1C"
            transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
            d="M39.2917 17.0406H31.7083V15.9573H39.2917V17.0406Z"
            fill="white"

            transition={{ duration: 0.3, delay: 0.6 }}
        />
        <defs>
            <linearGradient id="paint0_linear_5_79" x1="0" y1="16" x2="50" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B1B1B" />
                <stop offset="1" stopColor="#2F2F2F" />
            </linearGradient>
        </defs>
    </svg>
);

const OnlineIconSmall = () => (
    <svg width="26" height="15" viewBox="0 0 26 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13 2.17575C8.71317 2.16967 4.59242 3.83303 1.51105 6.81332L0 5.24679C3.48715 1.8754 8.14959 -0.00635388 13 1.61198e-05C17.8504 -0.00635388 22.5129 1.8754 26 5.24679L24.489 6.81332C21.4076 3.83303 17.2868 2.16967 13 2.17575Z"
            fill="#15803D"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
        />
        <motion.path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13 7.64336C10.1397 7.63931 7.38944 8.74534 5.32835 10.7285L3.82166 9.15767C6.2883 6.78639 9.57839 5.46403 13 5.46872C16.4219 5.46462 19.712 6.78777 22.1783 9.15985L20.6716 10.7296C18.6107 8.74603 15.8604 7.6396 13 7.64336ZM13.0217 13.0783C11.5577 13.076 10.1504 13.6446 9.09889 14.6634L7.58676 13.0979C9.0441 11.6874 10.9936 10.8999 13.0217 10.9026C15.1072 10.9026 17.0033 11.7207 18.4056 13.049L16.9087 14.6285C15.8607 13.6311 14.4685 13.0759 13.0217 13.0783Z"
            fill="#15803D"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        />
    </svg>
);

const OfflineIconSmall = () => (
    <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
            d="M16.0669 22L6.51464 0H8.81485L10.3075 3.4386C11.0349 3.34494 11.7672 3.29865 12.5 3.3C17.1639 3.29356 21.647 5.1963 25 8.6053L23.5471 10.1893C20.5842 7.17577 16.622 5.49386 12.5 5.5C12.0711 5.5 11.6464 5.5176 11.2259 5.5528L12.6485 8.8308C15.887 8.86583 18.9905 10.1996 21.3253 12.5598L19.8766 14.1482C18.1758 12.4271 15.9781 11.3511 13.6308 11.0902L15.2709 14.8698C16.1717 15.2427 16.9956 15.7947 17.6977 16.4956L16.5366 17.7826L18.3661 22H16.0669ZM7.29602 16.544C8.21122 15.6144 9.33546 14.9438 10.5638 14.5948L11.4498 16.6353C10.4326 16.8514 9.4955 17.369 8.74895 18.1269L7.29602 16.544ZM8.37238 9.548C6.61677 10.1811 5.01361 11.2093 3.67469 12.5609L5.12343 14.1482C6.29282 12.9677 7.70263 12.0829 9.24582 11.561L8.37238 9.548ZM0 8.6053C1.77105 6.80623 3.87444 5.40862 6.17992 4.499L7.05125 6.5065C4.96062 7.30857 3.05338 8.56322 1.45293 10.1893L0 8.6053Z"
            fill="#B91C1C"
            fillOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
        />
    </svg>
);

export default SearchWithFilter;