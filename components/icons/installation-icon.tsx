export const InstallationIcon = ({
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
        d="M9.5013 9.65812L5.16797 6.18432H8.05686V3H10.9457V6.18432H13.8346L9.5013 9.65812Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 11.9727H3M13.1111 13.999H5.88889"
        stroke="white"
        strokeLinecap="round"
      />
    </svg>
  );
};
