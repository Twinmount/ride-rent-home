import "./Landing.scss";
import { FaRegThumbsUp } from "react-icons/fa";
import BackgroundDiv from "./BackgroundDiv";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import Link from "next/link";
import VehicleCategories from "../vehicle-categories/VehicleCategories";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { convertToLabel, singularizeType } from "@/helpers";

const Landing = ({ state, category }: StateCategoryProps) => {
  return (
    <section className="landing-section">
      <div className="landing-top">
        {/* mobile visible button */}
        <Link
          href={`${process.env.NEXT_PUBLIC_AGENT_REGISTER_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-list-btn"
          className="yellow-gradient default-btn mobile-list-btn"
        >
          List your vehicle for FREE
        </Link>
        {/* landing top */}
        {/* wrapping with custom child component div for bg image */}
        <BackgroundDiv category={category}>
          <MotionDiv className={`landing-text-container`}>
            <div className="trust">
              <FaRegThumbsUp />
              Most Trusted Vehicle Renting Platform In{" "}
              <span className="capitalize">{convertToLabel(state)}!</span>
            </div>
            <div className="best-price">
              <p className="best-price-p">Explore thousands of vehicles</p>
              <p className="best-price-p">
                Get unbeatable deals & pay <span className="zero">Zero</span>{" "}
                commission!
              </p>
            </div>
            <Link
              href={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.LATEST_MODELS}`}
              id="view-all-cars"
              target="_blank"
              className="relative w-28 h-10 px-4 py-2 rounded-[0.7rem]  flex-center whitespace-nowrap font-bold  overflow-hidden"
            >
              <span className=" absolute text-center flex-center w-full h-full top-0 right-0 px-1 text-[0.85rem] leading-[1rem] text-black rounded-lg bg-[linear-gradient(110deg,#b78628,35%,#ffd700,45%,#fffacd,55%,#b78628)] bg-[length:200%_100%] animate-shimmer ">
                View all deals
              </span>
            </Link>
          </MotionDiv>
        </BackgroundDiv>

        {/* Vehicle categories  */}
        <VehicleCategories category={category} state={state} />
      </div>
      <div className="landing-bottom">
        <p>
          <strong>Ride.Rent</strong> ensures that you have access to the best
          and
          <strong>
            {" "}
            most affordable{" "}
            {convertToLabel(singularizeType(category)).toLowerCase()} rental
            services in{" "}
            <span className="bold-text">{convertToLabel(state)}</span>
            &nbsp;!.
          </strong>
          Take advantage of our exceptional offers on car rentals throughout{" "}
          <span className="bold-text">{convertToLabel(state)}</span>, with Ride
          On Rent, each car is well maintained and pre-serviced for efficient
          performance. <br />
          For your peace of mind, all vehicles are insured and come with
          dedicated agent assistance.
        </p>

        <div className="near-car">
          <p>Find {convertToLabel(category).toLowerCase()} near you in</p>
          <span>{convertToLabel(state)}</span>
        </div>
      </div>
    </section>
  );
};
export default Landing;
