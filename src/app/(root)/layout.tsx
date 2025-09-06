import Footer from '@/components/footer/Footer';
import { Navbar } from '@/components/navbar/Navbar';
import GlobalPageLoadingIndicator from './GlobalPageLoadingIndicator';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="global-padding container mt-[4rem] min-h-[1200px] bg-background">
        {children}
      </main>
      {/* <MobileNavbar /> */}
      <Footer />
      {/* global page loading indicator */}
      <GlobalPageLoadingIndicator />
      {/* Dialog */}
    </>
  );
}
