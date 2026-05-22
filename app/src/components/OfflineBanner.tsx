/**
 * @file OfflineBanner.tsx
 * @description Displays a banner when the user is offline.
 */
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 px-4 py-2 bg-[#F87171]/90 text-white text-sm font-medium backdrop-blur-sm">
      <WifiOff size={16} />
      <span>您当前处于离线状态 — 使用缓存数据中</span>
    </div>
  );
}
