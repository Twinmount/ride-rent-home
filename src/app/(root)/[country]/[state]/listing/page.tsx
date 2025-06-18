import { PageProps } from "@/types";
import { FC } from "react";

import { redirect } from "next/navigation";

const ListingPage: FC<PageProps> = async (props) => {
  const { country, state } = await props.params;

  redirect(`/${country}/${state}/listing/cars`);

  return null;
};

export default ListingPage;
