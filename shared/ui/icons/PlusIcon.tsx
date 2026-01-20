type PlusProps = {
  size: string;
  isHovered?: boolean;
};

const PlusIcon = ({ size, isHovered }: PlusProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
  >
    <path
      fill={`${isHovered ? "#ffffff" : "#000000"}`}
      d="M10 0c.423 0 .766.343.766.766v8.467h8.468a.766.766 0 1 1 0 1.533h-8.468v8.468a.766.766 0 1 1-1.532 0l-.001-8.468H.766a.766.766 0 0 1 0-1.532l8.467-.001V.766A.768.768 0 0 1 10 0Z"
    />
  </svg>
);

export default PlusIcon;
