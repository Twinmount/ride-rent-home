import { redirect } from "next/navigation";

export type PageProps = {
  params: Promise<{ country: string; state: string }>;
};

const StatePage = async (props: PageProps) => {
  const { country, state } = await props.params;

  const vehicleType = country === "ae" ? "cars" : "cars";

  redirect(`/${country}/${state}/${vehicleType}`);

  return null;
};

export default StatePage;
