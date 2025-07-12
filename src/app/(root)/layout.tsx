import Footer from "@/components/footer/Footer";
import MobileNavbar from "@/components/navbar/MobileNavbar";
import { Navbar } from "@/components/navbar/Navbar";
import GlobalPageLoadingIndicator from "./GlobalPageLoadingIndicator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="global-padding container mt-[4rem] bg-background">
        {children}
      </main>
      <MobileNavbar />
      <Footer />

      {/* global page loading indicator */}
      <GlobalPageLoadingIndicator />
    </>
  );
}
