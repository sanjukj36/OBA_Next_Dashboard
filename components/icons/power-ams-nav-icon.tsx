export const PowerAmsNavIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={className}
      {...props}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.8914 0H8.80664L2.38281 11H8.80664L3.30664 22L17.9719 8.25H10.6371L18.8914 0Z"
        fill="white"
      />
    </svg>
  );
};
