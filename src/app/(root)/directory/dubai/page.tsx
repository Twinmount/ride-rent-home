import DirectoryCategories from "@/components/root/series/directory/DirectoryCategories";
import DirectoryStates from "@/components/root/series/directory/DirectoryStates";

export default function page() {
  return (
    <div className="wrapper pt-6">
      <h1 className="md:text3xl mb-2 text-2xl font-semibold lg:text-4xl">
        Affordable Vehicle Rentals in Dubai | Free Directory
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
