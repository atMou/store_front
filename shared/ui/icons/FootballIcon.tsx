type Props = {
  size?: string;
};

function FootballIcon({ size = "18" }: Props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m12 2 3.5 5.5L22 9l-4 5.5L19 21l-7-2-7 2 1-6.5L2 9l6.5-1.5L12 2z" />
    </svg>
  );
}

export default FootballIcon;
