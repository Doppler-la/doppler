import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

// Páginas internas: las anclas del header y el footer apuntan a la home.
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header basePath="/" />
      {children}
      <Footer basePath="/" />
    </>
  );
}
