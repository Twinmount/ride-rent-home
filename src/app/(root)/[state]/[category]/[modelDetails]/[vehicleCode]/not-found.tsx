import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-screen w-full justify-center gap-4 bg-white text-center">
      <div className="mt-56">
        <h1 className="text-4xl font-semibold">Not Found :&#40;</h1>
        <p className="mb-12 text-gray-700">
          The requested vehicle either doesn&apos;t exist or the vehicle ID is
          invalid.
        </p>
        <Link
          href="/"
          className="rounded-[20px] bg-yellow px-4 py-2 text-white"
        >
          Go to Home
        </Link>
      </div>
    </section>
  );
}
