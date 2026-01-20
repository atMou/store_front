type Props = {
  size?: string;
};

function ShoeIcon({ size = "18" }: Props) {
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
      <path d="M2 17v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
      <path d="M22 14V9a2 2 0 0 0-2-2h-3l-3-3H6a2 2 0 0 0-2 2v8" />
      <path d="M2 14h20" />
      <path d="M6 17v-3" />
      <path d="M10 17v-3" />
      <path d="M14 17v-3" />
      <path d="M18 17v-3" />
    </svg>
  );
}

export default ShoeIcon;
