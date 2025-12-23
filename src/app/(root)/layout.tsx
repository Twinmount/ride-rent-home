import Footer from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import GlobalPageLoadingIndicator from "./GlobalPageLoadingIndicator";
import { ENV } from "@/config/env";

export default function Layout({ children }: { children: React.ReactNode }) {
  const APP_ENV = ENV.APP_ENV || ENV.NEXT_PUBLIC_APP_ENV;
  console.log("\nAPP ENV (NODE_NEV) :", APP_ENV, "\n");

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
