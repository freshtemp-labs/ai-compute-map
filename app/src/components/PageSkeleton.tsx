/**
 * @file components/PageSkeleton.tsx
 * @description 页面加载骨架屏组件。包含两个导出的骨架屏：
 *   MapPageSkeleton - 地图页专用（含世界地图形状和大洲占位）
 *   PageSkeleton - 通用页面（含面包屑、标题、统计网格、内容区域）
 *   通过 tailwind animate-pulse 实现动画效果。
 * @dependencies 无（纯 CSS/Tailwind）
 */

/**
 * 地图页面骨架屏
 * 模拟地图区域形状、搜索栏、图层面板、图例和缩放控件
 * @returns 地图骨架屏 JSX
 */
export function MapPageSkeleton() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100dvh - 3.5rem)', minHeight: 'calc(100dvh - 3.5rem)' }}>
      {/* Map area skeleton */}
      <div className="absolute inset-0 z-10 bg-[#0A0A0F]">
        {/* World map shape placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[80%] h-[60%]">
            {/* Continent-like shapes */}
            <div className="absolute top-[10%] left-[15%] w-[25%] h-[35%] rounded-[40%] bg-[#181820] animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="absolute top-[5%] left-[45%] w-[20%] h-[45%] rounded-[35%] bg-[#181820] animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="absolute top-[20%] left-[70%] w-[18%] h-[30%] rounded-[30%] bg-[#181820] animate-pulse" style={{ animationDelay: '400ms' }} />
            <div className="absolute top-[55%] left-[20%] w-[15%] h-[25%] rounded-[25%] bg-[#181820] animate-pulse" style={{ animationDelay: '300ms' }} />
            <div className="absolute top-[50%] left-[75%] w-[12%] h-[20%] rounded-[20%] bg-[#181820] animate-pulse" style={{ animationDelay: '500ms' }} />
          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="flex gap-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-text-muted font-mono">Loading map...</p>
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-[280px] h-[42px] rounded-full bg-[#111118] border border-[#1E1E28] animate-pulse" />
      </div>

      {/* Layer toggle skeleton */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[140px] h-[36px] rounded-lg bg-[#111118] border border-[#1E1E28] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="w-[300px] h-[32px] rounded-lg bg-[#111118] border border-[#1E1E28] animate-pulse" />
      </div>

      {/* Zoom controls skeleton */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-9 h-9 rounded-lg bg-[#111118] border border-[#1E1E28] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </div>
  );
}

/**
 * 通用页面骨架屏
 * 模拟面包屑导航、页面标题、描述文字、统计卡片网格和内容容器
 * @returns 通用页面骨架屏 JSX
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" />
            <div className="w-1 h-4 rounded bg-[rgba(255,255,255,0.03)]" />
            <div className="w-20 h-4 rounded bg-[rgba(255,255,255,0.05)] animate-pulse" style={{ animationDelay: '100ms' }} />
          </div>

          {/* Title */}
          <div className="w-64 h-8 rounded bg-[rgba(255,255,255,0.05)] animate-pulse mb-3" />
          <div className="w-96 h-4 rounded bg-[rgba(255,255,255,0.03)] animate-pulse" style={{ animationDelay: '100ms' }} />

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <div className="w-16 h-6 rounded bg-[rgba(255,255,255,0.05)] animate-pulse mb-2" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="w-24 h-3 rounded bg-[rgba(255,255,255,0.03)] animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="w-40 h-6 rounded bg-[rgba(255,255,255,0.05)] animate-pulse mb-4" />
          <div className="p-5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
            <div className="w-full h-[300px] rounded bg-[rgba(255,255,255,0.03)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
