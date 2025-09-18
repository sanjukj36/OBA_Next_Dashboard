export const PlusIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M25.5243 14.4068H14.8716V25.0595H11.3207V14.4068H0.667969V10.8559H11.3207V0.203125H14.8716V10.8559H25.5243V14.4068Z"
        fill="white"
      />
    </svg>
  );
};
