import { references, refCategories } from "../../lib/site";
import ReferenceGrid from "./ReferenceGrid";
import Tape from "../../components/Tape";

export const metadata = { title: "References - Safyproduction" };

export default function ReferencesPage() {
  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      <section className="relative pt-20 pb-10">
        <Tape
          src="/images/tapes/tape-green-2.svg"
          width={1200}
          height={75}
          className="absolute -top-2 right-[-25%] w-[75%]"
          from="translateX(120px) rotate(-4deg)"
          to="rotate(-8deg)"
        />
        <div className="mx-auto max-w-7xl px-6 relative">
          <h1 className="display-xl text-6xl md:text-9xl">References</h1>
        </div>
      </section>

      <ReferenceGrid references={references} categories={refCategories} />
    </div>
  );
}
