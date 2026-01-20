type TrousersIconProps = {
  size?: string;
};

const TrousersIcon = ({ size = "18" }: TrousersIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 4h12l1 16-4-1-3 3-3-3-4 1L6 4zm6 0v16"
    />
  </svg>
);

export default TrousersIcon;
