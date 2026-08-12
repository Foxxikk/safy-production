import { LangProvider } from "../../components/bx/LangContext";
import { ThemeProvider } from "../../components/bx/ThemeContext";
import TapeTransition from "../../components/bx/TapeTransition";

export const metadata = {
  title: "ŠAFY BX — Brand experience marketing",
  description:
    "Specializovaná divize Šafy pro Brand Experience marketing: kreativní strategie, interaktivní instalace a vlastní fyzická výroba. Stovky instalací v ČR i na Slovensku.",
};

export default function BxLayout({ children }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <TapeTransition>{children}</TapeTransition>
      </LangProvider>
    </ThemeProvider>
  );
}
