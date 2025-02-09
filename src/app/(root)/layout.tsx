import Footer from "@/components/footer/Footer";
import MobileNavbar from "@/components/navbar/MobileNavbar";
import { Navbar } from "@/components/navbar/Navbar";
import { NavbarProvider } from "@/context/NavbarContext";
import { VehicleCardDialogProvider } from "@/context/VehicleCardDialogContext";
import { NetworkWrapper } from "./NetworkWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NetworkWrapper>
      <NavbarProvider>
        <VehicleCardDialogProvider>
          <Navbar />
          <main className="mt-[4rem]">{children}</main>
          <MobileNavbar />
          <Footer />
        </VehicleCardDialogProvider>
      </NavbarProvider>
    </NetworkWrapper>
  );
}
