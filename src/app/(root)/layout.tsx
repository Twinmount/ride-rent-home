import Navbar from "@/components/general/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mt-[4.1rem]">{children}</main>
      <Footer />
    </>
  );
}
