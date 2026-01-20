type ShoppingCatergoriesShirtClothingTShirtMenTopProps = {
  size?: string;
};

const ClothingIcon = ({
  size = "18",
}: ShoppingCatergoriesShirtClothingTShirtMenTopProps) => (
  <svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
  >
    <path
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m10.5 1.5l3 3l-2 2l-1-1v6a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-6l-1 1l-2-2l3-3Z"
    />
  </svg>
);

export default ClothingIcon;
