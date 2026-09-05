import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link 
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
