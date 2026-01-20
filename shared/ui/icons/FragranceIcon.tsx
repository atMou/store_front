type Props = {
  size?: string;
};

function FragranceIcon({ size = "18" }: Props) {
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
      <rect width="6" height="12" x="9" y="10" rx="2" />
      <path d="M9 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      <path d="M9 16h6" />
      <path d="M16 8h3a2 2 0 0 1 2 2v2" />
      <path d="M3 12h2" />
    </svg>
  );
}

export default FragranceIcon;
