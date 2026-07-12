import Image from "next/image";
import Cta from "../../components/Cta";

export const metadata = { title: "About us - Safyproduction" };

const values = [
  {
    title: "Creativity",
    text: "We emphasize creativity in all our projects, ensuring that each event is unique and memorable.",
  },
  {
    title: "Integrity",
    text: "Building trust through honesty and transparency is key to our operations.",
  },
  {
    title: "Passion",
    text: "Our passion for event production drives us to deliver exceptional results every time.",
  },
  {
    title: "Innovation",
    text: "We continuously seek innovative approaches to surprise and delight our clients.",
  },
];

const team = ["t1.webp", "t2.webp", "t3.webp", "t4.webp", "t5.jpg", "t6.jpg", "t7.jpg", "t8.jpg"];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        <p className="text-2xl mb-3">Welcome to</p>
        <Image src="/images/logos/safy-logo.svg" alt="šafy production" width={220} height={85} />
        <h1 className="mt-12 max-w-4xl text-2xl md:text-4xl leading-snug font-normal">
          At <strong>Šafy Production s.r.o.</strong>, we pride ourselves on being a leading
          international event agency, delivering top-tier production and marketing services
          across the <strong>Czech Republic and Slovakia</strong> since 2010. Our mission is to{" "}
          <strong>transform ideas into memorable experiences</strong> that leave a lasting impact.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((t) => (
            <div key={t} className="relative aspect-[2/3] overflow-hidden bg-ink">
              <Image src={`/images/team/${t}`} alt="Šafy team" fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="display-xl text-5xl md:text-7xl mb-16">
            Our <span className="text-brand">values</span>
          </h2>
          <div className="grid gap-10 md:grid-cols-4">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="text-2xl font-bold mb-4 border-b-2 border-brand inline-block pb-2">
                  {v.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
