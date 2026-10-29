import Hero from "@/components/marketing/Hero";
import ClientLogos from "@/components/marketing/ClientLogos";
import Services from "@/components/marketing/Services";
import AiSection from "@/components/marketing/AiSection";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import LeadChat from "@/components/marketing/LeadChat";
import { organizationJsonLd } from "@/lib/organization";

export default function Page() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Hero />
      <ClientLogos />
      <Services />
      <AiSection />
      {/* <Metrics /> */}
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <LeadChat />
    </main>
  );
}
