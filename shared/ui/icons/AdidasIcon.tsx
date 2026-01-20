type AdidasIconProps = {
  size?: string;
};

const AdidasIcon = ({ size = "18" }: AdidasIconProps) => (
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
      d="M2 18l6-10M9 18l6-10M16 18l6-10"
    />
  </svg>
);

export default AdidasIcon;
