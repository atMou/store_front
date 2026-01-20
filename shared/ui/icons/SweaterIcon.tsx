type SweaterIconProps = {
  size?: string;
};

const SweaterIcon = ({ size = "18" }: SweaterIconProps) => (
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
      d="M6 4l2 2v14h8V6l2-2M8 6c0 2 1 3 4 3s4-1 4-3M3 8l3 2v10l-3-2V8zm18 0l-3 2v10l3-2V8z"
    />
  </svg>
);

export default SweaterIcon;
