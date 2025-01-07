import { convertToLabel } from "@/helpers";

type HeroSectionProps = {
  state: string;
  category: string;
};

export default function HeroSection({ state, category }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden border-b pb-5">
      <div className="relative z-10">
        <div className="container py-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="">
              Discover the best options in {convertToLabel(state)}
            </p>

            <div className="mt-4 max-w-2xl">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Rent Premium{" "}
                <span className="">{convertToLabel(category)}</span> In{" "}
                <span className="">{convertToLabel(state)}</span>
              </h1>
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-xl text-muted-foreground">
                Whether you're in {convertToLabel(state)} or exploring beyond,
                find the perfect {convertToLabel(category)} that fits your
                journey. Fully responsive and ready for every occasion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
