import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
  type: 'repo-list' | 'lang-stats' | 'wakatime'; // Nossos 3 tipos de widget
}

const shimmer = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
};

// Card "Base" com o efeito de shimmer e glassmorphism
const SkeletonBase = ({ children, className }: any) => (
  <section className={`relative overflow-hidden p-6 bg-gray-800/50 rounded-xl border border-gray-700/40 ${className}`}>
    {/* Efeito de shimmer */}
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-700/10 to-transparent"
      variants={shimmer}
      initial="initial"
      animate="animate"
    />
    {children}
  </section>
);

// --- Skeletons Específicos ---

const RepoListSkeleton = () => (
  <section className="animate-pulse">
    <div className="h-7 bg-gray-700/50 rounded-lg w-1/2 mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/40 space-y-3">
          <div className="h-5 bg-gray-700/50 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-700/50 rounded-lg w-full"></div>
          <div className="flex justify-between mt-3">
            <div className="h-4 bg-gray-700/50 rounded-lg w-20"></div>
            <div className="h-4 bg-gray-700/50 rounded-lg w-28"></div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const LangStatsSkeleton = () => (
  <SkeletonBase>
    <div className="h-7 bg-gray-700/50 rounded-lg w-1/2 mb-6"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-700/50 rounded-lg w-full"></div>
      <div className="h-6 bg-gray-700/50 rounded-lg w-full"></div>
      <div className="h-6 bg-gray-700/50 rounded-lg w-full"></div>
    </div>
  </SkeletonBase>
);

const WakaTimeSkeleton = () => (
  <SkeletonBase>
    <div className="h-7 bg-gray-700/50 rounded-lg w-1/2 mb-6"></div>
    {/* Stats */}
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-gray-700/20 rounded-lg space-y-2">
          <div className="h-4 bg-gray-700/50 rounded-lg w-1/3 mx-auto"></div>
          <div className="h-3 bg-gray-700/50 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-700/50 rounded-lg w-4/5 mx-auto"></div>
        </div>
      ))}
    </div>
    {/* Barras */}
    <div className="h-5 bg-gray-700/50 rounded-lg w-1/3 mb-4"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-700/50 rounded-lg w-full"></div>
          <div className="h-2 bg-gray-700/50 rounded-full w-full"></div>
        </div>
      ))}
    </div>
  </SkeletonBase>
);


export function SkeletonCard({ className = "", type }: SkeletonCardProps) {
  // O Repolist é uma seção, não um card, então é tratado diferente
  if (type === 'repo-list') {
    return <RepoListSkeleton />;
  }
  if (type === 'lang-stats') {
    return <LangStatsSkeleton />;
  }
  if (type === 'wakatime') {
    return <WakaTimeSkeleton />;
  }
  return null;
}
