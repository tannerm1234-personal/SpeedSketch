import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-3 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold text-black">
          SpeedSketch
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/gallery"
            className="px-4 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-sm"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
}
