type Props = {
  size?: string;
};

function SprayCanIcon({ size = "18" }: Props) {
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
      <path d="M3 3h.01" />
      <path d="M7 5h.01" />
      <path d="M11 7h.01" />
      <path d="M3 7h.01" />
      <path d="M7 9h.01" />
      <path d="M3 11h.01" />
      <rect width="4" height="12" x="14" y="8" rx="1" />
      <path d="M12 9v12" />
      <path d="M20 9v12" />
      <path d="M12 15h8" />
    </svg>
  );
}

export default SprayCanIcon;
