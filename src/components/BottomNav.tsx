'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, ClipboardList, Coins } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 w-[92vw] max-w-[400px] bottom-[calc(env(safe-area-inset-bottom)+1rem)] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] rounded-full flex justify-around py-1.5 px-2 z-50">
      <Link href="/" className={`flex flex-col items-center justify-center min-w-[50px] min-h-[50px] rounded-full transition-all active:scale-[0.92] ${pathname === '/' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-900'}`}>
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] font-bold">トップ</span>
      </Link>
      <Link href="/budget" className={`flex flex-col items-center justify-center min-w-[50px] min-h-[50px] rounded-full transition-all active:scale-[0.92] ${pathname?.startsWith('/budget') ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-900'}`}>
        <Coins className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] font-bold">予算・財政</span>
      </Link>
      <Link href="/report-cards" className={`flex flex-col items-center justify-center min-w-[50px] min-h-[50px] rounded-full transition-all active:scale-[0.92] ${pathname?.startsWith('/report-cards') ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-900'}`}>
        <ClipboardList className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] font-bold">通信簿</span>
      </Link>
      <Link href="/about" className={`flex flex-col items-center justify-center min-w-[50px] min-h-[50px] rounded-full transition-all active:scale-[0.92] ${pathname === '/about' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-900'}`}>
        <Info className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] font-bold">アバウト</span>
      </Link>
    </nav>
  );
}
