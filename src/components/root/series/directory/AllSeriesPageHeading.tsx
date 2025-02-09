import { convertToLabel } from "@/helpers";

type PropsType = {
  state: string;
  category: string;
  brand: string;
};

export default async function AllSeriesPageHeading({
  state,
  brand,
}: PropsType) {
  return (
    <>
      <h1 className="md:text3xl mb-6 text-2xl font-semibold lg:text-4xl">
        {convertToLabel(brand).toUpperCase()} series in {convertToLabel(state)}
      </h1>
    </>
  );
}
