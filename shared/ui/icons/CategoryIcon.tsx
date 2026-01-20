type CategoryProps = {
  size?: string;
};

const CategoryIcon = ({ size }: CategoryProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#000000"
  >
    <g
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="17" cy="7" r="3" />
      <circle cx="7" cy="17" r="3" />
      <path d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5ZM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4Z" />
    </g>
  </svg>
);

export default CategoryIcon;
