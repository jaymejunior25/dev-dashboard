'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import { fetcher } from '@/lib/fetcher';
import { GitHubData } from '@/lib/types';

export function Header() {
  // SWR vai usar o cache de '/api/github' se outro widget já o buscou
  const { data, error } = useSWR<GitHubData>('/api/github', fetcher);
  const isLoading = !data && !error;

  return (
    <header className="bg-gradient-to-r from-slate-900/70 to-slate-800/60 backdrop-blur-sm border-b border-gray-700/40 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          {/* --- Skeleton (Enquanto Carrega) --- */}
          {isLoading && (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-700/50 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-40 bg-gray-700/50 rounded-md animate-pulse" />
                <div className="h-4 w-64 bg-gray-700/50 rounded-md animate-pulse" />
              </div>
            </>
          )}

          {/* --- Conteúdo Carregado --- */}
          {data && (
            <>
              <img 
                src={data.avatarUrl} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full ring-2 ring-blue-400/30" 
              />
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                  {/* Usa seu nome real do GitHub */}
                  {data.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-300 mt-1">
                  Painel de Atividades de Desenvolvimento
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </header>
  );
}
