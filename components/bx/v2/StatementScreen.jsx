"use client";

import Doodle from "../Doodle";
import { Container } from "../Section";
import { Dots, ScrollHint, Steps } from "./ScrollBits";

/**
 * Text o divizi, který se odkrývá po větách.
 *
 * Sekce je vysoká tolik obrazovek, kolik je vět — každé posunutí scrollu
 * rozsvítí další větu. Návštěvník tak text projde, místo aby ho přeletěl.
 */
export default function StatementScreen({
  sentences = [],
  highlight = "",
  step = 0,
  hint,
  onNext,
}) {
  return (
    <section className="relative bg-[#f1f1ef] text-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Dots />

        <Container className="relative flex h-full items-center">
          <div className="flex w-full items-end gap-6 pt-14 md:pt-16">
            <p className="max-w-[30ch] md:max-w-[24ch] lg:max-w-[26ch] text-[clamp(1.3rem,3.3vw,2.85rem)] font-bold leading-[1.34] tracking-[-0.02em]">
              {sentences.map((s, i) => (
                <Sentence key={i} text={s} highlight={highlight} on={i <= step} />
              ))}
            </p>

            <Doodle
              name="blesk"
              aria-hidden
              className="hidden md:block w-[clamp(34px,3vw,52px)] shrink-0 text-brand mb-[0.4em]"
              style={{ aspectRatio: "45 / 86" }}
            />
          </div>
        </Container>

        <ScrollHint label={hint} onClick={onNext} />
      </div>

      <Steps n={Math.max(1, sentences.length)} />
    </section>
  );
}

/** Jedna věta. Zvýrazněná část se vybarví brandovou zelenou. */
function Sentence({ text, highlight, on }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  const base = on ? "text-ink" : "text-ink/20";
  const accent = on ? "text-brand" : "text-brand/25";

  const parts =
    at >= 0
      ? [
          { t: text.slice(0, at), accent: false },
          { t: highlight, accent: true },
          { t: text.slice(at + highlight.length), accent: false },
        ]
      : [{ t: text, accent: false }];

  return (
    <>
      {parts.map(
        (p, i) =>
          p.t && (
            <span
              key={i}
              className={`transition-colors duration-[900ms] ease-out ${p.accent ? accent : base}`}
            >
              {p.t}
            </span>
          )
      )}{" "}
    </>
  );
}
