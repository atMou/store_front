// "use client";
import LandingLayout from "@/components/layouts/LandingLayout";
import { ProductCarousel, TextBanner } from "@/components/layouts/section";
import SponsorCarousel from "@/components/layouts/section/SponsorCarousel";
import Sponsored from "@/components/layouts/section/Sponsored";
export default function WomenHome() {
  return (
    <>
      <LandingLayout>
        <TextBanner backgroundColor="#d2451e" textDirection="ltr" />

        <ProductCarousel
          direction="ltr"
          title="By Zara"
          itemSize="medium"
          filters={{ category: "Women", sub:"Clothing", brand: "Zara",  include: "colorVariants" }}
          showFollowButton={true}
          isFollowing={false}
          bgColor="#7c3aed"
        ></ProductCarousel>

        
        <Sponsored
          imageSrc="/promo.webp"
          imageAlt="Women's Fashion Collection"
          sponsored
          title="Discover the Latest in Women's Fashion"
          subtitle="Elevate your style with our curated collection of trends and timeless pieces"
          buttonText="Shop Now"
          titleClassName="text-xl md:text-2xl "
          subtitleClassName="text-gray-600"
          href="/women-clothing?brand=nike"
          padding="top"
        />

         <ProductCarousel
          direction="rtl"
          title="By Louis Vuitton"
          itemSize="medium"
          filters={{ category: "Women", sub:"Clothing", brand: "Louis Vuitton",  include: "colorVariants" }}
          showFollowButton={true}
          isFollowing={false}

        ></ProductCarousel>


        <ProductCarousel
          direction="rtl"
          title="By Gucci"
          itemSize="medium"
          filters={{ category: "Women", include: "colorVariants" }}
          showFollowButton={true}
          isFollowing={false}
        ></ProductCarousel>

        <Sponsored
          reverse
          imageSrc="/coach.webp"
          imageAlt="Exclusive Women's Accessories"
          sponsored
          title="Accessorize Your Look with Exclusive Finds"
          subtitle="Discover unique accessories that elevate your style."
          buttonText="Explore Accessories"
          titleClassName="text-xl md:text-2xl"
          subtitleClassName="text-gray-600"
          href="/women-accessories"
          padding="both"
        />
        <ProductCarousel
          direction="ltr"
          title="Accessories"
          itemSize="medium"
          filters={{
            category: "Women",
            sub: "Accessories",
            include: "colorVariants",
          }}
          bgColor="#000"
        ></ProductCarousel>

        <Sponsored
          reverse
          imageSrc="/banner_bag.webp"
          imageAlt="Exclusive Women's Accessories"
          sponsored
          title="Finding the one Designer gift collection"
          subtitle="A considered edit of standout pieces, chosen for connections that deserve more."
          buttonText="Explore Accessories"
          titleClassName="text-xl md:text-2xl text-white text-left"
          buttonClassName="border-white text-white  text-left"
          href="/women-accessories"
          padding="both"
          subtitleClassName="text-left text-white"
          backgroundColor="#000000"
          textColor="white"
        />

        <SponsorCarousel
          images={[
            {
              id: 1,
              url: "/Temperland_1s.webp",
              alt: "Timberland Collection 1",
            },
            {
              id: 2,
              url: "/temberland_3webp.webp",
              alt: "Timberland Collection 2",
            },
            {
              id: 3,
              url: "/Tempberland_2webp.webp",
              alt: "Timberland Collection 3",
            },
          ]}
          title="Step Into Adventure with Timberland"
          subtitle="Discover our exclusive sponsor center featuring top brands and products."
          buttonText="Discover more"
          buttonHref="/women-clothing?brand=timberland"
          sponsored={true}
          backgroundColor="bg-darkYellow"
          titleClassName="text-2xl mb-2"
          subtitleClassName="text-gray-600 mt-2 mb-6"
        />
      </LandingLayout>
    </>
  );
}
