export const ArrowLeftIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="14"
      height="24"
      viewBox="0 0 14 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M13.0786 1.97682L11.1422 0.0421162L0.595075 10.5862C0.425061 10.7552 0.290136 10.9561 0.198065 11.1774C0.105993 11.3987 0.0585937 11.636 0.0585937 11.8757C0.0585937 12.1154 0.105993 12.3528 0.198065 12.5741C0.290136 12.7954 0.425061 12.9963 0.595075 13.1652L11.1422 23.7148L13.0768 21.7801L3.17756 11.8785L13.0786 1.97682Z"
        fill="white"
      />
    </svg>
  );
};
