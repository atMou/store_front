type InfoProps = {
  size: string;
};

const InfoIcon = ({ size }: InfoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <g fill="none">
      <circle cx="12" cy="12" r="9.25" stroke="#000000" strokeWidth="1.5" />
      <path
        stroke="#000000"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M12 11.813v5"
      />
      <circle cx="12" cy="8.438" r="1.25" fill="#000000" />
    </g>
  </svg>
);

export default InfoIcon;
