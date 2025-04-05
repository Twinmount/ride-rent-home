import "./globals.scss";
import { ReactQueryProvider } from "@/app/ReactQueryProvider";
import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";

import TrackingScripts from "./TrackingScripts";
import BodyScripts from "./BodyScripts";
import { getDefaultMetadata } from "./root-metadata";
import { NetworkWrapper } from "./(root)/NetworkWrapper";
import { GlobalContextProvider } from "@/context/GlobalContext";

export const metadata: Metadata = getDefaultMetadata();

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head className="notranslate">
        {/* tracking scripts */}
        <TrackingScripts />
      </head>
      <body className={firaSans.className}>
        {/* body scripts */}
        <BodyScripts />
        {/* react query provider */}
        <NetworkWrapper>
          {/* global context provider */}
          <ReactQueryProvider>
            <GlobalContextProvider>{children}</GlobalContextProvider>
          </ReactQueryProvider>
        </NetworkWrapper>
      </body>
    </html>
  );
}
