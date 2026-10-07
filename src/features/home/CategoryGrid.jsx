import { Link } from "react-router-dom";

const categories = [
  {
    title: "Accessories & Decorations",
    image: "/Images/62d6d882bf7165679862b5dc_category image Large.jpeg",
    description: "Objects that finish a shelf, a table, or a quiet corner.",
    to: "/shop/Decor",
  },
  {
    title: "Frames & Art",
    image: "/Images/62d6d8a1288c207f11c9ddf2_category image 2 Large.jpeg",
    description: "Wall pieces with enough presence to hold a room.",
    to: "/shop/Wall Art",
  },
  {
    title: "Lamps & Lighting",
    image: "/Images/62d6d8ba1c7215866f71e1c8_category image 3 Large.jpeg",
    description: "Light that makes evening feel intentional.",
    to: "/shop/Lighting",
  },
];

export default function CategoryGrid() {
  return (
    <section className="page-wrap py-16">
      <p className="text-center text-xs uppercase tracking-[0.18em] text-text">Get started</p>
      <h2 className="mt-2 text-center text-4xl">Find something you love</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.title} to={category.to} className="group">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={category.image}
                alt={category.title}
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 text-center text-2xl">{category.title}</h3>
            <p className="mt-2 text-center text-sm text-text">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
