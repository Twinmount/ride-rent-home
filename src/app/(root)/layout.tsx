import Footer from '@/components/footer/Footer';
import MobileNavbar from '@/components/navbar/MobileNavbar';
import { Navbar } from '@/components/navbar/Navbar';
import GlobalPageLoadingIndicator from './GlobalPageLoadingIndicator';
import BookingDialog from '@/components/dialog/BookingDialog';
import { BookingPopup } from '@/components/dialog/BookingPopup';
import { DateRangePicker } from '@/components/dialog/date-range-picker/DateRangePicker';

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
      {/* <BookingDialog /> */}
      <BookingPopup />
      <DateRangePicker />
    </>
  );
}
