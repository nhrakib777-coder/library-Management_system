import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-linear-to-r from-primary to-secondary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Discover Your Next Favorite Book
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Access thousands of books, manage your borrows, and explore new worlds with our modern library system.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/books" className="btn-secondary bg-white text-primary">
            Browse Books
          </Link>
          <Link href="/register" className="btn-primary bg-white text-primary hover:bg-gray-100">
            Join Now
          </Link>
        </div>
      </div>
    </section>
  );
}