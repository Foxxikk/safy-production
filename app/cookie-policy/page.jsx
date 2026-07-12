import Tape from "../../components/Tape";

export const metadata = { title: "Cookie policy - Safyproduction" };

export default function CookiePolicyPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto max-w-4xl px-6 pt-20 pb-24">
        <Tape
          src="/images/tapes/tape-green.svg"
          width={1100}
          height={69}
          className="absolute top-16 right-[-45%] w-[80%] hidden md:block"
          from="translateX(120px) rotate(-4deg)"
          to="rotate(-9deg)"
        />

        <h1 className="display-xl text-4xl md:text-6xl mb-10 relative">
          Zásady používání souborů cookies
        </h1>

        <div className="text-lg leading-relaxed text-ink/90 space-y-6">
          <p>
            Tato webová stránka používá soubory cookies, abychom vám mohli poskytnout
            co nejlepší uživatelský zážitek a zlepšili naše služby.
          </p>

          <div>
            <h2 className="text-2xl font-bold mb-3">Co jsou cookies?</h2>
            <p>
              Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení
              (počítač, tablet, mobil) při návštěvě webové stránky. Umožňují stránce
              zapamatovat si vaše nastavení a preference (např. jazyk, přihlašovací
              údaje, zvolený obsah) po určitou dobu.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Jaké typy cookies používáme?</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Nezbytné cookies:</strong> Tyto cookies jsou nezbytné pro
                správné fungování stránky. Bez nich by některé funkce (např. navigace,
                přístup k zabezpečeným částem) nefungovaly.
              </li>
              <li>
                <strong>Analytické cookies:</strong> Pomáhají nám pochopit, jak
                návštěvníci používají naši stránku (např. počet návštěv, které stránky
                jsou nejnavštěvovanější), a na základě toho ji zlepšovat. Tyto údaje
                jsou anonymní.
              </li>
              <li>
                <strong>Funkční cookies:</strong> Umožňují stránce zapamatovat si vaše
                volby (např. jazyk nebo region) a zlepšují tím vaše uživatelské pohodlí.
              </li>
              <li>
                <strong>Marketingové cookies (pokud jsou používány):</strong> Slouží k
                zobrazování relevantních reklam na základě vašich zájmů. Na naší stránce
                mohou být tyto cookies používány pouze se souhlasem uživatele.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Jak můžete ovlivnit nastavení cookies?</h2>
            <p>
              Při první návštěvě naší webové stránky máte možnost udělit nebo odmítnout
              souhlas s používáním jednotlivých typů cookies (s výjimkou nezbytných
              cookies). Tento souhlas můžete kdykoli změnit nebo odvolat prostřednictvím
              nastavení ve vašem prohlížeči.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Správce údajů</h2>
            <p>
              Provozovatelem této webové stránky je:
              <br />
              <strong>Šafy production s.r.o.</strong>
              <br />
              Údolní 212/1, 147 00, Praha 4
              <br />
              IČO: 24769444, DIČ: CZ24769444
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
