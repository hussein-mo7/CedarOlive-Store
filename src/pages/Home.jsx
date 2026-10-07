import Hero from "../features/home/Hero";
import CategoryGrid from "../features/home/CategoryGrid";
import EditorialSplit from "../features/home/EditorialSplit";
import ProductRail from "../features/home/ProductRail";
import { AboutBanner, CollectionBanner } from "../features/home/Banners";
import JournalPreview from "../features/home/JournalPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <EditorialSplit />
      <ProductRail eyebrow="Spring season" title="New arrivals" query={{ limit: 4 }} />
      <CollectionBanner />
      <ProductRail
        eyebrow="Studio edit"
        title="Palestinian makers"
        query={{ brand: "PALESTINIAN", limit: 4 }}
      />
      <AboutBanner />
      <JournalPreview />
    </>
  );
}
