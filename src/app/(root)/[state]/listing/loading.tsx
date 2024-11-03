import LottieLoader from "@/components/skelton/LottieLoader";

export default function Loading() {
  return (
    <section className="h-screen flex flex-col justify-center  items-center">
      <LottieLoader text="Finding the Best Deals for You..." />
    </section>
  );
}
