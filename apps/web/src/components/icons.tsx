interface IconProps
  extends Partial<Omit<React.ComponentPropsWithoutRef<"svg">, "stroke">> {
  size?: string | number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  size = "24",
  children,
  className = "",
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
};

export const IconRelay = (props: IconProps) => (
  <div className="rotate-90 transform">
    <Icon {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 18v-12h4a4 4 0 0 1 4 4v4" />
      <path d="M18 6v12h-4a4 4 0 0 1 -4 -4v-4" />
    </Icon>
  </div>
);
