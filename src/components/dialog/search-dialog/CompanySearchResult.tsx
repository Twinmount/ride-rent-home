import { generateCompanyProfilePageLink } from "@/helpers";
import { CompanySearchItems } from "@/types";
import Link from "next/link";

type CompanySearchResultProps = {
  company: CompanySearchItems[];
  country: string;
};

export default function CompanySearchResult({
  company,
  country
}: CompanySearchResultProps) {
  if (company.length === 0) return null;

  return (
    <div className="mb-3 rounded-[0.4rem] bg-slate-50 p-1">
      <h3 className="mb-2 border-b px-3 py-2 text-sm font-semibold text-gray-700">
        Companies
      </h3>
      <div className="flex flex-col rounded-[0.25rem] p-1">
        {company.map((item) => {
          const companyProfilePageLink = generateCompanyProfilePageLink(
            item.title ?? "",
            item.code ?? "",
            country
          );
          return (
            <Link
              key={item._id}
              href={companyProfilePageLink}
              target="_blank"
              className="cursor-pointer rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-200"
            >
              <div className="flex justify-between align-middle">
                <span>{item.title}</span>
                <span className="text-xs text-gray-600">
                  {item.totalVehicles}{" "}
                  {item.totalVehicles === 1 ? "vehicle" : "vehicles"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
