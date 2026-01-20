type OpenInNewDownSharpProps = {
  size?: string;
};

const NewInIcon = ({ size = "18" }: OpenInNewDownSharpProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="#000000"
      d="M3 21V3h18v9h-2V5H5v14h7v2H3Zm11 0v-2h3.6L8.3 9.7l1.4-1.4l9.3 9.275V14h2v7h-7Z"
    />
  </svg>
);

export default NewInIcon;
