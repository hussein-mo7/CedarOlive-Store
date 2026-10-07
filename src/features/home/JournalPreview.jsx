import { Link } from "react-router-dom";
import { journalPosts } from "../../content/journal";

export default function JournalPreview() {
  return (
    <section className="page-wrap py-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text">Explore</p>
          <h2 className="mt-2 text-4xl">From the journal</h2>
        </div>
        <Link to="/blog" className="text-sm text-secondary">
          All stories
        </Link>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {journalPosts.map((post) => (
          <Link key={post.id} to="/blog" className="group">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={post.image}
                alt=""
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text">{post.date}</p>
            <h3 className="mt-1 text-2xl">{post.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
