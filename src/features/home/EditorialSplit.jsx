const stories = [
  {
    title: "Comfort at your home",
    text: "Give yourself and your loved ones room to get comfy.",
    image: "/Images/62d9b71403e1a65621ece082_Bitmap 2-p-1080.jpeg",
  },
  {
    title: "Set your table abloom",
    text: "Give your flowers a beautiful vase at your table.",
    image: "/Images/62d9b727cc17796463c612e0_Bitmap-p-1080.jpeg",
  },
];

export default function EditorialSplit() {
  return (
    <section className="page-wrap grid gap-4 py-6 md:grid-cols-2">
      {stories.map((story) => (
        <article key={story.title} className="relative overflow-hidden rounded-3xl">
          <img src={story.image} alt={story.title} className="h-[420px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 max-w-xs text-white">
            <h3 className="text-3xl">{story.title}</h3>
            <p className="mt-2 text-sm text-white/85">{story.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
