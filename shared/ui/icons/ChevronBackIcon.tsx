type ChevronBackOutlineProps = {
  size: string;
};

const ChevronBackIcon = ({ size }: ChevronBackOutlineProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 512 512"
  >
    <path
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="48"
      d="M328 112L184 256l144 144"
    />
  </svg>
);

export default ChevronBackIcon;
