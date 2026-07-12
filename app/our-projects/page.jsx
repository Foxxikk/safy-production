import Image from "next/image";
import Tape from "../../components/Tape";

export const metadata = { title: "Our Projects - Safyproduction" };

const projects = [
  {
    img: "/images/projects/01.webp",
    text:
      "Zašívárna pro kreativce, ale i místo pro obchodní schůzky. Bar s venkovní zahrádkou s výhledem na Vyšehrad i Vltavu včetně zvědavého hejna labutí. Kobka číslo 13/14 na správné straně náplavky. Na té smíchovské.",
    url: "https://hoaxpub.cz/",
  },
  {
    img: "/images/projects/02.webp",
    text:
      "Zašitá kavárna na Smíchovské straně náplavky skrývá útočiště všech neposedných dětí a jejich maminek. Jupík je stálou součástí nabídky stejně, jako kvalitní káva nebo dobré pivo. Otevřena od roku 2022.",
    url: "https://cafenabrezi.cz/",
  },
  {
    img: "/images/projects/03.webp",
    text:
      "Půjčení dodávky za výhodnou cenu, již od 600 Kč/den bez DPH. V případě potřeby zajistíme řidiče i závozníky na pomocné práce při nakládání a vykládání převážených věcí. K zapůjčení rudlík, paleťák nebo popruhy.",
    url: "https://www.pujceni-dodavek.cz/",
  },
];

export default function OurProjectsPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-12">
        <Tape
          src="/images/tapes/tape-green-2.svg"
          width={1200}
          height={75}
          className="absolute top-14 right-[-30%] w-[75%] hidden md:block"
          from="translateX(120px) rotate(-4deg)"
          to="rotate(-8deg)"
        />
        <h1 className="display-xl text-5xl md:text-8xl relative">
          Our <span className="text-brand">projects</span>
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 space-y-16">
        {projects.map((p, i) => (
          <div
            key={p.url}
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-dark">
              <Image
                src={p.img}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xl md:text-2xl leading-relaxed mb-8">{p.text}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-ink text-white font-bold px-8 py-3 hover:bg-brand hover:text-ink transition-colors"
              >
                Navštívit
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
