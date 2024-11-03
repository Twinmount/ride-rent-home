import LottieLoader from "@/components/skelton/LottieLoader";

export default function LandingLoading() {
  return (
    <section className="h-screen flex flex-col justify-center  items-center">
      <LottieLoader text="Finding the Best Deals for You..." />
    </section>
  );
}
