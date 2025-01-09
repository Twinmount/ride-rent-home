import LottieLoader from "@/components/skelton/LottieLoader";

export default function VehicleDetailsLoading() {
  return (
    <section className="h-screen flex flex-col justify-center  items-center">
      <LottieLoader text="Getting everything ready for you..." />
    </section>
  );
}
