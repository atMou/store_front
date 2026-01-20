type Props = {
  size?: string;
};

function MakeupIcon({ size = "18" }: Props) {
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
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <circle cx="12" cy="12" r="10" />
      <path d="m16 8-4 4-4-4" />
    </svg>
  );
}

export default MakeupIcon;
