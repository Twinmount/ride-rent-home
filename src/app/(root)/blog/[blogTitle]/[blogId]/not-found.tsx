import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-screen w-full justify-center gap-4 bg-white text-center">
      <div className="mt-56">
        <h1 className="text-4xl font-semibold">Not Found :&#40;</h1>
        <p className="mb-12 text-gray-700">
          The requested blog is either removed by the admin, or the blog URL is
          invalid.
        </p>
        <Link
          href="/blog"
          className="rounded-[20px] bg-yellow px-4 py-2 text-white"
        >
          Go to Home
        </Link>
      </div>
    </section>
  );
}
