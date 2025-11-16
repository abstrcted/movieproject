"use client";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
const Navbar = () => {
    return (
        <div className="flex justify-between items-center py-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[#272424]">
            <Link 
                href="/"
                className="cursor-pointer text-2xl font-normal text-white"
            >
                MovieApp
            </Link>
            
            <button
                type="button"
                aria-label="User Profile"
                onClick={() => {
                    // TODO: Implement user profile functionality
                    console.log('User Profile');
                }}
                className="cursor-pointer hover:scale-110 hover:text-white/60"
            >
                <CircleUserRound size={34} className="text-white" />
            </button>
            
            
        </div>
    );
};

export default Navbar;