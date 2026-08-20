import Hero from "@/components/marketing/Hero";
import ClientLogos from "@/components/marketing/ClientLogos";
import Services from "@/components/marketing/Services";
import AiSection from "@/components/marketing/AiSection";
import Metrics from "@/components/marketing/Metrics";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import ContactForm from "@/components/marketing/ContactForm";

export default function Page() {
  return (
    <main>
      <Hero />
      <ClientLogos />
      <Services />
      <AiSection />
      {/* <Metrics /> */}
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <ContactForm />
    </main>
  );
}
