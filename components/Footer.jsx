"use client";

import { useState } from "react";
import Link from "next/link";
import { company } from "../lib/data";

const links = {
  Company: [
    { label: "About us", href: "/about-us" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  Policy: [
    { label: "Cookie policy", href: "/cookie-policy" },
    { label: "Privacy policy", href: "/gdpr" },
  ],
  "Šafy": [
    { label: "Team", href: "/teams" },
    { label: "Services", href: "/services" },
    { label: "References", href: "/reference" },
    { label: "Careers", href: "/careers" },
    { label: "Our side projects", href: "/our-projects" },
  ],
  Social: [
    { label: "Facebook", href: "https://www.facebook.com/safyproduction" },
    { label: "Instagram", href: "https://www.instagram.com/safyproduction/" },
    { label: "Linkedin", href: "https://www.linkedin.com/company/%C5%A1afy-production-s-r-o-/" },
  ],
};

export default function Footer() {
  const [country, setCountry] = useState("cz");
  const c = company[country];

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-center gap-2 mb-14">
          {[["cz", "Czech"], ["sk", "Slovak"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCountry(key)}
              className={`px-6 py-3 font-medium transition-colors ${
                country === key ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="text-white/70 text-[15px] leading-relaxed">
            <p className="text-white mb-4">{c.name}</p>
            <p>
              {c.address}
              <br />
              {c.ico},
              <br />
              {c.dic}
            </p>
            <p className="mt-4">
              {c.emails.map((e) => (
                <a key={e} href={`mailto:${e}`} className="block hover:text-brand transition-colors">
                  {e}
                </a>
              ))}
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-bold text-lg mb-4">{title}</h3>
              <ul className="space-y-2 text-white/60 text-[15px]">
                {items.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-brand transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Šafy production s.r.o. — WE ARE ŠAFY
        </p>
      </div>
    </footer>
  );
}
