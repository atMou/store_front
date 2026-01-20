type HatGlassesProps = {
  size?: string;
};

const HatGlassesIcon = ({ size = "18" }: HatGlassesProps) => (
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
    <path d="M2 10s3-3 10-3 10 3 10 3-3 3-10 3-10-3-10-3Z" />
    <path d="M6 14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2" />
    <path d="M18 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2" />
    <path d="M10 16h4" />
  </svg>
);

export default HatGlassesIcon;
