type NikeIconProps = {
  size?: string;
};

const NikeIcon = ({ size = "18" }: NikeIconProps) => (
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
      d="M2 17c5-2 10-4 15-3 2 0 5 1 5 1-2-2-4-8-6-11l-13 7c0 3 2 5 4 5 3 0 5-2 6-4"
    />
  </svg>
);

export default NikeIcon;
