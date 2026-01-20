type HeartProps = {
  size?: string | number;
  fill?: string;
  stroke?: string;
  isFavourite?: boolean;
};

const HeartIcon = ({
  size = 18,
  fill = "none",
  stroke = "currentColor",
  isFavourite = false,
}: HeartProps) => (
  <svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    className="heart-icon"
    style={{
      overflow: "visible",
    }}
  >
    <defs>
      <clipPath id="heart-clip">
        <rect
          x="0"
          y="0"
          width="14"
          height="14"
          className={isFavourite ? "heart-fill-animation" : "heart-fill-reset"}
        />
      </clipPath>
    </defs>
    <path
      fill={fill}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 3.183C3.98-.522.792 2.111.75 4.949C.75 9.173 5.805 12.64 7 12.64s6.25-3.468 6.25-7.692C13.208 2.11 10.02-.522 7 3.183"
      clipPath="url(#heart-clip)"
    />
    <style>{`
      .heart-fill-animation {
        animation: fillFromBottom 0.4s ease-out forwards;
      }
      .heart-fill-reset {
        animation: emptyFromTop 0.3s ease-in forwards;
      }
      @keyframes fillFromBottom {
        from {
          y: 14;
        }
        to {
          y: 0;
        }
      }
      @keyframes emptyFromTop {
        from {
          y: 0;
        }
        to {
          y: 14;
        }
      }
    `}</style>
  </svg>
);

export default HeartIcon;
