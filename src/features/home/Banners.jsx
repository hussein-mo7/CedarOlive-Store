import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

export function CollectionBanner() {
  return (
    <section className="page-wrap py-8">
      <div className="grid overflow-hidden rounded-3xl bg-secondary text-white md:grid-cols-[0.9fr_1.4fr]">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h2 className="text-4xl text-white">
            Make the living room the room you actually use.
          </h2>
          <p className="mt-4 text-white/80">
            A short edit of seating, light, and objects that hold a conversation.
          </p>
          <Link to="/shop/All" className="mt-8">
            <Button variant="white">Shop collections</Button>
          </Link>
        </div>
        <img
          src="/Images/63f5cf9cef5fdf054c8af861_collections banner.jpg"
          alt="Living room collection"
          className="h-72 w-full object-cover md:h-full"
        />
      </div>
    </section>
  );
}

export function AboutBanner() {
  return (
    <section className="page-wrap py-8">
      <div className="grid overflow-hidden rounded-3xl bg-[#513015] text-white md:grid-cols-[1.4fr_0.9fr]">
        <img
          src="/Images/63f5dc1ad2ca79cd5062cf23_about banner.jpg"
          alt="Cedar Olive studio"
          className="h-72 w-full object-cover md:h-full"
        />
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h2 className="text-4xl text-white">Let us elevate the room around you.</h2>
          <p className="mt-4 text-white/80">
            Cedar Olive started as a small edit of pieces we wanted in our own homes.
          </p>
          <Link to="/about" className="mt-8">
            <Button variant="white">About the studio</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
