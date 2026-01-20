import LandingLayout from "@/components/layouts/LandingLayout";
import { ProductCarousel } from "@/components/layouts/section";
import SponsorCarousel from "@/components/layouts/section/SponsorCarousel";
import Sponsored from "@/components/layouts/section/Sponsored";
export default function WomenHome() {
  return (
    <>
      <LandingLayout>
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

        <ProductCarousel
          filters={{ category: "Women", include: "colorVariants" }}
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
        />
      </LandingLayout>
    </>
  );
}
