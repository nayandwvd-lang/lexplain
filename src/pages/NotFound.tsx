import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="font-serif text-2xl font-bold text-stone-900">Act not found</h1>
      <p className="text-stone-600">We couldn't find that act in the library.</p>
      <Link to="/" className="text-amber-700 underline">
        Back to Library
      </Link>
    </div>
  );
}
