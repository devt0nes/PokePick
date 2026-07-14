// components/BackgroundWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const bgClass =
    pathname === '/'
      ? 'bg-home'
      : 'bg-site';

  return (
    <div className={`${bgClass} min-h-screen`}>
      {children}
    </div>
  );
}