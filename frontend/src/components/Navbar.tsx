'use client';
import Link from 'next/link';
import { CircleUserRound } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 flex justify-between items-center py-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[#272424]">
      <Link href="/browse" className="cursor-pointer text-2xl font-normal text-white">
        MovieApp
      </Link>

      <Link href="/account" aria-label="User Profile" className="cursor-pointer hover:scale-110 hover:text-white/60">
        <CircleUserRound size={34} className="text-white" />
      </Link>
    </div>
  );
};

export default Navbar;
