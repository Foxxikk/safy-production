"use client";

import { useState } from "react";

const offices = {
  cz: {
    find: "Údolní 212/1, 147 00, Praha 4",
    company: "ŠAFY PRODUCTION S.R.O.",
    ids: "IČO: 24769444, DIČ: CZ24769444",
  },
  sk: {
    find: "Podzámska 68, Nitra 949 01",
    billing: "Billing address: Panónska cesta 34, Bratislava 851 04",
    company: "ŠAFY PRODUCTION SK S.R.O.",
    ids: "IČO: 46 031 685, DIČ: SK2023207494",
  },
};

export default function ContactContent() {
  const [country, setCountry] = useState("cz");
  const [sent, setSent] = useState(false);
  const o = offices[country];

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Web inquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}\n${data.get("phone") || ""}`);
    window.location.href = `mailto:info@safyproduction.cz?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-28">
        <h1 className="display-xl text-6xl md:text-9xl mb-14">Contact us</h1>

        <div className="flex gap-2 mb-12">
          {[["cz", "Czech"], ["sk", "Slovak"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCountry(key)}
              className={`px-6 py-3 font-medium transition-colors ${
                country === key ? "bg-ink text-white" : "bg-black/5 hover:bg-black/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-6 text-xl leading-relaxed">
            <p>
              <strong>Find us</strong>
              <br />
              {o.find}
            </p>
            {o.billing && <p>{o.billing}</p>}
            <p>
              <strong>{o.company}</strong>
              <br />
              {o.ids}
            </p>
            <p>
              Please send an e-mail to{" "}
              <a href="mailto:info@safyproduction.cz" className="font-bold hover:text-brand transition-colors">
                info@safyproduction.cz
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {["name", "email", "phone"].map((f) => (
              <input
                key={f}
                name={f}
                type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
                required={f !== "phone"}
                placeholder={f === "name" ? "Your name *" : f === "email" ? "E-mail *" : "Phone"}
                className="w-full border border-black/20 px-5 py-4 focus:outline-none focus:border-brand"
              />
            ))}
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Your message *"
              className="w-full border border-black/20 px-5 py-4 focus:outline-none focus:border-brand"
            />
            <p className="text-sm text-muted">
              Your information will remain private and confidential, exclusively used by Safy.
              Fields marked with an * are required. All details provided will be managed by Safy
              in accordance with our Privacy Policy.
            </p>
            <button
              type="submit"
              className="bg-ink text-white font-bold px-10 py-5 hover:bg-brand hover:text-ink transition-colors"
            >
              {sent ? "Opening your e-mail client…" : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
