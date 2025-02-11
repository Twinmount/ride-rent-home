import DirectoryCategories from "@/components/root/series/directory/DirectoryCategories";
import DirectoryStates from "@/components/root/series/directory/DirectoryStates";
import { convertToLabel } from "@/helpers";
import { Metadata } from "next";
import { generateDirectoryPageMetadata } from "./directory-metadata";

type PageProps = {
  params: {
    state: string;
  };
};

export async function generateMetadata({
  params: { state },
}: PageProps): Promise<Metadata> {
  return generateDirectoryPageMetadata({ state });
}

export default function DirectoryPage({ params: { state } }: PageProps) {
  return (
    <div className="wrapper pt-6">
      <h1 className="md:text3xl mb-2 text-2xl font-semibold lg:text-4xl">
        Affordable Vehicle Rentals in {convertToLabel(state)} | Free Directory
      </h1>
      <h2 className="mb-4 text-lg md:text-xl">
        Rent a vehicle in {convertToLabel(state)} at cheap rates | Wide range of
        cars, motorbikes, yachts for hourly, daily, weekly & monthly rental
        deals from verified agents.
      </h2>

      <DirectoryCategories state={state} />

      <DirectoryStates />
    </div>
  );
}
