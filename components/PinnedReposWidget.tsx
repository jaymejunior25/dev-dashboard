'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiGithub } from 'react-icons/fi';
import { fetcher } from '@/lib/fetcher';
import { GitHubData, Repo } from '@/lib/types';
import { SkeletonCard } from './SkeletonLoader';

// Sub-componente do Card de Repositório (Seu estilo)
const RepoCard = ({ repo }: { repo: Repo }) => (
  <motion.a
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block p-5 bg-gray-800/50 rounded-xl border border-gray-700/40 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg"
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <h3 className="font-semibold text-lg text-blue-400 truncate group-hover:text-blue-300 transition-colors">
          {repo.name}
        </h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{repo.description}</p>
      </div>
      <div className="flex flex-col items-end ml-4 flex-shrink-0">
        <div className="inline-flex items-center gap-2 text-sm text-gray-300">
          <FiStar size={14} color="#fbbf24" />
          <span>{repo.stargazerCount}</span>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-gray-300 mt-2">
          <FiGitBranch size={14} color="#34d399" />
          <span>{repo.forkCount}</span>
        </div>
      </div>
    </div>
    {repo.primaryLanguage && (
      <div className="mt-3 flex items-center text-sm text-gray-300">
        <span
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: repo.primaryLanguage.color }}
        />
        <span>{repo.primaryLanguage.name}</span>
      </div>
    )}
  </motion.a>
);

// Componente Principal do Widget
export function PinnedReposWidget() {
  const { data, error, isLoading } = useSWR<GitHubData>('/api/github', fetcher);

  if (isLoading) return <SkeletonCard type="repo-list" />;
  if (error) return <p className="text-red-400">Erro ao carregar repositórios.</p>;
  if (!data || data.pinnedRepos.length === 0) return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
      <h2 className="flex items-center gap-3 text-2xl font-semibold mb-2 text-white">
        <FiGithub size={20} color="#60a5fa" /> Repositórios Fixados
      </h2>
      <p className="text-gray-400">Nenhum repositório fixado encontrado.</p>
    </div>
  );

  return (
    <section>
      <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-white">
        <FiGithub size={20} color="#60a5fa" />
        Repositórios Fixados
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        initial="initial"
        animate="animate"
      >
        {data.pinnedRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </motion.div>
    </section>
  );
}
