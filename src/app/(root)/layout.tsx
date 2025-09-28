import Footer from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import GlobalPageLoadingIndicator from "./GlobalPageLoadingIndicator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="global-padding container mt-[4rem] min-h-screen bg-background">
        {children}
      </main>
      <Footer />
      <GlobalPageLoadingIndicator />
    </>
  );
}
