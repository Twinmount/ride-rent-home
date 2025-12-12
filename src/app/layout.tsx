import "./globals.scss";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { ReactQueryProvider } from "@/app/ReactQueryProvider";
import { ToastContainer, toast, Bounce } from "react-toastify";
import type { Metadata } from "next";
import { Fira_Sans, Poppins } from "next/font/google";
import TrackingScripts from "./TrackingScripts";
import BodyScripts from "./BodyScripts";
import { NetworkWrapper } from "./(root)/NetworkWrapper";
import { GlobalContextProvider } from "@/context/GlobalContext";
import NextTopLoader from "nextjs-toploader";
import CookiePopup from "@/components/dialog/CookiePopup";
import { getDefaultMetadata } from "@/helpers/metadata-helper";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = getDefaultMetadata({});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-fira-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Ride Rent",
      url: "https://www.ride.rent",
      logo: "https://ride.rent/assets/logo/Logo_Black.svg",
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://www.ride.rent/",
      // "potentialAction": {
      //   "@type": "SearchAction",
      //   "target": "https://www.ride.rent/search?q={search_term_string}",
      //   "query-input": "required name=search_term_string"
      // }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "UAE",
          item: "https://www.ride.rent/ae",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "India",
          item: "https://www.ride.rent/in",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "About Us",
          item: "https://www.ride.rent/about-us",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Partner with Us!",
          item: "https://agent.ride.rent/ae/register",
        },
      ],
    },
  ];

  return (
    <html lang="en" className={`${poppins.variable} ${firaSans.variable} `}>
      <head className="notranslate">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {/* tracking scripts */}
        <TrackingScripts />
      </head>
      <body className={poppins.className}>
        {/* top page loading progress bar indicator */}
        <NextTopLoader
          color="#ffa733"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          zIndex={1600}
        />

        {/* body scripts */}
        <BodyScripts />
        {/* react query provider */}
        <NetworkWrapper>
          {/* NextAuth Session Provider */}
          <SessionProvider>
            {/* global context provider */}
            <ReactQueryProvider>
              <GlobalContextProvider>
                {children}
              </GlobalContextProvider>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
            </ReactQueryProvider>
          </SessionProvider>
        </NetworkWrapper>
        <CookiePopup />
      </body>
    </html>
  );
}
