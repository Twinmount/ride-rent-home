"use client";
import React, { useEffect, useState } from "react";
import { ENV } from "@/config/env";
import { useParams } from "next/navigation";
import { CompanyPromotionItem } from "./CompanyPromotionItem";

interface CompanyPromotion {
  companyLogo?: string;
  companyName?: string;
  totalVehicleCount?: number;
  companyId?: string;
}

export const CompanyPromotionList = () => {
  const params = useParams<{ state?: string; category?: string }>();
  const baseUrl = ENV.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<CompanyPromotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const page = 0;
        const state = params?.state || "dubai";
        const category = params?.category || "cars";

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "4",
          sortOrder: "ASC",
          state,
          category,
        });

        const url = `${baseUrl}/company-promotion/public/list?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          cache: "no-cache",
        });

        const result = await response.json();

        if (Array.isArray(result?.result)) {
          setData(result.result as CompanyPromotion[]);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.state, params?.category, baseUrl]);

  if (loading) {
    return <></>;
  }

  return (
    <>
      {data.length > 0 && (
        <div className="flex flex-col items-center p-6 pt-20">
          <h2 className="mb-1 text-center text-xl text-gray-800">
            Rent From Premium Suppliers
          </h2>
          <p className="text-center text-xs text-gray-500">
            Affordable prices & Instant Bookings
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-6">
            {data.length > 0 ? (
              data.map((element, index) => (
                <CompanyPromotionItem
                  key={`${index}_company_promotion_list`}
                  element={element}
                />
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};
