import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="h-screen w-full bg-white flex gap-4 justify-center text-center">
      <div className="mt-56">
        <h1 className="text-4xl font-semibold">Not Found :&#40;</h1>
        <p className="mb-12 text-gray-700">
          The requested vehicle either doesn't exist or the vehicle ID is
          invalid.
        </p>
        <Link
          href="/"
          className="bg-yellow px-4 py-2 rounded-[20px] text-white "
        >
          Go to Home
        </Link>
      </div>
    </section>
  )
}
