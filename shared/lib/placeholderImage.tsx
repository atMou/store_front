import { COLORS } from "@/constants";

export const generatePlaceholderImage = (
  text: string,
  size: number = 200
): string => {
  const initials = text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].hex;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${randomColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
        size * 0.3
      }" 
            fill="white" text-anchor="middle" dy="0.35em" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;

  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  return dataUrl;
};

export const generateProductPlaceholder = (productName: string): string => {
  return generatePlaceholderImage(productName, 400);
};

export const generateUserAvatar = (userName: string): string => {
  return generatePlaceholderImage(userName, 200);
};
