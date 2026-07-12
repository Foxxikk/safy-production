import Image from "next/image";
import { team } from "../../lib/content";
import Cta from "../../components/Cta";
import Tape from "../../components/Tape";

export const metadata = { title: "Team - Safyproduction" };

export default function TeamPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <Tape
          src="/images/tapes/tape-green-2.svg"
          width={1200}
          height={75}
          className="absolute top-6 right-[-30%] w-[75%]"
          from="translateX(120px) rotate(-4deg)"
          to="rotate(-8deg)"
        />
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-8">
          <Image src="/images/logos/safy-white.svg" alt="šafy" width={150} height={72} />
          <h1 className="display-xl text-6xl md:text-9xl mt-4 mb-16">Team</h1>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="group relative bg-dark overflow-hidden aspect-[3/4]">
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="display-xl text-7xl text-white/10">
                    {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16">
                <p className="font-bold text-lg leading-tight">{m.name}</p>
                <p className="text-brand text-sm mt-1">{m.role}</p>
                {m.contact && (
                  <a
                    href={m.contact.includes("@") ? `mailto:${m.contact}` : `tel:${m.contact.replace(/\s/g, "")}`}
                    className="text-white/60 text-sm hover:text-brand transition-colors"
                  >
                    {m.contact}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
