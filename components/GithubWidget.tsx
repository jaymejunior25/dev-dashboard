import useSWR from 'swr';
import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiGithub } from 'react-icons/fi';
import { SkeletonCard } from './SkeletonLoader';

// --- INTERFACES ---
interface Repo {
  id: string;
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  };
}

interface LangStats {
  [key: string]: {
    count: number;
    color?: string;
  };
}

interface GitHubData {
  pinnedRepos: Repo[];
  langStats: LangStats;
}

// --- COMPONENTES AUXILIARES ---
const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-white">
    <FiGithub size={20} color="#60a5fa" />
    {children}
  </h2>
);

const RepoCard = ({ repo }: { repo: Repo }) => {
  // Animação para entrada dos cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 bg-gray-800/50 rounded-xl border border-gray-700/40 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg"
      variants={cardVariants}
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
        <div className="flex flex-col items-end ml-4">
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
};

// --- COMPONENTE PRINCIPAL ---
export function GithubWidget() {
  const fetcher = (u: string) => fetch(u).then((res) => res.json());
  const { data, error, isLoading } = useSWR<GitHubData>('/api/github', fetcher);

  if (isLoading) return <SkeletonCard className="md:col-span-2" type="github" />;
  if (error) return (
    <div className="p-6 bg-red-900/50 backdrop-blur-sm rounded-xl border border-red-700/50">
      <p className="text-red-200">Erro ao carregar dados do GitHub.</p>
    </div>
  );
  if (!data) return null;

  // Configuração de animação para a lista
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <section className="space-y-6">
        <CardHeader>Repositórios Fixados</CardHeader>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {data.pinnedRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </motion.div>
      </section>

      <section className="mt-8">
        <CardHeader>Estatísticas de Linguagens</CardHeader>
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/40">
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
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color || '#ccc' }}
                    />
                    <span>{lang}</span>
                  </span>
                  <span className="font-mono bg-gray-700/60 px-3 py-1 rounded-full text-sm text-white">
                    {count} {count > 1 ? 'repos' : 'repo'}
                  </span>
                </motion.li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}