export function ResetViewControl({
  onClick,
  isLoading
}: {
  onClick: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="absolute right-4 top-4 z-[1000] font-alexandria">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`rounded-full border border-white/50 bg-[#1A1A1A] p-[4px] shadow-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
          }`}
        title={isLoading ? "Loading..." : "Reset view"}
      >
        {isLoading ? (
          <div className="w-[34px] h-[34px] flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0771 19C10.1231 19 8.46782 18.3223 7.11115 16.967C5.75515 15.611 5.07715 13.9563 5.07715 12.003C5.07715 10.0497 5.75515 8.39433 7.11115 7.037C8.46715 5.67967 10.1225 5.00067 12.0771 5C13.2658 5 14.3788 5.28233 15.4161 5.847C16.4528 6.41167 17.2885 7.2 17.9231 8.212V5H18.9231V10.23H13.6931V9.23H17.3931C16.8718 8.23333 16.1391 7.44567 15.1951 6.867C14.2511 6.28833 13.2118 5.99933 12.0771 6C10.4105 6 8.99382 6.58333 7.82715 7.75C6.66048 8.91667 6.07715 10.3333 6.07715 12C6.07715 13.6667 6.66048 15.0833 7.82715 16.25C8.99382 17.4167 10.4105 18 12.0771 18C13.3605 18 14.5188 17.6333 15.5521 16.9C16.5855 16.1667 17.3105 15.2 17.7271 14H18.7891C18.3478 15.4973 17.5098 16.705 16.2751 17.623C15.0405 18.541 13.6411 19 12.0771 19Z"
              fill="white"
            />
          </svg>
        )}
      </button>
    </div>
  );
}