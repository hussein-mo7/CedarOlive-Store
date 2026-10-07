import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function Hero() {
  return (
    <section className="page-wrap grid min-h-[70vh] items-stretch gap-4 py-8 md:grid-cols-2 md:py-12">
      <div className="flex flex-col justify-center rounded-3xl bg-primary px-8 py-14 md:px-12">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Home collection</p>
        <h1 className="mt-3 text-5xl leading-tight md:text-6xl">
          Rooms with warmth, not noise.
        </h1>
        <p className="mt-5 max-w-md text-text">
          Pillows, vessels, lighting, and wall art chosen for homes that want to feel settled.
        </p>
        <Link to="/shop/All" className="mt-8">
          <Button>Shop the collection</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-3xl">
        <img
          src="/Images/62d9a3c6e6d62f3bc30c1e2e_hero_img-p-1080.jpg"
          alt="Cedar Olive living room"
          className="h-full min-h-[320px] w-full object-cover"
        />
      </div>
    </section>
  );
}
