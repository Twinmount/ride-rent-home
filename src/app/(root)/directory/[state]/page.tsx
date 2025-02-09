import DirectoryCategories from "@/components/root/series/directory/DirectoryCategories";
import DirectoryStates from "@/components/root/series/directory/DirectoryStates";
import { convertToLabel } from "@/helpers";

type PageProps = {
  params: {
    state: string;
  };
};

export default function page({ params: { state } }: PageProps) {
  return (
    <div className="wrapper pt-6">
      <h1 className="md:text3xl mb-2 text-2xl font-semibold lg:text-4xl">
        Affordable Vehicle Rentals in {convertToLabel(state)} | Free Directory
      </h1>
      <h2 className="mb-4 text-lg md:text-xl">
        Rent a vehicle in Dubai at cheap rates | Wide range of cars,
        motorbikes,yachts for daily, weekly
      </h2>

      <DirectoryCategories />

      <DirectoryStates />
    </div>
  );
}
