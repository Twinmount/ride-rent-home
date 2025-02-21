import "./globals.scss";
import { ReactQueryProvider } from "@/app/ReactQueryProvider";
import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";

import TrackingScripts from "./TrackingScripts";
import BodyScripts from "./BodyScripts";

export const metadata: Metadata = {
  title: "Ride.Rent",
  description: "The ultimate vehicle rental platform in UAE",
};

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
      <head>
        {/* tracking scripts */}
        <TrackingScripts />
      </head>
      <body className={firaSans.className}>
        {/* body scripts */}
        <BodyScripts />

        {/* react query provider */}
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
