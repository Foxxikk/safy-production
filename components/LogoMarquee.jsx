import Image from "next/image";
import { brands } from "../lib/data";

export default function LogoMarquee() {
  const row = [...brands, ...brands];
  return (
    <div className="overflow-hidden py-10 bg-white">
      <div className="flex w-max animate-marquee items-center">
        {row.map((b, i) => (
          <div key={`${b}-${i}`} className="mx-10 shrink-0 opacity-60 grayscale">
            <Image src={`/images/brands/${b}.png`} alt={b} width={140} height={70} />
          </div>
        ))}
      </div>
    </div>
  );
}
