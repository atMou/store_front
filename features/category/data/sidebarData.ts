import { MainCategoryType } from "..";

export interface SidebarSubType {
  name: string;
  subType: string;
}

export interface SidebarType {
  type: string;
  subTypes: SidebarSubType[];
}

export interface SidebarCategory {
  main: MainCategoryType;
  sub: string;
  types: SidebarType[];
}

const menClothingSidebar: SidebarCategory = {
  main: "Men",
  sub: "Clothing",
  types: [
    {
      type: "Knitwear",
      subTypes: [
        { name: "Sweaters", subType: "Sweaters" },
        { name: "Cardigans", subType: "Cardigans" },
        { name: "Turtlenecks", subType: "Turtlenecks" },
        { name: "Pullovers", subType: "Pullovers" },
      ],
    },
    {
      type: "Jackets",
      subTypes: [
        { name: "Bomber Jackets", subType: "Bomber" },
        { name: "Denim Jackets", subType: "Denim" },
        { name: "Leather Jackets", subType: "Leather" },
        { name: "Windbreakers", subType: "Windbreaker" },
        { name: "Track Jackets", subType: "Track" },
      ],
    },
    {
      type: "Coats",
      subTypes: [
        { name: "Overcoats", subType: "Overcoat" },
        { name: "Trench Coats", subType: "Trench" },
        { name: "Puffer Coats", subType: "Puffer" },
        { name: "Wool Coats", subType: "Wool" },
        { name: "Parkas", subType: "Parka" },
      ],
    },
    {
      type: "Sweatshirts & Hoodies",
      subTypes: [
        { name: "Hoodies", subType: "Hoodies" },
        { name: "Sweatshirts", subType: "Sweatshirts" },
        { name: "Zip Hoodies", subType: "Zip Hoodies" },
        { name: "Crew Neck", subType: "Crew Neck" },
      ],
    },
    {
      type: "Shirts",
      subTypes: [
        { name: "Casual Shirts", subType: "Casual" },
        { name: "Dress Shirts", subType: "Dress" },
        { name: "Denim Shirts", subType: "Denim" },
        { name: "Flannel Shirts", subType: "Flannel" },
        { name: "Oxford Shirts", subType: "Oxford" },
      ],
    },
    {
      type: "T-shirts & Polos",
      subTypes: [
        { name: "T-Shirts", subType: "T-Shirts" },
        { name: "Polo Shirts", subType: "Polo" },
        { name: "Long Sleeve", subType: "Long Sleeve" },
        { name: "Graphic Tees", subType: "Graphic" },
        { name: "V-Neck", subType: "V-Neck" },
      ],
    },
    {
      type: "Trousers",
      subTypes: [
        { name: "Chinos", subType: "Chinos" },
        { name: "Dress Pants", subType: "Dress" },
        { name: "Cargo Pants", subType: "Cargo" },
        { name: "Casual Trousers", subType: "Casual" },
        { name: "Cropped Trousers", subType: "Cropped" },
      ],
    },
    {
      type: "Jeans",
      subTypes: [
        { name: "Slim Fit", subType: "Slim" },
        { name: "Straight Fit", subType: "Straight" },
        { name: "Skinny Fit", subType: "Skinny" },
        { name: "Regular Fit", subType: "Regular" },
        { name: "Relaxed Fit", subType: "Relaxed" },
      ],
    },
    {
      type: "Suits & Tailoring",
      subTypes: [
        { name: "Suits", subType: "Suits" },
        { name: "Blazers", subType: "Blazers" },
        { name: "Suit Trousers", subType: "Suit Trousers" },
        { name: "Waistcoats", subType: "Waistcoats" },
        { name: "Tuxedos", subType: "Tuxedos" },
      ],
    },
    {
      type: "Tracksuits & Joggers",
      subTypes: [
        { name: "Tracksuits", subType: "Tracksuits" },
        { name: "Joggers", subType: "Joggers" },
        { name: "Track Pants", subType: "Track Pants" },
        { name: "Sweatpants", subType: "Sweatpants" },
      ],
    },
    {
      type: "Shorts",
      subTypes: [
        { name: "Casual Shorts", subType: "Casual" },
        { name: "Denim Shorts", subType: "Denim" },
        { name: "Sports Shorts", subType: "Sports" },
        { name: "Chino Shorts", subType: "Chino" },
        { name: "Cargo Shorts", subType: "Cargo" },
      ],
    },
    {
      type: "Underwear & Socks",
      subTypes: [
        { name: "Boxers", subType: "Boxers" },
        { name: "Briefs", subType: "Briefs" },
        { name: "Socks", subType: "Socks" },
        { name: "Undershirts", subType: "Undershirts" },
        { name: "Long Johns", subType: "Long Johns" },
      ],
    },
    {
      type: "Lounge- & Sleepwear",
      subTypes: [
        { name: "Pajamas", subType: "Pajamas" },
        { name: "Lounge Pants", subType: "Lounge Pants" },
        { name: "Robes", subType: "Robes" },
        { name: "Sleep Shorts", subType: "Sleep Shorts" },
      ],
    },
    {
      type: "Plus size",
      subTypes: [{ name: "Plus Size Clothing", subType: "Plus Size" }],
    },
    {
      type: "Adaptive Fashion",
      subTypes: [{ name: "Adaptive Clothing", subType: "Adaptive" }],
    },
    {
      type: "Swimwear",
      subTypes: [
        { name: "Swim Trunks", subType: "Trunks" },
        { name: "Board Shorts", subType: "Board Shorts" },
        { name: "Swim Briefs", subType: "Briefs" },
        { name: "Rash Guards", subType: "Rash Guards" },
      ],
    },
  ],
};

const menShoesSidebar: SidebarCategory = {
  main: "Men",
  sub: "Shoes",
  types: [
    {
      type: "Trainers",
      subTypes: [
        { name: "Running Shoes", subType: "Running" },
        { name: "Casual Trainers", subType: "Casual" },
        { name: "High Tops", subType: "High Tops" },
        { name: "Low Tops", subType: "Low Tops" },
        { name: "Slip-On Trainers", subType: "Slip-On" },
      ],
    },
    {
      type: "Boots",
      subTypes: [
        { name: "Chelsea Boots", subType: "Chelsea" },
        { name: "Desert Boots", subType: "Desert" },
        { name: "Work Boots", subType: "Work" },
        { name: "Combat Boots", subType: "Combat" },
        { name: "Hiking Boots", subType: "Hiking" },
      ],
    },
    {
      type: "Formal Shoes",
      subTypes: [
        { name: "Oxfords", subType: "Oxfords" },
        { name: "Derby Shoes", subType: "Derby" },
        { name: "Loafers", subType: "Loafers" },
        { name: "Brogues", subType: "Brogues" },
        { name: "Monk Straps", subType: "Monk Straps" },
      ],
    },
    {
      type: "Sandals & Slides",
      subTypes: [
        { name: "Slides", subType: "Slides" },
        { name: "Flip Flops", subType: "Flip Flops" },
        { name: "Sport Sandals", subType: "Sport" },
        { name: "Leather Sandals", subType: "Leather" },
      ],
    },
  ],
};

const menAccessoriesSidebar: SidebarCategory = {
  main: "Men",
  sub: "Accessories",
  types: [
    {
      type: "Bags",
      subTypes: [
        { name: "Backpacks", subType: "Backpacks" },
        { name: "Messenger Bags", subType: "Messenger" },
        { name: "Duffel Bags", subType: "Duffel" },
        { name: "Briefcases", subType: "Briefcases" },
        { name: "Tote Bags", subType: "Tote" },
      ],
    },
    {
      type: "Watches",
      subTypes: [
        { name: "Analog Watches", subType: "Analog" },
        { name: "Digital Watches", subType: "Digital" },
        { name: "Smart Watches", subType: "Smart" },
        { name: "Sport Watches", subType: "Sport" },
      ],
    },
    {
      type: "Wallets & Card Holders",
      subTypes: [
        { name: "Wallets", subType: "Wallets" },
        { name: "Card Holders", subType: "Card Holders" },
        { name: "Money Clips", subType: "Money Clips" },
      ],
    },
    {
      type: "Belts",
      subTypes: [
        { name: "Leather Belts", subType: "Leather" },
        { name: "Canvas Belts", subType: "Canvas" },
        { name: "Dress Belts", subType: "Dress" },
        { name: "Casual Belts", subType: "Casual" },
      ],
    },
    {
      type: "Hats & Caps",
      subTypes: [
        { name: "Baseball Caps", subType: "Baseball" },
        { name: "Beanies", subType: "Beanies" },
        { name: "Bucket Hats", subType: "Bucket" },
        { name: "Fedoras", subType: "Fedoras" },
        { name: "Snapbacks", subType: "Snapbacks" },
      ],
    },
    {
      type: "Sunglasses",
      subTypes: [
        { name: "Aviator", subType: "Aviator" },
        { name: "Wayfarer", subType: "Wayfarer" },
        { name: "Round", subType: "Round" },
        { name: "Square", subType: "Square" },
        { name: "Sport Sunglasses", subType: "Sport" },
      ],
    },
    {
      type: "Jewellery",
      subTypes: [
        { name: "Necklaces", subType: "Necklaces" },
        { name: "Bracelets", subType: "Bracelets" },
        { name: "Rings", subType: "Rings" },
        { name: "Earrings", subType: "Earrings" },
      ],
    },
  ],
};

const womenClothingSidebar: SidebarCategory = {
  main: "Women",
  sub: "Clothing",
  types: [
    {
      type: "Knitwear & Cardigans",
      subTypes: [
        { name: "Sweaters", subType: "Sweaters" },
        { name: "Cardigans", subType: "Cardigans" },
        { name: "Turtlenecks", subType: "Turtlenecks" },
        { name: "Pullovers", subType: "Pullovers" },
      ],
    },
    {
      type: "Coats",
      subTypes: [
        { name: "Trench Coats", subType: "Trench" },
        { name: "Puffer Coats", subType: "Puffer" },
        { name: "Wool Coats", subType: "Wool" },
        { name: "Peacoats", subType: "Peacoat" },
      ],
    },
    {
      type: "Jackets",
      subTypes: [
        { name: "Denim Jackets", subType: "Denim" },
        { name: "Leather Jackets", subType: "Leather" },
        { name: "Bomber Jackets", subType: "Bomber" },
        { name: "Blazers", subType: "Blazers" },
      ],
    },
    {
      type: "Dresses",
      subTypes: [
        { name: "Casual Dresses", subType: "Casual" },
        { name: "Evening Dresses", subType: "Evening" },
        { name: "Maxi Dresses", subType: "Maxi" },
        { name: "Midi Dresses", subType: "Midi" },
        { name: "Mini Dresses", subType: "Mini" },
      ],
    },
    {
      type: "Skirts",
      subTypes: [
        { name: "Mini Skirts", subType: "Mini" },
        { name: "Midi Skirts", subType: "Midi" },
        { name: "Maxi Skirts", subType: "Maxi" },
        { name: "Pencil Skirts", subType: "Pencil" },
        { name: "A-Line Skirts", subType: "A-Line" },
      ],
    },
    {
      type: "Underwear",
      subTypes: [
        { name: "Bras", subType: "Bras" },
        { name: "Panties", subType: "Panties" },
        { name: "Lingerie Sets", subType: "Sets" },
        { name: "Shapewear", subType: "Shapewear" },
      ],
    },
    {
      type: "Swimwear",
      subTypes: [
        { name: "Bikinis", subType: "Bikini" },
        { name: "One-Pieces", subType: "One-Piece" },
        { name: "Tankinis", subType: "Tankini" },
        { name: "Cover-Ups", subType: "Cover-Ups" },
      ],
    },
  ],
};

const womenShoesSidebar: SidebarCategory = {
  main: "Women",
  sub: "Shoes",
  types: [
    {
      type: "Boots",
      subTypes: [
        { name: "Ankle Boots", subType: "Ankle" },
        { name: "Knee High Boots", subType: "Knee High" },
        { name: "Over-the-Knee", subType: "Over-the-Knee" },
        { name: "Chelsea Boots", subType: "Chelsea" },
        { name: "Combat Boots", subType: "Combat" },
      ],
    },
    {
      type: "Ankle boots",
      subTypes: [
        { name: "Heeled Ankle Boots", subType: "Heeled" },
        { name: "Flat Ankle Boots", subType: "Flat" },
        { name: "Wedge Ankle Boots", subType: "Wedge" },
      ],
    },
    {
      type: "Flat shoes",
      subTypes: [
        { name: "Ballet Flats", subType: "Ballet" },
        { name: "Loafers", subType: "Loafers" },
        { name: "Oxfords", subType: "Oxfords" },
        { name: "Moccasins", subType: "Moccasins" },
      ],
    },
    {
      type: "Trainers",
      subTypes: [
        { name: "Running Shoes", subType: "Running" },
        { name: "Casual Trainers", subType: "Casual" },
        { name: "High Tops", subType: "High Tops" },
        { name: "Slip-On Trainers", subType: "Slip-On" },
      ],
    },
    {
      type: "High heels",
      subTypes: [
        { name: "Stilettos", subType: "Stiletto" },
        { name: "Block Heels", subType: "Block" },
        { name: "Kitten Heels", subType: "Kitten" },
        { name: "Platform Heels", subType: "Platform" },
      ],
    },
    {
      type: "Ballet pumps",
      subTypes: [
        { name: "Classic Ballet Flats", subType: "Classic" },
        { name: "Pointed Toe", subType: "Pointed" },
        { name: "Round Toe", subType: "Round" },
      ],
    },
    {
      type: "Pumps",
      subTypes: [
        { name: "Classic Pumps", subType: "Classic" },
        { name: "Pointed Pumps", subType: "Pointed" },
        { name: "Peep Toe Pumps", subType: "Peep Toe" },
      ],
    },
    {
      type: "Mules",
      subTypes: [
        { name: "Heeled Mules", subType: "Heeled" },
        { name: "Flat Mules", subType: "Flat" },
        { name: "Backless Mules", subType: "Backless" },
      ],
    },
    {
      type: "Slippers",
      subTypes: [
        { name: "House Slippers", subType: "House" },
        { name: "Slide Slippers", subType: "Slide" },
        { name: "Moccasin Slippers", subType: "Moccasin" },
      ],
    },
    {
      type: "Sandals",
      subTypes: [
        { name: "Flat Sandals", subType: "Flat" },
        { name: "Heeled Sandals", subType: "Heeled" },
        { name: "Gladiator Sandals", subType: "Gladiator" },
        { name: "Wedge Sandals", subType: "Wedge" },
      ],
    },
  ],
};

const womenAccessoriesSidebar: SidebarCategory = {
  main: "Women",
  sub: "Accessories",
  types: [
    {
      type: "Beanies",
      subTypes: [
        { name: "Knit Beanies", subType: "Knit" },
        { name: "Slouchy Beanies", subType: "Slouchy" },
        { name: "Pom Beanies", subType: "Pom" },
      ],
    },
    {
      type: "Balaclava",
      subTypes: [
        { name: "Winter Balaclava", subType: "Winter" },
        { name: "Fashion Balaclava", subType: "Fashion" },
      ],
    },
    {
      type: "Scarves",
      subTypes: [
        { name: "Silk Scarves", subType: "Silk" },
        { name: "Wool Scarves", subType: "Wool" },
        { name: "Infinity Scarves", subType: "Infinity" },
        { name: "Pashminas", subType: "Pashmina" },
      ],
    },
    {
      type: "Gloves",
      subTypes: [
        { name: "Leather Gloves", subType: "Leather" },
        { name: "Knit Gloves", subType: "Knit" },
        { name: "Touchscreen Gloves", subType: "Touchscreen" },
      ],
    },
    {
      type: "Bags & cases",
      subTypes: [
        { name: "Handbags", subType: "Handbags" },
        { name: "Shoulder Bags", subType: "Shoulder" },
        { name: "Crossbody Bags", subType: "Crossbody" },
        { name: "Tote Bags", subType: "Tote" },
        { name: "Clutches", subType: "Clutch" },
      ],
    },
    {
      type: "Jewellery",
      subTypes: [
        { name: "Necklaces", subType: "Necklaces" },
        { name: "Bracelets", subType: "Bracelets" },
        { name: "Earrings", subType: "Earrings" },
        { name: "Rings", subType: "Rings" },
      ],
    },
    {
      type: "Belts",
      subTypes: [
        { name: "Leather Belts", subType: "Leather" },
        { name: "Chain Belts", subType: "Chain" },
        { name: "Fabric Belts", subType: "Fabric" },
      ],
    },
    {
      type: "Watches",
      subTypes: [
        { name: "Analog Watches", subType: "Analog" },
        { name: "Digital Watches", subType: "Digital" },
        { name: "Smart Watches", subType: "Smart" },
      ],
    },
    {
      type: "Wallets & card holders",
      subTypes: [
        { name: "Wallets", subType: "Wallets" },
        { name: "Card Holders", subType: "Card Holders" },
        { name: "Coin Purses", subType: "Coin Purses" },
      ],
    },
    {
      type: "Sunglasses",
      subTypes: [
        { name: "Aviator", subType: "Aviator" },
        { name: "Cat Eye", subType: "Cat Eye" },
        { name: "Round", subType: "Round" },
        { name: "Oversized", subType: "Oversized" },
      ],
    },
  ],
};

export const sidebarData: SidebarCategory[] = [
  menClothingSidebar,
  menShoesSidebar,
  menAccessoriesSidebar,
  womenClothingSidebar,
  womenShoesSidebar,
  womenAccessoriesSidebar,
];

export default sidebarData;
