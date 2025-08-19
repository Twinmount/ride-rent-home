import { notFound, redirect } from "next/navigation";

export type PageProps = {
  params: Promise<{ country: string }>;
};

const CountryPage = async (props: PageProps) => {
  const { country } = await props.params;
  const countries = ["ae", "in"];

  if (!countries.includes(country)) {
    console.warn("triggering not found");
    return notFound();
  }

  const state = country === "ae" ? "dubai" : "bangalore";

  redirect(`/${country}/${state}`);

  return null;
};

export default CountryPage;
