import DirectoryCategories from "@/components/root/series/directory/DirectoryCategories";
import DirectoryStates from "@/components/root/series/directory/DirectoryStates";
import { convertToLabel } from "@/helpers";
import { Metadata } from "next";
import { generateDirectoryPageMetadata } from "./directory-metadata";

type PageProps = {
  params: Promise<{
    state: string;
    country: string;
  }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { state, country } = params;

  return generateDirectoryPageMetadata({ state, country });
}

export default async function DirectoryPage(props: PageProps) {
  const params = await props.params;

  const { state, country } = params;

  return (
    <div className="wrapper py-6">
      <h1 className="mb-2 text-2xl font-[500] md:text-3xl">
        Affordable Vehicle Rentals in {convertToLabel(state)} | Free Directory
      </h1>
      <h2 className="mb-4 text-base md:text-lg">
        Rent a vehicle in {convertToLabel(state)} at cheap rates | Wide range of
        cars, motorbikes, yachts for hourly, daily, weekly & monthly rental
        deals from verified agents.
      </h2>

      <DirectoryCategories state={state} country={country} />

      <DirectoryStates country={country} />
    </div>
  );
}
