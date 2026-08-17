'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const runSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/policies?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <header className="bg-white shadow-sm z-10 border-b-2 border-black">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="text-gray-500 lg:hidden border-2 border-black p-1 hover:bg-gray-100"
          onClick={onMenuToggle}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        
        <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-start">
          <form className="w-full max-w-lg lg:max-w-xs" onSubmit={handleSearchSubmit}>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative text-gray-400 focus-within:text-gray-600">
              <button
                type="button"
                onClick={runSearch}
                className="absolute inset-y-0 left-0 z-10 flex items-center border-0 bg-transparent p-0 pl-3 shadow-none"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
                id="search"
                className="block w-full border-2 border-black py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-retro-primary sm:text-sm sm:leading-6"
                placeholder="Search Coverage Rider policies, policyholders..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center">
          <button
            type="button"
            className="border-2 border-black p-1 text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Notification badge */}
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 border border-black bg-red-500 flex items-center justify-center text-xs text-white font-bold">
              3
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
