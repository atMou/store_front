type Props = {
  size?: string;
};

function RazorIcon({ size = "18" }: Props) {
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
      <path d="M6 2v20" />
      <path d="M10 2v20" />
      <path d="M14 2v20" />
      <path d="M18 2v20" />
      <path d="M3 6h18" />
      <path d="M3 10h18" />
      <path d="M3 14h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

export default RazorIcon;
