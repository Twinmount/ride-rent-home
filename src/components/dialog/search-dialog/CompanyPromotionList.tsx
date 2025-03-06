"use client";
import React from "react";
import { CompanyPromotionItem } from "./CompanyPromotionItem";
import { useCompanyPromotionList } from "./useCompanyPromotionList";

interface CompanyPromotion {
  companyLogo?: string;
  companyName?: string;
  totalVehicleCount?: number;
  companyId?: string;
}

export const CompanyPromotionList = () => {
  const { data, isLoading } = useCompanyPromotionList();

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      {data?.length > 0 && (
        <div className="mt-auto flex flex-col items-center p-6">
          <h2 className="mb-1 text-center text-xl text-gray-800">
            Rent From Premium Suppliers
          </h2>
          <p className="text-center text-xs text-gray-500">
            Affordable prices & Instant Bookings
          </p>

          <div
            className={`mt-4 grid justify-center gap-6 ${
              data.length === 1
                ? "grid-cols-1"
                : data.length === 2
                  ? "grid-cols-2"
                  : data.length === 3
                    ? "grid-cols-3 md:grid-cols-3"
                    : "grid-cols-2 md:grid-cols-4"
            }`}
          >
            {data.length > 0 ? (
              data.map((element: CompanyPromotion, index: number) => (
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
