import "@fontsource/roboto/latin-ext-300.css";
import "@fontsource/roboto/latin-ext-400.css";
import "@fontsource/roboto/latin-ext-500.css";
import "@fontsource/roboto/latin-ext-700.css";
import "@fontsource/roboto/latin-ext-900.css";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Safy production - Creative event agency",
  description:
    "WE ARE ŠAFY — creative event agency. Top-tier event production and marketing services across the Czech Republic and Slovakia since 2010.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
