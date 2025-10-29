'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import { FiCode } from 'react-icons/fi';
import { fetcher } from '@/lib/fetcher';
import { GitHubData } from '@/lib/types';
import { SkeletonCard } from './SkeletonLoader';

export function LangStatsWidget() {
  const { data, error, isLoading } = useSWR<GitHubData>('/api/github', fetcher);

  if (isLoading) return <SkeletonCard type="lang-stats" />;
  if (error) return <p className="text-red-400">Erro ao carregar linguagens.</p>;
  if (!data || Object.keys(data.langStats).length === 0) return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
       <h2 className="flex items-center gap-3 text-2xl font-semibold mb-2 text-white">
        <FiCode size={20} color="#60a5fa" /> Estatísticas de Linguagens
      </h2>
      <p className="text-gray-400">Nenhuma estatística de linguagem encontrada.</p>
    </div>
  );

  return (
    <section className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/40">
      <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-white">
        <FiCode size={20} color="#60a5fa" />
        Estatísticas de Linguagens
      </h2>
      <ul className="space-y-3">
        {Object.entries(data.langStats)
          .sort(([, a], [, b]) => b.count - a.count)
          .map(([lang, { count, color }], index) => (
            <motion.li
              key={lang}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-gray-300"
            >
              <span className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color || '#ccc' }}
                />
                <span className="font-medium">{lang}</span>
              </span>
              <span className="font-mono bg-gray-700/60 px-3 py-1 rounded-full text-sm text-white">
                {count} {count > 1 ? 'repos' : 'repo'}
              </span>
            </motion.li>
          ))}
      </ul>
    </section>
  );
}
