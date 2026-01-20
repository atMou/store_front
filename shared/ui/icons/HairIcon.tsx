type Props = {
  size?: string;
};

function HairIcon({ size = "18" }: Props) {
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
      <path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z" />
      <path d="M7 10v5a5 5 0 0 0 10 0v-5" />
      <path d="M12 10v12" />
    </svg>
  );
}

export default HairIcon;
