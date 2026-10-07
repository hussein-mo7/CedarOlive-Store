import { journalPosts } from "../content/journal";

export default function Blog() {
  const [featured, ...rest] = journalPosts;

  return (
    <div className="page-wrap py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-text">Journal</p>
      <h1 className="mt-2 text-5xl">Stories from the rooms we love</h1>
      <article className="mt-10 grid overflow-hidden rounded-3xl bg-[#1c1410] text-white md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm text-white/60">{featured.date}</p>
          <h2 className="mt-3 text-4xl text-white">{featured.title}</h2>
          <p className="mt-4 text-white/75">{featured.excerpt}</p>
        </div>
        <img src={featured.image} alt="" className="h-80 w-full object-cover md:h-full" />
      </article>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((post) => (
          <article key={post.id}>
            <img src={post.image} alt="" className="h-56 w-full rounded-2xl object-cover" />
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text">{post.date}</p>
            <h3 className="mt-1 text-2xl">{post.title}</h3>
            <p className="mt-2 text-sm text-text">{post.excerpt}</p>
          </article>
        ))}
        <article>
          <img
            src="/Images/62d856b2593d0df9b5451d54_thumbnail one.jpeg"
            alt=""
            className="h-56 w-full rounded-2xl object-cover"
          />
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text">July 29, 2022</p>
          <h3 className="mt-1 text-2xl">Notes on living with fewer, better things</h3>
        </article>
      </div>
    </div>
  );
}
