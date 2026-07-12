import Tape from "../../components/Tape";

export const metadata = { title: "GDPR - Safyproduction" };

export default function GdprPage() {
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

        <h1 className="display-xl text-4xl md:text-6xl mb-6 relative">
          Zpracování osobních údajů
        </h1>
        <h2 className="text-xl md:text-2xl font-bold mb-10">
          Souhlas se zpracováním osobních údajů, fotografií a zasíláním obchodních sdělení
        </h2>

        <div className="text-base md:text-lg leading-relaxed text-ink/90 space-y-6 text-justify">
          <p>
            Vyplněním registrace na webové stránce www.safyproduction.cz vyjadřuje
            zájemce o nabízenou pozici dobrovolně svůj výslovný souhlas s pravidly této
            náborové kampaně a současně uděluje v souladu s nařízením Evropského
            parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se
            zpracováním osobních údajů a o volném pohybu těchto údajů a o zrušení
            směrnice 95/46/ES („Nařízení GDPR“ se zákonem č. 101/2000 Sb., v platném
            znění, ochraně osobních údajů, a § 84 a násl. zákona č. 89/2012 Sb., v
            platném znění, občanský zákoník, na dobu tří (3) let od doby udělení výslovný
            souhlas se zpracováním svých osobních údajů v rozsahu jméno, příjmení, místo
            působnosti a e-mailová adresa a užitím fotografií zájemce poskytnutých či
            pořízených v rámci náborové kampaně společnosti ŠAFY production s.r.o., se
            sídlem: Údolní 212/1, Braník, 147 00 Praha 4, IČO: 24769444, zapsané v
            obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 172829,
            jako správci (dále jen „správce“), za účelem dalšího marketingového zpracování
            těchto údajů a fotografií, jejich použití v rámci podnikatelské činnosti
            správce, k marketingovým účelům správce jako je nabízení obchodu a služeb a
            zasílání informací o marketingových akcích, produktech či jiných aktivitách
            správce, informování zájemce o realizaci dalších marketingových akcí správce,
            použití v propagačních a reklamních materiálech správce, dále za účelem užití
            těchto údajů a fotografií ve sdělovacích prostředcích a na webových stránkách
            správce, pokud je toto užití v souvislosti s touto náborovou kampaní. Zájemce
            vyplněním registrace na webové stránce www.safyproduction.cz rovněž na dobu
            tří (3) let od doby poskytnutí uděluje správci svůj výslovný souhlas k
            zasílání informací a jiných obchodních sdělení prostřednictvím e-mailů, jakož
            i dalších elektronických prostředků dle zákona č. 480/2004 Sb., o některých
            službách informační společnosti a o změně některých zákonů (zákon o některých
            službách informační společnosti), v platném znění. Zájemce náborové kampaně má
            právo přístupu k osobním údajům a další práva dle §§ 11, 12 a 21 zák. č.
            101/2000 Sb., o ochraně osobních údajů a dle Nařízení GDPR, tj. zejména
            správce informuje zájemce náborové kampaně, že udělení souhlasu se zpracováním
            osobních údajů je dobrovolné a tento souhlas může být kdykoli bezplatně na
            adrese správce zájemcem náborové kampaně odvolán, že má právo na opravu těchto
            osobních údajů, že v případě, že zjistí nebo se domnívá, že správce provádí
            zpracování jeho osobních údajů, které je v rozporu s ochranou jeho soukromého
            a osobního života nebo v rozporu se zákonem, zejména jsou-li osobní údaje
            nepřesné s ohledem na účel jejich zpracování, může požádat správce o
            vysvětlení nebo požadovat, aby správce odstranil takto vzniklý stav. Zejména
            se může jednat o blokování, provedení opravy, doplnění nebo likvidaci osobních
            údajů a dále že má i právo obrátit se na Úřad pro ochranu osobních údajů,
            zjistí-li, že při zpracování údajů došlo k porušení povinností správce ve
            smyslu tohoto zákona a/nebo Nařízení GDPR. Odvolání souhlasu je účinné
            okamžikem doručení správci. Souhlas se zpracováním osobních údajů, užitím
            fotografií a zasíláním obchodních sdělení je nezbytný pro účast v náborové
            kampani. Obdrží-li správce od zájemce nesouhlas nebo žádost o výmaz z databáze,
            má toto automaticky za následek zrušení účasti příslušného zájemce v této
            náborové kampani bez náhrady. Správce závěrem informuje zájemce náborové
            kampaně, že jím správci poskytnutý životopis bude správcem zpracováván pouze po
            nezbytnou dobu tří (3) měsíců od jeho poskytnutí a poté bude správcem
            zlikvidován.
          </p>
          <p>
            Shora uvedené informace ze strany správce beru na vědomí a udělením tohoto
            souhlasu současně potvrzuji, že jsem se seznámil/a s Informací o zpracování a
            ochraně osobních údajů, která je k dispozici na www.safyproduction.cz a se
            všemi právy, které mi v souvislosti se zpracováním osobních údajů náleží.
          </p>
        </div>
      </section>
    </div>
  );
}
