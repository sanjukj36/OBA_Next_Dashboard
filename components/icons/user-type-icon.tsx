export const UserTypeIcon = ({
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
        d="M9.77908 10.2222C11.7734 10.2222 13.3902 8.60547 13.3902 6.61111C13.3902 4.61675 11.7734 3 9.77908 3C7.78472 3 6.16797 4.61675 6.16797 6.61111C6.16797 8.60547 7.78472 10.2222 9.77908 10.2222Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5556 16.0004C15.5556 14.4681 14.9468 12.9985 13.8633 11.9149C12.7797 10.8314 11.3101 10.2227 9.77778 10.2227C8.24542 10.2227 6.77582 10.8314 5.69227 11.9149C4.60873 12.9985 4 14.4681 4 16.0004"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.324 4.86H10.17L10.026 7.62H9.468L9.324 4.86ZM9.354 8.22H10.14V9H9.354V8.22Z"
        fill="white"
      />
    </svg>
  );
};

export const UserTypeBlackIcon = ({
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
        d="M9.77908 10.2222C11.7734 10.2222 13.3902 8.60547 13.3902 6.61111C13.3902 4.61675 11.7734 3 9.77908 3C7.78472 3 6.16797 4.61675 6.16797 6.61111C6.16797 8.60547 7.78472 10.2222 9.77908 10.2222Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5556 16.0004C15.5556 14.4681 14.9468 12.9985 13.8633 11.9149C12.7797 10.8314 11.3101 10.2227 9.77778 10.2227C8.24542 10.2227 6.77582 10.8314 5.69227 11.9149C4.60873 12.9985 4 14.4681 4 16.0004"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.324 4.86H10.17L10.026 7.62H9.468L9.324 4.86ZM9.354 8.22H10.14V9H9.354V8.22Z"
        fill="black"
      />
    </svg>
  );
};
