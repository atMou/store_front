type DressIconProps = {
  size?: string;
};

const DressIcon = ({ size = "18" }: DressIconProps) => (
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
      d="M8 4L6 8v12h12V8l-2-4M8 4c0 1.5 1 2 4 2s4-.5 4-2M8 4h8M6 11h12"
    />
  </svg>
);

export default DressIcon;
