export default function About() {
  return (
    <>
      <section className="page-wrap py-8">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="/Images/62e1861385026e9ef52ab6bf_about hero Large.jpeg"
            alt="Cedar Olive studio"
            className="h-[60vh] w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 px-6">
            <h1 className="max-w-3xl text-center text-4xl text-white md:text-6xl">
              We believe we make all the difference
            </h1>
          </div>
        </div>
      </section>

      <section className="page-wrap grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text">The genesis</p>
          <h2 className="mt-2 text-4xl">How it all began</h2>
          <p className="mt-4 leading-7 text-text">
            Cedar Olive began as a small edit of objects we wanted in our own rooms: vessels with weight, light that does not glare, and wall pieces that hold a wall without shouting.
          </p>
          <p className="mt-4 leading-7 text-text">
            We still buy the way a person furnishes a house — slowly, and only when a piece earns the space. The shop is that edit, opened to everyone else.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src="/Images/62e173378da06e493cb1ed0a_about one-p-500.jpeg" alt="Making process" className="h-72 w-full rounded-2xl object-cover" />
          <img src="/Images/62e173374433b74f067b2cf5_about two-p-500.jpeg" alt="Studio work" className="mt-8 h-72 w-full rounded-2xl object-cover" />
        </div>
      </section>

      <section className="page-wrap py-8 text-center">
        <h2 className="text-4xl">We are doing it big now</h2>
        <p className="mx-auto mt-4 max-w-xl text-text">
          The same eye, a wider collection. Rooms, tables, and walls — still chosen one piece at a time.
        </p>
        <img
          src="/Images/62e171057a6e386d44e5133c_about banner Large.jpeg"
          alt="Cedar Olive collection"
          className="mt-8 h-[420px] w-full rounded-3xl object-cover"
        />
      </section>

      <section className="page-wrap py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-text">Visit</p>
        <h2 className="mt-2 text-4xl">The home of brilliant decor</h2>
        <div className="mt-8 space-y-4">
          <article className="grid overflow-hidden rounded-3xl bg-[#513015] text-white md:grid-cols-[1.4fr_0.8fr]">
            <img src="/Images/62e16cfc0661addceafe2b8a_store one.jpeg" alt="San Diego store" className="h-72 w-full object-cover md:h-[420px]" />
            <div className="flex flex-col justify-center p-8">
              <h3 className="text-3xl text-white">695 Town Center Dr. San Diego, CA</h3>
              <p className="mt-3 text-white/75">A quiet floor of ceramics, wood, and light.</p>
            </div>
          </article>
          <article className="grid overflow-hidden rounded-3xl bg-[#513015] text-white md:grid-cols-[0.8fr_1.4fr]">
            <div className="order-2 flex flex-col justify-center p-8 md:order-1">
              <h3 className="text-3xl text-white">999 North 29th Street Birmingham, AL</h3>
              <p className="mt-3 text-white/75">The same collection, a different light.</p>
            </div>
            <img src="/Images/62e16e16961d2e051bb5020e_store two xl.jpeg" alt="Birmingham store" className="order-1 h-72 w-full object-cover md:order-2 md:h-[420px]" />
          </article>
        </div>
      </section>
    </>
  );
}
