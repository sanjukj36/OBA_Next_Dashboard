export const ChartIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 3H17V17H3V3ZM4.4 4.4V15.6H15.6V4.4H4.4ZM10.7 6.5V14.2H9.3V6.5H10.7ZM7.2 9.3V14.2H5.8V9.3H7.2ZM14.2 10.7V14.2H12.8V10.7H14.2Z"
        fill="white"
      />
    </svg>
  );
};
