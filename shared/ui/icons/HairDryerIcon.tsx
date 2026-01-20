type Props = {
  size?: string;
};

function HairDryerIcon({ size = "18" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0" />
      <path d="M12 12v8" />
      <path d="M8 20h8" />
      <path d="M12 7V3" />
      <path d="m15 9 3-3" />
      <path d="m9 9-3-3" />
    </svg>
  );
}

export default HairDryerIcon;
