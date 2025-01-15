"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { company } from ".";

export const CompanyLinks = () => {
  // Get the state from the URL's search params
  const { state } = useParams();

  return (
    <div>
      <h3 className="mb-2 text-[1.1rem] text-yellow">Company</h3>
      <div className="flex flex-col gap-[0.15rem] text-base font-light text-gray-400">
        {company.map((item) => {
          // Handle FAQ link dynamically
          const link =
            item.title === "FAQ" ? `/faq/${state || "dubai"}` : item.link;

          return item.link.includes("http") ? (
            // Open external links in a new tab for the 'List Vehicles' link
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit gap-[0.2rem] text-white hover:text-white"
              key={item.id}
            >
              &sdot;{" "}
              <span className="w-fit cursor-pointer transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
                {item.title}
              </span>
            </Link>
          ) : (
            // Handle internal links normally
            <Link
              href={link}
              className="flex w-fit gap-[0.2rem] text-white"
              key={item.id}
            >
              &sdot;{" "}
              <span className="w-fit cursor-pointer transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
