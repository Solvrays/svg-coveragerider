'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t-2 border-black py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="border-2 border-black p-1 mr-3">
            <Image 
              src="/cr-logo.png" 
              alt="Coverage Rider Icon" 
              width={24} 
              height={24} 
              className="pixelated"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-black">
              &copy; {currentYear} Coverage Rider - A Solvrays Product
            </p>
            <p className="text-xs text-gray-700">
              All rights reserved
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center">
          <Link 
            href="/policies" 
            className="text-xs mx-2 mb-2 md:mb-0 border-b-2 border-transparent hover:border-retro-primary text-black"
          >
            Policies
          </Link>
          <Link 
            href="/policyholders" 
            className="text-xs mx-2 mb-2 md:mb-0 border-b-2 border-transparent hover:border-retro-primary text-black"
          >
            Policyholders
          </Link>
          <Link 
            href="/beneficiaries" 
            className="text-xs mx-2 mb-2 md:mb-0 border-b-2 border-transparent hover:border-retro-primary text-black"
          >
            Beneficiaries
          </Link>
          <Link 
            href="/benefits" 
            className="text-xs mx-2 mb-2 md:mb-0 border-b-2 border-transparent hover:border-retro-primary text-black"
          >
            Benefits
          </Link>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-xs mr-2 text-black">v1.0.0</span>
          <Link 
            href="/settings" 
            className="text-xs border-2 border-black px-2 py-1 hover:bg-gray-100 text-black"
          >
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
