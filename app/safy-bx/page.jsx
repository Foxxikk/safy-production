import BxHeader from "../../components/bx/BxHeader";
import BxFooter from "../../components/bx/BxFooter";
import Hero from "../../components/bx/Hero";
import Portfolio from "../../components/bx/Portfolio";
import { Clients } from "../../components/bx/Stats";
import ContactForm from "../../components/bx/ContactForm";

export default function BxLandingPage() {
  return (
    <div className="bg-white text-ink min-h-screen">
      <BxHeader />
      <Hero />
      <Portfolio />
      <Clients />
      <ContactForm />
      <BxFooter />
    </div>
  );
}
