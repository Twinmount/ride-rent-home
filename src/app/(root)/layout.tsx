import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { NavbarProvider } from "@/context/NavbarContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavbarProvider>
      <Navbar />
      <main className="mt-[4.5rem]">{children}</main>
      <Footer />
    </NavbarProvider>
  );
}
