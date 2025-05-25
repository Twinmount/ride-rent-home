"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse, StateType } from "@/types";
import { fetchCategories } from "@/lib/api/general-api";
import { useRouter } from "next/navigation";

export default function FooterLocations() {
  const params = useParams();
  const router = useRouter();
  const country = (params?.country as string) || "uae";
  const category = (params?.category as string) || "cars";

  const [states, setStates] = useState<StateType[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = category || 'cars'
  const selectedCountryURL = country === "in" ? "in" : "uae";

  useEffect(() => {
    const baseUrl = country === "in" ? process.env.NEXT_PUBLIC_API_URL_INDIA : process.env.NEXT_PUBLIC_API_URL;
    const countryId = country === "in" ? "68ea1314-08ed-4bba-a2b1-af549946523d" : "ee8a7c95-303d-4f55-bd6c-85063ff1cf48";

    const fetchStates = async () => {
      try {
        const response = await fetch(`${baseUrl}/states/list?hasVehicle=true&countryId=${countryId}`, {
          cache: "no-cache",
        });
        const data: FetchStatesResponse = await response.json();
        let result = country === "in" ? data.result : rearrangeStates(data.result);
        setStates(result);
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [country]);

  const gotoLocationCategory = async (stateValue: string) => {
     const res = await fetchCategories(stateValue, country);
        const categories: any = res?.result?.list;
    
        if (categories?.length > 0) {
          let isSelectedPresent = categories?.find(
            (category: any) => category?.value === selectedCategory,
          );
          let hasCars = categories?.find(
            (category: any) => category?.value === "cars",
          );
          router.push(
            `/${selectedCountryURL}/${stateValue}/${!!isSelectedPresent ? selectedCategory : !!hasCars ? "cars" : categories[0]?.value}`,
          );
         
          return;
        } else {
          router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
        }
  }

  if (loading || states.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-[1.1rem] text-yellow">Locations</h3>
      <div className="flex flex-col gap-y-1 text-base font-light text-gray-400">
        {states.map((location) => (
          <div
            onClick={() => gotoLocationCategory(location.stateValue)}
            className="flex w-fit gap-[0.2rem] text-white hover:text-white"
            key={location.stateId}
          >
            &sdot;{" "}
            <span className="w-fit cursor-pointer text-white transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
              {location.stateName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
