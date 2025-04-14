'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  UserIcon, 
  ShieldCheckIcon,
  ChartPieIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Policies', href: '/policies', icon: DocumentTextIcon },
  { name: 'Policyholders', href: '/policyholders', icon: UserIcon },
  { name: 'Beneficiaries', href: '/beneficiaries', icon: UserGroupIcon },
  { name: 'Benefits', href: '/benefits', icon: ShieldCheckIcon },
  { name: 'Reports', href: '/reports', icon: ChartPieIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-green-900 retro-sidebar">
      <div className="flex flex-col overflow-y-auto">
        <div className="flex shrink-0 items-center justify-center border-b-2 border-black">
          <div className="relative h-16 w-full flex items-center justify-center bg-gray-200 border-2 border-black">
            <Image 
              src="/cr-logo-full.png" 
              alt="Coverage Rider Logo" 
              width={200} 
              height={40} 
              className="object-contain"
            />
          </div>
        </div>
        <nav className="mt-6 px-3 flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium border-2
                      ${isActive
                        ? 'bg-indigo-800 text-white border-black'
                        : 'text-indigo-100 hover:bg-indigo-600 border-transparent'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 h-6 w-6 flex-shrink-0
                        ${isActive ? 'text-white' : 'text-indigo-300'}
                      `}
                      aria-hidden="true"
                    />
                    <span className={isActive ? 'retro-text-shadow' : ''}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t-2 border-black">
        <div className="flex items-center">
          <div className="h-8 w-8 border-2 border-black bg-white flex items-center justify-center text-black font-bold">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white retro-text-shadow">Admin User</p>
            <p className="text-xs font-medium text-indigo-200">admin@coveragerider.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
