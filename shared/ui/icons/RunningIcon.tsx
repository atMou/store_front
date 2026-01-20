type Props = {
  size?: string;
};

function RunningIcon({ size = "18" }: Props) {
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
      <circle cx="13" cy="5" r="2" />
      <path d="M6 15l-2 2 2 2" />
      <path d="M13 8l-3 3 6 6" />
      <path d="M10 11l2 2 6-3" />
      <path d="M18 14v-2a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

export default RunningIcon;
