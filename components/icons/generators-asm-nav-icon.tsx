export const GeneratorsAmsNavIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={className}
      {...props}
      width="24"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 0.75H22C22.8284 0.75 23.5 1.42157 23.5 2.25V19.25H0.5V2.25C0.5 1.42157 1.17157 0.75 2 0.75Z"
        stroke="white"
      />
      <path
        d="M10.5 4.75H5.9184L3 10.75H5.9184L3.4197 16.75L10.0822 9.25H6.75L10.5 4.75Z"
        fill="white"
      />
      <rect x="12" y="4.75" width="9" height="3" rx="1.5" fill="white" />
      <rect x="12" y="12.25" width="9" height="3" rx="1.5" fill="white" />
    </svg>
  );
};
