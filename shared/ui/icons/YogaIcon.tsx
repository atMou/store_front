type Props = {
  size?: string;
};

function YogaIcon({ size = "18" }: Props) {
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
      <circle cx="12" cy="5" r="2" />
      <path d="M4 14v6" />
      <path d="M20 14v6" />
      <path d="M12 9v13" />
      <path d="M6 14l6-5 6 5" />
    </svg>
  );
}

export default YogaIcon;
