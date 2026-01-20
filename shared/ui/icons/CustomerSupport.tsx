type CustomerSupport1Props = {
  size?: string;
  className?: string;
};

const CustomerSupport = ({ size = "18", className }: CustomerSupport1Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#000000"
    className={className}
  >
    <g fill="none" stroke="#000000" strokeWidth="1.5">
      <path d="M2 10h4v6H2zm16 0h4v6h-4zM6 10V8a6 6 0 1 1 12 0v8a4 4 0 0 1-4 4" />
      <path d="M14 21.5v-3h-4v3z" />
    </g>
  </svg>
);

export default CustomerSupport;
