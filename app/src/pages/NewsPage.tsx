/**
 * @file pages/NewsPage.tsx
 * @description AI compute infrastructure news/dynamics page.
 * Displays static news data with tag-based filtering, search, and date sorting.
 *
 * @dependencies react-router-dom, @/data/newsData
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { newsData, NEWS_TAGS } from '@/data/newsData';
import type { NewsTag } from '@/data/newsData';
import ExportPdfButton from '@/components/ExportPdfButton';
import { useRef } from 'react';

const TAG_COLORS: Record<string, string> = {
  '数据中心': '#A855F7',
  '晶圆代工': '#00D4FF',
  '供应链': '#FFB84D',
  '政策': '#F59E0B',
  '投资': '#22C55E',
  '能源': '#38bdf8',
  'AI芯片': '#EF4444',
  '光刻': '#F472B6',
  '稀土': '#FB923C',
  '全部': '#6B6B80',
};

export default function NewsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTag, setActiveTag] = useState<NewsTag>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredNews = useMemo(() => {
    let items = [...newsData];

    // Filter by tag
    if (activeTag !== '全部') {
      items = items.filter((n) => n.tags.includes(activeTag));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.titleZh.includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.summaryZh.includes(q) ||
          n.source.toLowerCase().includes(q)
      );
    }

    // Sort by date
    items.sort((a, b) =>
      sortOrder === 'newest'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

    return items;
  }, [activeTag, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen" ref={pageRef}>
      {/* Header */}
      <header className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-mono-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-accent-cyan transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">时事动态</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-title text-text-primary">AI 算力动态</h1>
              <p className="text-body text-text-secondary mt-3 max-w-2xl">
                全球 AI 算力基础设施相关新闻与行业动态，涵盖数据中心、晶圆代工、供应链、政策法规等关键领域。
              </p>
            </div>
            <ExportPdfButton targetRef={pageRef} filename="ai-compute-news" />
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: newsData.length, label: '新闻总数' },
              { value: newsData.filter((n) => n.date >= '2025-01-01').length, label: '2025 年新闻' },
              { value: Array.from(new Set(newsData.flatMap((n) => n.tags))).length, label: '标签类别' },
              { value: Array.from(new Set(newsData.map((n) => n.source))).length, label: '信息来源' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-border-subtle">
                <p className="text-mono-lg text-accent-cyan">{stat.value}</p>
                <p className="text-mono-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {NEWS_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-full text-mono-sm border transition-all cursor-pointer ${
                  activeTag === tag
                    ? 'border-current'
                    : 'border-[#2A2A3A] text-[#6B6B80] hover:text-[#9A9AAF] hover:border-[#6B6B80]'
                }`}
                style={
                  activeTag === tag
                    ? {
                        color: TAG_COLORS[tag] || '#00D4FF',
                        borderColor: TAG_COLORS[tag] || '#00D4FF',
                        backgroundColor: (TAG_COLORS[tag] || '#00D4FF') + '15',
                      }
                    : {}
                }
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="搜索新闻标题、摘要、来源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded text-sm text-text-primary"
            >
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
            </select>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto space-y-4">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-[#111118] border border-[#1E1E28] rounded-lg p-5 transition-all duration-200 hover:border-[#2A2A3A]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date + Source */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-mono-sm text-[#6B6B80]">{news.date}</span>
                    <span className="text-mono-sm text-[#9A9AAF]">•</span>
                    <span className="text-mono-sm text-[#00D4FF]">{news.source}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-heading-md text-[#E8E8EC] mb-1 leading-snug">
                    {news.titleZh}
                  </h3>
                  <p className="text-mono-sm text-[#6B6B80] italic mb-3">{news.title}</p>

                  {/* Summary */}
                  <p className="text-body-sm text-[#9A9AAF] leading-relaxed mb-3">
                    {news.summaryZh}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag as NewsTag)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border cursor-pointer transition-colors hover:brightness-125"
                        style={{
                          color: TAG_COLORS[tag] || '#6B6B80',
                          borderColor: (TAG_COLORS[tag] || '#6B6B80') + '40',
                          backgroundColor: (TAG_COLORS[tag] || '#6B6B80') + '10',
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* External link */}
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-mono-sm text-[#6B6B80] hover:text-accent-cyan transition-colors"
                    title="Open source"
                  >
                    ↗
                  </a>
                )}
              </div>
            </article>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg mb-2">没有匹配的新闻</p>
              <p className="text-text-muted text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
