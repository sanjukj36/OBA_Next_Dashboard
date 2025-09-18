export const ArrowRightIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="15"
      height="24"
      viewBox="0 0 15 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M0.608864 1.97682L2.72131 0.0421162L14.2272 10.5862C14.4127 10.7552 14.5599 10.9561 14.6603 11.1774C14.7608 11.3987 14.8125 11.636 14.8125 11.8757C14.8125 12.1154 14.7608 12.3528 14.6603 12.5741C14.5599 12.7954 14.4127 12.9963 14.2272 13.1652L2.72131 23.7148L0.610855 21.7801L11.41 11.8785L0.608864 1.97682Z"
        fill="white"
      />
    </svg>
  );
};
