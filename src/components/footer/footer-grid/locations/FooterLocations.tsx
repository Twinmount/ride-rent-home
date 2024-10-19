import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse } from "@/types";
import Link from "next/link";

export default async function FooterLocations() {
  const baseUrl = process.env.API_URL;

  // Fetch the states data from the API
  const response = await fetch(`${baseUrl}/states/list`, { cache: "no-store" });
  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  // Call the rearrangeStates function to reorder the states array
  states = rearrangeStates(states);

  return (
    <div className="footer-section">
      {/* locations  link */}
      <h3 className="footer-grid-headings">Locations</h3>
      <div className="footer-links">
        {states.map((location) => (
          <Link
            href={`/${location.stateValue}/cars`}
            className="link-wrapper"
            key={location.stateId}
          >
            &sdot; <span className="link">{location.stateName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
