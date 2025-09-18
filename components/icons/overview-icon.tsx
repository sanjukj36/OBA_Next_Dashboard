export const OverviewIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8 2C11.3133 2 14 4.68667 14 8C14 11.3133 11.3133 14 8 14C4.68667 14 2 11.3133 2 8C2 4.68667 4.68667 2 8 2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2026 9.2026L4.66927 11.3359L6.8026 6.8026L11.3359 4.66927L9.2026 9.2026Z"
        fill="white"
      />
      <path
        d="M7.9987 8.66536C8.36689 8.66536 8.66536 8.36689 8.66536 7.9987C8.66536 7.63051 8.36689 7.33203 7.9987 7.33203C7.63051 7.33203 7.33203 7.63051 7.33203 7.9987C7.33203 8.36689 7.63051 8.66536 7.9987 8.66536Z"
        fill="#565656"
      />
    </svg>
  );
};
