import {
  AccessoriesIcon,
  BabyIcon,
  BeltFillIcon,
  BoyIcon,
  CasesIcon,
  ClothesIcon,
  DesignIcon,
  DressIcon,
  DribbbleIcon,
  FlameIcon,
  FlatShoesLadyIcon,
  FootprintsIcon,
  GirlIcon,
  HatGlassesIcon,
  HeartIcon,
  JacketIcon,
  JeansIcon,
  JewelryIcon,
  LayersIcon,
  PackageIcon,
  PercentIcon,
  ShirtIcon,
  ShoesIcon,
  ShoesLadyIcon,
  SparklesIcon,
  StarIcon,
  StarsCIcon,
  StarsIcon,
  SunglassesIcon,
  TagIcon,
  ToyHorseLineIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrousersIcon,
  TShirtIcon,
  UsersIcon,
  WatchIcon,
  ZapIcon,
} from "@/shared/ui/icons";
import {
  CategoryTabPanels,
  KidsGroupedItems,
  MenGroupedItems,
  WomenGroupedItems,
} from "..";

const KidsBaby: KidsGroupedItems = {
  group: "Baby",
  imageUrl: "kids-baby.jpg",
  borderLeftColor: "#ec4899",
  borderBottomColor: "#93c5fd",
  items: [
    {
      title: "Baby Clothing",
      items: [
        {
          icon: <BabyIcon />,
          text: "Bodysuits & Rompers",
          filters: { category: "Kids", sub: "Baby", type: "Bodysuits" },
        },
        {
          icon: <ShirtIcon />,
          text: "Baby Tops",
          filters: { category: "Kids", sub: "Baby", type: "Tops" },
        },
        {
          icon: <PackageIcon />,
          text: "Baby Bottoms",
          filters: { category: "Kids", sub: "Baby", type: "Bottoms" },
        },
        {
          icon: <ClothesIcon />,
          text: "Sleepwear",
          filters: { category: "Kids", sub: "Baby", type: "Sleepwear" },
        },
      ],
    },
    {
      title: "Baby Essentials",
      items: [
        {
          icon: <ShoesIcon />,
          text: "Baby Shoes",
          filters: { category: "Kids", sub: "Baby", type: "Shoes" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Bibs & Burp Cloths",
          filters: { category: "Kids", type: "Accessories", sub: "Bibs" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Hats & Mittens",
          filters: { category: "Kids", type: "Accessories", sub: "Hats" },
        },
        {
          icon: <HeartIcon />,
          text: "Gift Sets",
          filters: { category: "Kids", sub: "Baby", type: "Gift Sets" },
        },
      ],
    },
    {
      title: "Featured Baby",
      items: [
        {
          icon: <SparklesIcon />,
          text: "New Arrivals",
          filters: { category: "Kids", sub: "Baby", isNew: true },
        },
        {
          icon: <StarIcon />,
          text: "Best Sellers",
          filters: { category: "Kids", sub: "Baby", isBestSeller: true },
        },
        {
          icon: <BabyIcon />,
          text: "Newborn (0-3M)",
          filters: { category: "Kids", sub: "Baby", size: "0-3M" },
        },
        {
          icon: <PackageIcon />,
          text: "Baby Bundles",
          filters: { category: "Kids", sub: "Baby", type: "Bundles" },
        },
      ],
    },
  ],
};

const KidsBoys: KidsGroupedItems = {
  group: "Boys",
  imageUrl: "kids-boy.jpg",
  borderLeftColor: "#3b82f6",
  borderBottomColor: "#06b6d4",
  items: [
    {
      title: "Boys Clothing",
      items: [
        {
          icon: <TShirtIcon />,
          text: "T-Shirts & Tops",
          filters: { category: "Kids", sub: "Boys", type: "T-Shirts" },
        },
        {
          icon: <ShirtIcon />,
          text: "Shirts",
          filters: { category: "Kids", sub: "Boys", type: "Shirts" },
        },
        {
          icon: <PackageIcon />,
          text: "Jeans & Trousers",
          filters: { category: "Kids", sub: "Boys", type: "Bottoms" },
        },
        {
          icon: <ClothesIcon />,
          text: "Shorts",
          filters: { category: "Kids", sub: "Boys", type: "Shorts" },
        },
      ],
    },
    {
      title: "Boys Shoes & Accessories",
      items: [
        {
          icon: <ShoesIcon />,
          text: "Boys Shoes",
          filters: { category: "Kids", sub: "Boys", type: "Shoes" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Caps & Hats",
          filters: { category: "Kids", type: "Accessories", sub: "Caps" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Backpacks",
          filters: { category: "Kids", type: "Accessories", sub: "Backpacks" },
        },
        {
          icon: <DribbbleIcon />,
          text: "Sports Gear",
          filters: { category: "Kids", sub: "Boys", type: "Sports" },
        },
      ],
    },
    {
      title: "Featured Boys",
      items: [
        {
          icon: <SparklesIcon />,
          text: "New Arrivals",
          filters: { category: "Kids", sub: "Boys", isNew: true },
        },
        {
          icon: <TrendingUpIcon />,
          text: "Trending",
          filters: { category: "Kids", sub: "Boys", isTrending: true },
        },
        {
          icon: <StarIcon />,
          text: "Best Sellers",
          filters: { category: "Kids", sub: "Boys", isBestSeller: true },
        },
        {
          icon: <ClothesIcon />,
          text: "Activewear",
          filters: { category: "Kids", sub: "Boys", type: "Activewear" },
        },
      ],
    },
  ],
};

export const KidsGirls: KidsGroupedItems = {
  group: "Girls",
  imageUrl: "kids-girl.jpg",
  borderLeftColor: "#a855f7",
  borderBottomColor: "#f472b6",
  items: [
    {
      title: "Girls Clothing",
      items: [
        {
          icon: <DressIcon />,
          text: "Dresses",
          filters: { category: "Kids", sub: "Girls", type: "Dresses" },
        },
        {
          icon: <TShirtIcon />,
          text: "Tops & T-Shirts",
          filters: { category: "Kids", sub: "Girls", type: "Tops" },
        },
        {
          icon: <ClothesIcon />,
          text: "Skirts",
          filters: { category: "Kids", sub: "Girls", type: "Skirts" },
        },
        {
          icon: <PackageIcon />,
          text: "Jeans & Trousers",
          filters: { category: "Kids", sub: "Girls", type: "Bottoms" },
        },
      ],
    },
    {
      title: "Girls Shoes & Accessories",
      items: [
        {
          icon: <ShoesIcon />,
          text: "Girls Shoes",
          filters: { category: "Kids", sub: "Girls", type: "Shoes" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Hair Accessories",
          filters: { category: "Kids", type: "Accessories", sub: "Hair" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Bags",
          filters: { category: "Kids", type: "Accessories", sub: "Bags" },
        },
        {
          icon: <HeartIcon />,
          text: "Jewellery",
          filters: { category: "Kids", type: "Accessories", sub: "Jewellery" },
        },
      ],
    },
    {
      title: "Featured Girls",
      items: [
        {
          icon: <SparklesIcon />,
          text: "New Arrivals",
          filters: { category: "Kids", sub: "Girls", isNew: true },
        },
        {
          icon: <TrendingUpIcon />,
          text: "Trending",
          filters: { category: "Kids", sub: "Girls", isTrending: true },
        },
        {
          icon: <StarIcon />,
          text: "Best Sellers",
          filters: { category: "Kids", sub: "Girls", isBestSeller: true },
        },
        {
          icon: <ClothesIcon />,
          text: "Party Wear",
          filters: { category: "Kids", sub: "Girls", type: "Party Wear" },
        },
      ],
    },
  ],
};

export const KidsSale: KidsGroupedItems = {
  group: "Sale",
  imageUrl: "kids-sale.jpg",
  borderLeftColor: "#f97316",
  borderBottomColor: "#ef4444",
  items: [
    {
      title: "Sale by Age",
      items: [
        {
          icon: <TagIcon />,
          text: "All Sale Items",
          filters: { category: "Kids" },
        },
        {
          icon: <UsersIcon />,
          text: "Girls Sale",
          filters: { category: "Kids", sub: "Girls" },
        },
        {
          icon: <UsersIcon />,
          text: "Boys Sale",
          filters: { category: "Kids", sub: "Boys" },
        },
        {
          icon: <BabyIcon />,
          text: "Baby Sale",
          filters: { category: "Kids", sub: "Baby" },
        },
      ],
    },
    {
      title: "By Discount",
      items: [
        {
          icon: <PercentIcon />,
          text: "Up to 30% Off",
          filters: { category: "Kids", maxPrice: 40 },
        },
        {
          icon: <PercentIcon />,
          text: "Up to 50% Off",
          filters: { category: "Kids", maxPrice: 30 },
        },
        {
          icon: <TrendingDownIcon />,
          text: "Up to 70% Off",
          filters: { category: "Kids", maxPrice: 15 },
        },
        {
          icon: <FlameIcon />,
          text: "Clearance",
          filters: { category: "Kids", orderBy: "price", sortDir: "asc" },
        },
      ],
    },
    {
      title: "Sale Categories",
      items: [
        {
          icon: <ClothesIcon />,
          text: "Clothing Sale",
          filters: { category: "Kids", type: "Clothing" },
        },
        {
          icon: <ShoesIcon />,
          text: "Shoes Sale",
          filters: { category: "Kids", type: "Shoes" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Accessories Sale",
          filters: { category: "Kids", type: "Accessories" },
        },
        {
          icon: <ZapIcon />,
          text: "Best Sellers",
          filters: { category: "Kids", isBestSeller: true },
        },
      ],
    },
  ],
};

export const KidsShoes: KidsGroupedItems = {
  group: "Shoes",
  imageUrl: "kids-shoe.jpg",
  borderLeftColor: "#10b981",
  borderBottomColor: "#14b8a6",
  items: [
    {
      title: "By Age",
      items: [
        {
          icon: <PackageIcon />,
          text: "Discover All",
          filters: { category: "Kids", type: "Shoes" },
        },
        {
          icon: <GirlIcon />,
          text: "Girls Shoes",
          filters: { category: "Kids", sub: "Girls", type: "Shoes" },
        },
        {
          icon: <BoyIcon />,
          text: "Boys Shoes",
          filters: { category: "Kids", sub: "Boys", type: "Shoes" },
        },
        {
          icon: <BabyIcon />,
          text: "Baby Shoes",
          filters: { category: "Kids", sub: "Baby", type: "Shoes" },
        },
      ],
    },
    {
      title: "Categories",
      items: [
        {
          icon: <ShoesIcon />,
          text: "Sneakers",
          filters: { category: "Kids", type: "Shoes", sub: "Sneakers" },
        },
        {
          icon: <FootprintsIcon />,
          text: "Boots",
          filters: { category: "Kids", type: "Shoes", sub: "Boots" },
        },
        {
          icon: <ShoesIcon />,
          text: "Sandals",
          filters: { category: "Kids", type: "Shoes", sub: "Sandals" },
        },
        {
          icon: <StarIcon />,
          text: "School Shoes",
          filters: { category: "Kids", type: "Shoes", sub: "School" },
        },
      ],
    },
    {
      title: "Discover More",
      items: [
        {
          icon: <SparklesIcon />,
          text: "New Arrivals",
          filters: { category: "Kids", type: "Shoes", isNew: true },
        },
        {
          icon: <ZapIcon />,
          text: "Athletic Shoes",
          filters: { category: "Kids", type: "Shoes", sub: "Athletic" },
        },
        {
          icon: <DesignIcon />,
          text: "Designer Shoes",
          filters: { category: "Kids", type: "Shoes", isFeatured: true },
        },
      ],
    },
  ],
};

export const MenAccessories: MenGroupedItems = {
  group: "Accessories",
  imageUrl: "men-acccessories.jpg",
  borderLeftColor: "#92400e",
  borderBottomColor: "#f59e0b",
  items: [
    {
      title: "Categories",
      items: [
        { icon: <StarsCIcon />, text: "Discover All", filters: {} },
        { icon: <CasesIcon />, text: "Bags & suitcases", filters: {} },
        { icon: <JewelryIcon />, text: "Jewellery", filters: {} },
        { icon: <WatchIcon />, text: "Watches", filters: {} },
      ],
    },
    {
      title: "More Categories",
      items: [
        { icon: <SunglassesIcon />, text: "Sunglasses", filters: {} },
        { icon: <BeltFillIcon />, text: "Belts", filters: {} },
        { icon: <HatGlassesIcon />, text: "Hats & Caps", filters: {} },
      ],
    },
    {
      title: "Discover More",
      items: [
        { icon: <BoyIcon />, text: "Kids Accessories", filters: {} },
        { icon: <BabyIcon />, text: "Baby Accessories", filters: {} },
        { icon: <ToyHorseLineIcon />, text: "Toys & Games", filters: {} },
      ],
    },
  ],
};

export const MenClothing: MenGroupedItems = {
  group: "Clothing",
  imageUrl: "men-clothing.jpg",
  borderLeftColor: "#1e40af",
  borderBottomColor: "#6366f1",
  items: [
    {
      title: "Categories",
      items: [
        {
          icon: <PackageIcon />,
          text: "Discover all",
          filters: { category: "Men", type: "Discover all", sub: "Clothing" },
        },
        {
          icon: <ClothesIcon />,
          text: "Knitwear",
          filters: { category: "Men", type: "Knitwear", sub: "Clothing" },
        },
        {
          icon: <JacketIcon />,
          text: "Jackets",
          filters: { category: "Men", type: "Jackets", sub: "Clothing" },
        },
        {
          icon: <LayersIcon />,
          text: "Coats",
          filters: { category: "Men", type: "Coats", sub: "Clothing" },
        },
        {
          icon: <ClothesIcon />,
          text: "Sweatshirts & Hoodies",
          filters: {
            category: "Men",
            type: "Sweatshirts & Hoodies",
            sub: "Clothing",
          },
        },
        {
          icon: <ShirtIcon />,
          text: "Shirts",
          filters: { category: "Men", type: "Shirts", sub: "Clothing" },
        },
        {
          icon: <DesignIcon />,
          text: "More categories",
          filters: {
            category: "Men",
            type: "More categories",
            sub: "Clothing",
          },
        },
      ],
    },
    {
      title: "",
      items: [
        {
          icon: <TShirtIcon />,
          text: "T-shirts & Polos",
          filters: {
            category: "Men",
            type: "T-shirts & Polos",
            sub: "Clothing",
          },
        },
        {
          icon: <TrousersIcon />,
          text: "Trousers",
          filters: { category: "Men", type: "Trousers", sub: "Clothing" },
        },
        {
          icon: <JeansIcon />,
          text: "Jeans",
          filters: { category: "Men", type: "Jeans", sub: "Clothing" },
        },
        {
          icon: <ShirtIcon />,
          text: "Suits & Tailoring",
          filters: {
            category: "Men",
            type: "Suits & Tailoring",
            sub: "Clothing",
          },
        },
        {
          icon: <ClothesIcon />,
          text: "Tracksuits & Joggers",
          filters: {
            category: "Men",
            type: "Tracksuits & Joggers",
            sub: "Clothing",
          },
        },
        {
          icon: <ClothesIcon />,
          text: "Shorts",
          filters: { category: "Men", type: "Shorts", sub: "Clothing" },
        },
      ],
    },
    {
      title: "Discover more",
      items: [
        {
          icon: <ClothesIcon />,
          text: "Underwear & Socks",
          filters: {
            category: "Men",
            type: "Underwear & Socks",
            sub: "Clothing",
          },
        },
        {
          icon: <ClothesIcon />,
          text: "Lounge- & Sleepwear",
          filters: {
            category: "Men",
            type: "Lounge- & Sleepwear",
            sub: "Clothing",
          },
        },
        {
          icon: <ZapIcon />,
          text: "Plus size",
          filters: { category: "Men", type: "Plus size", sub: "Clothing" },
        },
        {
          icon: <DesignIcon />,
          text: "Adaptive Fashion",
          filters: {
            category: "Men",
            type: "Adaptive Fashion",
            sub: "Clothing",
          },
        },
        {
          icon: <ClothesIcon />,
          text: "Swimwear",
          filters: { category: "Men", type: "Swimwear", sub: "Clothing" },
        },
      ],
    },
  ],
};

export const MenSale: MenGroupedItems = {
  group: "Sale",
  imageUrl: "men-sale.jpg",
  borderLeftColor: "#dc2626",
  borderBottomColor: "#f97316",
  items: [
    {
      title: "Sale Categories",
      items: [
        {
          icon: <TagIcon />,
          text: "All Sale Items",
          filters: { category: "Men" },
        },
        {
          icon: <ClothesIcon />,
          text: "Clothing Sale",
          filters: { category: "Men", type: "Clothing" },
        },
        {
          icon: <ShoesIcon />,
          text: "Shoes Sale",
          filters: { category: "Men", type: "Shoes" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Accessories Sale",
          filters: { category: "Men", type: "Accessories" },
        },
      ],
    },
    {
      title: "By Discount",
      items: [
        {
          icon: <PercentIcon />,
          text: "Up to 30% Off",
          filters: { category: "Men", maxPrice: 70 },
        },
        {
          icon: <PercentIcon />,
          text: "Up to 50% Off",
          filters: { category: "Men", maxPrice: 50 },
        },
        {
          icon: <TrendingDownIcon />,
          text: "Up to 70% Off",
          filters: { category: "Men", maxPrice: 30 },
        },
        {
          icon: <FlameIcon />,
          text: "Clearance",
          filters: { category: "Men", orderBy: "price", sortDir: "asc" },
        },
      ],
    },
    {
      title: "Featured Sale",
      items: [
        {
          icon: <TShirtIcon />,
          text: "T-Shirts Sale",
          filters: { category: "Men", type: "Men T-Shirts" },
        },
        {
          icon: <PackageIcon />,
          text: "Jeans Sale",
          filters: { category: "Men", type: "Men Jeans" },
        },
        {
          icon: <ClothesIcon />,
          text: "Jackets Sale",
          filters: { category: "Men", type: "Men Jackets" },
        },
        {
          icon: <ZapIcon />,
          text: "Best Sellers",
          filters: { category: "Men", isBestSeller: true },
        },
      ],
    },
  ],
};

export const MenShoes: MenGroupedItems = {
  group: "Shoes",
  imageUrl: "men-shoe.jpg",
  borderLeftColor: "#475569",
  borderBottomColor: "#71717a",
  items: [
    {
      title: "Categories",
      items: [
        {
          icon: <PackageIcon />,
          text: "Discover All",
          filters: { category: "Men", type: "Shoes" },
        },
        {
          icon: <ShoesIcon />,
          text: "Sneakers",
          filters: { category: "Men", type: "Men Sneakers" },
        },
        {
          icon: <FootprintsIcon />,
          text: "Boots",
          filters: { category: "Men", type: "Men Boots" },
        },
        {
          icon: <ShoesIcon />,
          text: "Loafers",
          filters: { category: "Men", type: "Men Loafers" },
        },
        {
          icon: <ShoesIcon />,
          text: "Sandals",
          filters: { category: "Men", type: "Men Sandals" },
        },
      ],
    },
    {
      title: "By Style",
      items: [
        {
          icon: <FootprintsIcon />,
          text: "Casual Shoes",
          filters: { category: "Men", type: "Shoes", sub: "Casual" },
        },
        {
          icon: <StarIcon />,
          text: "Formal Shoes",
          filters: { category: "Men", type: "Shoes", sub: "Formal" },
        },
        {
          icon: <ZapIcon />,
          text: "Athletic Shoes",
          filters: { category: "Men", type: "Shoes", sub: "Athletic" },
        },
      ],
    },
    {
      title: "Discover More",
      items: [
        {
          icon: <SparklesIcon />,
          text: "New Arrivals",
          filters: { category: "Men", type: "Shoes", isNew: true },
        },
        {
          icon: <DesignIcon />,
          text: "Designer Shoes",
          filters: { category: "Men", type: "Shoes", isFeatured: true },
        },
        {
          icon: <ClothesIcon />,
          text: "Complete the Look",
          filters: { category: "Men" },
        },
      ],
    },
  ],
};

export const MenTrending: MenGroupedItems = {
  group: "Trending",
  imageUrl: "men-trending.jpg",
  borderLeftColor: "#059669",
  borderBottomColor: "#84cc16",
  items: [
    {
      title: "What's Trending",
      items: [
        {
          icon: <TrendingUpIcon />,
          text: "All Trending",
          filters: { category: "Men", isTrending: true },
        },
        {
          icon: <FlameIcon />,
          text: "Hot This Week",
          filters: { category: "Men", isTrending: true, isBestSeller: true },
        },
        {
          icon: <SparklesIcon />,
          text: "New Trends",
          filters: { category: "Men", isTrending: true, isNew: true },
        },
        {
          icon: <StarIcon />,
          text: "Top Rated",
          filters: { category: "Men", orderBy: "rating", sortDir: "desc" },
        },
      ],
    },
    {
      title: "Trending Categories",
      items: [
        {
          icon: <ClothesIcon />,
          text: "Trending Clothing",
          filters: { category: "Men", type: "Clothing", isTrending: true },
        },
        {
          icon: <ShoesIcon />,
          text: "Trending Sneakers",
          filters: { category: "Men", type: "Shoes", isTrending: true },
        },
        {
          icon: <JewelryIcon />,
          text: "Trending Accessories",
          filters: { category: "Men", type: "Accessories", isTrending: true },
        },
      ],
    },
    {
      title: "Style Trends",
      items: [
        {
          icon: <ZapIcon />,
          text: "Streetwear",
          filters: { category: "Men", isTrending: true },
        },
        {
          icon: <DesignIcon />,
          text: "Designer Trends",
          filters: { category: "Men", isTrending: true, isFeatured: true },
        },
        {
          icon: <HeartIcon />,
          text: "Most Loved",
          filters: { category: "Men", isBestSeller: true },
        },
      ],
    },
  ],
};

export const WomenAccessories: WomenGroupedItems = {
  group: "Accessories",
  imageUrl: "women-accessories.jpg",
  borderLeftColor: "#c026d3",
  borderBottomColor: "#ec4899",
  items: [
    {
      title: "Categories",
      items: [
        {
          icon: <StarsIcon />,
          text: "Discover all",
          filters: { category: "Women", sub: "Accessories" },
        },
        {
          icon: <HatGlassesIcon />,
          text: "Beanies",
          filters: { category: "Women", sub: "Accessories", type: "Beanies" },
        },
        {
          icon: <HatGlassesIcon />,
          text: "Balaclava",
          filters: { category: "Women", sub: "Accessories", type: "Balaclava" },
        },
        {
          icon: <HatGlassesIcon />,
          text: "Scarves",
          filters: { category: "Women", sub: "Accessories", type: "Scarves" },
        },
        {
          icon: <HatGlassesIcon />,
          text: "Gloves",
          filters: { category: "Women", sub: "Accessories", type: "Gloves" },
        },
        {
          icon: <StarsIcon />,
          text: "More categories",
          filters: { category: "Women", sub: "Accessories" },
        },
      ],
    },
    {
      title: "Discover more",

      items: [
        {
          icon: <CasesIcon />,
          text: "Bags & cases",
          filters: { category: "Women", sub: "Accessories", type: "Bags" },
        },
        {
          icon: <JewelryIcon />,
          text: "Jewellery",
          filters: { category: "Women", sub: "Accessories", type: "Jewellery" },
        },
        {
          icon: <BeltFillIcon />,
          text: "Belts",
          filters: { category: "Women", sub: "Accessories", type: "Belts" },
        },
        {
          icon: <WatchIcon />,
          text: "Watches",
          filters: { category: "Women", sub: "Accessories", type: "Watches" },
        },
        {
          icon: <CasesIcon />,
          text: "Wallets & card holders",
          filters: { category: "Women", sub: "Accessories", type: "Wallets" },
        },
      ],
    },
    {
      title: "",
      items: [
        {
          icon: <SunglassesIcon />,
          text: "Sunglasses",
          filters: {
            category: "Women",
            sub: "Accessories",
            type: "Sunglasses",
          },
        },
        {
          icon: <SparklesIcon />,
          text: "Home at Lounge by Zalando",
          filters: { category: "Women", sub: "Accessories", type: "Home" },
        },
        {
          icon: <CasesIcon />,
          text: "Tech-Accessories & Audio",
          filters: { category: "Women", sub: "Accessories", type: "Tech" },
        },
        {
          icon: <SunglassesIcon />,
          text: "Blue-light glasses",
          filters: {
            category: "Women",
            sub: "Accessories",
            type: "Blue-light glasses",
          },
        },
      ],
    },
  ],
};

export const WomenClothing: WomenGroupedItems = {
  group: "Clothing",
  imageUrl: "women-clothing.jpg",
  borderLeftColor: "#7c3aed",
  borderBottomColor: "#a855f7",
  items: [
    {
      title: "Categories",
      items: [
        {
          icon: <PackageIcon />,
          text: "Discover all",
          filters: { category: "Women", sub: "Clothing" },
        },
        {
          icon: <ClothesIcon />,
          text: "Knitwear & Cardigans",
          filters: { category: "Women", sub: "Clothing", type: "Knitwear" },
        },
        {
          icon: <LayersIcon />,
          text: "Coats",
          filters: { category: "Women", sub: "Clothing", type: "Coats" },
        },
        {
          icon: <JacketIcon />,
          text: "Jackets",
          filters: {
            category: "Women",
            sub: "Clothing",
            type: "Women Jackets",
          },
        },
        {
          icon: <TrousersIcon />,
          text: "Trousers",
          filters: {
            category: "Women",
            sub: "Clothing",
            type: "Women Trousers",
          },
        },
        {
          icon: <JeansIcon />,
          text: "Jeans",
          filters: { category: "Women", sub: "Clothing", type: "Women Jeans" },
        },
        {
          icon: <PackageIcon />,
          text: "More categories",
          filters: { category: "Women", sub: "Clothing" },
        },
      ],
    },
    {
      title: "Discover more",
      items: [
        {
          icon: <SparklesIcon />,
          text: "Dresses",
          filters: { category: "Women", sub: "Clothing", type: "Dresses" },
        },
        {
          icon: <ClothesIcon />,
          text: "Skirts",
          filters: { category: "Women", sub: "Clothing", type: "Skirts" },
        },
        {
          icon: <ShirtIcon />,
          text: "Shirts & Blouses",
          filters: { category: "Women", sub: "Clothing", type: "Blouses" },
        },
        {
          icon: <TShirtIcon />,
          text: "Sweatshirts & Hoodies",
          filters: { category: "Women", sub: "Clothing", type: "Sweatshirts" },
        },
        {
          icon: <TShirtIcon />,
          text: "T-shirts & tops",
          filters: {
            category: "Women",
            sub: "Clothing",
            type: "Women T-Shirts",
          },
        },
        {
          icon: <ClothesIcon />,
          text: "Jumpsuits",
          filters: { category: "Women", sub: "Clothing", type: "Jumpsuits" },
        },
      ],
    },
    {
      title: "",
      items: [
        {
          icon: <ClothesIcon />,
          text: "Underwear",
          filters: { category: "Women", sub: "Clothing", type: "Underwear" },
        },
        {
          icon: <ClothesIcon />,
          text: "Night- & Loungewear",
          filters: { category: "Women", sub: "Clothing", type: "Loungewear" },
        },
        {
          icon: <ClothesIcon />,
          text: "Socks & Tights",
          filters: { category: "Women", sub: "Clothing", type: "Socks" },
        },
        {
          icon: <SparklesIcon />,
          text: "Adaptive Fashion",
          filters: { category: "Women", sub: "Clothing", type: "Adaptive" },
        },
        {
          icon: <ClothesIcon />,
          text: "Swimwear",
          filters: { category: "Women", sub: "Clothing", type: "Swimwear" },
        },
      ],
    },
  ],
};

export const WomenSale: WomenGroupedItems = {
  group: "Sale",
  imageUrl: "women-sale.jpg",
  borderLeftColor: "#e11d48",
  borderBottomColor: "#f43f5e",
  items: [
    {
      title: "Sale Categories",
      items: [
        {
          icon: <TagIcon />,
          text: "All Sale Items",
          filters: { category: "Women" },
        },
        {
          icon: <ClothesIcon />,
          text: "Clothing Sale",
          filters: { category: "Women", type: "Clothing" },
        },
        {
          icon: <ShoesIcon />,
          text: "Shoes Sale",
          filters: { category: "Women", type: "Shoes" },
        },
        {
          icon: <AccessoriesIcon />,
          text: "Accessories Sale",
          filters: { category: "Women", type: "Accessories" },
        },
      ],
    },
    {
      title: "By Discount",
      items: [
        {
          icon: <PercentIcon />,
          text: "Up to 30% Off",
          filters: { category: "Women", maxPrice: 70 },
        },
        {
          icon: <PercentIcon />,
          text: "Up to 50% Off",
          filters: { category: "Women", maxPrice: 50 },
        },
        {
          icon: <TrendingDownIcon />,
          text: "Up to 70% Off",
          filters: { category: "Women", maxPrice: 30 },
        },
        {
          icon: <FlameIcon />,
          text: "Clearance",
          filters: { category: "Women", orderBy: "price", sortDir: "asc" },
        },
      ],
    },
    {
      title: "Featured Sale",
      items: [
        {
          icon: <ShirtIcon />,
          text: "Dresses Sale",
          filters: { category: "Women", type: "Dresses" },
        },
        {
          icon: <PackageIcon />,
          text: "Jeans Sale",
          filters: { category: "Women", type: "Women Jeans" },
        },
        {
          icon: <JewelryIcon />,
          text: "Jewellery Sale",
          filters: { category: "Women", type: "Accessories", sub: "Jewellery" },
        },
        {
          icon: <ZapIcon />,
          text: "Best Sellers",
          filters: { category: "Women", isBestSeller: true },
        },
      ],
    },
  ],
};

export const WomenShoes: WomenGroupedItems = {
  group: "Shoes",
  imageUrl: "women-shoe.jpg",
  borderLeftColor: "#d97706",
  borderBottomColor: "#eab308",
  items: [
    {
      title: "Categories",
      items: [
        {
          icon: <PackageIcon />,
          text: "Discover all",
          filters: { category: "Women", sub: "Shoes" },
        },
        {
          icon: <FootprintsIcon />,
          text: "Boots",
          filters: { category: "Women", sub: "Shoes", type: "Boots" },
        },
        {
          icon: <ShoesLadyIcon />,
          text: "Ankle boots",
          filters: { category: "Women", sub: "Shoes", type: "Ankle Boots" },
        },
        {
          icon: <FlatShoesLadyIcon />,
          text: "Flat shoes",
          filters: { category: "Women", sub: "Shoes", type: "Flat Shoes" },
        },
        {
          icon: <ShoesIcon />,
          text: "Trainers",
          filters: { category: "Women", sub: "Shoes", type: "Trainers" },
        },
        {
          icon: <ShoesLadyIcon />,
          text: "High heels",
          filters: { category: "Women", sub: "Shoes", type: "High Heels" },
        },
        {
          icon: <StarIcon />,
          text: "More categories",
          filters: { category: "Women", sub: "Shoes", type: "More" },
        },
      ],
    },
    {
      title: "Sneaker Hot Drops",
      items: [
        {
          icon: <FlatShoesLadyIcon />,
          text: "Ballet pumps",
          filters: { category: "Women", sub: "Shoes", type: "Ballet Pumps" },
        },
        {
          icon: <ShoesLadyIcon />,
          text: "Pumps",
          filters: { category: "Women", sub: "Shoes", type: "Pumps" },
        },
        {
          icon: <ShoesIcon />,
          text: "Mules",
          filters: { category: "Women", sub: "Shoes", type: "Mules" },
        },
        {
          icon: <ShoesIcon />,
          text: "Slippers",
          filters: { category: "Women", sub: "Shoes", type: "Slippers" },
        },
        {
          icon: <ShoesIcon />,
          text: "Sandals",
          filters: { category: "Women", sub: "Shoes", type: "Sandals" },
        },
      ],
    },
    {
      title: "Shop by occasion",
      items: [
        {
          icon: <ShoesIcon />,
          text: "Outdoor shoes",
          filters: { category: "Women", sub: "Shoes", type: "Outdoor" },
        },
        {
          icon: <ShoesIcon />,
          text: "Sport shoes",
          filters: { category: "Women", sub: "Shoes", type: "Sport" },
        },
        {
          icon: <SparklesIcon />,
          text: "Bridal shoes",
          filters: { category: "Women", sub: "Shoes", type: "Bridal" },
        },
        {
          icon: <ShoesIcon />,
          text: "Beach shoes",
          filters: { category: "Women", sub: "Shoes", type: "Beach" },
        },
        {
          icon: <ZapIcon />,
          text: "Running shoes",
          filters: { category: "Women", sub: "Shoes", type: "Running" },
        },
        {
          icon: <StarIcon />,
          text: "Shoe accessories",
          filters: {
            category: "Women",
            type: "Shoes",
            sub: "Shoe Accessories",
          },
        },
      ],
    },
  ],
};

export const WomenTrending: WomenGroupedItems = {
  group: "Trending",
  imageUrl: "women-trending.jpg",
  borderLeftColor: "#0284c7",
  borderBottomColor: "#06b6d4",
  items: [
    {
      title: "What's Trending",
      items: [
        {
          icon: <TrendingUpIcon />,
          text: "All Trending",
          filters: { category: "Women", isTrending: true },
        },
        {
          icon: <FlameIcon />,
          text: "Hot This Week",
          filters: { category: "Women", isTrending: true, isBestSeller: true },
        },
        {
          icon: <SparklesIcon />,
          text: "New Trends",
          filters: { category: "Women", isTrending: true, isNew: true },
        },
        {
          icon: <StarIcon />,
          text: "Top Rated",
          filters: { category: "Women", orderBy: "rating", sortDir: "desc" },
        },
      ],
    },
    {
      title: "Trending Categories",
      items: [
        {
          icon: <ShirtIcon />,
          text: "Trending Dresses",
          filters: { category: "Women", type: "Dresses", isTrending: true },
        },
        {
          icon: <ClothesIcon />,
          text: "Trending Clothing",
          filters: { category: "Women", type: "Clothing", isTrending: true },
        },
        {
          icon: <ShoesIcon />,
          text: "Trending Shoes",
          filters: { category: "Women", type: "Shoes", isTrending: true },
        },
        {
          icon: <JewelryIcon />,
          text: "Trending Jewellery",
          filters: {
            category: "Women",
            type: "Accessories",
            sub: "Jewellery",
            isTrending: true,
          },
        },
      ],
    },
    {
      title: "Style Trends",
      items: [
        {
          icon: <ZapIcon />,
          text: "Fashion Forward",
          filters: { category: "Women", isTrending: true },
        },
        {
          icon: <DesignIcon />,
          text: "Designer Trends",
          filters: { category: "Women", isTrending: true, isFeatured: true },
        },
        {
          icon: <HeartIcon />,
          text: "Most Loved",
          filters: { category: "Women", isBestSeller: true },
        },
      ],
    },
  ],
};

export const MenTabPanels: CategoryTabPanels = {
  category: "Men",
  tabs: [MenAccessories, MenClothing, MenTrending, MenShoes, MenSale],
};

export const WomenTabPanels: CategoryTabPanels = {
  category: "Women",
  tabs: [WomenAccessories, WomenClothing, WomenTrending, WomenShoes, WomenSale],
};

export const KidsTabPanels: CategoryTabPanels = {
  category: "Kids",
  tabs: [KidsGirls, KidsBoys, KidsBaby, KidsShoes, KidsSale],
};
